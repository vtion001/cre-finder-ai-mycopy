#!/usr/bin/env node
// Grants all asset types and demo locations to a given user (default admin@local.test)
// Uses Supabase REST API with service role key from apps/web/.env.local

import fs from 'node:fs';
import path from 'node:path';

const API = process.env.SUPABASE_API_URL || 'http://127.0.0.1:54321';
const EMAIL = process.argv[2] || 'admin@local.test';
const envPath = path.resolve(process.cwd(), 'apps/web/.env.local');

function parseEnv(filePath) {
  const text = fs.readFileSync(filePath, 'utf8');
  const lines = text.split(/\r?\n/);
  const map = {};
  for (const line of lines) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (!m) continue;
    const key = m[1];
    let val = m[2];
    if (val.startsWith('"') && val.endsWith('"')) val = val.slice(1, -1);
    map[key] = val;
  }
  return map;
}

async function api(method, pathName, { anon, service, body, prefer } = {}) {
  const headers = {
    'apikey': anon,
    'Authorization': `Bearer ${service}`,
  };
  if (body !== undefined) headers['Content-Type'] = 'application/json';
  if (prefer) headers['Prefer'] = prefer;
  const res = await fetch(`${API}${pathName}`, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`${method} ${pathName} -> ${res.status}: ${text}`);
  }
  const ct = res.headers.get('content-type') || '';
  if (ct.includes('application/json')) return res.json();
  return null;
}

async function main() {
  if (!fs.existsSync(envPath)) {
    throw new Error(`Env file not found: ${envPath}`);
  }
  const env = parseEnv(envPath);
  const anon = env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const service = env.SUPABASE_SERVICE_KEY;
  if (!anon || !service) {
    throw new Error('Missing NEXT_PUBLIC_SUPABASE_ANON_KEY or SUPABASE_SERVICE_KEY in apps/web/.env.local');
  }

  // Resolve user id
  const users = await api('GET', `/rest/v1/users?select=id,email&email=eq.${encodeURIComponent(EMAIL)}`,
    { anon, service });
  const userId = users?.[0]?.id;
  if (!userId) throw new Error(`User not found: ${EMAIL}`);
  console.log(`User: ${EMAIL} -> ${userId}`);

  // Fetch asset type slugs
  const assetTypes = await api('GET', '/rest/v1/asset_types?select=slug', { anon, service });
  const slugs = assetTypes.map(a => a.slug);
  console.log(`Asset types: ${slugs.join(', ')}`);

  const upsertLocationSet = [
    {
      location_internal_id: 'c-fl-vero-beach',
      location_name: 'Vero Beach',
      location_type: 'city',
      location_formatted: 'Vero Beach, FL',
      location_state: 'FL',
      is_active: true,
      result_count: 100,
      expires_at: '2026-12-31T23:59:59Z',
    },
    {
      location_internal_id: 'az-maricopa-county',
      location_name: 'Maricopa County',
      location_type: 'county',
      location_formatted: 'Maricopa County, AZ',
      location_state: 'AZ',
      is_active: true,
      result_count: 200,
      expires_at: '2026-12-31T23:59:59Z',
    },
  ];

  for (const slug of slugs) {
    // Ensure asset license exists
    const existing = await api('GET', `/rest/v1/asset_licenses?select=id&user_id=eq.${userId}&asset_type_slug=eq.${slug}`, { anon, service });
    let licenseId = existing?.[0]?.id;
    if (!licenseId) {
      const created = await api('POST', '/rest/v1/asset_licenses', {
        anon,
        service,
        body: {
          user_id: userId,
          asset_type_slug: slug,
          is_active: true,
          search_params: {},
        },
        prefer: 'return=representation',
      });
      licenseId = created?.[0]?.id;
    }

    // Upsert demo locations
    const payload = upsertLocationSet.map(loc => ({
      asset_license_id: licenseId,
      ...loc,
    }));
    await api('POST', '/rest/v1/location_licenses', {
      anon,
      service,
      body: payload,
      prefer: 'resolution=merge-duplicates,return=representation',
    });
    console.log(`Granted ${slug} -> ${licenseId}`);
  }

  const summary = await api('GET', `/rest/v1/asset_licenses?select=id,asset_type_slug,location_licenses(id,location_internal_id,location_name,location_state)&user_id=eq.${userId}`, { anon, service });
  console.log(JSON.stringify(summary, null, 2));
  console.log('\nSample Records URL: http://localhost:3001/en/dashboard/records?asset_type=residential&locations=c-fl-vero-beach');
}

main().catch(err => {
  console.error(err.message || err);
  process.exit(1);
});


