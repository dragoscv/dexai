'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useAuth } from '@/lib/auth-context';
import { isValidWordFormat } from '@/lib/normalize-word';
import SearchLoadingModal from './SearchLoadingModal';
import { trackWordSearch, trackWordDiscovery } from '@/lib/analytics';

interface Suggestion {
    id: string;
    lemma: string;
    display: string;
    partOfSpeech: string;
}

export default function SearchBar() {
    const [searchTerm, setSearchTerm] = useState('');
    const [isSearching, setIsSearching] = useState(false);
    const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(-1);
    const router = useRouter();
    const { user, getIdToken } = useAuth();
    const wrapperRef = useRef<HTMLDivElement>(null);

    // Close suggestions when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setShowSuggestions(false);
            }
        }

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Fetch autocomplete suggestions
    useEffect(() => {
        const fetchSuggestions = async () => {
            if (searchTerm.length < 2) {
                setSuggestions([]);
                setShowSuggestions(false);
                return;
            }

            try {
                console.log('[SearchBar] Fetching suggestions for:', searchTerm);
                const response = await fetch(`/api/autocomplete?q=${encodeURIComponent(searchTerm)}`);
                const data = await response.json();

                console.log('[SearchBar] Autocomplete response:', data);

                if (data.success && data.data.length > 0) {
                    setSuggestions(data.data);
                    setShowSuggestions(true);
                    console.log('[SearchBar] Showing', data.data.length, 'suggestions');
                } else {
                    setSuggestions([]);
                    setShowSuggestions(false);
                    console.log('[SearchBar] No suggestions found');
                }
            } catch (error) {
                console.error('Autocomplete error:', error);
            }
        };

        const debounceTimer = setTimeout(fetchSuggestions, 300);
        return () => clearTimeout(debounceTimer);
    }, [searchTerm]);

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (!showSuggestions || suggestions.length === 0) return;

        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                setSelectedIndex((prev) => (prev < suggestions.length - 1 ? prev + 1 : prev));
                break;
            case 'ArrowUp':
                e.preventDefault();
                setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
                break;
            case 'Escape':
                setShowSuggestions(false);
                setSelectedIndex(-1);
                break;
            case 'Enter':
                if (selectedIndex >= 0) {
                    e.preventDefault();
                    handleSuggestionClick(suggestions[selectedIndex]);
                }
                break;
        }
    };

    const handleSuggestionClick = (suggestion: Suggestion) => {
        setSearchTerm(suggestion.display);
        setShowSuggestions(false);
        setSelectedIndex(-1);
        router.push(`/cuvant/${suggestion.id}`);
    };

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!searchTerm.trim()) return;

        if (!isValidWordFormat(searchTerm)) {
            toast.error('Te rugăm să introduci un cuvânt valid.');
            return;
        }

        setIsSearching(true);

        try {
            const token = await getIdToken();
            const headers: HeadersInit = { 'Content-Type': 'application/json' };

            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }

            const response = await fetch('/api/search', {
                method: 'POST',
                headers,
                body: JSON.stringify({ term: searchTerm }),
            });

            const data = await response.json();

            if (data.success && data.data?.wordId) {
                // Track search analytics
                trackWordSearch(searchTerm, 1);

                // Track discovery if it's a new word
                if (data.data.isNewDiscovery) {
                    trackWordDiscovery(searchTerm, user?.uid);
                    toast.success(data.data.message || 'Cuvânt descoperit!');
                }

                // Redirect to word page
                router.push(`/cuvant/${data.data.wordId}`);
            } else {
                // Track search with no results
                trackWordSearch(searchTerm, 0);
                toast.error(data.message || 'Eroare la căutare');
            }
        } catch (error) {
            console.error('Search error:', error);
            toast.error('A apărut o eroare la căutare');
        } finally {
            setIsSearching(false);
        }
    };

    return (
        <form onSubmit={handleSearch} className="w-full max-w-2xl mx-auto">
            <SearchLoadingModal searchTerm={searchTerm} isOpen={isSearching} />

            <div className="relative" ref={wrapperRef}>
                <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Caută un cuvânt românesc..."
                    disabled={isSearching}
                    className="w-full px-6 py-4 text-lg border-2 border-gray-300 rounded-full focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200 disabled:bg-gray-100 disabled:cursor-not-allowed"
                    autoComplete="off"
                />
                <button
                    type="submit"
                    disabled={isSearching || !searchTerm.trim()}
                    className="absolute right-2 top-1/2 -translate-y-1/2 px-6 py-2 bg-primary-600 text-white rounded-full font-medium hover:bg-primary-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                >
                    {isSearching ? 'Caut...' : 'Caută'}
                </button>

                {/* Autocomplete Dropdown */}
                {showSuggestions && suggestions.length > 0 && (
                    <div className="absolute top-full mt-3 w-full bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                        <div className="max-h-[400px] overflow-y-auto">
                            {suggestions.map((suggestion, index) => (
                                <button
                                    key={suggestion.id}
                                    type="button"
                                    onClick={() => handleSuggestionClick(suggestion)}
                                    className={`w-full text-left px-6 py-4 transition-all duration-150 border-b border-gray-50 last:border-b-0 group ${index === selectedIndex
                                        ? 'bg-gradient-to-r from-primary-50 to-primary-100/50'
                                        : 'hover:bg-gray-50'
                                        }`}
                                >
                                    <div className="flex items-center justify-between gap-4">
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-baseline gap-2 mb-1">
                                                <span className={`font-semibold text-lg truncate ${index === selectedIndex
                                                    ? 'text-primary-700'
                                                    : 'text-gray-900'
                                                    }`}>
                                                    {suggestion.display}
                                                </span>
                                                <span className="text-xs font-medium text-gray-500 uppercase tracking-wide flex-shrink-0">
                                                    {suggestion.partOfSpeech}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2 text-sm text-gray-500">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                </svg>
                                                <span className="truncate">Cuvânt din dicționar</span>
                                            </div>
                                        </div>
                                        <div className={`flex-shrink-0 transition-transform duration-200 ${index === selectedIndex ? 'translate-x-1' : 'group-hover:translate-x-1'
                                            }`}>
                                            <svg
                                                className={`w-5 h-5 ${index === selectedIndex ? 'text-primary-600' : 'text-gray-400 group-hover:text-gray-600'
                                                    }`}
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M9 5l7 7-7 7"
                                                />
                                            </svg>
                                        </div>
                                    </div>
                                </button>
                            ))}
                        </div>
                        <div className="bg-gradient-to-r from-gray-50 to-gray-100/50 px-6 py-3 border-t border-gray-100">
                            <p className="text-xs text-gray-600 flex items-center gap-2 mb-1">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span>Folosește săgețile ↑↓ pentru navigare, Enter pentru selectare</span>
                            </p>
                            <p className="text-xs text-blue-600 flex items-center gap-2">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span>Poți căuta fără diacritice - rezultatele includ forma corectă</span>
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </form>
    );
}
