import { notFound } from 'next/navigation';
import { adminDb } from '@/lib/firebase-admin';
import type { Word } from '@/types';
import WordHeader from '@/components/WordHeader';
import DefinitionsList from '@/components/DefinitionsList';
import SynonymsBlock from '@/components/SynonymsBlock';
import ContributionsCard from '@/components/ContributionsCard';

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
        } as Word;
    } catch (error) {
        console.error('Error fetching word:', error);
        return null;
    }
}

export default async function WordPage(props: PageProps) {
    const params = await props.params;
    const word = await getWord(params.slug);

    if (!word) {
        notFound();
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Main Content */}
            <main className="container mx-auto px-4 py-8">
                <div className="max-w-4xl mx-auto">
                    <WordHeader word={word} />
                    <DefinitionsList
                        definitions={word.definitions}
                        examples={word.examples}
                    />
                    <SynonymsBlock
                        synonyms={word.synonyms}
                        antonyms={word.antonyms}
                        relatedWords={word.relatedWords}
                    />
                    <ContributionsCard word={word} />
                </div>
            </main>
        </div>
    );
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
