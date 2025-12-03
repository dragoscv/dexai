import type { Word } from '@/types';

/**
 * SEO utility functions for DEXAI.ro
 */

/**
 * Generate a rich meta description from word data
 */
export function generateWordMetaDescription(word: Word): string {
    const partOfSpeech = word.partOfSpeech || 'cuvânt';
    const definition = word.definitions?.[0]?.shortDef || word.definitions?.[0]?.longDef || '';
    
    // Trim definition to ~150 characters for optimal meta description length
    const shortDefinition = definition.length > 150 
        ? definition.substring(0, 147) + '...' 
        : definition;
    
    return `${word.display} - ${partOfSpeech}. ${shortDefinition} Descoperă definiția completă, exemple, sinonime și etimologie pe DEXAI.ro.`;
}

/**
 * Generate keywords from word data
 */
export function generateWordKeywords(word: Word): string[] {
    const keywords: string[] = [
        word.display,
        word.lemma,
        'dicționar',
        'română',
        'DEX',
    ];

    // Add part of speech
    if (word.partOfSpeech) {
        keywords.push(word.partOfSpeech);
    }

    // Add synonyms (limit to 5 for relevance)
    if (word.synonyms && word.synonyms.length > 0) {
        keywords.push(...word.synonyms.slice(0, 5));
    }

    // Add etymology if available
    if (word.etymology) {
        keywords.push('etimologie');
    }

    return keywords;
}

/**
 * Generate Open Graph image URL
 * For now returns default, can be enhanced with dynamic image generation
 */
export function generateOGImage(_word: Word): string {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://dexai.ro';
    // Could implement dynamic OG image generation here
    // For now, return default brand image
    return `${baseUrl}/og-image.png`;
}

/**
 * Generate canonical URL for a word page
 */
export function generateCanonicalUrl(wordId: string): string {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://dexai.ro';
    return `${baseUrl}/cuvant/${wordId}`;
}

/**
 * Extract main definition for preview
 */
export function extractMainDefinition(word: Word, maxLength: number = 200): string {
    const definition = word.definitions?.[0]?.longDef || word.definitions?.[0]?.shortDef || '';
    
    if (definition.length <= maxLength) {
        return definition;
    }
    
    return definition.substring(0, maxLength - 3) + '...';
}
