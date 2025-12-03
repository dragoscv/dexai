import { NextRequest, NextResponse } from 'next/server';
import { adminDb, adminAuth } from '@/lib/firebase-admin';
import admin from '@/lib/firebase-admin';
import { checkEndpointRateLimit } from '@/lib/rate-limit';
import type { VoteType, WordVote } from '@/types';

interface RouteContext {
    params: Promise<{
        wordId: string;
    }>;
}

// GET - Get user's current vote and all vote counts
export async function GET(request: NextRequest, context: RouteContext) {
    try {
        const { wordId } = await context.params;

        // Get auth token
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

        // Get word to fetch vote counts
        const wordDoc = await adminDb.collection('words').doc(wordId).get();

        if (!wordDoc.exists) {
            return NextResponse.json(
                { success: false, message: 'Word not found' },
                { status: 404 }
            );
        }

        const wordData = wordDoc.data();

        // Get user's vote if authenticated
        let userVote: VoteType | null = null;
        if (userId) {
            const voteId = `${wordId}_${userId}`;
            const voteDoc = await adminDb.collection('wordVotes').doc(voteId).get();

            if (voteDoc.exists) {
                userVote = (voteDoc.data() as WordVote).voteType;
            }
        }

        return NextResponse.json({
            success: true,
            data: {
                userVote,
                counts: {
                    likes: wordData?.likesCount || 0,
                    dislikes: wordData?.dislikesCount || 0,
                    validations: wordData?.validationsCount || 0,
                    errors: wordData?.errorsCount || 0,
                },
                communityVerified: wordData?.communityVerified || false,
            },
        });
    } catch (error) {
        console.error('Get vote error:', error);
        return NextResponse.json(
            { success: false, message: 'Error fetching vote data' },
            { status: 500 }
        );
    }
}

// POST - Create/update/remove vote
export async function POST(request: NextRequest, context: RouteContext) {
    try {
        const { wordId } = await context.params;
        const { voteType } = await request.json();

        // Validate voteType
        if (voteType !== null && !['like', 'dislike', 'validate', 'report_error'].includes(voteType)) {
            return NextResponse.json(
                { success: false, message: 'Invalid vote type' },
                { status: 400 }
            );
        }

        // Get auth token
        const authHeader = request.headers.get('authorization');
        if (!authHeader) {
            return NextResponse.json(
                { success: false, message: 'Authentication required' },
                { status: 401 }
            );
        }

        let userId: string;
        try {
            const token = authHeader.replace('Bearer ', '');
            const decodedToken = await adminAuth.verifyIdToken(token);
            userId = decodedToken.uid;
        } catch (error) {
            return NextResponse.json(
                { success: false, message: 'Invalid authentication token' },
                { status: 401 }
            );
        }

        // Rate limit: 20 votes per minute per user
        if (!checkEndpointRateLimit(userId, 'vote', 20, 60 * 1000)) {
            return NextResponse.json({
                success: false,
                message: 'Prea multe voturi. Te rugăm să încetinești.',
            }, { status: 429 });
        }

        // Check if word exists
        const wordRef = adminDb.collection('words').doc(wordId);
        const wordDoc = await wordRef.get();

        if (!wordDoc.exists) {
            return NextResponse.json(
                { success: false, message: 'Word not found' },
                { status: 404 }
            );
        }

        const voteId = `${wordId}_${userId}`;
        const voteRef = adminDb.collection('wordVotes').doc(voteId);
        const existingVoteDoc = await voteRef.get();

        let oldVoteType: VoteType | null = null;
        if (existingVoteDoc.exists) {
            oldVoteType = (existingVoteDoc.data() as WordVote).voteType;
        }

        // Calculate counter updates
        const counterUpdates: any = {};

        // Decrement old vote count
        if (oldVoteType) {
            const oldCountField = `${oldVoteType === 'report_error' ? 'errors' : oldVoteType + 's'}Count`;
            counterUpdates[oldCountField] = admin.firestore.FieldValue.increment(-1);
        }

        // Increment new vote count (if not null)
        if (voteType) {
            const newCountField = `${voteType === 'report_error' ? 'errors' : voteType + 's'}Count`;
            counterUpdates[newCountField] = admin.firestore.FieldValue.increment(1);
        }

        // Update vote document
        if (voteType === null) {
            // Remove vote
            if (existingVoteDoc.exists) {
                await voteRef.delete();
            }
        } else {
            // Create or update vote
            const voteData: Omit<WordVote, 'id'> = {
                wordId,
                userId,
                voteType,
                createdAt: existingVoteDoc.exists ? (existingVoteDoc.data() as WordVote).createdAt : new Date() as any,
                updatedAt: new Date() as any,
            };
            await voteRef.set(voteData);
        }

        // Update word counters
        await wordRef.update(counterUpdates);

        // Get updated word data
        const updatedWordDoc = await wordRef.get();
        const updatedWordData = updatedWordDoc.data();

        // Check if should be community verified
        const validationsCount = updatedWordData?.validationsCount || 0;
        const errorsCount = updatedWordData?.errorsCount || 0;

        let shouldBeVerified = false;
        if (validationsCount >= 5 && errorsCount < 3) {
            shouldBeVerified = true;
            if (!updatedWordData?.communityVerified) {
                await wordRef.update({ communityVerified: true, verified: true });
            }
        } else if (updatedWordData?.communityVerified && validationsCount < 5) {
            // Remove community verification if validations drop below 5
            await wordRef.update({ communityVerified: false, verified: false });
        }

        return NextResponse.json({
            success: true,
            message: voteType === null ? 'Vote removed' : 'Vote recorded successfully',
            data: {
                userVote: voteType,
                counts: {
                    likes: updatedWordData?.likesCount || 0,
                    dislikes: updatedWordData?.dislikesCount || 0,
                    validations: updatedWordData?.validationsCount || 0,
                    errors: updatedWordData?.errorsCount || 0,
                },
                communityVerified: shouldBeVerified,
            },
        });
    } catch (error) {
        console.error('Vote error:', error);
        return NextResponse.json(
            { success: false, message: 'Error processing vote' },
            { status: 500 }
        );
    }
}
