import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import Link from 'next/link';

export const metadata = {
    title: "لوحة تحكم الإدارة | QORVEX",
};

const navItems = [
    { href: '/admin', icon: '📊', label: 'نظرة عامة' },
    { href: '/admin/orders', icon: '🛒', label: 'إدارة الطلبات' },
    { href: '/admin/products', icon: '📦', label: 'إدارة المنتجات' },
    { href: '/admin/categories', icon: '🏷️', label: 'إدارة الأقسام' },
    { href: '/admin/customers', icon: '👥', label: 'إدارة العملاء' },
    { href: '/admin/reviews', icon: '⭐', label: 'إدارة التقييمات' },
    { href: '/admin/coupons', icon: '🎫', label: 'كوبونات الخصم' },
    { href: '/admin/reports', icon: '📈', label: 'المبيعات والأرباح' },
    { href: '/admin/analytics', icon: '👁️', label: 'تتبع الزوار' },
    { href: '/admin/settings', icon: '⚙️', label: 'الإعدادات والمحتوى' },
    { href: '/admin/pages', icon: '📄', label: 'الصفحات الإضافية' },
];

export default async function AdminLayout({ children }) {
    const cookieStore = await cookies();
    const adminToken = cookieStore.get('admin_token');

    if (!adminToken) {
        redirect('/login');
    }

    return (
        <div style={{ display: 'flex', minHeight: '100vh', direction: 'rtl', background: 'var(--bg-color)' }}>
            {/* Sidebar */}
            <aside className="glass admin-sidebar">
                <Link href="/" style={{ textDecoration: 'none' }}>
                    <h2 className="text-gradient" style={{ marginBottom: '4px', fontSize: '1.5rem', textAlign: 'center' }}>QORVEX</h2>
                </Link>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', textAlign: 'center', marginBottom: '24px', borderBottom: '1px solid var(--glass-border)', paddingBottom: '16px' }}>لوحة التحكم الاحترافية</p>

                <nav style={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: 1 }}>
                    {navItems.map(item => (
                        <Link key={item.href} href={item.href} className="admin-nav-link">
                            <span style={{ fontSize: '1.1rem' }}>{item.icon}</span>
                            {item.label}
                        </Link>
                    ))}
                    <Link href="/admin/landings" className="admin-nav-link">
                        <span style={{ fontSize: '1.1rem' }}>🚀</span> صفحات الهبوط (Sales Pages)
                    </Link>
                </nav>

                <div style={{ borderTop: '1px solid var(--glass-border)', paddingTop: '16px', marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <Link href="/" className="admin-nav-link" style={{ color: 'var(--accent-color)' }}>
                        <span style={{ fontSize: '1.1rem' }}>🌍</span> العودة للمتجر
                    </Link>
                    <Link href="/api/auth/logout" className="admin-nav-link" style={{ color: 'var(--danger-color)' }}>
                        <span style={{ fontSize: '1.1rem' }}>🚪</span> تسجيل الخروج
                    </Link>
                </div>
            </aside>

            {/* Main Content */}
            <main style={{ flex: 1, padding: '32px 40px', overflowY: 'auto', maxHeight: '100vh' }}>
                {children}
            </main>

            <style>{`
                .footer-glass { display: none !important; }
            `}</style>
        </div>
    );
}
