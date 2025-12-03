// TypeScript type definitions for the dexai.ro application

import { Timestamp } from 'firebase/firestore';

// User types
export interface User {
    uid: string;
    displayName: string;
    photoURL: string | null;
    email: string;
    createdAt: Timestamp;
    totalPoints: number;
    dailyPoints: number;
    wordsDiscovered: number;
    lastLoginAt: Timestamp;
}

// Word definition types
export interface Definition {
    id: string;
    shortDef: string;
    longDef?: string;
    register?: 'curent' | 'arhaic' | 'regional' | 'argou' | 'neologism';
    domain?: string; // 'juridic', 'medical', 'tehnic', etc.
}

export interface Example {
    text: string;
    source: 'ai' | 'user';
    authorUserId?: string;
}

export interface NounForms {
    singularIndefinit?: string; // "o carte"
    singularDefinit?: string; // "cartea"
    pluralIndefinit?: string; // "niște cărți"
    pluralDefinit?: string; // "cărțile"
    genitivDativSingular?: string; // "cărții"
    genitivDativPlural?: string; // "cărților"
}

export interface VerbConjugationPerson {
    eu?: string;
    tu?: string;
    el?: string;
    noi?: string;
    voi?: string;
    ei?: string;
}

export interface VerbForms {
    // Forme nepersonale (non-personal forms)
    infinitiv?: string; // "a lucra"
    participiu?: string; // "lucrat"
    gerunziu?: string; // "lucrând"
    supin?: string; // "de lucrat"

    // Modul Indicativ
    indicativPrezent?: VerbConjugationPerson;
    indicativImperfect?: VerbConjugationPerson;
    indicativPerfectSimplu?: VerbConjugationPerson; // rare in modern Romanian
    indicativPerfectCompus?: VerbConjugationPerson;
    indicativMaiMultCaPerfect?: VerbConjugationPerson;
    indicativViitor?: VerbConjugationPerson;

    // Modul Conjunctiv
    conjunctivPrezent?: VerbConjugationPerson;
    conjunctivPerfect?: VerbConjugationPerson;

    // Modul Conditional
    conditionalPrezent?: VerbConjugationPerson;
    conditionalPerfect?: VerbConjugationPerson;

    // Modul Imperativ
    imperativ?: {
        tu?: string; // "lucrează!"
        voi?: string; // "lucrați!"
    };
}

export interface AdjectiveForms {
    masculinSingular?: string; // "frumos"
    femininSingular?: string; // "frumoasă"
    neutruSingular?: string; // "frumos"
    plural?: string; // "frumoși / frumoase"
}

// Legacy forms interface for backwards compatibility
export interface WordForms {
    singular?: string;
    plural?: string;
    genitivDativ?: string;
    infinitiv?: string;
    gerunziu?: string;
    participiu?: string;
    [key: string]: string | undefined;
}

export interface Translation {
    language: 'en' | 'fr' | 'es' | 'de' | 'hu';
    word: string;
    note?: string;
}

export interface Collocation {
    phrase: string;
    meaning: string;
}

export interface UsageNote {
    type: 'grammar' | 'register' | 'common_mistake' | 'context';
    note: string;
}

