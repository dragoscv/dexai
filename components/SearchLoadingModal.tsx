'use client';

import { useEffect, useState } from 'react';

interface SearchLoadingModalProps {
    searchTerm: string;
    isOpen: boolean;
}

const loadingMessages = [
    'Căutăm în dicționar...',
    'AI analizează cuvântul...',
    'Generăm definiția...',
    'Pregătim exemple...',
    'Aproape gata...',
];

export default function SearchLoadingModal({ searchTerm, isOpen }: SearchLoadingModalProps) {
    const [messageIndex, setMessageIndex] = useState(0);

    useEffect(() => {
        if (!isOpen) {
            setMessageIndex(0);
            return;
        }

        const interval = setInterval(() => {
            setMessageIndex((prev) => (prev + 1) % loadingMessages.length);
        }, 2000);

        return () => clearInterval(interval);
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4 animate-in zoom-in-95 duration-300">
                {/* Animated Book Icon */}
                <div className="flex justify-center mb-6">
                    <div className="relative">
                        {/* Outer rotating ring */}
                        <div className="absolute inset-0 rounded-full border-4 border-primary-200 border-t-primary-600 animate-spin w-24 h-24"></div>

                        {/* Book icon */}
                        <div className="relative flex items-center justify-center w-24 h-24">
                            <svg
                                className="w-12 h-12 text-primary-600 animate-pulse"
                                fill="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                                <path d="M21 5c-1.11-.35-2.33-.5-3.5-.5-1.95 0-4.05.4-5.5 1.5-1.45-1.1-3.55-1.5-5.5-1.5S2.45 4.9 1 6v14.65c0 .25.25.5.5.5.1 0 .15-.05.25-.05C3.1 20.45 5.05 20 6.5 20c1.95 0 4.05.4 5.5 1.5 1.35-.85 3.8-1.5 5.5-1.5 1.65 0 3.35.3 4.75 1.05.1.05.15.05.25.05.25 0 .5-.25.5-.5V6c-.6-.45-1.25-.75-2-1zm0 13.5c-1.1-.35-2.3-.5-3.5-.5-1.7 0-4.15.65-5.5 1.5V8c1.35-.85 3.8-1.5 5.5-1.5 1.2 0 2.4.15 3.5.5v11.5z" />
                            </svg>
                        </div>
                    </div>
                </div>

                {/* Search Term */}
                <div className="text-center mb-4">
                    <p className="text-sm text-gray-500 mb-1">Căutăm</p>
                    <p className="text-2xl font-bold text-gray-900 bg-gradient-to-r from-primary-600 to-primary-400 bg-clip-text text-transparent">
                        {searchTerm}
                    </p>
                </div>

                {/* Animated Loading Message */}
                <div className="text-center mb-6 h-6">
                    <p className="text-gray-600 animate-in fade-in slide-in-from-bottom-2 duration-500" key={messageIndex}>
                        {loadingMessages[messageIndex]}
                    </p>
                </div>

                {/* Animated Dots */}
                <div className="flex justify-center gap-2">
                    <div className="w-3 h-3 bg-primary-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-3 h-3 bg-primary-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-3 h-3 bg-primary-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>

                {/* Progress Bar */}
                <div className="mt-6">
                    <div className="h-1 bg-gray-200 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-primary-600 to-primary-400 animate-pulse" style={{ width: '60%' }}></div>
                    </div>
                </div>

                {/* Helper Text */}
                <p className="text-xs text-gray-400 text-center mt-4">
                    Acest proces poate dura câteva secunde...
                </p>
            </div>
        </div>
    );
}
