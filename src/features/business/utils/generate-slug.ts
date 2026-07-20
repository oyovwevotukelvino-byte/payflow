// features/business/utils/generate-slug.ts

/**
 * Converts a business name into a URL-safe slug base.
 * "JQ Technologies & Co." -> "jq-technologies-co"
 */
function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

/**
 * Short, unambiguous random suffix for collision resolution.
 * Excludes visually confusing characters (0/O, 1/l/I).
 */
function randomSuffix(length = 4): string {
  const chars = "abcdefghjkmnpqrstuvwxyz23456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars[Math.floor(Math.random() * chars.length)];
  }
  return result;
}

export { slugify, randomSuffix };