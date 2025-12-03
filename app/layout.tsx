import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '@/lib/auth-context';
import Header from '@/components/Header';
import { Toaster } from 'sonner';
import AnalyticsProvider from '@/components/AnalyticsProvider';

export const metadata: Metadata = {
    title: 'DEXAI.ro - Dicționar Românesc cu Inteligență Artificială',
    description:
        'Descoperă și explorează limba română cu ajutorul inteligenței artificiale. Caută cuvinte, primește puncte pentru descoperiri noi și contribuie la cel mai mare dicționar românesc colaborativ.',
    keywords: [
        'dicționar',
        'română',
        'DEX',
        'AI',
        'inteligență artificială',
        'cuvinte',
        'limba română',
    ],
    authors: [{ name: 'DEXAI.ro' }],
    openGraph: {
        title: 'DEXAI.ro - Dicționar Românesc cu AI',
        description:
            'Descoperă limba română cu ajutorul inteligenței artificiale',
        type: 'website',
        locale: 'ro_RO',
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="ro">
            <body className="antialiased romanian-text">
                <AnalyticsProvider>
                    <AuthProvider>
                        <Header />
                        {children}
                        <footer className="bg-gray-900 text-white py-8 mt-12">
                            <div className="container mx-auto px-4 text-center">
                                <p className="text-gray-400">
                                    © {new Date().getFullYear()} DEXAI.ro - Dicționar Românesc cu Inteligență Artificială
                                </p>
                                <p className="text-sm text-gray-500 mt-2">
                                    Creat cu dragoste de{' '}
                                    <a
                                        href="https://dragoscatalin.ro"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-primary-400 hover:text-primary-300 transition-colors"
                                    >
                                        Dragoș Cătălin
                                    </a>
                                </p>
                                <p className="text-sm text-gray-500 mt-2">
                                    <a
                                        href="https://github.com/dragoscv/dexai"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
                                    >
                                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                            <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                                        </svg>
                                        Vezi pe GitHub
                                    </a>
                                </p>
                            </div>
                        </footer>
                        <Toaster position="top-center" richColors />
                    </AuthProvider>
                </AnalyticsProvider>
            </body>
        </html>
    );
}
