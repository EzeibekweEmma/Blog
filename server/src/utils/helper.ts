/**
 * @param str - String to capitalize
 * @returns string - Capitalized string
 */
export function capitalize(str: string): string {
  return str.toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase());
}

/**
 * Estimate reading time of a content
 * @param content - Content to estimate reading time
 * @return number - Estimated reading time
 */
export function estimateReadingTime(content: string): number {
  const wordCount = content.trim().split(/\s+/).length;

  const averageReadingSpeed = 200;
  const rawReadingTime = wordCount / averageReadingSpeed;

  const estimatedReadingTime = Math.ceil(rawReadingTime);

  return estimatedReadingTime;
}

/**
 * Generate a unique slug
 * @param key - The key to generate the slug from
 * @param appendHex - Append a random hex to the slug, default is false(boolean)
 * @return string - The unique slug
 */
export function generateUniqueSlug(key: string, appendHex: boolean = false): string {
  const baseSlug = key.toLowerCase().replace(/[^A-Za-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

  if (appendHex) {
    const randomHex = Math.floor(Math.random() * 16777215).toString(16).padStart(6, "0");
    return `${baseSlug}-${randomHex}`;
  }

  return baseSlug;
}