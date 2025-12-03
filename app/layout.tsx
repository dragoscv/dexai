import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '@/lib/auth-context';
import Header from '@/components/Header';
import { Toaster } from 'sonner';

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
                <AuthProvider>
                    <Header />
                    {children}
                    <Toaster position="top-center" richColors />
                </AuthProvider>
            </body>
        </html>
    );
}
