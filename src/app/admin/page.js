"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function AdminOverview() {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await fetch('/api/admin/stats');
                if (res.ok) {
                    const data = await res.json();
                    setStats(data);
                }
            } catch (error) {
                console.error('Dashboard fetch error:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

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

    if (loading) {
        return (
            <div className="animate-fade-in">
                <h1 className="text-gradient" style={{ marginBottom: '30px' }}>لوحة التحكم</h1>
                <div className="grid grid-cols-4" style={{ marginBottom: '40px' }}>
                    {[1, 2, 3, 4].map(i => <div key={i} className="skeleton" style={{ height: '160px', borderRadius: '16px' }}></div>)}
                </div>
                <div className="grid grid-cols-2" style={{ marginBottom: '30px' }}>
                    {[1, 2].map(i => <div key={i} className="skeleton" style={{ height: '300px', borderRadius: '16px' }}></div>)}
                </div>
            </div>
        );
    }

    if (!stats) return <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)' }}>حدث خطأ في تحميل البيانات</div>;

    const quickActions = [
        { icon: '➕', label: 'إضافة منتج', href: '/admin/products', color: 'var(--primary-color)' },
        { icon: '📋', label: 'عرض الطلبات', href: '/admin/orders', color: 'var(--accent-color)' },
        { icon: '🏷️', label: 'إضافة قسم', href: '/admin/categories', color: '#a78bfa' },
        { icon: '🎫', label: 'إنشاء كوبون', href: '/admin/coupons', color: '#fbbf24' },
    ];

    return (
        <div className="animate-fade-in">
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                <div>
                    <h1 className="text-gradient" style={{ margin: 0, fontSize: '2rem' }}>لوحة التحكم التشغيلية</h1>
                    <p style={{ color: 'var(--text-secondary)', marginTop: '4px' }}>مرحباً بك في مركز إدارة متجر QORVEX — {new Date().toLocaleDateString('ar-SA', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                </div>
            </div>

            {/* Main Stats */}
            <div className="grid grid-cols-4" style={{ marginBottom: '30px' }}>
                <div className="glass-card stat-card" style={{ borderRight: '4px solid var(--primary-color)' }}>
                    <div style={{ fontSize: '2rem' }}>💰</div>
                    <div className="stat-value" style={{ color: 'var(--primary-color)' }}>{stats.totalRevenue?.toFixed(0)}</div>
                    <div className="stat-label">إجمالي المبيعات (ر.س)</div>
                </div>
                <div className="glass-card stat-card" style={{ borderRight: '4px solid var(--accent-color)' }}>
                    <div style={{ fontSize: '2rem' }}>📦</div>
                    <div className="stat-value" style={{ color: 'var(--accent-color)' }}>{stats.totalOrders}</div>
                    <div className="stat-label">إجمالي الطلبات</div>
                </div>
                <div className="glass-card stat-card" style={{ borderRight: '4px solid #a78bfa' }}>
                    <div style={{ fontSize: '2rem' }}>🏷️</div>
                    <div className="stat-value" style={{ color: '#a78bfa' }}>{stats.totalProducts}</div>
                    <div className="stat-label">المنتجات المعروضة</div>
                </div>
                <div className="glass-card stat-card" style={{ borderRight: '4px solid var(--success-color)' }}>
                    <div style={{ fontSize: '2rem' }}>👥</div>
                    <div className="stat-value" style={{ color: 'var(--success-color)' }}>{stats.totalCustomers}</div>
                    <div className="stat-label">العملاء المسجلين</div>
                </div>
            </div>

            {/* Secondary Stats */}
            <div className="grid grid-cols-4" style={{ marginBottom: '30px' }}>
                <div className="glass-card" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{ width: '50px', height: '50px', borderRadius: '12px', background: 'rgba(245,158,11,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.6rem' }}>⏳</div>
                    <div>
                        <div style={{ fontSize: '1.8rem', fontWeight: '800', color: 'var(--warning-color)' }}>{stats.pendingOrders}</div>
                        <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>طلبات معلقة</div>
                    </div>
                </div>
                <div className="glass-card" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{ width: '50px', height: '50px', borderRadius: '12px', background: 'rgba(59,130,246,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.6rem' }}>🔄</div>
                    <div>
                        <div style={{ fontSize: '1.8rem', fontWeight: '800', color: '#60a5fa' }}>{stats.processingOrders}</div>
                        <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>قيد التجهيز</div>
                    </div>
                </div>
                <div className="glass-card" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{ width: '50px', height: '50px', borderRadius: '12px', background: 'rgba(16,185,129,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.6rem' }}>✅</div>
                    <div>
                        <div style={{ fontSize: '1.8rem', fontWeight: '800', color: 'var(--success-color)' }}>{stats.deliveredOrders}</div>
                        <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>تم التوصيل</div>
                    </div>
                </div>
                <div className="glass-card" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{ width: '50px', height: '50px', borderRadius: '12px', background: 'rgba(239,68,68,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.6rem' }}>❌</div>
                    <div>
                        <div style={{ fontSize: '1.8rem', fontWeight: '800', color: 'var(--danger-color)' }}>{stats.cancelledOrders}</div>
                        <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>ملغي</div>
                    </div>
                </div>
            </div>

            {/* Today + Quick Actions row */}
            <div className="grid grid-cols-2" style={{ marginBottom: '30px' }}>
                {/* Today Summary */}
                <div className="glass-card">
                    <h3 style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        📅 إحصائيات اليوم
                    </h3>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                        <div style={{ padding: '20px', background: 'var(--surface-color)', borderRadius: '12px', textAlign: 'center' }}>
                            <div style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--primary-color)' }}>{stats.todayRevenue?.toFixed(0) || 0}</div>
                            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '4px' }}>مبيعات اليوم (ر.س)</div>
                        </div>
                        <div style={{ padding: '20px', background: 'var(--surface-color)', borderRadius: '12px', textAlign: 'center' }}>
                            <div style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--accent-color)' }}>{stats.todayOrders || 0}</div>
                            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '4px' }}>طلبات اليوم</div>
                        </div>
                        <div style={{ padding: '20px', background: 'var(--surface-color)', borderRadius: '12px', textAlign: 'center' }}>
                            <div style={{ fontSize: '2rem', fontWeight: '800', color: '#a78bfa' }}>{stats.averageOrderValue?.toFixed(0) || 0}</div>
                            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '4px' }}>متوسط قيمة الطلب</div>
                        </div>
                        <div style={{ padding: '20px', background: 'var(--surface-color)', borderRadius: '12px', textAlign: 'center' }}>
                            <div style={{ display: 'flex', justifyContent: 'center', gap: '20px' }}>
                                <div>
                                    <div style={{ fontSize: '1.4rem', fontWeight: '800', color: 'var(--success-color)' }}>{stats.codOrders}</div>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>نقدي</div>
                                </div>
                                <div style={{ borderLeft: '1px solid var(--glass-border)', paddingLeft: '20px' }}>
                                    <div style={{ fontSize: '1.4rem', fontWeight: '800', color: '#4cc9f0' }}>{stats.cardOrders}</div>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>بطاقة</div>
                                </div>
                            </div>
                            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '8px' }}>طرق الدفع</div>
                        </div>
                    </div>
                </div>

                {/* Quick Actions + Monthly */}
                <div className="glass-card">
                    <h3 style={{ marginBottom: '20px' }}>⚡ إجراءات سريعة</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '24px' }}>
                        {quickActions.map(action => (
                            <Link key={action.href} href={action.href} style={{ textDecoration: 'none' }}>
                                <div style={{
                                    padding: '18px', borderRadius: '12px', border: `1px solid ${action.color}30`,
                                    background: `${action.color}08`, cursor: 'pointer', textAlign: 'center',
                                    transition: 'var(--transition)',
                                }}>
                                    <div style={{ fontSize: '1.5rem', marginBottom: '6px' }}>{action.icon}</div>
                                    <div style={{ fontSize: '0.9rem', fontWeight: '600', color: action.color }}>{action.label}</div>
                                </div>
                            </Link>
                        ))}
                    </div>

                    {/* Monthly Revenue Mini */}
                    <h4 style={{ marginBottom: '12px', fontSize: '0.95rem', color: 'var(--text-secondary)' }}>📈 المبيعات الشهرية</h4>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-end', height: '80px' }}>
                        {stats.monthlyRevenue?.map((m, i) => {
                            const maxRev = Math.max(...stats.monthlyRevenue.map(x => x.revenue), 1);
                            const height = Math.max((m.revenue / maxRev) * 100, 5);
                            return (
                                <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                                    <div style={{
                                        width: '100%', height: `${height}%`, borderRadius: '6px 6px 0 0',
                                        background: i === stats.monthlyRevenue.length - 1
                                            ? 'linear-gradient(180deg, var(--primary-color), var(--secondary-color))'
                                            : 'var(--glass-border)',
                                        transition: 'height 0.5s ease',
                                    }}></div>
                                    <span style={{ fontSize: '0.6rem', color: 'var(--text-secondary)' }}>{m.month?.split(' ')[0]}</span>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Top Products + Recent Orders */}
            <div className="grid grid-cols-2" style={{ marginBottom: '30px' }}>
                {/* Top Products */}
                <div className="glass-card">
                    <h3 style={{ marginBottom: '20px' }}>🏆 المنتجات الأكثر مبيعاً</h3>
                    {stats.topProducts?.length === 0 ? (
                        <p style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: '30px' }}>لا توجد مبيعات حتى الآن</p>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            {stats.topProducts?.map((p, i) => (
                                <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '12px', background: 'var(--surface-color)', borderRadius: '10px' }}>
                                    <div style={{
                                        width: '32px', height: '32px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        background: i === 0 ? 'rgba(251,191,36,0.2)' : i === 1 ? 'rgba(192,192,192,0.2)' : 'rgba(205,127,50,0.2)',
                                        color: i === 0 ? '#fbbf24' : i === 1 ? '#c0c0c0' : '#cd7f32',
                                        fontWeight: '800', fontSize: '0.9rem'
                                    }}>{i + 1}</div>
                                    {p.image && <img src={p.image} alt="" style={{ width: '40px', height: '40px', borderRadius: '8px', objectFit: 'cover' }}
                                        onError={(e) => e.target.style.display = 'none'} />}
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontWeight: '600', fontSize: '0.95rem' }}>{p.title}</div>
                                        <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{p.totalSold} مبيع</div>
                                    </div>
                                    <div style={{ fontWeight: '700', color: 'var(--primary-color)' }}>{p.totalRevenue} ر.س</div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Recent Orders */}
                <div className="glass-card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                        <h3 style={{ margin: 0 }}>📋 أحدث الطلبات</h3>
                        <Link href="/admin/orders" style={{ color: 'var(--accent-color)', textDecoration: 'none', fontSize: '0.9rem' }}>عرض الكل ←</Link>
                    </div>
                    {stats.recentOrders?.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-secondary)' }}>
                            <div style={{ fontSize: '3rem', marginBottom: '16px' }}>📭</div>
                            <p>لا توجد طلبات حتى الآن</p>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '350px', overflowY: 'auto' }}>
                            {stats.recentOrders?.map(order => (
                                <div key={order.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', background: 'var(--surface-color)', borderRadius: '10px' }}>
                                    <div>
                                        <span style={{ fontWeight: '600', fontSize: '0.95rem' }}>#{order.id.slice(-6).toUpperCase()}</span>
                                        <span style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', marginRight: '12px' }}>
                                            {new Date(order.createdAt).toLocaleDateString('ar-SA')}
                                        </span>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                        {getStatusBadge(order.status)}
                                        <span style={{ fontWeight: '700', color: 'var(--primary-color)' }}>{order.totalAmount} ر.س</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
