import { z } from 'zod';

/**
 * Zod schemas for validating user inputs and API responses
 */

export const SearchQuerySchema = z.object({
    term: z.string().min(2).max(50),
});

export const ContributionSchema = z.object({
    wordId: z.string(),
    type: z.enum(['example_add', 'synonym_add', 'antonym_add', 'report_error']),
    content: z.string().min(1).max(500),
});

export const FlagSchema = z.object({
    wordId: z.string(),
    reason: z.string().min(10).max(500),
});

export const WordFormsSchema = z.record(z.string(), z.string()).optional();

export const DefinitionSchema = z.object({
    id: z.string(),
    shortDef: z.string(),
    longDef: z.string().optional(),
    register: z.enum(['curent', 'arhaic', 'regional', 'argou', 'neologism']).optional(),
    domain: z.string().optional(),
});

export const ExampleSchema = z.object({
    text: z.string(),
    source: z.enum(['ai', 'user']),
    authorUserId: z.string().optional(),
});

export const WordSchema = z.object({
    id: z.string(),
    lemma: z.string(),
    display: z.string(),
    forms: WordFormsSchema,
    partOfSpeech: z.enum([
        'substantiv',
        'verb',
        'adjectiv',
        'adverb',
        'pronume',
        'prepozitie',
        'conjunctie',
        'interjectie',
    ]),
    definitions: z.array(DefinitionSchema),
    examples: z.array(ExampleSchema),
    synonyms: z.array(z.string()),
    antonyms: z.array(z.string()),
    relatedWords: z.array(z.string()),
    pronunciation: z.string(),
    syllables: z.array(z.string()),
    etymology: z.string(),
    tags: z.array(z.string()),
    verified: z.boolean(),
    aiVersion: z.string().optional(),
});
