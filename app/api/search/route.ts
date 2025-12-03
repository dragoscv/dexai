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
        // Generate with AI
        const aiResponse = await analyzeWordWithAI(term);

        if (!aiResponse || !aiResponse.isValid) {
            return NextResponse.json({
                success: false,
                message: 'Cuvântul nu pare a fi valid sau nu poate fi verificat automat.',
            });
        }

        // Check AI confidence (required for all users)
        if (aiResponse.confidence < 0.7) {
            return NextResponse.json({
                success: false,
                message: 'Cuvântul nu pare a fi valid sau este prea rar pentru a fi verificat automat.',
            });
        }

        // Additional validations for authenticated users
        if (userId) {
            // Check rate limit
            if (!checkRateLimit(userId)) {
                return NextResponse.json({
                    success: false,
                    message: 'Ai atins limita zilnică de descoperiri. Încearcă mâine!',
                }, { status: 429 });
            }

            // Validate discovery (duplicate check, spam check)
            const validationResult = await isValidDiscovery(userId, normalized, aiResponse.confidence);
            if (!validationResult.valid) {
                return NextResponse.json({
                    success: false,
                    message: validationResult.reason,
                });
            }
        }

        // Create word document
        const newWord: Partial<Word> = {
            id: normalized,
            lemma: aiResponse.lemma,
            display: term,
            forms: aiResponse.forms || {},
            partOfSpeech: aiResponse.partOfSpeech as any,
            definitions: aiResponse.definitions.map((def, idx) => {
                const definition: any = {
                    id: `def-${idx}`,
                    shortDef: def.shortDef,
                };
                // Only add optional fields if they have values
                if (def.longDef) definition.longDef = def.longDef;
                if (def.register) definition.register = def.register;
                if (def.domain) definition.domain = def.domain;
                return definition;
            }),
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
            translations: aiResponse.translations || [],
            collocations: aiResponse.collocations || [],
            usageNotes: aiResponse.usageNotes || [],
            createdAt: new Date() as any,
            createdBy: 'ai',
            createdByUserId: userId || undefined,
            verified: false,
            aiVersion: 'gpt-4o',
        };

        // Only add optional top-level fields if they have values
        if (aiResponse.frequencyLevel) newWord.frequencyLevel = aiResponse.frequencyLevel;
        if (aiResponse.difficultyLevel) newWord.difficultyLevel = aiResponse.difficultyLevel;
        if (aiResponse.nounForms) newWord.nounForms = aiResponse.nounForms;
        if (aiResponse.verbForms) newWord.verbForms = aiResponse.verbForms;
        if (aiResponse.adjectiveForms) newWord.adjectiveForms = aiResponse.adjectiveForms;

        await wordRef.set(newWord);

        // Award points only if user is authenticated
        let pointsResult;
        if (userId) {
            pointsResult = await awardPoints(userId, normalized, 'discovery');
        }

        const response: SearchResponse = {
            found: true,
            word: { ...newWord, id: normalized } as Word,
            isNewDiscovery: true,
            isAnonymousDiscovery: !userId,
            pointsAwarded: pointsResult?.points,
            message: userId
                ? `Felicitări! Ai descoperit un cuvânt nou și ai primit ${pointsResult?.points} ${pointsResult?.points === 1 ? 'punct' : 'puncte'}!`
                : 'Cuvânt adăugat cu succes! 🎉 Autentifică-te pentru a câștiga puncte pentru descoperiri ca aceasta!',
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
