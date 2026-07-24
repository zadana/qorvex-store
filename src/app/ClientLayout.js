"use client";

import { usePathname } from 'next/navigation';
import { Suspense } from 'react';
import FooterClient from '../components/FooterClient';
import HeaderClient from '../components/HeaderClient';
import Providers from '../components/Providers';
import AnalyticsTracker from '../components/AnalyticsTracker';

export default function ClientLayout({ children, footerSettings, headerSettings = {} }) {
    const pathname = usePathname();
    const isAdmin = pathname?.startsWith('/admin');

    const isLanding = pathname?.startsWith('/l/');

    if (isAdmin) {
        return <>{children}</>;
    }

    return (
        <Providers>
            <Suspense fallback={null}>
                <AnalyticsTracker />
            </Suspense>
            {!isLanding && <HeaderClient menus={headerSettings.menus} storeName={headerSettings.storeName} />}
            {children}
            {!isLanding && <FooterClient settings={footerSettings} />}
        </Providers>
    );
}
