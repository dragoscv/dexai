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

export interface WordForms {
    singular?: string;
    plural?: string;
    genitivDativ?: string;
    infinitiv?: string;
    gerunziu?: string;
    participiu?: string;
    [key: string]: string | undefined;
}

export interface Word {
    id: string; // Document ID (normalized word)
    lemma: string; // Base form
    display: string; // Display form with diacritics
    forms: WordForms;
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
    createdAt: Timestamp;
    createdBy: 'ai' | 'user' | 'import';
    createdByUserId?: string;
    verified: boolean;
    aiVersion?: string;
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
export type ContributionType = 'discovery' | 'example_add' | 'synonym_add' | 'antonym_add' | 'report_error';

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
}

// Statistics types
export interface SiteStatistics {
    totalWords: number;
    totalSearches: number;
    totalContributions: number;
    totalUsers: number;
    wordsAddedToday: number;
}
