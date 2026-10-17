/**
 * Hashes a plaintext password using standard SHA-256 via Web Crypto API.
 * @param {string} password - Raw password
 * @returns {Promise<string>} Hexadecimal SHA-256 hash string
 */
export async function hashPassword(password) {
  if (!password || typeof password !== 'string') return '';

  const cryptoObj =
    typeof window !== 'undefined'
      ? window.crypto
      : typeof globalThis !== 'undefined'
        ? globalThis.crypto
        : null;

  if (cryptoObj && cryptoObj.subtle) {
    const encoder = new TextEncoder();
    const data = encoder.encode(`tm_salt_${password}`);
    const hashBuffer = await cryptoObj.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
  }

  // Fast fallback for environments without WebCrypto subtle
  let hash = 0;
  const str = `tm_salt_${password}`;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash).toString(16).padStart(64, '0');
}
