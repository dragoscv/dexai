import { logEvent, setUserId, setUserProperties } from 'firebase/analytics';
import { analytics } from './firebase';

/**
 * Analytics utility functions for DEXAI
 * All functions safely handle cases where analytics is not initialized
 */

// Track page views
export const trackPageView = (pagePath: string, pageTitle?: string) => {
    if (!analytics) return;

    logEvent(analytics, 'page_view', {
        page_path: pagePath,
        page_title: pageTitle,
    });
};

// Track word searches
export const trackWordSearch = (query: string, resultsCount: number) => {
    if (!analytics) return;

    logEvent(analytics, 'search', {
        search_term: query,
        results_count: resultsCount,
    });
};

// Track word discoveries (when a new word is added to the database)
export const trackWordDiscovery = (word: string, userId?: string) => {
    if (!analytics) return;

    logEvent(analytics, 'word_discovery', {
        word: word,
        user_id: userId || 'anonymous',
        discovery_type: userId ? 'authenticated' : 'anonymous',
    });
};

// Track community votes
export const trackVote = (
    voteType: 'like' | 'dislike' | 'validate' | 'report_error',
    wordId: string,
    userId?: string
) => {
    if (!analytics) return;

    logEvent(analytics, 'vote_cast', {
        vote_type: voteType,
        word_id: wordId,
        user_id: userId || 'anonymous',
    });
};

// Track word regeneration
export const trackWordRegeneration = (wordId: string, userId: string) => {
    if (!analytics) return;

    logEvent(analytics, 'word_regenerate', {
        word_id: wordId,
        user_id: userId,
    });
};

// Track user authentication
export const trackUserLogin = (method: string) => {
    if (!analytics) return;

    logEvent(analytics, 'login', {
        method: method,
    });
};

export const trackUserSignup = (method: string) => {
    if (!analytics) return;

    logEvent(analytics, 'sign_up', {
        method: method,
    });
};

// Set user ID for analytics
export const setAnalyticsUserId = (userId: string | null) => {
    if (!analytics) return;

    setUserId(analytics, userId);
};

// Set user properties
export const setAnalyticsUserProperties = (properties: Record<string, string | number>) => {
    if (!analytics) return;

    setUserProperties(analytics, properties);
};

// Track profile views
export const trackProfileView = (userId: string, isOwnProfile: boolean) => {
    if (!analytics) return;

    logEvent(analytics, 'profile_view', {
        viewed_user_id: userId,
        is_own_profile: isOwnProfile,
    });
};

// Track leaderboard views
export const trackLeaderboardView = () => {
    if (!analytics) return;

    logEvent(analytics, 'leaderboard_view', {
        timestamp: new Date().toISOString(),
    });
};

// Track content flagging
export const trackContentFlag = (contentId: string, reason: string) => {
    if (!analytics) return;

    logEvent(analytics, 'content_flag', {
        content_id: contentId,
        flag_reason: reason,
    });
};

// Track custom events
export const trackCustomEvent = (
    eventName: string,
    params?: Record<string, string | number | boolean>
) => {
    if (!analytics) return;

    logEvent(analytics, eventName, params);
};
