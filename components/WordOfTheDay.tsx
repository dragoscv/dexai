import { adminDb } from '@/lib/firebase-admin';
import type { Word } from '@/types';
import Link from 'next/link';

async function getWordOfTheDay(): Promise<Word | null> {
    try {
        // Get a random recent word
        const wordsSnapshot = await adminDb
            .collection('words')
            .orderBy('createdAt', 'desc')
            .limit(10)
            .get();

        if (wordsSnapshot.empty) return null;

        const words = wordsSnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        })) as Word[];

        // Return a random word from the recent ones
        return words[Math.floor(Math.random() * words.length)];
    } catch (error) {
        console.error('Error fetching word of the day:', error);
        return null;
    }
}

export default async function WordOfTheDay() {
    const word = await getWordOfTheDay();

    if (!word) {
        return null;
    }

    return (
        <div className="bg-gradient-to-r from-primary-50 to-blue-50 rounded-lg shadow-md p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
                ✨ Cuvântul zilei
            </h3>
            <Link
                href={`/cuvant/${word.id}`}
                className="block hover:scale-102 transition-transform"
            >
                <div className="bg-white rounded-lg p-6">
                    <div className="flex items-baseline gap-3 mb-3">
                        <h4 className="text-3xl font-bold text-primary-600">
                            {word.display}
                        </h4>
                        <span className="text-sm text-gray-500 italic">
                            {word.partOfSpeech}
                        </span>
                    </div>
                    {word.definitions[0] && (
                        <p className="text-gray-700 mb-3">{word.definitions[0].shortDef}</p>
                    )}
                    {word.examples[0] && (
                        <p className="text-gray-600 italic text-sm">
                            &ldquo;{word.examples[0].text}&rdquo;
                        </p>
                    )}
                    <div className="mt-4 text-primary-600 font-medium text-sm">
                        Citește mai mult →
                    </div>
                </div>
            </Link>
        </div>
    );
}
