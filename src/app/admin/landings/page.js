"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function LandingsAdmin() {
    const [landings, setLandings] = useState([]);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingLanding, setEditingLanding] = useState(null);

    // Form fields
    const [isNewProduct, setIsNewProduct] = useState(false);
    const [productId, setProductId] = useState('');
    const [newProductTitle, setNewProductTitle] = useState('');
    const [newProductPrice, setNewProductPrice] = useState('');
    const [newProductDesc, setNewProductDesc] = useState('');
    const [newProductImage, setNewProductImage] = useState('');

    // Landing Page fields
    const [slug, setSlug] = useState('');
    const [heroTitle, setHeroTitle] = useState('');
    const [heroSubtitle, setHeroSubtitle] = useState('');
    const [themeColor, setThemeColor] = useState('#f72585');
    const [ctaText, setCtaText] = useState('اطلب الآن - دفع عند الاستلام 🚚');
    const [videoUrl, setVideoUrl] = useState('');
    const [features, setFeatures] = useState('');

    // Marketing fields
    const [compareAtPrice, setCompareAtPrice] = useState('');
    const [offerEndsAt, setOfferEndsAt] = useState('');
    const [showStock, setShowStock] = useState(false);
    const [fakeStock, setFakeStock] = useState('7');
    const [showViewers, setShowViewers] = useState(true);
    const [viewersMin, setViewersMin] = useState('20');
    const [viewersMax, setViewersMax] = useState('50');
    const [showSoldCount, setShowSoldCount] = useState(true);
    const [fakeSoldCount, setFakeSoldCount] = useState('143');
    const [urgencyText, setUrgencyText] = useState('');
    const [guaranteeText, setGuaranteeText] = useState('');
    const [testimonials, setTestimonials] = useState('');

    useEffect(() => {
        fetchLandings();
        fetchProducts();
    }, []);

    const fetchLandings = async () => {
        try {
            const res = await fetch('/api/admin/landings');
            const data = await res.json();
            if (Array.isArray(data)) setLandings(data);
        } catch (e) { console.error(e); }
        finally { setLoading(false); }
    };

    const fetchProducts = async () => {
        try {
            const res = await fetch('/api/products');
            const data = await res.json();
            if (Array.isArray(data)) {
                setProducts(data);
                if (data.length > 0) setProductId(data[0].id);
            }
        } catch (e) { console.error(e); }
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const formData = new FormData();
        formData.append('file', file);
        try {
            const res = await fetch('/api/upload', { method: 'POST', body: formData });
            const data = await res.json();
            if (data.url) setNewProductImage(data.url);
        } catch (err) { alert('فشل رفع الصورة'); }
    };

    const resetForm = () => {
        setSlug(''); setHeroTitle(''); setHeroSubtitle(''); setVideoUrl(''); setFeatures('');
        setNewProductTitle(''); setNewProductPrice(''); setNewProductDesc(''); setNewProductImage('');
        setCompareAtPrice(''); setOfferEndsAt(''); setShowStock(false); setFakeStock('7');
        setShowViewers(true); setViewersMin('20'); setViewersMax('50');
        setShowSoldCount(true); setFakeSoldCount('143');
        setUrgencyText(''); setGuaranteeText(''); setTestimonials('');
        setThemeColor('#f72585'); setCtaText('اطلب الآن - دفع عند الاستلام 🚚');
        setEditingLanding(null); setIsNewProduct(false);
    };

    const openEdit = (l) => {
        setEditingLanding(l);
        setHeroTitle(l.heroTitle || '');
        setHeroSubtitle(l.heroSubtitle || '');
        setThemeColor(l.themeColor || '#f72585');
        setCtaText(l.ctaText || '');
        setVideoUrl(l.videoUrl || '');
        setFeatures(l.features || '');
        setCompareAtPrice(l.compareAtPrice || '');
        setOfferEndsAt(l.offerEndsAt ? new Date(l.offerEndsAt).toISOString().slice(0, 16) : '');
        setShowStock(l.showStock ?? false);
        setFakeStock(String(l.fakeStock ?? 7));
        setShowViewers(l.showViewers ?? true);
        setViewersMin(String(l.viewersMin ?? 20));
        setViewersMax(String(l.viewersMax ?? 50));
        setShowSoldCount(l.showSoldCount ?? true);
        setFakeSoldCount(String(l.fakeSoldCount ?? 143));
        setUrgencyText(l.urgencyText || '');
        setGuaranteeText(l.guaranteeText || '');
        setTestimonials(l.testimonials || '');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const marketingPayload = {
            heroTitle, heroSubtitle, themeColor, ctaText, videoUrl, features,
            compareAtPrice, offerEndsAt, showStock, fakeStock,
            showViewers, viewersMin, viewersMax,
            showSoldCount, fakeSoldCount, urgencyText, guaranteeText, testimonials
        };

        try {
            let res;
            if (editingLanding) {
                res = await fetch('/api/admin/landings', {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ id: editingLanding.id, ...marketingPayload })
                });
            } else {
                const payload = { slug, isNewProduct, ...marketingPayload };
                if (isNewProduct) {
                    payload.newProductData = {
                        title: newProductTitle, price: parseFloat(newProductPrice),
                        description: newProductDesc, image: newProductImage || '/placeholder.png'
                    };
                } else {
                    payload.productId = productId;
                }
                res = await fetch('/api/admin/landings', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });
            }
            if (res.ok) {
                alert(editingLanding ? 'تم التحديث بنجاح!' : 'تم إنشاء صفحة الهبوط بنجاح!');
                resetForm();
                fetchLandings();
            } else {
                const err = await res.json();
                alert('خطأ: ' + err.error);
            }
        } catch (error) { console.error(error); }
    };

    const handleDelete = async (id) => {
        if (!confirm('هل أنت متأكد من الحذف؟')) return;
        try {
            const res = await fetch(`/api/admin/landings/${id}`, { method: 'DELETE' });
            if (res.ok) fetchLandings();
        } catch (e) { console.error(e); }
    };

    const copyLink = (slug) => {
        navigator.clipboard.writeText(`${window.location.origin}/l/${slug}`);
        alert('تم نسخ الرابط!');
    };

    if (loading) return <div style={{ padding: '40px', textAlign: 'center' }}>جاري التحميل...</div>;

    const sectionStyle = { background: 'rgba(255,255,255,0.03)', padding: '20px', borderRadius: '16px', border: '1px solid var(--glass-border)', marginBottom: '15px' };
    const sectionTitle = (icon, text) => <h4 style={{ margin: '0 0 15px 0', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent-color)' }}>{icon} {text}</h4>;

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                <h1 className="text-gradient" style={{ margin: 0 }}>🚀 إدارة صفحات الهبوط</h1>
                {editingLanding && <button onClick={resetForm} className="btn btn-outline">✕ إلغاء التعديل</button>}
            </div>

            <div className="grid grid-cols-2" style={{ gap: '30px', alignItems: 'flex-start' }}>
                <div className="glass-card" style={{ padding: '30px' }}>
                    <h3 style={{ marginBottom: '20px', color: editingLanding ? 'var(--warning-color)' : 'var(--text-primary)' }}>
                        {editingLanding ? `✏️ تعديل: ${editingLanding.heroTitle || editingLanding.product?.title}` : '➕ إنشاء صفحة هبوط جديدة'}
                    </h3>
                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>

                        {/* Product Selection (only for new) */}
                        {!editingLanding && (
                            <div style={sectionStyle}>
                                {sectionTitle('📦', 'اختيار المنتج')}
                                <div style={{ display: 'flex', gap: '15px', marginBottom: '15px' }}>
                                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                                        <input type="radio" checked={!isNewProduct} onChange={() => setIsNewProduct(false)} /> منتج موجود
                                    </label>
                                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', color: 'var(--accent-color)' }}>
                                        <input type="radio" checked={isNewProduct} onChange={() => setIsNewProduct(true)} /> ➕ منتج خفي جديد
                                    </label>
                                </div>
                                {!isNewProduct ? (
                                    <select className="form-input" value={productId} onChange={(e) => setProductId(e.target.value)} required={!isNewProduct}>
                                        {products.length === 0 && <option value="">لا يوجد منتجات</option>}
                                        {products.map(p => <option key={p.id} value={p.id}>{p.title} - {p.price} ر.س</option>)}
                                    </select>
                                ) : (
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                        <input type="text" className="form-input" placeholder="اسم المنتج" required={isNewProduct} value={newProductTitle} onChange={e => setNewProductTitle(e.target.value)} />
                                        <input type="number" className="form-input" placeholder="السعر" required={isNewProduct} value={newProductPrice} onChange={e => setNewProductPrice(e.target.value)} />
                                        <input type="text" className="form-input" placeholder="وصف سريع" required={isNewProduct} value={newProductDesc} onChange={e => setNewProductDesc(e.target.value)} />
                                        <input type="file" className="form-input" onChange={handleImageUpload} accept="image/*" />
                                        {newProductImage && <img src={newProductImage} alt="Preview" style={{ width: '80px', borderRadius: '8px' }} />}
                                    </div>
                                )}
                                <div style={{ marginTop: '10px' }}>
                                    <label className="form-label">رابط الصفحة (Slug)</label>
                                    <input className="form-input" type="text" placeholder="auto-generated if empty" value={slug} onChange={e => setSlug(e.target.value)} />
                                </div>
                            </div>
                        )}

                        {/* Content Section */}
                        <div style={sectionStyle}>
                            {sectionTitle('📝', 'المحتوى والنصوص')}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                <input className="form-input" type="text" placeholder="العنوان الرئيسي الذي يخطف الأنظار" value={heroTitle} onChange={e => setHeroTitle(e.target.value)} />
                                <input className="form-input" type="text" placeholder="العنوان الفرعي (وصف مختصر)" value={heroSubtitle} onChange={e => setHeroSubtitle(e.target.value)} />
                                <input className="form-input" type="text" placeholder="نص زر الشراء CTA" value={ctaText} onChange={e => setCtaText(e.target.value)} />
                                <input className="form-input" type="url" placeholder="رابط فيديو YouTube (اختياري)" value={videoUrl} onChange={e => setVideoUrl(e.target.value)} />
                                <textarea className="form-input" rows="3" placeholder="المميزات (سطر لكل ميزة، يدعم HTML)" value={features} onChange={e => setFeatures(e.target.value)}></textarea>
                            </div>
                        </div>

                        {/* Design Section */}
                        <div style={sectionStyle}>
                            {sectionTitle('🎨', 'التصميم والألوان')}
                            <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                                <label className="form-label" style={{ margin: 0 }}>اللون المميز:</label>
                                <input type="color" value={themeColor} onChange={e => setThemeColor(e.target.value)} style={{ width: '60px', height: '40px', border: 'none', cursor: 'pointer', borderRadius: '8px' }} />
                                <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{themeColor}</span>
                            </div>
                        </div>

                        {/* Marketing Section */}
                        <div style={sectionStyle}>
                            {sectionTitle('🔥', 'أدوات التسويق والإقناع')}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>

                                <div style={{ display: 'flex', gap: '15px' }}>
                                    <div style={{ flex: 1 }}>
                                        <label className="form-label">السعر قبل الخصم</label>
                                        <input type="number" className="form-input" placeholder="مثال: 299" value={compareAtPrice} onChange={e => setCompareAtPrice(e.target.value)} />
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <label className="form-label">انتهاء العرض (عداد تنازلي)</label>
                                        <input type="datetime-local" className="form-input" value={offerEndsAt} onChange={e => setOfferEndsAt(e.target.value)} />
                                    </div>
                                </div>

                                <div style={{ background: 'rgba(247, 37, 133, 0.05)', padding: '15px', borderRadius: '12px' }}>
                                    <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', marginBottom: '10px' }}>
                                        <input type="checkbox" checked={showViewers} onChange={e => setShowViewers(e.target.checked)} />
                                        <span>👁️ إظهار عداد المشاهدات الحية (وهمي)</span>
                                    </label>
                                    {showViewers && (
                                        <div style={{ display: 'flex', gap: '15px' }}>
                                            <div style={{ flex: 1 }}>
                                                <label className="form-label">الحد الأدنى</label>
                                                <input type="number" className="form-input" value={viewersMin} onChange={e => setViewersMin(e.target.value)} />
                                            </div>
                                            <div style={{ flex: 1 }}>
                                                <label className="form-label">الحد الأقصى</label>
                                                <input type="number" className="form-input" value={viewersMax} onChange={e => setViewersMax(e.target.value)} />
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div style={{ background: 'rgba(76, 201, 240, 0.05)', padding: '15px', borderRadius: '12px' }}>
                                    <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', marginBottom: '10px' }}>
                                        <input type="checkbox" checked={showStock} onChange={e => setShowStock(e.target.checked)} />
                                        <span>📦 إظهار كمية المخزون المتبقي</span>
                                    </label>
                                    {showStock && (
                                        <input type="number" className="form-input" placeholder="الكمية المتبقية" value={fakeStock} onChange={e => setFakeStock(e.target.value)} />
                                    )}
                                </div>

                                <div style={{ background: 'rgba(16, 185, 129, 0.05)', padding: '15px', borderRadius: '12px' }}>
                                    <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', marginBottom: '10px' }}>
                                        <input type="checkbox" checked={showSoldCount} onChange={e => setShowSoldCount(e.target.checked)} />
                                        <span>🛒 إظهار عدد المبيعات</span>
                                    </label>
                                    {showSoldCount && (
                                        <input type="number" className="form-input" placeholder="عدد القطع المباعة" value={fakeSoldCount} onChange={e => setFakeSoldCount(e.target.value)} />
                                    )}
                                </div>

                                <div>
                                    <label className="form-label">نص الاستعجال (مثل: العرض ينتهي خلال ساعات!)</label>
                                    <input type="text" className="form-input" placeholder="⏰ الكمية محدودة جداً..." value={urgencyText} onChange={e => setUrgencyText(e.target.value)} />
                                </div>

                                <div>
                                    <label className="form-label">نص الضمان</label>
                                    <input type="text" className="form-input" placeholder="مثال: ضمان استرجاع 100% خلال 14 يوم" value={guaranteeText} onChange={e => setGuaranteeText(e.target.value)} />
                                </div>
                            </div>
                        </div>

                        {/* Testimonials */}
                        <div style={sectionStyle}>
                            {sectionTitle('⭐', 'آراء العملاء (Social Proof)')}
                            <textarea className="form-input" rows="5" placeholder={"أحمد - الرياض | ⭐⭐⭐⭐⭐ | ممتاز جداً والتوصيل سريع\nسارة - جدة | ⭐⭐⭐⭐⭐ | المنتج فاق توقعاتي\n(كل سطر = تقييم عميل)"} value={testimonials} onChange={e => setTestimonials(e.target.value)}></textarea>
                        </div>

                        <button type="submit" className="btn btn-primary" style={{ marginTop: '10px', fontSize: '1.1rem', padding: '14px' }}>
                            {editingLanding ? '💾 حفظ التعديلات' : '🚀 إنشاء صفحة الهبوط'}
                        </button>
                    </form>
                </div>

                {/* Existing Landings */}
                <div className="glass-card">
                    <h3 style={{ marginBottom: '20px' }}>صفحات الهبوط الحالية ({landings.length})</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                        {landings.length === 0 ? (
                            <p style={{ color: 'var(--text-secondary)' }}>لا توجد صفحات هبوط بعد.</p>
                        ) : landings.map(l => (
                            <div key={l.id} style={{ background: 'var(--surface-color)', padding: '20px', borderRadius: '16px', border: `1px solid ${l.themeColor}33` }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                                    <h4 style={{ margin: 0, color: l.themeColor }}>{l.heroTitle || l.product?.title}</h4>
                                    <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', background: 'var(--glass-bg)', padding: '4px 8px', borderRadius: '6px' }}>
                                        /l/{l.slug}
                                    </span>
                                </div>
                                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '8px' }}>
                                    📦 {l.product?.title} | 💰 {l.product?.price} ر.س
                                    {!l.product?.isActive && <span style={{ color: 'var(--warning-color)' }}> (خفي)</span>}
                                </p>
                                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '12px' }}>
                                    {l.showViewers && <span style={{ fontSize: '0.75rem', padding: '3px 8px', borderRadius: '6px', background: 'rgba(76, 201, 240, 0.15)', color: '#4cc9f0' }}>👁️ مشاهدات</span>}
                                    {l.showStock && <span style={{ fontSize: '0.75rem', padding: '3px 8px', borderRadius: '6px', background: 'rgba(247, 37, 133, 0.15)', color: '#f72585' }}>📦 مخزون</span>}
                                    {l.showSoldCount && <span style={{ fontSize: '0.75rem', padding: '3px 8px', borderRadius: '6px', background: 'rgba(16, 185, 129, 0.15)', color: '#10b981' }}>🛒 مبيعات</span>}
                                    {l.offerEndsAt && <span style={{ fontSize: '0.75rem', padding: '3px 8px', borderRadius: '6px', background: 'rgba(245, 158, 11, 0.15)', color: '#f59e0b' }}>⏰ عداد</span>}
                                </div>
                                <div style={{ display: 'flex', gap: '8px' }}>
                                    <Link href={`/l/${l.slug}`} target="_blank" className="btn btn-outline" style={{ padding: '8px 12px', fontSize: '0.85rem', flex: 1, textAlign: 'center', textDecoration: 'none' }}>
                                        👁️ معاينة
                                    </Link>
                                    <button onClick={() => openEdit(l)} className="btn btn-primary" style={{ padding: '8px 12px', fontSize: '0.85rem', flex: 1 }}>
                                        ✏️ تعديل
                                    </button>
                                    <button onClick={() => copyLink(l.slug)} className="btn btn-outline" style={{ padding: '8px 12px', fontSize: '0.85rem' }}>
                                        📋
                                    </button>
                                    <button onClick={() => handleDelete(l.id)} className="btn btn-danger" style={{ padding: '8px 12px', fontSize: '0.85rem' }}>
                                        🗑️
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
