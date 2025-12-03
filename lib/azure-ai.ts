import { AzureOpenAI } from 'openai';
import { z } from 'zod';
import type { AIWordResponse } from '@/types';

// Initialize Azure OpenAI client
const azureOpenAI = new AzureOpenAI({
    apiKey: process.env.AZURE_OPENAI_API_KEY!,
    endpoint: process.env.AZURE_OPENAI_ENDPOINT!,
    apiVersion: '2024-08-01-preview',
    deployment: process.env.AZURE_OPENAI_DEPLOYMENT_NAME!,
});

// Zod schema for validating AI responses
const AIWordSchema = z.object({
    lemma: z.string(),
    partOfSpeech: z.string(),
    definitions: z.array(
        z.object({
            shortDef: z.string(),
            longDef: z.string().optional(),
            register: z.string().optional(),
            domain: z.string().optional(),
        })
    ),
    examples: z.array(z.string()),
    synonyms: z.array(z.string()),
    antonyms: z.array(z.string()),
    relatedWords: z.array(z.string()),
    etymology: z.string(),
    pronunciation: z.string(),
    syllables: z.array(z.string()),
    tags: z.array(z.string()),
    forms: z.record(z.string(), z.string()).optional(),
    isValid: z.boolean(),
    confidence: z.number().min(0).max(1),
});

const ROMANIAN_WORD_ANALYSIS_PROMPT = `Ești un asistent pentru analiză de cuvinte românești. Primești un cuvânt și trebuie să-l analizezi în detaliu.

IMPORTANT:
1. Verifică dacă cuvântul este valid în limba română
2. Returnează ÎNTOTDEAUNA un JSON valid, exact în acest format
3. Dacă cuvântul nu este valid sau nu este românesc, setează "isValid": false și "confidence": 0.0

Format JSON necesar:
{
  "lemma": "forma de dicționar",
  "partOfSpeech": "substantiv|verb|adjectiv|adverb|pronume|prepozitie|conjunctie|interjectie",
  "definitions": [
    {
      "shortDef": "Definiție scurtă",
      "longDef": "Definiție detaliată (opțional)",
      "register": "curent|arhaic|regional|argou|neologism (opțional)",
      "domain": "juridic|medical|tehnic|etc. (opțional)"
    }
  ],
  "examples": ["Exemplu 1", "Exemplu 2", "Exemplu 3"],
  "synonyms": ["sinonim1", "sinonim2"],
  "antonyms": ["antonim1", "antonim2"],
  "relatedWords": ["cuvânt înrudit1", "cuvânt înrudit2"],
  "etymology": "Etimologia cuvântului",
  "pronunciation": "pronunție fonetică",
  "syllables": ["si", "la", "be"],
  "tags": ["neologism", "argou", etc.],
  "forms": {
    "singular": "forma singular (pentru substantive)",
    "plural": "forma plural (pentru substantive)",
    "infinitiv": "forma infinitiv (pentru verbe)"
  },
  "isValid": true,
  "confidence": 0.95
}

Analizează cuvântul următor:`;

export async function analyzeWordWithAI(word: string): Promise<AIWordResponse | null> {
    try {
        const response = await azureOpenAI.chat.completions.create({
            messages: [
                {
                    role: 'system',
                    content: ROMANIAN_WORD_ANALYSIS_PROMPT,
                },
                {
                    role: 'user',
                    content: word,
                },
            ],
            model: process.env.AZURE_OPENAI_DEPLOYMENT_NAME!,
            temperature: 0.3,
            max_tokens: 2000,
            response_format: { type: 'json_object' },
        });

        const content = response.choices[0]?.message?.content;
        if (!content) {
            console.error('No content in AI response');
            return null;
        }

        // Parse and validate the JSON response
        const parsed = JSON.parse(content);
        const validated = AIWordSchema.parse(parsed);

        return validated as AIWordResponse;
    } catch (error) {
        console.error('Error analyzing word with AI:', error);
        return null;
    }
}

// Rate limiting cache (simple in-memory cache)
const rateLimitCache = new Map<string, { count: number; resetAt: number }>();

export function checkRateLimit(userId: string, maxRequests: number = 50): boolean {
    const now = Date.now();
    const userLimit = rateLimitCache.get(userId);

    if (!userLimit || userLimit.resetAt < now) {
        // Reset daily at midnight
        const tomorrow = new Date();
        tomorrow.setHours(24, 0, 0, 0);

        rateLimitCache.set(userId, {
            count: 1,
            resetAt: tomorrow.getTime(),
        });
        return true;
    }

    if (userLimit.count >= maxRequests) {
        return false;
    }

    userLimit.count++;
    return true;
}

export function getRemainingRequests(userId: string, maxRequests: number = 50): number {
    const userLimit = rateLimitCache.get(userId);
    if (!userLimit || userLimit.resetAt < Date.now()) {
        return maxRequests;
    }
    return Math.max(0, maxRequests - userLimit.count);
}
