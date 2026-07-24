"use client";

import { useEffect, useState } from 'react';
import Image from 'next/image';

export default function AdminReviews() {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [toast, setToast] = useState(null);

    const showToast = (message, type = 'success') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3000);
    };

    const fetchReviews = async () => {
        try {
            const res = await fetch('/api/admin/reviews');
            if (res.ok) {
                const data = await res.json();
                setReviews(Array.isArray(data) ? data : []);
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchReviews(); }, []);

    const deleteReview = async (id) => {
        if (!confirm('هل أنت متأكد من حذف هذا التقييم نهائياً؟')) return;
        try {
            const res = await fetch(`/api/admin/reviews/${id}`, { method: 'DELETE' });
            if (res.ok) {
                showToast('تم حذف التقييم بنجاح');
                fetchReviews();
            } else {
                showToast('حدث خطأ أثناء الحذف', 'error');
            }
        } catch (e) {
            showToast('تعذر الاتصال بالخادم', 'error');
        }
    };

    const renderStars = (rating) => "⭐".repeat(rating);

    if (loading) {
        return (
            <div className="animate-fade-in">
                <h1 className="text-gradient" style={{ marginBottom: '30px' }}>⭐ إدارة التقييمات</h1>
                {[1, 2, 3].map(i => <div key={i} className="skeleton" style={{ height: '120px', borderRadius: '16px', marginBottom: '16px' }}></div>)}
            </div>
        );
    }

    return (
        <div className="animate-fade-in">
            {toast && <div className={`toast toast-${toast.type}`}>{toast.message}</div>}

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <div>
                    <h1 className="text-gradient" style={{ margin: 0 }}>⭐ إدارة التقييمات</h1>
                    <p style={{ color: 'var(--text-secondary)', marginTop: '4px' }}>إجمالي {reviews.length} تقييم</p>
                </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {reviews.length === 0 ? (
                    <div className="glass-card" style={{ textAlign: 'center', padding: '60px' }}>
                        <div style={{ fontSize: '4rem', marginBottom: '16px' }}>📭</div>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>لا توجد تقييمات</p>
                    </div>
                ) : reviews.map(review => (
                    <div key={review.id} className="glass-card" style={{ padding: '20px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <div style={{ flex: 1 }}>
                                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                                    <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--primary-color), var(--accent-color))', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold' }}>
                                        {review.name.charAt(0)}
                                    </div>
                                    <div>
                                        <div style={{ fontWeight: 'bold', fontSize: '1.05rem' }}>{review.name} {review.user?.email ? <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>({review.user.email})</span> : null}</div>
                                        <div style={{ color: '#fbbf24', fontSize: '0.85rem' }}>{renderStars(review.rating)}</div>
                                    </div>
                                </div>
                                {review.product && (
                                    <div style={{ marginTop: '12px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                                        المنتج: <strong>{review.product.title}</strong>
                                    </div>
                                )}
                                {review.comment && (
                                    <p style={{ marginTop: '12px', color: 'var(--text-primary)', lineHeight: 1.6 }}>{review.comment}</p>
                                )}
                                {review.image && (
                                    <img src={review.image} alt="صورة المراجعة" style={{ marginTop: '12px', borderRadius: '12px', maxHeight: '150px', objectFit: 'cover' }} />
                                )}
                                <div style={{ marginTop: '12px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                                    {new Date(review.createdAt).toLocaleString('ar-SA')}
                                </div>
                            </div>
                            <div>
                                <button className="btn btn-outline" style={{ color: 'var(--danger-color)', borderColor: 'var(--danger-color)', padding: '6px 12px', fontSize: '0.9rem' }} onClick={() => deleteReview(review.id)}>
                                    🗑️ حذف
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
