export function normalizeWhitespace(text: string): string {
  if (!text || typeof text !== "string") {
    return "";
  }

  return (
    text
      // Replace multiple newlines (2+) with a single space
      .replace(/\n{2,}/g, " ")
      // Replace single newlines with a space
      .replace(/\n/g, " ")
      // Replace multiple spaces with a single space
      .replace(/\s+/g, " ")
      // Trim leading and trailing whitespace
      .trim()
  );
}
