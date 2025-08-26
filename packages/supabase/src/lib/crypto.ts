import crypto from 'crypto';

const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 12; // GCM recommended IV length

function getKey(): Buffer {
  const secret = process.env.INTEGRATIONS_ENCRYPTION_KEY;
  if (!secret) {
    throw new Error('INTEGRATIONS_ENCRYPTION_KEY is not set');
  }
  // Derive a 32-byte key from the provided secret
  // If secret is 32 bytes, use directly; otherwise, hash
  const buf = Buffer.from(secret, 'utf8');
  return buf.length === 32 ? buf : crypto.createHash('sha256').update(buf).digest();
}

export function encryptString(plainText: string): string {
  const key = getKey();
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
  const encrypted = Buffer.concat([cipher.update(plainText, 'utf8'), cipher.final()]);
  const authTag = cipher.getAuthTag();
  // Encode as base64: iv.ciphertext.tag
  return [iv.toString('base64'), encrypted.toString('base64'), authTag.toString('base64')].join('.');
}

export function decryptString(payload: string): string {
  const key = getKey();
  const parts = payload.split('.');
  if (parts.length !== 3) {
    throw new Error('Invalid encrypted payload format');
  }
  const [ivB64, encB64, tagB64] = parts;
  const iv = Buffer.from(ivB64, 'base64');
  const encrypted = Buffer.from(encB64, 'base64');
  const authTag = Buffer.from(tagB64, 'base64');
  const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
  decipher.setAuthTag(authTag);
  const decrypted = Buffer.concat([decipher.update(encrypted), decipher.final()]);
  return decrypted.toString('utf8');
}


