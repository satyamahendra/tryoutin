export function normalizeString(input: string): string {
    return input
        .replace(/[^a-zA-Z0-9]+/g, " ") // replace weird chars with spaces
        .trim()
        .split(/\s+/)
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(" ")
}
