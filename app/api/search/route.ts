import { NextRequest, NextResponse } from 'next/server';
import { adminDb, adminAuth } from '@/lib/firebase-admin';
import { analyzeWordWithAI, checkRateLimit } from '@/lib/azure-ai';
import { normalizeWord, isValidWordFormat } from '@/lib/normalize-word';
import { awardPoints, isValidDiscovery } from '@/lib/points';
import type { SearchResponse, Word } from '@/types';

export async function POST(request: NextRequest) {
    try {
        const { term } = await request.json();

        // Validate input
        if (!term || typeof term !== 'string') {
            return NextResponse.json(
                { success: false, message: 'Invalid search term' },
                { status: 400 }
            );
        }

        if (!isValidWordFormat(term)) {
            return NextResponse.json(
                { success: false, message: 'Format de cuvânt invalid' },
                { status: 400 }
            );
        }

        // Normalize the word for database lookup
        const normalized = normalizeWord(term);

        // Log the search
        const authHeader = request.headers.get('authorization');
        let userId: string | null = null;

        if (authHeader) {
            try {
                const token = authHeader.replace('Bearer ', '');
                const decodedToken = await adminAuth.verifyIdToken(token);
                userId = decodedToken.uid;
            } catch (error) {
                console.error('Auth error:', error);
            }
        }

        // Check if word exists
        const wordRef = adminDb.collection('words').doc(normalized);
        const wordDoc = await wordRef.get();

        // Log search
        await adminDb.collection('searchLogs').add({
            userId,
            term,
            normalizedTerm: normalized,
            found: wordDoc.exists,
            wordId: wordDoc.exists ? normalized : null,
            createdAt: new Date(),
        });

        if (wordDoc.exists) {
            // Word exists - return it
            const response: SearchResponse = {
                found: true,
                word: {
                    id: wordDoc.id,
                    ...wordDoc.data(),
                } as Word,
            };
            return NextResponse.json({ success: true, data: { ...response, wordId: wordDoc.id } });
        }

        // Word doesn't exist - try to generate with AI
        if (!userId) {
            return NextResponse.json({
                success: false,
                message: 'Cuvântul nu există. Autentifică-te cu Google pentru a-l adăuga și câștiga puncte!',
            });
        }

        // Check rate limit
        if (!checkRateLimit(userId)) {
            return NextResponse.json({
                success: false,
                message: 'Ai atins limita zilnică de descoperiri. Încearcă mâine!',
            }, { status: 429 });
        }

        // Generate with AI
        const aiResponse = await analyzeWordWithAI(term);

        if (!aiResponse || !aiResponse.isValid) {
            return NextResponse.json({
                success: false,
                message: 'Cuvântul nu pare a fi valid sau nu poate fi verificat automat.',
            });
        }

        // Validate discovery
        const validationResult = await isValidDiscovery(userId, normalized, aiResponse.confidence);
        if (!validationResult.valid) {
            return NextResponse.json({
                success: false,
                message: validationResult.reason,
            });
        }

        // Create word document
        const newWord: Partial<Word> = {
            id: normalized,
            lemma: aiResponse.lemma,
            display: term,
            forms: aiResponse.forms || {},
            partOfSpeech: aiResponse.partOfSpeech as any,
            definitions: aiResponse.definitions.map((def, idx) => ({
                id: `def-${idx}`,
                shortDef: def.shortDef,
                longDef: def.longDef,
                register: def.register as 'curent' | 'arhaic' | 'regional' | 'argou' | 'neologism' | undefined,
                domain: def.domain,
            })),
            examples: aiResponse.examples.map((text) => ({
                text,
                source: 'ai' as const,
            })),
            synonyms: aiResponse.synonyms || [],
            antonyms: aiResponse.antonyms || [],
            relatedWords: aiResponse.relatedWords || [],
            pronunciation: aiResponse.pronunciation,
            syllables: aiResponse.syllables,
            etymology: aiResponse.etymology,
            tags: aiResponse.tags || [],
            createdAt: new Date() as any,
            createdBy: 'ai',
            createdByUserId: userId,
            verified: false,
            aiVersion: 'gpt-4o',
        };

        await wordRef.set(newWord);

        // Award points
        const pointsResult = await awardPoints(userId, normalized, 'discovery');

        const response: SearchResponse = {
            found: true,
            word: { ...newWord, id: normalized } as Word,
            isNewDiscovery: true,
            pointsAwarded: pointsResult.points,
            message: `Felicitări! Ai descoperit un cuvânt nou și ai primit ${pointsResult.points} ${pointsResult.points === 1 ? 'punct' : 'puncte'}!`,
        };

        return NextResponse.json({ success: true, data: { ...response, wordId: normalized } });
    } catch (error) {
        console.error('Search error:', error);
        return NextResponse.json(
            { success: false, message: 'Eroare la procesarea cererii' },
            { status: 500 }
        );
    }
}
