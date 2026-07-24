"use client";

import { useState, useEffect } from 'react';

export default function AnalyticsPage() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/admin/analytics')
            .then(res => res.json())
            .then(data => {
                setData(data);
                setLoading(false);
            })
            .catch(e => {
                console.error(e);
                setLoading(false);
            });
    }, []);

    if (loading) {
        return (
            <div>
                <h2 className="text-gradient" style={{ marginBottom: '24px' }}>تتبع العملاء (Analytics)</h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '40px' }}>
                    {[...Array(4)].map((_,i) => <div key={i} className="skeleton" style={{ height: '140px', borderRadius: '16px' }}></div>)}
                </div>
            </div>
        );
    }

    return (
        <div>
            <h2 className="text-gradient" style={{ marginBottom: '24px' }}>تتبع العملاء (Analytics)</h2>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '40px' }}>
                <div className="glass-card" style={{ padding: '24px', textAlign: 'center' }}>
                    <div style={{ fontSize: '2rem', marginBottom: '8px' }}>👁️</div>
                    <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--primary-color)' }}>{data?.totalVisits || 0}</div>
                    <div style={{ color: 'var(--text-secondary)' }}>إجمالي الزيارات (مرات الظهور)</div>
                </div>
                
                <div className="glass-card" style={{ padding: '24px', textAlign: 'center' }}>
                    <div style={{ fontSize: '2rem', marginBottom: '8px' }}>🚀</div>
                    <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#4cc9f0' }}>{data?.todayVisits || 0}</div>
                    <div style={{ color: 'var(--text-secondary)' }}>الزيارات اليوم (مرات الظهور)</div>
                </div>

                <div className="glass-card" style={{ padding: '24px', textAlign: 'center' }}>
                    <div style={{ fontSize: '2rem', marginBottom: '8px' }}>👥</div>
                    <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#f72585' }}>{data?.totalUniqueVisitors || 0}</div>
                    <div style={{ color: 'var(--text-secondary)' }}>إجمالي الزوار الفريدين (Unique)</div>
                </div>
                
                <div className="glass-card" style={{ padding: '24px', textAlign: 'center' }}>
                    <div style={{ fontSize: '2rem', marginBottom: '8px' }}>🔥</div>
                    <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--success-color)' }}>{data?.todayUniqueVisitors || 0}</div>
                    <div style={{ color: 'var(--text-secondary)' }}>الزوار الفريدين اليوم</div>
                </div>
            </div>

            <div className="glass-card" style={{ padding: '30px' }}>
                <h3 style={{ marginBottom: '24px' }}>🛍️ تفاعل العملاء مع المنتجات (أكثر المنتجات زيارة)</h3>
                
                {data?.topProducts && data.topProducts.length > 0 ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        {data.topProducts.map((prod, idx) => (
                            <div key={prod.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--surface-color)', padding: '16px', borderRadius: '12px', border: '1px solid var(--glass-border)' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                    <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--text-secondary)', width: '30px', textAlign: 'center' }}>#{idx + 1}</div>
                                    <img src={prod.image} alt={prod.title} style={{ width: '60px', height: '60px', borderRadius: '10px', objectFit: 'cover' }} onError={e => e.target.style.display = 'none'} />
                                    <div>
                                        <h4 style={{ margin: '0 0 6px 0', fontSize: '1.2rem' }}>{prod.title}</h4>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <div style={{ padding: '8px 16px', background: 'rgba(247,37,133,0.1)', border: '1px solid var(--primary-color)', borderRadius: '20px', color: 'var(--primary-color)', fontWeight: 'bold' }}>
                                        {prod.visits} زيارة
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-secondary)' }}>لا توجد بيانات تفاعل للعملاء مع المنتجات حتى الآن.</div>
                )}
            </div>
        </div>
    );
}
