import { adminDb } from '@/lib/firebase-admin';
import type { Word } from '@/types';
import WordPageClient from '@/components/WordPageClient';
import {
    generateWordMetaDescription,
    generateWordKeywords,
    generateOGImage,
    generateCanonicalUrl,
} from '@/lib/seo-utils';

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
            description: 'Cuvântul căutat nu a fost găsit în dicționarul nostru.',
        };
    }

    const description = generateWordMetaDescription(word);
    const keywords = generateWordKeywords(word);
    const ogImage = generateOGImage(word);
    const canonical = generateCanonicalUrl(word.id);

    return {
        title: `${word.display} - Definiție, Sinonime, Etimologie | DEXAI.ro`,
        description,
        keywords,
        alternates: {
            canonical,
        },
        openGraph: {
            title: `${word.display} - Dicționar Românesc`,
            description,
            url: canonical,
            siteName: 'DEXAI.ro',
            locale: 'ro_RO',
            type: 'article',
            images: [
                {
                    url: ogImage,
                    width: 1200,
                    height: 630,
                    alt: `Definiția cuvântului ${word.display}`,
                },
            ],
        },
        twitter: {
            card: 'summary_large_image',
            title: `${word.display} - Dicționar Românesc`,
            description,
            images: [ogImage],
            creator: '@dexairo',
        },
        other: {
            'article:published_time': word.createdAt
                ? new Date(word.createdAt.seconds * 1000).toISOString()
                : undefined,
            'article:modified_time': word.lastRegeneratedAt
                ? new Date(word.lastRegeneratedAt.seconds * 1000).toISOString()
                : word.createdAt
                    ? new Date(word.createdAt.seconds * 1000).toISOString()
                    : undefined,
            'article:author': 'DEXAI.ro',
            'article:section': 'Dicționar',
        },
    };
}
