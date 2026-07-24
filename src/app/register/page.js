"use client";

import { useState } from 'react';
import Link from 'next/link';

export default function Register() {
    const [formData, setFormData] = useState({ name: '', email: '', password: '' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleRegister = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const res = await fetch('/api/auth/register', {
                method: 'POST',
                body: JSON.stringify(formData),
                headers: { 'Content-Type': 'application/json' }
            });
            const data = await res.json();

            if (res.ok) {
                localStorage.setItem('user', JSON.stringify(data.user));
                window.location.href = '/dashboard';
            } else {
                setError(data.error || 'حدث خطأ غير متوقع');
            }
        } catch (err) {
            setError('تعذر الاتصال بالخادم.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <main className="container" style={{ paddingTop: '150px', display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh', direction: 'rtl' }}>
                <div className="glass-card animate-fade-in" style={{ width: '100%', maxWidth: '440px', padding: '40px' }}>
                    <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                        <div style={{ fontSize: '3rem', marginBottom: '10px' }}>🚀</div>
                        <h2 className="text-gradient" style={{ fontSize: '1.8rem' }}>إنشاء حساب جديد</h2>
                        <p style={{ color: 'var(--text-secondary)', marginTop: '8px' }}>انضم إلينا واستمتع بتجربة تسوق فريدة</p>
                    </div>

                    {error && (
                        <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: '#f87171', padding: '12px 16px', borderRadius: '12px', marginBottom: '20px', textAlign: 'center' }}>
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        <div>
                            <label className="form-label">الاسم الكامل</label>
                            <input
                                type="text" placeholder="أدخل الاسم الكامل" required
                                value={formData.name}
                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                                className="form-input"
                            />
                        </div>
                        <div>
                            <label className="form-label">البريد الإلكتروني</label>
                            <input
                                type="email" placeholder="example@email.com" required
                                value={formData.email}
                                onChange={e => setFormData({ ...formData, email: e.target.value })}
                                className="form-input"
                            />
                        </div>
                        <div>
                            <label className="form-label">كلمة المرور</label>
                            <input
                                type="password" placeholder="••••••••" required
                                value={formData.password}
                                onChange={e => setFormData({ ...formData, password: e.target.value })}
                                className="form-input"
                            />
                        </div>
                        <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '16px', fontSize: '1.1rem', marginTop: '10px' }} disabled={loading}>
                            {loading ? 'جاري إنشاء الحساب...' : 'إنشاء حساب'}
                        </button>
                        <div style={{ display: 'flex', alignItems: 'center', margin: '20px 0', color: 'var(--text-secondary)' }}>
                            <div style={{ flex: 1, height: '1px', background: 'var(--glass-border)' }}></div>
                            <span style={{ padding: '0 10px', fontSize: '0.9rem' }}>أو عبر</span>
                            <div style={{ flex: 1, height: '1px', background: 'var(--glass-border)' }}></div>
                        </div>

                        <button
                            type="button"
                            className="btn form-input"
                            style={{ width: '100%', padding: '14px', fontSize: '1.05rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', background: 'var(--surface-color)', border: '1px solid var(--glass-border)', color: 'var(--text-primary)', cursor: 'pointer', transition: 'var(--transition)' }}
                            onMouseOver={e => e.currentTarget.style.borderColor = 'var(--primary-color)'}
                            onMouseOut={e => e.currentTarget.style.borderColor = 'var(--glass-border)'}
                            onClick={() => alert("لإتمام برمجة الدخول عبر جوجل يجب إعداد بيانات حساب جوجل (Client ID).\nيرجى التواصل لبرمجتها!")}
                        >
                            <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                            </svg>
                            الدخول السريع بحساب جوجل
                        </button>

                        <div style={{ textAlign: 'center', marginTop: '15px' }}>
                            <Link href="/login" style={{ color: 'var(--accent-color)', textDecoration: 'none', fontWeight: '600' }}>لديك حساب بالفعل؟ سجّل دخولك</Link>
                        </div>
                    </form>
                </div>
            </main>
        </>
    );
}
