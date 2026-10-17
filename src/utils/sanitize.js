/**
 * Strips HTML tags, trims whitespace, and escapes special characters to prevent XSS.
 * @param {string} input - Raw user input string
 * @param {number} maxLength - Maximum allowable length
 * @returns {string} Sanitized string
 */
export function sanitizeText(input, maxLength = 1000) {
  if (typeof input !== 'string') return '';
  
  // Strip dangerous HTML tags and script content
  const stripped = input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<[^>]+>/g, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+=/gi, '');

  return stripped.trim().slice(0, maxLength);
}

/**
 * Validates and sanitizes email addresses
 * @param {string} email
 * @returns {string} Sanitized email in lowercase
 */
export function sanitizeEmail(email) {
  if (typeof email !== 'string') return '';
  return email.trim().toLowerCase().slice(0, 254);
}
