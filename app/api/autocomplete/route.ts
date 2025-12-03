import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';
import { normalizeWord } from '@/lib/normalize-word';

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const query = searchParams.get('q');

        if (!query || query.length < 2) {
            return NextResponse.json({ success: true, data: [] });
        }

        const normalized = normalizeWord(query);
        const queryLower = query.toLowerCase().trim();

        console.log('[Autocomplete] Query:', query, 'Normalized:', normalized, 'Lower:', queryLower);

        // Get all words and filter in memory for more flexible matching
        // This is better for autocomplete as Firestore range queries are limited
        const wordsSnapshot = await adminDb
            .collection('words')
            .limit(100) // Get first 100 words to search through
            .get();

        console.log('[Autocomplete] Total words in collection:', wordsSnapshot.size);

        const suggestions = wordsSnapshot.docs
            .map((doc) => {
                const data = doc.data();
                return {
                    id: doc.id,
                    lemma: data.lemma || '',
                    display: data.display || '',
                    partOfSpeech: data.partOfSpeech || 'cuvânt',
                };
            })
            .filter((word) => {
                // Match against display field (original with diacritics)
                const displayLower = word.display.toLowerCase();
                const lemmaLower = word.lemma.toLowerCase();
                const idMatch = word.id.toLowerCase();

                // Check if any field contains the search term
                return (
                    displayLower.includes(queryLower) ||
                    lemmaLower.includes(queryLower) ||
                    idMatch.includes(normalized) ||
                    word.id.includes(queryLower.replace(/\s+/g, '-'))
                );
            })
            .sort((a, b) => {
                // Prioritize exact matches at the start
                const aStartsWith = a.display.toLowerCase().startsWith(queryLower);
                const bStartsWith = b.display.toLowerCase().startsWith(queryLower);

                if (aStartsWith && !bStartsWith) return -1;
                if (!aStartsWith && bStartsWith) return 1;

                // Then sort alphabetically
                return a.display.localeCompare(b.display);
            })
            .slice(0, 10); // Limit to 10 results

        console.log('[Autocomplete] Found', suggestions.length, 'matching words');

        return NextResponse.json({ success: true, data: suggestions });
    } catch (error) {
        console.error('Autocomplete error:', error);
        return NextResponse.json(
            { success: false, message: 'Eroare la căutare' },
            { status: 500 }
        );
    }
}
