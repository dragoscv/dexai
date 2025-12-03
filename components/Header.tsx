'use client';

import Link from 'next/link';
import AuthButton from './AuthButton';

export default function Header() {
    return (
        <header className="border-b bg-white shadow-sm sticky top-0 z-30">
            <div className="container mx-auto px-4 py-6">
                <div className="flex items-center justify-between">
                    <Link href="/" className="hover:opacity-80 transition-opacity">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">
                                DEXAI<span className="text-primary-600">.ro</span>
                            </h1>
                            <p className="text-sm text-gray-600 mt-1">
                                Dicționar Românesc cu Inteligență Artificială
                            </p>
                        </div>
                    </Link>
                    <AuthButton />
                </div>
            </div>
        </header>
    );
}
