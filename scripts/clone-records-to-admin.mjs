#!/usr/bin/env node
// Clone existing property_records to the admin user's licenses so they appear in the UI

import fs from 'node:fs';
import path from 'node:path';

const API = process.env.SUPABASE_API_URL || 'http://127.0.0.1:54321';
const ADMIN_EMAIL = process.argv[2] || 'admin@local.test';
const envPath = path.resolve(process.cwd(), 'apps/web/.env.local');

function parseEnv(filePath) {
  const text = fs.readFileSync(filePath, 'utf8');
  const out = {};
  for (const line of text.split(/\r?\n/)) {
    const m = line.match(/^([A-Z0-9_]+)=(.*)$/);
    if (!m) continue;
    const k = m[1];
    let v = m[2];
    if (v.startsWith('"') && v.endsWith('"')) v = v.slice(1, -1);
    out[k] = v;
  }
  return out;
}

async function api(method, pathName, { anon, service, body, prefer, range } = {}) {
  const headers = {
    apikey: anon,
    Authorization: `Bearer ${service}`,
  };
  if (body !== undefined) headers['Content-Type'] = 'application/json';
  if (prefer) headers['Prefer'] = prefer;
  if (range) headers['Range'] = range;
  const res = await fetch(`${API}${pathName}`, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) {
    const t = await res.text();
    throw new Error(`${method} ${pathName} -> ${res.status}: ${t}`);
  }
  const ct = res.headers.get('content-type') || '';
  if (ct.includes('application/json')) return res.json();
  return null;
}

async function main() {
  const env = parseEnv(envPath);
  const anon = env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const service = env.SUPABASE_SERVICE_KEY;
  if (!anon || !service) throw new Error('Missing anon/service keys in apps/web/.env.local');

  // Admin user id
  const users = await api('GET', `/rest/v1/users?select=id,email&email=eq.${encodeURIComponent(ADMIN_EMAIL)}`, { anon, service });
  const adminId = users?.[0]?.id;
  if (!adminId) throw new Error(`Admin user not found: ${ADMIN_EMAIL}`);

  // Fetch up to 2000 property records with joins (adjust if needed)
  const records = await api(
    'GET',
    `/rest/v1/property_records?select=*,location_licenses!inner(location_internal_id),asset_licenses!inner(asset_type_slug)&limit=2000`,
    { anon, service }
  );
  if (!records?.length) {
    console.log('No source property_records found to clone.');
    return;
  }

  // Helper: ensure admin has asset license and location license for given pair
  async function ensureAdminLicense(slug, locationInternalId) {
    // asset license
    let lic = await api('GET', `/rest/v1/asset_licenses?select=id&user_id=eq.${adminId}&asset_type_slug=eq.${slug}`, { anon, service });
    let licenseId = lic?.[0]?.id;
    if (!licenseId) {
      const created = await api('POST', `/rest/v1/asset_licenses`, {
        anon, service, prefer: 'return=representation',
        body: { user_id: adminId, asset_type_slug: slug, is_active: true, search_params: {} },
      });
      licenseId = created?.[0]?.id;
    }
    // location license
    let lloc = await api('GET', `/rest/v1/location_licenses?select=id&asset_license_id=eq.${licenseId}&location_internal_id=eq.${locationInternalId}`, { anon, service });
    let locationLicenseId = lloc?.[0]?.id;
    if (!locationLicenseId) {
      const createdLoc = await api('POST', `/rest/v1/location_licenses`, {
        anon, service, prefer: 'return=representation',
        body: [{
          asset_license_id: licenseId,
          location_internal_id: locationInternalId,
          location_name: locationInternalId.split('-').slice(2).join(' ').replace(/\b\w/g, c => c.toUpperCase()),
          location_type: locationInternalId.includes('county') ? 'county' : 'city',
          location_formatted: locationInternalId.replace(/^c-([a-z]{2})-/, '').replace(/-/g, ' ') + ', ' + (locationInternalId.split('-')[1] || '').toUpperCase(),
          location_state: (locationInternalId.split('-')[1] || '').toUpperCase(),
          is_active: true,
          result_count: 0,
          expires_at: '2026-12-31T23:59:59Z',
        }],
      });
      locationLicenseId = createdLoc?.[0]?.id;
    }
    return { licenseId, locationLicenseId };
  }

  // Group records by (slug, locationInternalId)
  const groups = new Map();
  for (const r of records) {
    const slug = r.asset_licenses?.asset_type_slug;
    const loc = r.location_licenses?.location_internal_id;
    if (!slug || !loc) continue;
    const key = `${slug}|${loc}`;
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(r);
  }

  let totalInserted = 0;
  for (const [key, list] of groups.entries()) {
    const [slug, loc] = key.split('|');
    const { licenseId, locationLicenseId } = await ensureAdminLicense(slug, loc);

    // Prepare clones
    const payload = list.map((r) => {
      const { asset_licenses, location_licenses, id, created_at, updated_at, ...rest } = r;
      return {
        ...rest,
        user_id: adminId,
        asset_license_id: licenseId,
        location_license_id: locationLicenseId,
      };
    });

    // Insert in chunks
    const chunk = 100;
    for (let i = 0; i < payload.length; i += chunk) {
      const slice = payload.slice(i, i + chunk);
      await api('POST', '/rest/v1/property_records', {
        anon, service, body: slice,
        prefer: 'resolution=merge-duplicates,return=minimal',
      });
      totalInserted += slice.length;
    }
    console.log(`Cloned ${list.length} records for ${slug} @ ${loc}`);
  }

  console.log(`Done. Attempted inserts: ${totalInserted}.`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});