export interface Word {
    id: string; // Document ID (normalized word)
    lemma: string; // Base form
    display: string; // Display form with diacritics
    forms: WordForms; // Legacy forms (kept for backwards compatibility)
    // Structured declension/conjugation forms
    nounForms?: NounForms;
    verbForms?: VerbForms;
    adjectiveForms?: AdjectiveForms;
    partOfSpeech: 'substantiv' | 'verb' | 'adjectiv' | 'adverb' | 'pronume' | 'prepozitie' | 'conjunctie' | 'interjectie';
    definitions: Definition[];
    examples: Example[];
    synonyms: string[];
    antonyms: string[];
    relatedWords: string[];
    pronunciation: string;
    syllables: string[];
    etymology: string;
    tags: string[];
    // Enhanced sections
    translations?: Translation[];
    collocations?: Collocation[];
    usageNotes?: UsageNote[];
    frequencyLevel?: 'very_rare' | 'rare' | 'common' | 'very_common';
    difficultyLevel?: 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';
    createdAt: Timestamp;
    createdBy: 'ai' | 'user' | 'import';
    createdByUserId?: string;
    verified: boolean;
    aiVersion?: string;
    // Development/regeneration tracking
    lastRegeneratedAt?: Timestamp;
    regenerationCount?: number;
    // Community voting
    likesCount?: number;
    dislikesCount?: number;
    validationsCount?: number;
    errorsCount?: number;
    communityVerified?: boolean;
}

// Vote types
export type VoteType = 'like' | 'dislike' | 'validate' | 'report_error';

export interface WordVote {
    id: string; // composite: wordId_userId
    wordId: string;
    userId: string;
    voteType: VoteType;
    createdAt: Timestamp;
    updatedAt: Timestamp;
}

// Search log types
export interface SearchLog {
    userId: string | null;
    term: string;
    normalizedTerm: string;
    found: boolean;
    wordId?: string;
    createdAt: Timestamp;
}

// Contribution types
export type ContributionType = 'discovery' | 'example_add' | 'synonym_add' | 'antonym_add' | 'report_error' | 'definition_enhance';

export interface Contribution {
    id: string;
    userId: string;
    wordId: string;
    type: ContributionType;
    points: number;
    createdAt: Timestamp;
    data?: Record<string, unknown>; // Additional data for the contribution
}

// Flag types
export interface Flag {
    id: string;
    wordId: string;
    userId: string;
    reason: string;
    status: 'open' | 'resolved' | 'rejected';
    createdAt: Timestamp;
    resolvedAt?: Timestamp;
    resolvedBy?: string;
    notes?: string;
}

// Leaderboard types
export interface LeaderboardEntry {
    uid: string;
    displayName: string;
    photoURL: string | null;
    totalPoints: number;
    wordsDiscovered: number;
    rank: number;
}

export type LeaderboardPeriod = 'today' | 'week' | 'month' | 'allTime';

// AI Response types (from Azure GPT-4o)
export interface AIWordResponse {
    lemma: string;
    partOfSpeech: string;
    definitions: Array<{
        shortDef: string;
        longDef?: string;
        register?: string;
        domain?: string;
    }>;
    examples: string[];
    synonyms: string[];
    antonyms: string[];
    relatedWords: string[];
    etymology: string;
    pronunciation: string;
    syllables: string[];
    tags: string[];
    forms?: WordForms;
    // Structured declension/conjugation forms
    nounForms?: NounForms;
    verbForms?: VerbForms;
    adjectiveForms?: AdjectiveForms;
    // Enhanced fields
    translations?: Array<{
        language: 'en' | 'fr' | 'es' | 'de' | 'hu';
        word: string;
        note?: string;
    }>;
    collocations?: Array<{
        phrase: string;
        meaning: string;
    }>;
    usageNotes?: Array<{
        type: 'grammar' | 'register' | 'common_mistake' | 'context';
        note: string;
    }>;
    frequencyLevel?: 'very_rare' | 'rare' | 'common' | 'very_common';
    difficultyLevel?: 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';
    isValid: boolean;
    confidence: number;
}

// API Response types
export interface ApiResponse<T = unknown> {
    success: boolean;
    data?: T;
    error?: string;
    message?: string;
}

export interface SearchResponse {
    found: boolean;
    word?: Word;
    message?: string;
    pointsAwarded?: number;
    isNewDiscovery?: boolean;
    isAnonymousDiscovery?: boolean;
}

// Statistics types
export interface SiteStatistics {
    totalWords: number;
    totalSearches: number;
    totalContributions: number;
    totalUsers: number;
    wordsAddedToday: number;
}
