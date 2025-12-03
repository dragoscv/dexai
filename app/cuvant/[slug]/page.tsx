import { adminDb } from '@/lib/firebase-admin';
import type { Word } from '@/types';
import WordPageClient from '@/components/WordPageClient';

interface PageProps {
    params: Promise<{
        slug: string;
    }>;
}

async function getWord(slug: string): Promise<Word | null> {
    try {
        const wordDoc = await adminDb.collection('words').doc(slug).get();

        if (!wordDoc.exists) {
            return null;
        }

        const data = wordDoc.data() as any;

        // Serialize Firestore Timestamps to plain objects for Client Components
        return {
            id: wordDoc.id,
            ...data,
            createdAt: data?.createdAt ? {
                _seconds: data.createdAt._seconds || data.createdAt.seconds,
                _nanoseconds: data.createdAt._nanoseconds || data.createdAt.nanoseconds,
            } : null,
            lastRegeneratedAt: data?.lastRegeneratedAt ? {
                _seconds: data.lastRegeneratedAt._seconds || data.lastRegeneratedAt.seconds,
                _nanoseconds: data.lastRegeneratedAt._nanoseconds || data.lastRegeneratedAt.nanoseconds,
            } : null,
        } as Word;
    } catch (error) {
        console.error('Error fetching word:', error);
        return null;
    }
}

export default async function WordPage(props: PageProps) {
    const params = await props.params;
    const word = await getWord(params.slug);

    // Pass word (or null) to client component which will handle fetching if needed
    return <WordPageClient initialWord={word} slug={params.slug} />;
}

export async function generateMetadata(props: PageProps) {
    const params = await props.params;
    const word = await getWord(params.slug);

    if (!word) {
        return {
            title: 'Cuvânt negăsit - DEXAI.ro',
        };
    }

    return {
        title: `${word.display} - DEXAI.ro`,
        description:
            word.definitions[0]?.shortDef || `Definiția cuvântului ${word.display}`,
        openGraph: {
            title: `${word.display} - DEXAI.ro`,
            description: word.definitions[0]?.shortDef,
        },
    };
}
