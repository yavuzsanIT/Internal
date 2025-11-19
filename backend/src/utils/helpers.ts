/**
 * Converts a Date to a formatted text string suitable for filenames
 * Format: YYYY-MM-DD_HH-mm-ss
 * @returns Formatted date-time string
 */
export function getDateTimeAsText(): string {
  try {
    const now = new Date();
    return now
      .toISOString()
      .replace(/[:]/g, '-') // Replace colons with hyphens
      .replace('T', '_') // Replace T (date-time separator) with underscore
      .split('.')[0]; // Remove milliseconds
  } catch (error) {
    console.error('Date formatting error:', error);
    return new Date().getTime().toString(); // in format: YYYYMMDDHHMMSS
  }
}

/**
 * Normalizes text by removing special characters and whitespace
 * Keeps only alphanumeric characters
 * Used for comparing OE numbers with potential variations
 * @param text - Text to normalize
 * @returns Normalized text (lowercase, no special chars)
 */
export function normalize_OE(text: string): string {
    return !text? "" : text.replace(/\\n|\\r|\\t/g, '').replace(/[^a-zA-Z0-9]/g, '');
}

/**
 * Safely trims whitespace from text
 * @param text - Text to trim
 * @returns Trimmed text
 */
export function safeTrim(text: any): string {
  if (!text) return '';
  return String(text).trim();
}

/**
 * Checks if a string is empty or only contains whitespace
 * @param text - Text to check
 * @returns True if empty, false otherwise
 */
export function isEmpty(text: any): boolean {
  return !text || String(text).trim().length === 0;
}

export default {
  getDateTimeAsText,
  normalizeText: normalize_OE,
  safeTrim,
  isEmpty,
};
