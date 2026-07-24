"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function Dashboard() {
    const [user, setUser] = useState(null);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (!storedUser) {
            window.location.href = '/login';
            return;
        }

        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);

        fetch(`/api/user/orders?userId=${parsedUser.id}`)
            .then(res => res.json())
            .then(data => {
                // Make sure we got an array back, not an error object
                if (Array.isArray(data)) {
                    setOrders(data);
                } else {
                    setOrders([]);
                }
            })
            .catch(() => setOrders([]))
            .finally(() => setLoading(false));
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('user');
        // Also clear admin cookie by calling a logout endpoint
        fetch('/api/auth/logout', { method: 'POST' }).catch(() => { });
        window.location.href = '/';
    };

    const getStatusBadge = (status) => {
        const map = {
            pending: { label: 'قيد الانتظار', class: 'badge-pending' },
            processing: { label: 'جاري التجهيز', class: 'badge-processing' },
            shipped: { label: 'تم الشحن', class: 'badge-shipped' },
            delivered: { label: 'تم التوصيل', class: 'badge-delivered' },
            cancelled: { label: 'ملغي', class: 'badge-cancelled' },
        };
        const info = map[status] || { label: status, class: 'badge-pending' };
        return <span className={`badge ${info.class}`}>{info.label}</span>;
    };

    if (!user) return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
            <p style={{ color: 'var(--text-secondary)' }}>جاري التحميل...</p>
        </div>
    );

    return (
        <>
            <main className="container animate-fade-in" style={{ paddingTop: '120px', minHeight: '80vh', direction: 'rtl', paddingBottom: '60px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
                    <div>
                        <h1 className="text-gradient" style={{ marginBottom: '5px' }}>مرحباً بك، {user.name} 👋</h1>
                        <p style={{ color: 'var(--text-secondary)' }}>هذه لوحة حسابك الشخصي</p>
                    </div>
                    <button onClick={handleLogout} className="btn btn-danger" style={{ padding: '10px 24px' }}>
                        تسجيل الخروج
                    </button>
                </div>

                <div className="grid grid-cols-3" style={{ marginBottom: '40px' }}>
                    <div className="glass-card stat-card">
                        <div className="stat-label">إجمالي الطلبات</div>
                        <div className="stat-value" style={{ color: 'var(--primary-color)' }}>{orders.length}</div>
                    </div>
                    <div className="glass-card stat-card">
                        <div className="stat-label">المبلغ المنفق</div>
                        <div className="stat-value" style={{ color: 'var(--accent-color)' }}>
                            {orders.reduce((acc, o) => acc + o.totalAmount, 0)} <span style={{ fontSize: '1rem' }}>ر.س</span>
                        </div>
                    </div>
                    <div className="glass-card stat-card">
                        <div className="stat-label">حالة الحساب</div>
                        <div className="stat-value" style={{ color: 'var(--success-color)', fontSize: '1.5rem' }}>✅ نشط</div>
                    </div>
                </div>

                <div className="grid grid-cols-2">
                    {/* Profile Summary */}
                    <div className="glass-card" style={{ height: 'fit-content' }}>
                        <h3 style={{ marginBottom: '24px' }}>📋 معلومات الحساب</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid var(--glass-border)' }}>
                                <span style={{ color: 'var(--text-secondary)' }}>الاسم</span>
                                <strong>{user.name}</strong>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid var(--glass-border)' }}>
                                <span style={{ color: 'var(--text-secondary)' }}>البريد الإلكتروني</span>
                                <strong>{user.email}</strong>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0' }}>
                                <span style={{ color: 'var(--text-secondary)' }}>نوع الحساب</span>
                                <strong style={{ color: user.role === 'admin' ? 'var(--primary-color)' : 'var(--accent-color)' }}>
                                    {user.role === 'admin' ? '👑 مدير' : '👤 عميل'}
                                </strong>
                            </div>
                        </div>
                    </div>

                    {/* Orders History */}
                    <div className="glass-card">
                        <h3>🛍️ سجل طلباتك ({orders.length})</h3>
                        <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '16px', maxHeight: '500px', overflowY: 'auto' }}>
                            {loading ? (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                    {[1, 2, 3].map(i => <div key={i} className="skeleton" style={{ height: '80px' }}></div>)}
                                </div>
                            ) : orders.length === 0 ? (
                                <div style={{ textAlign: 'center', padding: '40px 0' }}>
                                    <div style={{ fontSize: '3rem', marginBottom: '16px' }}>🛒</div>
                                    <p style={{ color: 'var(--text-secondary)' }}>لم تقم بشراء أي منتج حتى الآن.</p>
                                    <Link href="/" className="btn btn-outline" style={{ marginTop: '16px' }}>تسوق الآن</Link>
                                </div>
                            ) : orders.map(order => (
                                <div key={order.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--glass-border)', paddingBottom: '16px' }}>
                                    <div>
                                        <h4 style={{ margin: '0 0 6px 0' }}>#{order.id.slice(-6).toUpperCase()}</h4>
                                        <p style={{ color: 'var(--text-secondary)', margin: 0, fontSize: '0.9rem' }}>{new Date(order.createdAt).toLocaleDateString('ar-SA')}</p>
                                        {order.items && (
                                            <p style={{ color: 'var(--text-secondary)', margin: '4px 0 0 0', fontSize: '0.85rem' }}>
                                                {order.items.length} منتج
                                            </p>
                                        )}
                                    </div>
                                    <div style={{ textAlign: 'left' }}>
                                        <p style={{ fontSize: '1.1rem', fontWeight: 'bold', margin: '0 0 8px 0', color: 'var(--primary-color)' }}>{order.totalAmount} ر.س</p>
                                        {getStatusBadge(order.status)}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </main>
        </>
    );
}
