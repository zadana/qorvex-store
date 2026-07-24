"use client";

import { useState, useRef } from 'react';

export default function ProductReviews({ productId, initialReviews = [] }) {
    const [reviews, setReviews] = useState(initialReviews);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({ name: '', rating: 5, comment: '' });
    const [imageFile, setImageFile] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const fileInputRef = useRef(null);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const currentUserStr = localStorage.getItem('user');
        if (!currentUserStr) {
            alert('يرجى تسجيل الدخول أولاً لتتمكن من إضافة تقييم');
            return;
        }
        const currentUser = JSON.parse(currentUserStr);

        setIsSubmitting(true);
        try {
            let uploadedImageUrl = null;
            if (imageFile) {
                const formDataUpload = new FormData();
                formDataUpload.append('file', imageFile);
                const uploadRes = await fetch('/api/upload', {
                    method: 'POST',
                    body: formDataUpload
                });
                const uploadData = await uploadRes.json();
                if (uploadData.url) {
                    uploadedImageUrl = uploadData.url;
                }
            }

            const res = await fetch(`/api/products/${productId}/reviews`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId: currentUser.id,
                    name: formData.name || currentUser.name,
                    rating: formData.rating,
                    comment: formData.comment,
                    image: uploadedImageUrl
                })
            });

            if (res.ok) {
                const newReview = await res.json();
                setReviews([newReview, ...reviews]);
                setFormData({ name: '', rating: 5, comment: '' });
                setImageFile(null);
                setShowForm(false);
            } else {
                const errData = await res.json();
                alert(errData.error || 'حدث خطأ أثناء إضافة التقييم');
            }
        } catch (e) {
            console.error(e);
            alert('حدث خطأ في الاتصال');
        } finally {
            setIsSubmitting(false);
        }
    };

    const renderStars = (rating) => {
        return "⭐".repeat(rating);
    };

    return (
        <div style={{ marginTop: '60px', padding: '30px', borderRadius: '16px', background: 'var(--surface-color)', border: '1px solid var(--glass-border)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                <h3 style={{ margin: 0, fontSize: '1.8rem' }}>تقييمات العملاء الموثقة</h3>
                <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
                    {showForm ? 'إلغاء' : 'إضافة تقييم'}
                </button>
            </div>

            {showForm && (
                <form onSubmit={handleSubmit} className="animate-fade-in" style={{ marginBottom: '40px', padding: '20px', background: 'var(--bg-color)', borderRadius: '12px', border: '1px solid var(--glass-border)' }}>
                    <div className="grid grid-cols-2" style={{ gap: '16px' }}>
                        <div>
                            <label className="form-label">الاسم</label>
                            <input type="text" className="form-input" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} placeholder="الاسم الكريم (اختياري)" />
                        </div>
                        <div>
                            <label className="form-label">التقييم (من 5)</label>
                            <select className="form-input" value={formData.rating} onChange={e => setFormData({ ...formData, rating: parseInt(e.target.value) })}>
                                <option value="5">⭐⭐⭐⭐⭐ ممتاز</option>
                                <option value="4">⭐⭐⭐⭐ جيد جداً</option>
                                <option value="3">⭐⭐⭐ متوسط</option>
                                <option value="2">⭐⭐ ضعيف</option>
                                <option value="1">⭐ سيء</option>
                            </select>
                        </div>
                    </div>
                    <div style={{ marginTop: '16px' }}>
                        <label className="form-label">إضافة تعليق</label>
                        <textarea className="form-input" rows="3" value={formData.comment} onChange={e => setFormData({ ...formData, comment: e.target.value })} placeholder="شارك تجربتك مع المنتج..."></textarea>
                    </div>
                    <div style={{ marginTop: '16px' }}>
                        <label className="form-label">إرفاق صورة للمنتج (اختياري)</label>
                        <input type="file" accept="image/*" className="form-input" ref={fileInputRef} onChange={e => setImageFile(e.target.files[0])} />
                    </div>
                    <button type="submit" disabled={isSubmitting} className="btn btn-primary" style={{ marginTop: '20px', width: '100%' }}>
                        {isSubmitting ? 'جاري الإرسال...' : 'إرسال التقييم'}
                    </button>
                </form>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {reviews.length === 0 ? (
                    <div style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '20px' }}>لا توجد تقييمات بعد. كن أول من يقيم هذا المنتج!</div>
                ) : (
                    reviews.map(review => (
                        <div key={review.id} style={{ padding: '20px', borderBottom: '1px solid var(--glass-border)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                                    <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--primary-color), var(--accent-color))', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold', fontSize: '1.2rem' }}>
                                        {review.name.charAt(0)}
                                    </div>
                                    <div>
                                        <div style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>{review.name}</div>
                                        <div style={{ color: '#fbbf24', fontSize: '0.9rem', letterSpacing: '2px' }}>{renderStars(review.rating)}</div>
                                    </div>
                                </div>
                                {review.verified && (
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--success-color)', fontSize: '0.9rem', background: 'rgba(16, 185, 129, 0.1)', padding: '4px 12px', borderRadius: '20px' }}>
                                        ✓ قام بالشراء، تم التقييم
                                    </div>
                                )}
                            </div>
                            {review.comment && (
                                <p style={{ marginTop: '16px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>{review.comment}</p>
                            )}
                            {review.image && (
                                <img src={review.image} alt="صورة المراجعة" style={{ marginTop: '16px', borderRadius: '12px', maxHeight: '200px', objectFit: 'cover' }} />
                            )}
                            <div style={{ marginTop: '12px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                                {String(review.createdAt).split('T')[0]}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
