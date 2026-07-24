"use client";

import { useEffect, useState } from 'react';

export default function AdminCoupons() {
    const [coupons, setCoupons] = useState([]);
    const [formData, setFormData] = useState({ code: '', discount: '', type: 'percentage', maxUses: '100', expiresAt: '' });
    const [loading, setLoading] = useState(false);
    const [fetchLoading, setFetchLoading] = useState(true);
    const [toast, setToast] = useState(null);

    const showToast = (message, type = 'success') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3000);
    };

    const fetchCoupons = async () => {
        try {
            const res = await fetch('/api/admin/coupons');
            if (res.ok) {
                const data = await res.json();
                setCoupons(Array.isArray(data) ? data : []);
            }
        } catch (e) {
            console.error(e);
        } finally {
            setFetchLoading(false);
        }
    };

    useEffect(() => { fetchCoupons(); }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await fetch('/api/admin/coupons', {
                method: 'POST',
                body: JSON.stringify(formData),
                headers: { 'Content-Type': 'application/json' }
            });
            if (res.ok) {
                showToast('تم إنشاء الكوبون بنجاح ✅');
                setFormData({ code: '', discount: '', type: 'percentage', maxUses: '100', expiresAt: '' });
                fetchCoupons();
            } else {
                const err = await res.json();
                showToast(err.error || 'حدث خطأ', 'error');
            }
        } catch (e) {
            showToast('تعذر الاتصال بالخادم', 'error');
        } finally {
            setLoading(false);
        }
    };

    const toggleActive = async (coupon) => {
        try {
            const res = await fetch(`/api/admin/coupons/${coupon.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ isActive: !coupon.isActive })
            });
            if (res.ok) {
                showToast(coupon.isActive ? 'تم تعطيل الكوبون' : 'تم تفعيل الكوبون ✅');
                fetchCoupons();
            }
        } catch (e) {
            showToast('حدث خطأ', 'error');
        }
    };

    const deleteCoupon = async (id) => {
        if (!confirm('هل أنت متأكد من حذف هذا الكوبون؟')) return;
        try {
            const res = await fetch(`/api/admin/coupons/${id}`, { method: 'DELETE' });
            if (res.ok) {
                showToast('تم حذف الكوبون بنجاح');
                fetchCoupons();
            }
        } catch (e) {
            showToast('حدث خطأ', 'error');
        }
    };

    const generateCode = () => {
        const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
        let code = '';
        for (let i = 0; i < 8; i++) code += chars[Math.floor(Math.random() * chars.length)];
        setFormData({ ...formData, code });
    };

    return (
        <div className="animate-fade-in">
            {toast && <div className={`toast toast-${toast.type}`}>{toast.message}</div>}

            <h1 className="text-gradient" style={{ marginBottom: '8px' }}>🎫 كوبونات الخصم</h1>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '30px' }}>أنشئ وأدِر كوبونات الخصم لعملائك</p>

            <div className="grid grid-cols-2" style={{ gap: '30px' }}>
                {/* Form */}
                <div className="glass-card" style={{ height: 'fit-content' }}>
                    <h3 style={{ marginBottom: '20px' }}>✨ إنشاء كوبون جديد</h3>
                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <div>
                            <label className="form-label">كود الكوبون</label>
                            <div style={{ display: 'flex', gap: '8px' }}>
                                <input type="text" placeholder="SALE50" value={formData.code} required
                                    onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                                    className="form-input" style={{ flex: 1, letterSpacing: '2px', fontWeight: 'bold' }} />
                                <button type="button" onClick={generateCode} className="btn btn-outline" style={{ padding: '10px 16px', whiteSpace: 'nowrap' }}>
                                    🎲 توليد
                                </button>
                            </div>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                            <div>
                                <label className="form-label">نوع الخصم</label>
                                <select value={formData.type} onChange={(e) => setFormData({ ...formData, type: e.target.value })} className="form-input">
                                    <option value="percentage">نسبة مئوية (%)</option>
                                    <option value="fixed">مبلغ ثابت (ر.س)</option>
                                </select>
                            </div>
                            <div>
                                <label className="form-label">قيمة الخصم</label>
                                <input type="number" placeholder={formData.type === 'percentage' ? '20' : '50'} value={formData.discount} required min="0"
                                    max={formData.type === 'percentage' ? '100' : undefined}
                                    onChange={(e) => setFormData({ ...formData, discount: e.target.value })} className="form-input" />
                            </div>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                            <div>
                                <label className="form-label">الحد الأقصى للاستخدام</label>
                                <input type="number" placeholder="100" value={formData.maxUses} min="1"
                                    onChange={(e) => setFormData({ ...formData, maxUses: e.target.value })} className="form-input" />
                            </div>
                            <div>
                                <label className="form-label">تاريخ الانتهاء (اختياري)</label>
                                <input type="date" value={formData.expiresAt}
                                    onChange={(e) => setFormData({ ...formData, expiresAt: e.target.value })} className="form-input" />
                            </div>
                        </div>
                        <button type="submit" className="btn btn-primary" style={{ padding: '16px' }} disabled={loading}>
                            {loading ? 'جاري الإنشاء...' : '🎫 إنشاء الكوبون'}
                        </button>
                    </form>
                </div>

                {/* Coupons List */}
                <div className="glass-card">
                    <h3 style={{ marginBottom: '20px' }}>الكوبونات ({coupons.length})</h3>
                    {fetchLoading ? (
                        [1, 2, 3].map(i => <div key={i} className="skeleton" style={{ height: '90px', borderRadius: '12px', marginBottom: '12px' }}></div>)
                    ) : coupons.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-secondary)' }}>
                            <div style={{ fontSize: '3rem', marginBottom: '16px' }}>🎫</div>
                            <p>لا توجد كوبونات. أنشئ كوبون خصم لعملائك!</p>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '600px', overflowY: 'auto' }}>
                            {coupons.map(coupon => (
                                <div key={coupon.id} style={{
                                    padding: '16px', background: 'var(--surface-color)', borderRadius: '12px',
                                    border: `1px solid ${coupon.isActive ? 'rgba(16,185,129,0.3)' : 'rgba(239,68,68,0.3)'}`,
                                    opacity: coupon.isActive ? 1 : 0.6,
                                }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                            <span style={{
                                                background: 'var(--glass-bg)', padding: '6px 14px', borderRadius: '8px',
                                                fontWeight: '800', letterSpacing: '2px', fontSize: '1.1rem',
                                                border: '1px dashed var(--glass-border)',
                                            }}>{coupon.code}</span>
                                            <span className={`badge ${coupon.isActive ? 'badge-delivered' : 'badge-cancelled'}`}>
                                                {coupon.isActive ? '✅ نشط' : '❌ معطل'}
                                            </span>
                                        </div>
                                        <span style={{ fontWeight: '800', fontSize: '1.3rem', color: 'var(--primary-color)' }}>
                                            {coupon.type === 'percentage' ? `${coupon.discount}%` : `${coupon.discount} ر.س`}
                                        </span>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '10px' }}>
                                        <span>الاستخدام: {coupon.usedCount}/{coupon.maxUses}</span>
                                        <span>{coupon.expiresAt ? `ينتهي: ${new Date(coupon.expiresAt).toLocaleDateString('ar-SA')}` : 'بدون تاريخ انتهاء'}</span>
                                    </div>
                                    <div style={{ display: 'flex', gap: '8px' }}>
                                        <button onClick={() => toggleActive(coupon)}
                                            style={{
                                                flex: 1, padding: '8px', borderRadius: '8px', cursor: 'pointer', fontFamily: 'inherit', fontSize: '0.85rem',
                                                border: '1px solid var(--glass-border)', background: 'transparent', color: 'var(--text-primary)',
                                            }}>
                                            {coupon.isActive ? '⏸️ تعطيل' : '▶️ تفعيل'}
                                        </button>
                                        <button onClick={() => deleteCoupon(coupon.id)}
                                            style={{
                                                padding: '8px 14px', borderRadius: '8px', cursor: 'pointer', fontFamily: 'inherit', fontSize: '0.85rem',
                                                border: '1px solid rgba(239,68,68,0.3)', background: 'rgba(239,68,68,0.1)', color: '#f87171',
                                            }}>
                                            🗑️
                                        </button>
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
