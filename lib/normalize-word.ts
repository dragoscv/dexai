/**
 * Normalizes a Romanian word for search and comparison
 * - Converts to lowercase
 * - Removes diacritics (ă->a, â->a, î->i, ș->s, ț->t)
 * - Trims whitespace
 */
export function normalizeWord(word: string): string {
    return word
        .toLowerCase()
        .trim()
        .replace(/ă/g, 'a')
        .replace(/â/g, 'a')
        .replace(/î/g, 'i')
        .replace(/ș/g, 's')
        .replace(/ț/g, 't')
        .replace(/\s+/g, '-');
}

/**
 * Validates if a string could be a valid Romanian word
 * Basic validation: checks for Romanian characters and reasonable length
 */
export function isValidWordFormat(word: string): boolean {
    // Must be 2-50 characters
    if (word.length < 2 || word.length > 50) {
        return false;
    }

    // Only Romanian letters, hyphens, and spaces allowed
    const romanianWordPattern = /^[a-zA-ZăâîșțĂÂÎȘȚ\s-]+$/;
    if (!romanianWordPattern.test(word)) {
        return false;
    }

    // Must contain at least one vowel
    const hasVowel = /[aeiouăâî]/i.test(word);
    if (!hasVowel) {
        return false;
    }

    return true;
}

/**
 * Generates a URL-safe slug from a word
 */
export function generateSlug(word: string): string {
    return normalizeWord(word).replace(/\s+/g, '-');
}

/**
 * Converts a normalized word back to display format with diacritics
 * Note: This is a basic approximation, the actual word with diacritics
 * should be stored in the database
 */
export function denormalizeWord(normalized: string): string {
    return normalized.replace(/-/g, ' ');
}

/**
 * Checks if two words are similar (for duplicate detection)
 */
export function areSimilarWords(word1: string, word2: string): boolean {
    const normalized1 = normalizeWord(word1);
    const normalized2 = normalizeWord(word2);
    return normalized1 === normalized2;
}
