import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';
import { analyzeWordWithAI } from '@/lib/azure-ai';
import type { Word } from '@/types';

interface RouteContext {
    params: Promise<{
        wordId: string;
    }>;
}

export async function POST(_request: NextRequest, context: RouteContext) {
    try {
        // Only allow in development environment
        if (process.env.NODE_ENV !== 'development') {
            return NextResponse.json(
                { success: false, message: 'This endpoint is only available in development' },
                { status: 403 }
            );
        }

        const { wordId } = await context.params;

        // Fetch existing word
        const wordRef = adminDb.collection('words').doc(wordId);
        const wordDoc = await wordRef.get();

        if (!wordDoc.exists) {
            return NextResponse.json(
                { success: false, message: 'Word not found' },
                { status: 404 }
            );
        }

        const existingWord = wordDoc.data() as Word;

        // Regenerate with AI using the display form of the word
        const aiResponse = await analyzeWordWithAI(existingWord.display);

        if (!aiResponse || !aiResponse.isValid) {
            return NextResponse.json({
                success: false,
                message: 'Failed to regenerate word data - AI returned invalid response',
            });
        }

        // Prepare updated word data
        const updatedWord: Partial<Word> = {
            // Preserve original metadata
            id: wordId,
            createdAt: existingWord.createdAt,
            createdBy: existingWord.createdBy,
            createdByUserId: existingWord.createdByUserId,
            verified: existingWord.verified,

            // Update from AI response (use AI's lemma as the correct display form with diacritics)
            lemma: aiResponse.lemma,
            display: aiResponse.lemma, // Use AI's lemma which has correct diacritics
            forms: aiResponse.forms || {},
            partOfSpeech: aiResponse.partOfSpeech as any,
            definitions: aiResponse.definitions.map((def, idx) => {
                const definition: any = {
                    id: `def-${idx}`,
                    shortDef: def.shortDef,
                };
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

            // Update metadata
            aiVersion: 'gpt-4o',
            lastRegeneratedAt: new Date() as any,
            regenerationCount: (existingWord.regenerationCount || 0) + 1,
        };

        // Add optional fields
        if (aiResponse.frequencyLevel) updatedWord.frequencyLevel = aiResponse.frequencyLevel;
        if (aiResponse.difficultyLevel) updatedWord.difficultyLevel = aiResponse.difficultyLevel;
        if (aiResponse.nounForms) updatedWord.nounForms = aiResponse.nounForms;
        if (aiResponse.verbForms) updatedWord.verbForms = aiResponse.verbForms;
        if (aiResponse.adjectiveForms) updatedWord.adjectiveForms = aiResponse.adjectiveForms;

        // Update in Firestore
        await wordRef.update(updatedWord);

        return NextResponse.json({
            success: true,
            message: `Word regenerated successfully (${updatedWord.regenerationCount}x)`,
            data: {
                word: { ...updatedWord, id: wordId } as Word,
                confidence: aiResponse.confidence,
            },
        });
    } catch (error) {
        console.error('Regeneration error:', error);
        return NextResponse.json(
            { success: false, message: 'Error regenerating word' },
            { status: 500 }
        );
    }
}
