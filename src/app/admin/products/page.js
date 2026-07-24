"use client";

import { useEffect, useState } from 'react';

export default function AdminProducts() {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [formData, setFormData] = useState({ title: '', description: '', price: '', image: '', imageAlt: '', stock: '100', rating: '', categoryId: '', compareAtPrice: '', offerEndsAt: '', showStock: false, features: '' });
    const [loading, setLoading] = useState(false);
    const [fetchLoading, setFetchLoading] = useState(true);
    const [toast, setToast] = useState(null);
    const [editingId, setEditingId] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [viewMode, setViewMode] = useState('grid');

    const showToast = (message, type = 'success') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3000);
    };

    const fetchProducts = async () => {
        try {
            const res = await fetch('/api/products');
            if (res.ok) {
                const data = await res.json();
                setProducts(Array.isArray(data) ? data : []);
            }
        } catch (e) {
            console.error(e);
        } finally {
            setFetchLoading(false);
        }
    };

    const fetchCategories = async () => {
        try {
            const res = await fetch('/api/admin/categories');
            if (res.ok) {
                const data = await res.json();
                setCategories(Array.isArray(data) ? data : []);
            }
        } catch (e) {
            console.error(e);
        }
    };

    useEffect(() => {
        fetchProducts();
        fetchCategories();
    }, []);

    const resetForm = () => {
        setFormData({ title: '', description: '', price: '', image: '', imageAlt: '', stock: '100', rating: '', categoryId: '', compareAtPrice: '', offerEndsAt: '', showStock: false, features: '' });
        setEditingId(null);
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const data = new FormData();
        data.append('file', file);

        showToast('جاري رفع الصورة...', 'info');

        try {
            const res = await fetch('/api/upload', {
                method: 'POST',
                body: data
            });
            if (res.ok) {
                const { url } = await res.json();
                setFormData(prev => ({ ...prev, image: url }));
                showToast('تم رفع الصورة بنجاح ✅');
            } else {
                showToast('حدث خطأ أثناء رفع الصورة', 'error');
            }
        } catch {
            showToast('تعذر الاتصال بالخادم لرفع الصورة', 'error');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const url = editingId ? `/api/products/${editingId}` : '/api/products';
            const method = editingId ? 'PUT' : 'POST';
            const res = await fetch(url, {
                method,
                body: JSON.stringify(formData),
                headers: { 'Content-Type': 'application/json' }
            });
            if (res.ok) {
                showToast(editingId ? 'تم تعديل المنتج بنجاح ✅' : 'تمت إضافة المنتج بنجاح ✅');
                resetForm();
                fetchProducts();
            } else {
                showToast('حدث خطأ أثناء الحفظ', 'error');
            }
        } catch (e) {
            showToast('تعذر الاتصال بالخادم', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (product) => {
        setFormData({
            title: product.title,
            description: product.description,
            price: String(product.price),
            image: product.image,
            imageAlt: product.imageAlt || '',
            stock: String(product.stock || 100),
            rating: String(product.rating || 0),
            categoryId: product.categories?.length > 0 ? product.categories[0].categoryId : '',
            compareAtPrice: product.compareAtPrice ? String(product.compareAtPrice) : '',
            offerEndsAt: product.offerEndsAt && !isNaN(new Date(product.offerEndsAt)) ? new Date(product.offerEndsAt).toISOString().slice(0, 16) : '',
            showStock: product.showStock || false,
            features: product.features || ''
        });
        setEditingId(product.id);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDelete = async (id) => {
        if (!confirm('هل أنت متأكد من حذف هذا المنتج نهائياً؟')) return;
        try {
            const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
            if (res.ok) {
                showToast('تم حذف المنتج بنجاح');
                fetchProducts();
                if (editingId === id) resetForm();
            } else {
                showToast('حدث خطأ أثناء الحذف', 'error');
            }
        } catch (e) {
            showToast('تعذر الاتصال بالخادم', 'error');
        }
    };

    const filteredProducts = products.filter(p =>
        p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="animate-fade-in">
            {toast && <div className={`toast toast-${toast.type}`}>{toast.message}</div>}

            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <div>
                    <h1 className="text-gradient" style={{ margin: 0 }}>📦 إدارة المنتجات</h1>
                    <p style={{ color: 'var(--text-secondary)', marginTop: '4px' }}>إجمالي {products.length} منتج في المتجر</p>
                </div>
            </div>

            <div className="grid grid-cols-2" style={{ gap: '30px' }}>
                {/* Form */}
                <div className="glass-card" style={{ height: 'fit-content', position: 'sticky', top: '20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                        <h3 style={{ margin: 0 }}>{editingId ? '✏️ تعديل المنتج' : '➕ إضافة منتج جديد'}</h3>
                        {editingId && (
                            <button onClick={resetForm} className="btn btn-outline" style={{ padding: '6px 14px', fontSize: '0.85rem' }}>إلغاء التعديل</button>
                        )}
                    </div>
                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <div>
                            <label className="form-label">اسم المنتج</label>
                            <input type="text" placeholder="مثال: حقيبة جلدية فاخرة" value={formData.title} required
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })} className="form-input" />
                        </div>
                        <div>
                            <label className="form-label">الوصف التفصيلي</label>
                            <textarea placeholder="اكتب وصفاً تفصيلياً للمنتج..." value={formData.description} required
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                className="form-input" style={{ minHeight: '100px', resize: 'vertical' }}></textarea>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                            <div>
                                <label className="form-label">السعر (ر.س)</label>
                                <input type="number" placeholder="299" value={formData.price} required min="0" step="0.01"
                                    onChange={(e) => setFormData({ ...formData, price: e.target.value })} className="form-input" />
                            </div>
                            <div>
                                <label className="form-label">المخزون</label>
                                <input type="number" placeholder="100" value={formData.stock} min="0"
                                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })} className="form-input" />
                            </div>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                            <div>
                                <label className="form-label">القسم التصنيفي</label>
                                <select value={formData.categoryId} onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })} className="form-input" style={{ appearance: 'auto' }}>
                                    <option value="">-- بدون قسم --</option>
                                    {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.icon} {cat.name}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="form-label">التقييم (0-5)</label>
                                <input type="number" placeholder="4.5" value={formData.rating} min="0" max="5" step="0.1"
                                    onChange={(e) => setFormData({ ...formData, rating: e.target.value })} className="form-input" />
                            </div>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                            <div>
                                <label className="form-label">رابط الصورة أو رفع من الجهاز</label>
                                <div style={{ display: 'flex', gap: '8px' }}>
                                    <input type="text" placeholder="https://... أو رفع صورة" value={formData.image} required
                                        onChange={(e) => setFormData({ ...formData, image: e.target.value })} className="form-input" style={{ flex: 1 }} />
                                    <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--surface-color)', padding: '0 16px', borderRadius: '12px', cursor: 'pointer', border: '1px solid var(--glass-border)' }}>
                                        <span>📁 رفع</span>
                                        <input type="file" accept="image/*" onChange={handleImageUpload} style={{ display: 'none' }} />
                                    </label>
                                </div>
                            </div>
                            <div>
                                <label className="form-label">نص بديل للصورة (SEO)</label>
                                <input type="text" placeholder="مثال: حقيبة جلدية سوداء للرجال" value={formData.imageAlt}
                                    onChange={(e) => setFormData({ ...formData, imageAlt: e.target.value })} className="form-input" />
                            </div>
                        </div>
                        {formData.image && (
                            <div style={{ textAlign: 'center' }}>
                                <img src={formData.image} alt="معاينة" style={{ maxWidth: '100%', maxHeight: '200px', objectFit: 'cover', borderRadius: '12px', border: '1px solid var(--glass-border)' }}
                                    onError={(e) => e.target.style.display = 'none'} />
                            </div>
                        )}
                        <div>
                            <label className="form-label">مميزات المنتج (اختياري - يدعم HTML)</label>
                            <textarea placeholder="أدخل مميزات المنتج ليتم عرضها في صفحة المنتج. يمكنك استخدام كود HTML كامل..." value={formData.features}
                                onChange={(e) => setFormData({ ...formData, features: e.target.value })}
                                className="form-input" style={{ minHeight: '120px', resize: 'vertical', direction: 'ltr', textAlign: 'left' }}></textarea>
                            <small style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', marginTop: '4px', display: 'block' }}>
                                مثال: &lt;ul&gt;&lt;li&gt;شحن مجاني&lt;/li&gt;&lt;li&gt;100% قطن&lt;/li&gt;&lt;/ul&gt;
                            </small>
                        </div>

                        <hr style={{ borderColor: 'rgba(255,255,255,0.1)' }} />
                        <h4 style={{ margin: '0', color: 'var(--primary-color)' }}>🔥 خصائص العروض والمخزون</h4>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                            <div>
                                <label className="form-label">السعر قبل الخصم (اختياري)</label>
                                <input type="number" step="0.01" placeholder="مثال: 499" value={formData.compareAtPrice}
                                    onChange={(e) => setFormData({ ...formData, compareAtPrice: e.target.value })} className="form-input" />
                            </div>
                            <div>
                                <label className="form-label">نهاية العرض (اختياري)</label>
                                <input type="datetime-local" value={formData.offerEndsAt}
                                    onChange={(e) => setFormData({ ...formData, offerEndsAt: e.target.value })} className="form-input" style={{ direction: 'ltr' }} />
                            </div>
                        </div>
                        <div>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                                <input type="checkbox" checked={formData.showStock}
                                    onChange={(e) => setFormData({ ...formData, showStock: e.target.checked })}
                                    style={{ width: '18px', height: '18px', accentColor: 'var(--primary-color)' }} />
                                <span>إظهار المخزون المتاح للعميل (يشجع على الشراء السريع)</span>
                            </label>
                        </div>

                        <button type="submit" className={editingId ? 'btn btn-success' : 'btn btn-primary'} style={{ padding: '16px' }} disabled={loading}>
                            {loading ? 'جاري الحفظ...' : editingId ? '💾 حفظ التعديلات' : '➕ إضافة المنتج'}
                        </button>
                    </form>
                </div>

                {/* Products List */}
                <div>
                    <div style={{ display: 'flex', gap: '12px', marginBottom: '20px', alignItems: 'center' }}>
                        <input
                            type="text" placeholder="🔍 بحث في المنتجات..."
                            value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
                            className="form-input" style={{ flex: 1, padding: '10px 16px' }}
                        />
                        <div style={{ display: 'flex', gap: '4px' }}>
                            <button onClick={() => setViewMode('grid')} style={{
                                padding: '10px 14px', borderRadius: '8px', cursor: 'pointer', border: '1px solid var(--glass-border)',
                                background: viewMode === 'grid' ? 'var(--primary-color)' : 'var(--surface-color)', color: 'white', fontFamily: 'inherit',
                            }}>▦</button>
                            <button onClick={() => setViewMode('list')} style={{
                                padding: '10px 14px', borderRadius: '8px', cursor: 'pointer', border: '1px solid var(--glass-border)',
                                background: viewMode === 'list' ? 'var(--primary-color)' : 'var(--surface-color)', color: 'white', fontFamily: 'inherit',
                            }}>☰</button>
                        </div>
                    </div>

                    {fetchLoading ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            {[1, 2, 3].map(i => <div key={i} className="skeleton" style={{ height: '80px', borderRadius: '12px' }}></div>)}
                        </div>
                    ) : filteredProducts.length === 0 ? (
                        <div className="glass-card" style={{ textAlign: 'center', padding: '60px' }}>
                            <div style={{ fontSize: '3rem', marginBottom: '16px' }}>📭</div>
                            <p style={{ color: 'var(--text-secondary)' }}>{searchTerm ? 'لا توجد نتائج مطابقة' : 'المخزون فارغ. ابدأ بإضافة منتجاتك!'}</p>
                        </div>
                    ) : (
                        <div style={{
                            display: viewMode === 'grid' ? 'grid' : 'flex',
                            gridTemplateColumns: '1fr 1fr',
                            flexDirection: 'column',
                            gap: '16px',
                            maxHeight: '700px',
                            overflowY: 'auto',
                            paddingLeft: '4px',
                        }}>
                            {filteredProducts.map(p => (
                                <div key={p.id} className="glass-card" style={{ padding: '16px' }}>
                                    <div style={{ display: viewMode === 'list' ? 'flex' : 'block', gap: '16px', alignItems: 'center' }}>
                                        <img src={p.image} alt={p.title}
                                            style={{
                                                width: viewMode === 'list' ? '70px' : '100%',
                                                height: viewMode === 'list' ? '70px' : '150px',
                                                borderRadius: '10px', objectFit: 'cover',
                                                marginBottom: viewMode === 'grid' ? '12px' : 0,
                                            }}
                                            onError={(e) => { e.target.src = 'https://via.placeholder.com/200?text=No+Image'; }} />
                                        <div style={{ flex: 1 }}>
                                            <h4 style={{ margin: '0 0 4px 0', fontSize: '0.95rem' }}>{p.title}</h4>
                                            <p style={{ color: 'var(--primary-color)', margin: '0 0 4px 0', fontWeight: 'bold', fontSize: '1.1rem' }}>{p.price} ر.س</p>
                                            {viewMode === 'grid' && (
                                                <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', margin: '0 0 8px 0', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{p.description}</p>
                                            )}
                                            <div style={{ display: 'flex', gap: '6px', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                                                <span>⭐ {p.rating || 0}</span>
                                                <span>•</span>
                                                <span>📦 مخزون: {p.stock ?? '∞'}</span>
                                            </div>
                                        </div>
                                        <div style={{ display: 'flex', gap: '8px', marginTop: viewMode === 'grid' ? '12px' : 0 }}>
                                            <button onClick={() => handleEdit(p)}
                                                style={{ flex: 1, padding: '8px 12px', borderRadius: '8px', cursor: 'pointer', border: '1px solid rgba(76,201,240,0.3)', background: 'rgba(76,201,240,0.1)', color: '#4cc9f0', fontFamily: 'inherit', fontSize: '0.85rem' }}>
                                                ✏️ تعديل
                                            </button>
                                            <button onClick={() => handleDelete(p.id)}
                                                style={{ flex: 1, padding: '8px 12px', borderRadius: '8px', cursor: 'pointer', border: '1px solid rgba(239,68,68,0.3)', background: 'rgba(239,68,68,0.1)', color: '#f87171', fontFamily: 'inherit', fontSize: '0.85rem' }}>
                                                🗑️ حذف
                                            </button>
                                        </div>
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
