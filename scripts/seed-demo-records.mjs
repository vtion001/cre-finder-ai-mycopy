#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const API = process.env.SUPABASE_API_URL || 'http://127.0.0.1:54321';
const BASE = process.env.APP_BASE_URL || 'http://localhost:3000';
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

async function api(method, pathName, { anon, service, body, prefer } = {}) {
  const headers = { apikey: anon, Authorization: `Bearer ${service}` };
  if (body !== undefined) headers['Content-Type'] = 'application/json';
  if (prefer) headers['Prefer'] = prefer;
  const res = await fetch(`${API}${pathName}`, { method, headers, body: body ? JSON.stringify(body) : undefined });
  if (!res.ok) throw new Error(`${method} ${pathName} -> ${res.status}: ${await res.text()}`);
  const ct = res.headers.get('content-type') || '';
  if (ct.includes('application/json')) return res.json();
  return null;
}

async function ensureLicense(anon, service, userId, slug, locationInternalId, locationName, state) {
  let lic = await api('GET', `/rest/v1/asset_licenses?select=id&user_id=eq.${userId}&asset_type_slug=eq.${slug}`, { anon, service });
  let licenseId = lic?.[0]?.id;
  if (!licenseId) {
    const created = await api('POST', '/rest/v1/asset_licenses', { anon, service, prefer: 'return=representation', body: { user_id: userId, asset_type_slug: slug, is_active: true, search_params: {} } });
    licenseId = created?.[0]?.id;
  }
  let lloc = await api('GET', `/rest/v1/location_licenses?select=id&asset_license_id=eq.${licenseId}&location_internal_id=eq.${locationInternalId}`, { anon, service });
  let locationLicenseId = lloc?.[0]?.id;
  if (!locationLicenseId) {
    const created = await api('POST', '/rest/v1/location_licenses', { anon, service, prefer: 'return=representation', body: [{ asset_license_id: licenseId, location_internal_id: locationInternalId, location_name: locationName, location_type: locationInternalId.includes('county') ? 'county' : 'city', location_formatted: `${locationName}, ${state}`, location_state: state, is_active: true, result_count: 0, expires_at: '2026-12-31T23:59:59Z' }] });
    locationLicenseId = created?.[0]?.id;
  }
  return { licenseId, locationLicenseId };
}

async function revalidate(secret, tag, id) {
  await fetch(`${BASE}/api/webhook/cache/revalidate`, { method: 'POST', headers: { Authorization: `Bearer ${secret}`, 'Content-Type': 'application/json' }, body: JSON.stringify({ tag, id }) }).catch(() => {});
}

async function main() {
  const env = parseEnv(envPath);
  const anon = env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const service = env.SUPABASE_SERVICE_KEY;
  const cacheSecret = env.NEXT_CACHE_API_SECRET;
  if (!anon || !service) throw new Error('Missing anon/service keys in apps/web/.env.local');

  const users = await api('GET', `/rest/v1/users?select=id,email&email=eq.${encodeURIComponent(ADMIN_EMAIL)}`, { anon, service });
  const userId = users?.[0]?.id;
  if (!userId) throw new Error('Admin user not found');

  // Ensure licenses
  const greer = await ensureLicense(anon, service, userId, 'residential', 'c-sc-greer', 'Greer', 'SC');
  const vero = await ensureLicense(anon, service, userId, 'multi-family', 'c-fl-vero-beach', 'Vero Beach', 'FL');

  // Seed a few demo records if none exist
  const existing = await api('GET', `/rest/v1/property_records?select=id&user_id=eq.${userId}&limit=1`, { anon, service });
  if (existing?.length) {
    console.log('Property records already present for admin; skipping insert.');
    return;
  }

  const payload = [
    // Residential - Greer
    { user_id: userId, asset_license_id: greer.licenseId, location_license_id: greer.locationLicenseId, property_id: 'demo-greer-1', address: '19 Riley Eden Ln, Greer, SC 29650', city: 'Greer', state: 'SC', zip: '29650', owner1_last_name: 'White', square_feet: 3392, last_sale_date: '2024-04-05' },
    { user_id: userId, asset_license_id: greer.licenseId, location_license_id: greer.locationLicenseId, property_id: 'demo-greer-2', address: '24 Riley Eden Ln, Greer, SC 29650', city: 'Greer', state: 'SC', zip: '29650', owner1_last_name: 'Vu', square_feet: 3391, last_sale_date: '2024-06-12' },
    // Multi-family - Vero Beach
    { user_id: userId, asset_license_id: vero.licenseId, location_license_id: vero.locationLicenseId, property_id: 'demo-vero-1', address: '1055 Royal Palm Blvd, Vero Beach, FL 32960', city: 'Vero Beach', state: 'FL', zip: '32960', owner1_last_name: 'Jacourt', square_feet: 9982, last_sale_date: '2023-08-15' },
    { user_id: userId, asset_license_id: vero.licenseId, location_license_id: vero.locationLicenseId, property_id: 'demo-vero-2', address: '4255 32nd Ave, Vero Beach, FL 32967', city: 'Vero Beach', state: 'FL', zip: '32967', owner1_last_name: 'Coalition', square_feet: 3006, last_sale_date: '2023-05-01' },
  ];

  await api('POST', '/rest/v1/property_records', { anon, service, body: payload, prefer: 'resolution=merge-duplicates,return=minimal' });

  // Revalidate caches
  if (cacheSecret) {
    await revalidate(cacheSecret, 'licenses', userId);
    for (const id of [greer.licenseId, vero.licenseId]) await revalidate(cacheSecret, 'records', id);
  }

  console.log('Seeded demo property_records for admin user.');
  console.log('Try:');
  console.log('  - http://localhost:3000/en/dashboard/records?asset_type=residential&locations=c-sc-greer');
  console.log('  - http://localhost:3000/en/dashboard/records?asset_type=multi-family&locations=c-fl-vero-beach');
}

main().catch((e) => { console.error(e); process.exit(1); });


