"use client";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function FooterClient({ settings = {} }) {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    // Default fallback values
    const [footerData, setFooterData] = useState({
        footerAboutTitle: settings.footerAboutTitle || 'QORVEX',
        footerAboutText: settings.footerAboutText || 'نقدم لك تجربة تسوق فريدة ومميزة تناسب ذوقك الرفيع. الجودة والفخامة هي شعارنا الدائم.',
        footerQuickLinks: [],
        footerServiceLinks: [],
        footerNewsletterTitle: settings.footerNewsletterTitle || 'النشرة البريدية',
        footerNewsletterText: settings.footerNewsletterText || 'اشترك ليصلك كل جديد وعروض حصرية.',
        footerShowNewsletter: settings.footerShowNewsletter !== 'false',
        footerCopyright: settings.footerCopyright || `© ${new Date().getFullYear()} متجر QORVEX. جميع الحقوق محفوظة.`
    });

    useEffect(() => {
        // Check login status
        try {
            const storedUser = localStorage.getItem('user');
            if (storedUser) setIsLoggedIn(true);
        } catch (e) { }
    }, []);

    useEffect(() => {
        try {
            let parsedQuick = settings.footerQuickLinks
                ? JSON.parse(settings.footerQuickLinks)
                : [
                    { title: 'الرئيسية', url: '/' },
                    { title: 'تصفح المنتجات', url: '/search' },
                    { title: 'تسجيل الدخول', url: '/login' },
                    { title: 'السلة والدفع', url: '/cart' }
                ];

            // If user is logged in, replace login link with account link
            if (isLoggedIn) {
                parsedQuick = parsedQuick.map(link =>
                    (link.url === '/login' || link.title === 'تسجيل الدخول')
                        ? { title: 'حسابي', url: '/dashboard' }
                        : link
                );
            }

            const parsedServices = settings.footerServiceLinks
                ? JSON.parse(settings.footerServiceLinks)
                : [
                    { title: 'سياسة الاسترجاع', url: '#' },
                    { title: 'الشروط والأحكام', url: '#' },
                    { title: 'الأسئلة الشائعة', url: '#' },
                    { title: 'اتصل بنا', url: '#' }
                ];

            setFooterData(prev => ({
                ...prev,
                footerQuickLinks: parsedQuick,
                footerServiceLinks: parsedServices
            }));
        } catch (e) { }
    }, [settings, isLoggedIn]);

    return (
        <footer className="footer-premium" style={{ marginTop: '100px', padding: '80px 0 0 0', position: 'relative', overflow: 'hidden' }}>
            {/* Background Blob for Premium Look */}
            <div style={{ position: 'absolute', top: 0, right: '10%', width: '300px', height: '300px', background: 'radial-gradient(circle, var(--primary-color) 0%, transparent 70%)', opacity: '0.05', filter: 'blur(50px)', zIndex: -1 }}></div>

            <div className={`container grid ${footerData.footerShowNewsletter ? "grid-cols-4" : "grid-cols-3"}`} style={{ gap: '60px', marginBottom: '60px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div className="logo text-gradient" style={{ fontSize: '2.5rem', fontWeight: '800', letterSpacing: '1px' }}>{footerData.footerAboutTitle}</div>
                    <p style={{ color: 'var(--text-secondary)', lineHeight: '1.9', fontSize: '0.95rem' }}>
                        {footerData.footerAboutText}
                    </p>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: '700', margin: 0, color: 'var(--text-primary)' }}>روابط سريعة</h3>
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '14px' }}>
                        {footerData.footerQuickLinks.map((link, i) => (
                            <li key={i}><Link href={link.url} className="footer-link"><span style={{ color: 'var(--primary-color)', marginLeft: '6px', fontSize: '0.8rem' }}>✦</span>{link.title}</Link></li>
                        ))}
                    </ul>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: '700', margin: 0, color: 'var(--text-primary)' }}>خدمة العملاء</h3>
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '14px' }}>
                        {footerData.footerServiceLinks.map((link, i) => (
                            <li key={i}><Link href={link.url} className="footer-link"><span style={{ color: 'var(--accent-color)', marginLeft: '6px', fontSize: '0.8rem' }}>✦</span>{link.title}</Link></li>
                        ))}
                    </ul>
                </div>

                {footerData.footerShowNewsletter && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        <h3 style={{ fontSize: '1.1rem', fontWeight: '700', margin: 0, color: 'var(--text-primary)' }}>{footerData.footerNewsletterTitle}</h3>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>{footerData.footerNewsletterText}</p>
                        <form style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '5px' }} onSubmit={(e) => e.preventDefault()}>
                            <input
                                type="email" placeholder="بريدك الإلكتروني" required
                                style={{ width: '100%', padding: '14px 18px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(0,0,0,0.2)', color: 'white', outline: 'none', transition: 'var(--transition)' }}
                                onFocus={(e) => e.target.style.borderColor = 'var(--primary-color)'}
                                onBlur={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
                            />
                            <button type="submit" className="btn btn-primary" style={{ padding: '14px', width: '100%', borderRadius: '12px' }}>اشتراك</button>
                        </form>
                    </div>
                )}
            </div>

            <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', backgroundColor: 'rgba(0,0,0,0.2)' }}>
                <div className="container" style={{ padding: '24px 20px', display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                    <p style={{ margin: 0 }}>{footerData.footerCopyright}</p>
                </div>
            </div>
        </footer>
    );
}
