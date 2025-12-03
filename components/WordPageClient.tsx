'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useAuth } from '@/lib/auth-context';
import type { Word } from '@/types';
import WordHeader from '@/components/WordHeader';
import WordVotingButtons from '@/components/WordVotingButtons';
import DefinitionsList from '@/components/DefinitionsList';
import SynonymsBlock from '@/components/SynonymsBlock';
import ContributionsCard from '@/components/ContributionsCard';
import WordMetadataCard from '@/components/WordMetadataCard';
import TranslationsCard from '@/components/TranslationsCard';
import CollocationsCard from '@/components/CollocationsCard';
import UsageNotesCard from '@/components/UsageNotesCard';
import DeclensionCard from '@/components/DeclensionCard';
import SearchLoadingModal from '@/components/SearchLoadingModal';
import StructuredData from '@/components/StructuredData';

interface WordPageClientProps {
    initialWord: Word | null;
    slug: string;
}

export default function WordPageClient({ initialWord, slug }: WordPageClientProps) {
    const [word, setWord] = useState<Word | null>(initialWord);
    const [isLoading, setIsLoading] = useState(!initialWord);
    const [error, setError] = useState<string | null>(null);
    const [showAnonymousBanner, setShowAnonymousBanner] = useState(false);
    const [isRegenerating, setIsRegenerating] = useState(false);
    const [isDevelopment, setIsDevelopment] = useState(false);
    const { user, loading: authLoading, getIdToken } = useAuth();
    const router = useRouter();

    // Check if we're in development environment
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const isDev = window.location.hostname === 'localhost' ||
                window.location.hostname.includes('dev');
            setIsDevelopment(isDev);
        }
    }, []);

    useEffect(() => {
        // If word already exists, no need to fetch
        if (initialWord) return;

        // Wait for auth to finish loading before making API call
        if (authLoading) return;

        // Auto-fetch the word when component mounts and auth is ready
        fetchAndAddWord();
    }, [initialWord, slug, authLoading]);

    const fetchAndAddWord = async () => {
        setIsLoading(true);
        setError(null);

        try {
            const token = await getIdToken();
            const headers: HeadersInit = { 'Content-Type': 'application/json' };

            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }

            const response = await fetch('/api/search', {
                method: 'POST',
                headers,
                body: JSON.stringify({ term: slug }),
            });

            const data = await response.json();

            if (data.success && data.data?.word) {
                // Successfully got the word (either existing or newly created)
                setWord(data.data.word);

                // Show success message if it's a new discovery
                if (data.data.isNewDiscovery) {
                    toast.success(data.data.message || 'Cuvânt descoperit cu succes!');

                    // Show banner for anonymous discoveries
                    if (data.data.isAnonymousDiscovery) {
                        setShowAnonymousBanner(true);
                    }
                }

                // Refresh the page to get server-side rendered content
                router.refresh();
            } else {
                // Handle different error cases
                if (data.message?.includes('limita')) {
                    setError('Ai atins limita zilnică de descoperiri. Încearcă mâine!');
                } else {
                    setError(data.message || 'Nu am putut găsi sau adăuga acest cuvânt.');
                }
            }
        } catch (error) {
            console.error('Error fetching word:', error);
            setError('A apărut o eroare la încărcarea cuvântului.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleRetry = () => {
        setError(null);
        fetchAndAddWord();
    };

    // Watch for user authentication changes
    useEffect(() => {
        if (user && showAnonymousBanner) {
            // User just authenticated after seeing anonymous banner
            // Could potentially award points retroactively here in future
            setShowAnonymousBanner(false);
        }
    }, [user, showAnonymousBanner]);

    const handleRegenerate = async () => {
        if (!word) return;

        setIsRegenerating(true);

        try {
            const response = await fetch(`/api/words/${word.id}/regenerate`, {
                method: 'POST',
            });

            const data = await response.json();

            if (data.success && data.data?.word) {
                setWord(data.data.word);
                toast.success(data.message || 'Word regenerated successfully!');
                router.refresh();
            } else {
                toast.error(data.message || 'Failed to regenerate word');
            }
        } catch (error) {
            console.error('Regeneration error:', error);
            toast.error('Error regenerating word');
        } finally {
            setIsRegenerating(false);
        }
    };

    // Show loading state
    if (isLoading) {
        return (
            <>
                <SearchLoadingModal searchTerm={slug} isOpen={true} />
                <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                    <div className="text-center">
                        <p className="text-gray-500">Se încarcă cuvântul...</p>
                    </div>
                </div>
            </>
        );
    }

    // Show error state
    if (error && !word) {
        return (
            <div className="min-h-screen bg-gray-50">
                <main className="container mx-auto px-4 py-8">
                    <div className="max-w-2xl mx-auto">
                        <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
                            {/* Error Icon */}
                            <div className="flex justify-center mb-6">
                                <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center">
                                    <svg
                                        className="w-10 h-10 text-red-600"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                                        />
                                    </svg>
                                </div>
                            </div>

                            {/* Error Message */}
                            <h2 className="text-2xl font-bold text-gray-900 mb-3">
                                Cuvânt negăsit
                            </h2>
                            <p className="text-lg text-gray-600 mb-2">
                                <span className="font-semibold text-primary-600">{slug}</span>
                            </p>
                            <p className="text-gray-500 mb-6">{error}</p>

                            {/* Action Buttons */}
                            <div className="flex flex-col sm:flex-row gap-3 justify-center">
                                <button
                                    onClick={handleRetry}
                                    className="px-6 py-3 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors"
                                >
                                    Încearcă din nou
                                </button>
                                <button
                                    onClick={() => router.push('/')}
                                    className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-colors"
                                >
                                    Înapoi la căutare
                                </button>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        );
    }

    // Show word content
    if (!word) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <p className="text-gray-500">Cuvântul nu a putut fi încărcat.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* SEO Structured Data */}
            <StructuredData word={word} />

            {/* Main Content */}
            <main className="container mx-auto px-4 py-8">
                <div className="max-w-4xl mx-auto space-y-6">
                    {/* Anonymous Discovery Banner */}
                    {showAnonymousBanner && !user && (
                        <div className="bg-gradient-to-r from-primary-500 to-primary-600 rounded-2xl shadow-lg p-6 text-white animate-in slide-in-from-top duration-500">
                            <div className="flex items-start gap-4">
                                <div className="flex-shrink-0">
                                    <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                    </svg>
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-xl font-bold mb-2">🎉 Cuvânt adăugat cu succes!</h3>
                                    <p className="text-white/90 mb-4">
                                        Autentifică-te cu Google pentru a câștiga puncte când descoperi cuvinte noi ca acesta!
                                    </p>
                                    <button
                                        onClick={() => {
                                            // Trigger auth modal (could import AuthButton or inline the logic)
                                            window.location.href = '/?auth=true';
                                        }}
                                        className="px-6 py-2 bg-white text-primary-600 rounded-lg font-medium hover:bg-gray-100 transition-colors inline-flex items-center gap-2"
                                    >
                                        <svg className="w-5 h-5" viewBox="0 0 24 24">
                                            <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                            <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                            <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                            <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                                        </svg>
                                        Conectează-te cu Google
                                    </button>
                                </div>
                                <button
                                    onClick={() => setShowAnonymousBanner(false)}
                                    className="flex-shrink-0 text-white/80 hover:text-white transition-colors"
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    )}

                    <WordHeader word={word} />

                    {/* Voting Buttons */}
                    <WordVotingButtons word={word} className="mb-6" />

                    {/* Definitions */}
                    <DefinitionsList
                        definitions={word.definitions}
                        examples={word.examples}
                    />

                    {/* Declensions & Conjugations */}
                    <DeclensionCard word={word} />

                    {/* Synonyms, Antonyms, Related Words */}
                    <SynonymsBlock
                        synonyms={word.synonyms}
                        antonyms={word.antonyms}
                        relatedWords={word.relatedWords}
                    />

                    {/* Collocations */}
                    <CollocationsCard word={word} />

                    {/* Usage Notes */}
                    <UsageNotesCard word={word} />

                    {/* Translations */}
                    <TranslationsCard word={word} />

                    {/* Metadata: Frequency & Difficulty */}
                    <WordMetadataCard word={word} />

                    {/* Contributions & Etymology */}
                    <ContributionsCard word={word} />
                </div>
            </main>

            {/* Development Regenerate Button */}
            {isDevelopment && word && (
                <button
                    onClick={handleRegenerate}
                    disabled={isRegenerating}
                    className="fixed bottom-6 right-6 px-6 py-3 bg-amber-500 hover:bg-amber-600 text-white rounded-full shadow-lg font-medium transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 z-50 animate-pulse hover:animate-none"
                    title="Development only - Regenerate word with current AI prompt"
                >
                    <svg
                        className={`w-5 h-5 ${isRegenerating ? 'animate-spin' : ''}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                        />
                    </svg>
                    {isRegenerating ? 'Regenerating...' : '🧠 Regenerate'}
                </button>
            )}
        </div>
    );
}
