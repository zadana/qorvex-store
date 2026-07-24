"use client";

import { useEffect, useState } from 'react';

export default function AdminReports() {
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
                console.error('Reports fetch error:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    if (loading) {
        return (
            <div className="animate-fade-in">
                <h1 className="text-gradient" style={{ marginBottom: '30px' }}>📈 التقارير والإحصائيات</h1>
                <div className="skeleton" style={{ height: '400px', borderRadius: '16px' }}></div>
            </div>
        );
    }

    if (!stats) return <div style={{ padding: '40px', textAlign: 'center' }}>حدث خطأ في تحميل التقرير.</div>;

    const exportToCSV = () => {
        // Simple export logic for demonstration
        if (!stats.monthlyRevenue) return;
        const csvContent = "data:text/csv;charset=utf-8,"
            + "الشهر,عدد الطلبات,المبيعات (ر.س)\n"
            + stats.monthlyRevenue.map(e => `${e.month},${e.orders},${e.revenue}`).join("\n");
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `تقرير_مبيعات_إليجانس_${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="animate-fade-in">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                <div>
                    <h1 className="text-gradient" style={{ margin: 0 }}>📈 تقارير الأداء والمبيعات</h1>
                    <p style={{ color: 'var(--text-secondary)', marginTop: '8px' }}>تتبع أداء المتجر وتحليل بيانات المبيعات</p>
                </div>
                <button onClick={exportToCSV} className="btn btn-primary" style={{ padding: '12px 24px' }}>
                    📥 تصدير التقرير (CSV)
                </button>
            </div>

            <div className="grid grid-cols-2" style={{ gap: '30px' }}>

                {/* Monthly Revenue Trend */}
                <div className="glass-card" style={{ gridColumn: 'span 2' }}>
                    <h3 style={{ marginBottom: '30px' }}>📊 حركة المبيعات خلال الـ 6 أشهر الماضية</h3>
                    <div style={{ display: 'flex', alignItems: 'flex-end', height: '240px', gap: '20px', padding: '20px 0', borderBottom: '1px solid var(--glass-border)' }}>
                        {stats.monthlyRevenue?.map((m, i) => {
                            const maxRev = Math.max(...stats.monthlyRevenue.map(x => x.revenue), 1);
                            const height = Math.max((m.revenue / maxRev) * 100, 5);
                            return (
                                <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', position: 'relative' }}>
                                    <span style={{ fontSize: '0.9rem', fontWeight: 'bold', color: 'var(--primary-color)' }}>
                                        {m.revenue.toLocaleString()} ر.س
                                    </span>
                                    <div style={{
                                        width: '100%', maxWidth: '60px', height: `${height}%`, borderRadius: '8px 8px 0 0',
                                        background: 'linear-gradient(180deg, var(--primary-color), var(--secondary-color))',
                                        transition: 'height 1s cubic-bezier(0.4, 0, 0.2, 1)',
                                        boxShadow: '0 4px 15px rgba(247,37,133,0.3)'
                                    }}></div>
                                    <span style={{ fontSize: '0.9rem', color: 'var(--text-primary)', fontWeight: '600' }}>{m.month?.split(' ')[0]}</span>
                                    <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{m.orders} طلبات</span>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Conversion & Customers */}
                <div className="glass-card">
                    <h3 style={{ marginBottom: '20px' }}>👥 أداء العملاء</h3>
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <li style={{ display: 'flex', justifyContent: 'space-between', padding: '12px', background: 'var(--surface-color)', borderRadius: '10px' }}>
                            <span style={{ color: 'var(--text-secondary)' }}>إجمالي العملاء المسجلين:</span>
                            <strong style={{ fontSize: '1.2rem' }}>{stats.totalCustomers} مستخدم</strong>
                        </li>
                        <li style={{ display: 'flex', justifyContent: 'space-between', padding: '12px', background: 'var(--surface-color)', borderRadius: '10px' }}>
                            <span style={{ color: 'var(--text-secondary)' }}>متوسط قيمة الطلب (AOV):</span>
                            <strong style={{ fontSize: '1.2rem', color: 'var(--accent-color)' }}>{stats.averageOrderValue?.toFixed(2)} ر.س</strong>
                        </li>
                        <li style={{ display: 'flex', justifyContent: 'space-between', padding: '12px', background: 'var(--surface-color)', borderRadius: '10px' }}>
                            <span style={{ color: 'var(--text-secondary)' }}>نسبة الطلبات الملغاة:</span>
                            <strong style={{ fontSize: '1.2rem', color: 'var(--danger-color)' }}>
                                {stats.totalOrders > 0 ? ((stats.cancelledOrders / stats.totalOrders) * 100).toFixed(1) : 0}%
                            </strong>
                        </li>
                    </ul>
                </div>

                {/* Payment Breakdown */}
                <div className="glass-card">
                    <h3 style={{ marginBottom: '20px' }}>💳 توزيع طرق الدفع</h3>
                    <div style={{ display: 'flex', gap: '24px', alignItems: 'center', height: '100%' }}>
                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <div style={{ padding: '16px', background: 'rgba(76,201,240,0.1)', border: '1px solid rgba(76,201,240,0.3)', borderRadius: '12px', textAlign: 'center' }}>
                                <div style={{ fontSize: '2rem', marginBottom: '8px' }}>💳</div>
                                <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#4cc9f0' }}>{stats.cardOrders}</div>
                                <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>دفع إلكتروني</div>
                            </div>
                        </div>
                        <div style={{ width: '1px', background: 'var(--glass-border)', height: '80%' }}></div>
                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <div style={{ padding: '16px', background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)', borderRadius: '12px', textAlign: 'center' }}>
                                <div style={{ fontSize: '2rem', marginBottom: '8px' }}>💵</div>
                                <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--success-color)' }}>{stats.codOrders}</div>
                                <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>دفع عند الاستلام</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Top Selling Products */}
                <div className="glass-card" style={{ gridColumn: 'span 2' }}>
                    <h3 style={{ marginBottom: '20px' }}>🌟 المنتجات الأكثر مبيعاً (Top Sellers)</h3>
                    {stats.topProducts && stats.topProducts.length > 0 ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            {stats.topProducts.map((prod, idx) => (
                                <div key={prod.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--surface-color)', padding: '16px', borderRadius: '12px', border: '1px solid var(--glass-border)' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                        <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--text-secondary)', width: '30px', textAlign: 'center' }}>#{idx + 1}</div>
                                        <img src={prod.image} alt={prod.title} style={{ width: '60px', height: '60px', borderRadius: '10px', objectFit: 'cover' }} onError={e => e.target.style.display = 'none'} />
                                        <div>
                                            <h4 style={{ margin: '0 0 6px 0', fontSize: '1.1rem' }}>{prod.title}</h4>
                                            <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.9rem' }}>تم بيع: <strong style={{ color: 'white' }}>{prod.totalSold}</strong> وحدة</p>
                                        </div>
                                    </div>
                                    <div style={{ textAlign: 'left' }}>
                                        <span style={{ display: 'block', fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>إجمالي العوائد:</span>
                                        <strong style={{ fontSize: '1.2rem', color: 'var(--primary-color)' }}>{prod.totalRevenue.toLocaleString()} ر.س</strong>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-secondary)' }}>لا توجد بيانات مبيعات كافية حتى الآن.</div>
                    )}
                </div>

            </div>
        </div>
    );
}
