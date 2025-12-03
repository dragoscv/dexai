import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';
import type { LeaderboardEntry } from '@/types';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const limit = parseInt(searchParams.get('limit') || '10', 10);

        const query = adminDb.collection('users').orderBy('totalPoints', 'desc');

        const snapshot = await query.limit(limit).get();

        const leaders: LeaderboardEntry[] = snapshot.docs.map((doc, index) => {
            const data = doc.data();
            return {
                uid: doc.id,
                displayName: data.displayName || 'Utilizator',
                photoURL: data.photoURL || null,
                totalPoints: data.totalPoints || 0,
                wordsDiscovered: data.wordsDiscovered || 0,
                rank: index + 1,
            };
        });

        return NextResponse.json({ success: true, data: leaders });
    } catch (error) {
        console.error('Leaderboard error:', error);
        return NextResponse.json(
            { success: false, message: 'Eroare la încărcarea clasamentului' },
            { status: 500 }
        );
    }
}
