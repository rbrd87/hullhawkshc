const SESSION_COOKIE_NAME = "hawks-admin-session";
const SESSION_DURATION = 60 * 60 * 24 * 7; // 7 days

function getSessionSecret() {
  const secret = process.env.HAWKS_SESSION_SECRET;
  if (!secret) {
    throw new Error("HAWKS_SESSION_SECRET is not configured.");
  }
  return secret;
}

function bytesToBase64Url(bytes: Uint8Array) {
  let binary = "";
  for (const byte of bytes) {
    binary += String.fromCharCode(byte);
  }
  return btoa(binary)
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");
}

function base64UrlToBytes(value: string) {
  const base64 = value.replace(/-/g, "+").replace(/_/g, "/");
  const padded = base64 + "=".repeat((4 - (base64.length % 4)) % 4);
  const binary = atob(padded);
  return Uint8Array.from(binary, (character) => character.charCodeAt(0));
}

async function createSignature(value: string) {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(getSessionSecret()),
    {
      name: "HMAC",
      hash: "SHA-256",
    },
    false,
    ["sign"],
  );
  const signature = await crypto.subtle.sign(
    "HMAC",
    key,
    encoder.encode(value),
  );
  return bytesToBase64Url(new Uint8Array(signature));
}

async function verifySignature(value: string, signature: string) {
  try {
    const encoder = new TextEncoder();
    const key = await crypto.subtle.importKey(
      "raw",
      encoder.encode(getSessionSecret()),
      {
        name: "HMAC",
        hash: "SHA-256",
      },
      false,
      ["verify"],
    );
    return await crypto.subtle.verify(
      "HMAC",
      key,
      base64UrlToBytes(signature),
      encoder.encode(value),
    );
  } catch {
    return false;
  }
}

export async function createAdminSessionToken() {
  const expiresAt = Math.floor(Date.now() / 1000) + SESSION_DURATION;
  const payload = `hawks-admin:${expiresAt}`;
  const signature = await createSignature(payload);
  return `${payload}.${signature}`;
}

export async function verifyAdminSessionToken(token?: string) {
  if (!token) {
    return false;
  }
  const parts = token.split(".");
  if (parts.length !== 2) {
    return false;
  }
  const [payload, signature] = parts;
  const [identifier, expiryString] = payload.split(":");
  if (identifier !== "hawks-admin") {
    return false;
  }
  const expiry = Number(expiryString);
  if (!Number.isFinite(expiry) || expiry <= Math.floor(Date.now() / 1000)) {
    return false;
  }
  return verifySignature(payload, signature);
}

export async function verifyAdminPassword(suppliedPassword: string) {
  const expectedPassword = process.env.HAWKS_ADMIN_PASSWORD;
  if (!expectedPassword) {
    throw new Error("HAWKS_ADMIN_PASSWORD is not configured.");
  }
  const encoder = new TextEncoder();
  const [suppliedHash, expectedHash] = await Promise.all([
    crypto.subtle.digest("SHA-256", encoder.encode(suppliedPassword)),
    crypto.subtle.digest("SHA-256", encoder.encode(expectedPassword)),
  ]);
  const supplied = new Uint8Array(suppliedHash);
  const expected = new Uint8Array(expectedHash);
  if (supplied.length !== expected.length) {
    return false;
  }
  let difference = 0;
  for (let index = 0; index < supplied.length; index++) {
    difference |= supplied[index] ^ expected[index];
  }
  return difference === 0;
}

export { SESSION_COOKIE_NAME, SESSION_DURATION };
