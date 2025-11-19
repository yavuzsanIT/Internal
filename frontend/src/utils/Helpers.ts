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
