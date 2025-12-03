import { NextRequest, NextResponse } from 'next/server';
import { adminDb, adminAuth } from '@/lib/firebase-admin';
import { checkEndpointRateLimit } from '@/lib/rate-limit';
import { sanitizeText } from '@/lib/sanitize';

export async function POST(request: NextRequest) {
    try {
        const { wordId, reason } = await request.json();

        // Validate input
        if (!wordId || typeof wordId !== 'string') {
            return NextResponse.json(
                { success: false, message: 'ID cuvânt invalid' },
                { status: 400 }
            );
        }

        if (!reason || typeof reason !== 'string' || reason.trim().length < 10) {
            return NextResponse.json(
                { success: false, message: 'Te rugăm să descrii problema (minim 10 caractere)' },
                { status: 400 }
            );
        }

        // Verify authentication
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

        if (!userId) {
            return NextResponse.json({
                success: false,
                message: 'Trebuie să fii autentificat pentru a raporta erori',
            }, { status: 401 });
        }

        // Rate limit: 5 flags per hour per user
        if (!checkEndpointRateLimit(userId, 'flag', 5, 60 * 60 * 1000)) {
            return NextResponse.json({
                success: false,
                message: 'Prea multe raportări. Te rugăm să aștepți.',
            }, { status: 429 });
        }

        // Sanitize input
        const sanitizedReason = sanitizeText(reason);

        // Check if word exists
        const wordDoc = await adminDb.collection('words').doc(wordId).get();
        if (!wordDoc.exists) {
            return NextResponse.json(
                { success: false, message: 'Cuvântul nu există' },
                { status: 404 }
            );
        }

        // Create flag document
        const flagData = {
            wordId,
            userId,
            reason: sanitizedReason,
            status: 'open',
            createdAt: new Date(),
        };

        const flagRef = await adminDb.collection('flags').add(flagData);

        console.log('[Flag] Created flag:', flagRef.id, 'for word:', wordId, 'by user:', userId);

        return NextResponse.json({
            success: true,
            data: { flagId: flagRef.id },
            message: 'Raportul a fost trimis cu succes',
        });
    } catch (error) {
        console.error('Flag error:', error);
        return NextResponse.json(
            { success: false, message: 'Eroare la trimiterea raportului' },
            { status: 500 }
        );
    }
}
