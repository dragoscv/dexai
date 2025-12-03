'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { trackPageView } from '@/lib/analytics';

/**
 * AnalyticsProvider - Client component that handles Firebase Analytics initialization
 * and automatic page view tracking for the Next.js App Router
 */
export default function AnalyticsProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();

    useEffect(() => {
        // Track page view on mount and when pathname changes
        if (pathname) {
            trackPageView(pathname);
        }
    }, [pathname]);

    return <>{children}</>;
}
