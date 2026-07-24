"use client";

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

export default function AnalyticsTracker() {
    const pathname = usePathname();
    const searchParams = useSearchParams();

    useEffect(() => {
        if (!pathname) return;
        // Don't track admin routes
        if (pathname.startsWith('/admin')) return;

        const url = pathname + (searchParams.toString() ? '?' + searchParams.toString() : '');

        fetch('/api/track', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ url }),
        }).catch(e => console.error(e));

    }, [pathname, searchParams]);

    return null;
}
