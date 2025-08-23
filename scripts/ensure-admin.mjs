#!/usr/bin/env node
// Ensure admin user exists in Supabase Auth and promote to role=admin in public.users

import fs from 'node:fs';
import path from 'node:path';

const API = process.env.SUPABASE_API_URL || 'http://127.0.0.1:54321';
const EMAIL = process.argv[2] || 'admin@local.test';
const PASSWORD = process.argv[3] || 'Passw0rd!23';
const envPath = path.resolve(process.cwd(), 'apps/web/.env.local');

function parseEnv(filePath) {
  const text = fs.readFileSync(filePath, 'utf8');
  const out = {};
  for (const line of text.split(/\r?\n/)) {
    const m = line.match(/^([A-Z0-9_]+)=(.*)$/);
    if (!m) continue;
    const key = m[1];
    let val = m[2];
    if (val.startsWith('"') && val.endsWith('"')) val = val.slice(1, -1);
    out[key] = val;
  }
  return out;
}

async function request(method, pathName, { apikey, token, body } = {}) {
  const headers = {
    apikey,
    Authorization: `Bearer ${token}`,
  };
  if (body !== undefined) headers['Content-Type'] = 'application/json';
  const res = await fetch(`${API}${pathName}`, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });
  const text = await res.text();
  const ct = res.headers.get('content-type') || '';
  let json = null;
  if (ct.includes('application/json')) {
    try { json = JSON.parse(text); } catch {}
  }
  if (!res.ok) {
    throw new Error(`${method} ${pathName} -> ${res.status}: ${text}`);
  }
  return json;
}

async function main() {
  const env = parseEnv(envPath);
  const anon = env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const service = env.SUPABASE_SERVICE_KEY;
  if (!anon || !service) throw new Error('Missing NEXT_PUBLIC_SUPABASE_ANON_KEY or SUPABASE_SERVICE_KEY');

  // Try to create admin auth user
  try {
    await request('POST', '/auth/v1/admin/users', {
      apikey: anon,
      token: service,
      body: { email: EMAIL, password: PASSWORD, email_confirm: true },
    });
    console.log('Admin auth user created.');
  } catch (e) {
    console.log(`Create admin user: ${e.message}. Proceeding (it may already exist).`);
  }

  // Resolve user id in public.users via REST view
  const u = await request('GET', `/rest/v1/users?select=id,email&email=eq.${encodeURIComponent(EMAIL)}`, {
    apikey: anon,
    token: service,
  });
  const userId = u?.[0]?.id;
  if (!userId) throw new Error('Could not resolve admin user id');

  // Promote to admin role
  await request('PATCH', `/rest/v1/users?email=eq.${encodeURIComponent(EMAIL)}`, {
    apikey: anon,
    token: service,
    body: { role: 'admin' },
  });
  console.log(`Promoted ${EMAIL} (${userId}) to role=admin.`);
  console.log('Credentials ready:', EMAIL, '/', PASSWORD);
}

main().catch((e) => { console.error(e.message || e); process.exit(1); });


