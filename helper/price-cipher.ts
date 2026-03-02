import CryptoJS from "crypto-js";

const SECRET = process.env.API_SECRET_KEY || "mhealth-fallback-secret";

/**
 * Encrypt a price value into a URL-safe string.
 * Uses AES encryption with the server-side API_SECRET_KEY.
 */
export function encryptPrice(price: number): string {
  const payload = JSON.stringify({ price, ts: Date.now() });
  const encrypted = CryptoJS.AES.encrypt(payload, SECRET).toString();
  // Make it URL-safe: base64 can contain +, /, =
  return encodeURIComponent(encrypted);
}

/**
 * Decrypt a price string back to a number.
 * Returns `null` if decryption fails or data is invalid.
 */
export function decryptPrice(encryptedPrice: string): number | null {
  try {
    const decoded = decodeURIComponent(encryptedPrice);
    const bytes = CryptoJS.AES.decrypt(decoded, SECRET);
    const decrypted = bytes.toString(CryptoJS.enc.Utf8);

    if (!decrypted) return null;

    const parsed = JSON.parse(decrypted);
    return typeof parsed.price === "number" ? parsed.price : null;
  } catch {
    return null;
  }
}
