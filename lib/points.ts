import { adminDb } from './firebase-admin';
import type { ContributionType } from '@/types';

const MAX_DAILY_DISCOVERIES = parseInt(process.env.MAX_DAILY_DISCOVERIES || '50', 10);

/**
 * Point values for different contribution types
 */
export const POINT_VALUES: Record<ContributionType, number> = {
    discovery: 1.0,
    example_add: 0.5,
    synonym_add: 0.5,
    antonym_add: 0.5,
    report_error: 0.0, // No points for reporting, but important for quality
};

/**
 * Checks if a user has exceeded their daily discovery limit
 */
export async function hasExceededDailyLimit(userId: string): Promise<boolean> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const contributions = await adminDb
        .collection('contributions')
        .where('userId', '==', userId)
        .where('type', '==', 'discovery')
        .where('createdAt', '>=', today)
        .count()
        .get();

    return contributions.data().count >= MAX_DAILY_DISCOVERIES;
}

/**
 * Gets the number of discoveries made today by a user
 */
export async function getTodayDiscoveryCount(userId: string): Promise<number> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const contributions = await adminDb
        .collection('contributions')
        .where('userId', '==', userId)
        .where('type', '==', 'discovery')
        .where('createdAt', '>=', today)
        .count()
        .get();

    return contributions.data().count;
}

/**
 * Awards points to a user for a contribution
 */
export async function awardPoints(
    userId: string,
    wordId: string,
    contributionType: ContributionType,
    additionalData?: Record<string, unknown>
): Promise<{ success: boolean; points: number; message?: string }> {
    try {
        // Check daily limit for discoveries
        if (contributionType === 'discovery') {
            const exceeded = await hasExceededDailyLimit(userId);
            if (exceeded) {
                return {
                    success: false,
                    points: 0,
                    message: `Ai atins limita zilnică de ${MAX_DAILY_DISCOVERIES} descoperiri. Încearcă mâine!`,
                };
            }
        }

        const points = POINT_VALUES[contributionType];

        // Create contribution record
        const contributionRef = adminDb.collection('contributions').doc();
        await contributionRef.set({
            userId,
            wordId,
            type: contributionType,
            points,
            createdAt: new Date(),
            data: additionalData || {},
        });

        // Update user's total points
        const userRef = adminDb.collection('users').doc(userId);
        await userRef.update({
            totalPoints: (await userRef.get()).data()?.totalPoints || 0 + points,
        });

        return {
            success: true,
            points,
        };
    } catch (error) {
        console.error('Error awarding points:', error);
        return {
            success: false,
            points: 0,
            message: 'A apărut o eroare la acordarea punctelor.',
        };
    }
}

/**
 * Checks if a word discovery is valid (anti-spam)
 */
export async function isValidDiscovery(
    userId: string,
    wordId: string,
    aiConfidence: number
): Promise<{ valid: boolean; reason?: string }> {
    // AI confidence must be at least 0.7
    if (aiConfidence < 0.7) {
        return {
            valid: false,
            reason: 'Cuvântul nu pare a fi valid sau este prea rar pentru a fi verificat automat.',
        };
    }

    // Check if user has already discovered this word (duplicate prevention)
    const existingContribution = await adminDb
        .collection('contributions')
        .where('userId', '==', userId)
        .where('wordId', '==', wordId)
        .where('type', '==', 'discovery')
        .limit(1)
        .get();

    if (!existingContribution.empty) {
        return {
            valid: false,
            reason: 'Ai descoperit deja acest cuvânt.',
        };
    }

    // Check for rapid-fire submissions (anti-spam)
    const oneMinuteAgo = new Date(Date.now() - 60 * 1000);
    const recentContributions = await adminDb
        .collection('contributions')
        .where('userId', '==', userId)
        .where('type', '==', 'discovery')
        .where('createdAt', '>=', oneMinuteAgo)
        .count()
        .get();

    if (recentContributions.data().count >= 5) {
        return {
            valid: false,
            reason: 'Prea multe descoperiri într-un timp scurt. Te rugăm să încetinești.',
        };
    }

    return { valid: true };
}

/**
 * Gets user's remaining daily discoveries
 */
export async function getRemainingDiscoveries(userId: string): Promise<number> {
    const count = await getTodayDiscoveryCount(userId);
    return Math.max(0, MAX_DAILY_DISCOVERIES - count);
}

/**
 * Calculates daily points for a user
 */
export async function calculateDailyPoints(userId: string): Promise<number> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const contributions = await adminDb
        .collection('contributions')
        .where('userId', '==', userId)
        .where('createdAt', '>=', today)
        .get();

    let totalPoints = 0;
    contributions.forEach((doc) => {
        totalPoints += doc.data().points || 0;
    });

    return totalPoints;
}
