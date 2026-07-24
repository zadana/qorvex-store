"use client";

import { useEffect, useState } from 'react';

export default function AdminCategories() {
    const [categories, setCategories] = useState([]);
    const [formData, setFormData] = useState({ name: '', icon: '📦' });
    const [loading, setLoading] = useState(false);
    const [fetchLoading, setFetchLoading] = useState(true);
    const [toast, setToast] = useState(null);
    const [editingId, setEditingId] = useState(null);

    const showToast = (message, type = 'success') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3000);
    };

    const icons = ['📦', '👕', '👗', '👟', '💍', '🎒', '⌚', '🕶️', '👜', '💄', '🖥️', '📱', '🏠', '🎮', '📚', '🍽️', '🧴', '🎁', '🏋️', '🎵'];

    const fetchCategories = async () => {
        try {
            const res = await fetch('/api/admin/categories');
            if (res.ok) {
                const data = await res.json();
                setCategories(Array.isArray(data) ? data : []);
            }
        } catch (e) {
            console.error(e);
        } finally {
            setFetchLoading(false);
        }
    };

    useEffect(() => { fetchCategories(); }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const url = editingId ? `/api/admin/categories/${editingId}` : '/api/admin/categories';
            const method = editingId ? 'PUT' : 'POST';
            const res = await fetch(url, {
                method,
                body: JSON.stringify(formData),
                headers: { 'Content-Type': 'application/json' }
            });
            if (res.ok) {
                showToast(editingId ? 'تم تعديل القسم بنجاح ✅' : 'تمت إضافة القسم بنجاح ✅');
                setFormData({ name: '', icon: '📦' });
                setEditingId(null);
                fetchCategories();
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

    const handleEdit = (cat) => {
        setFormData({ name: cat.name, icon: cat.icon });
        setEditingId(cat.id);
    };

    const handleDelete = async (id) => {
        if (!confirm('هل أنت متأكد من حذف هذا القسم؟')) return;
        try {
            const res = await fetch(`/api/admin/categories/${id}`, { method: 'DELETE' });
            if (res.ok) {
                showToast('تم حذف القسم بنجاح');
                fetchCategories();
            } else {
                showToast('حدث خطأ أثناء الحذف', 'error');
            }
        } catch (e) {
            showToast('تعذر الاتصال بالخادم', 'error');
        }
    };

    return (
        <div className="animate-fade-in">
            {toast && <div className={`toast toast-${toast.type}`}>{toast.message}</div>}

            <h1 className="text-gradient" style={{ marginBottom: '8px' }}>🏷️ إدارة الأقسام والتصنيفات</h1>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '30px' }}>أنشئ أقسام لتنظيم منتجات متجرك</p>

            <div className="grid grid-cols-2" style={{ gap: '30px' }}>
                {/* Form */}
                <div className="glass-card" style={{ height: 'fit-content' }}>
                    <h3 style={{ marginBottom: '20px' }}>{editingId ? '✏️ تعديل القسم' : '➕ إضافة قسم جديد'}</h3>
                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <div>
                            <label className="form-label">اسم القسم</label>
                            <input type="text" placeholder="مثال: إلكترونيات، ملابس..." value={formData.name} required
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="form-input" />
                        </div>
                        <div>
                            <label className="form-label">أيقونة القسم</label>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '8px' }}>
                                {icons.map(icon => (
                                    <button key={icon} type="button" onClick={() => setFormData({ ...formData, icon })}
                                        style={{
                                            width: '44px', height: '44px', borderRadius: '10px', cursor: 'pointer',
                                            fontSize: '1.3rem', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            border: formData.icon === icon ? '2px solid var(--primary-color)' : '1px solid var(--glass-border)',
                                            background: formData.icon === icon ? 'rgba(247,37,133,0.15)' : 'var(--surface-color)',
                                            transition: 'var(--transition)',
                                        }}>
                                        {icon}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div style={{ display: 'flex', gap: '8px' }}>
                            <button type="submit" className={editingId ? 'btn btn-success' : 'btn btn-primary'} style={{ flex: 1, padding: '14px' }} disabled={loading}>
                                {loading ? 'جاري الحفظ...' : editingId ? '💾 حفظ التعديلات' : '➕ إضافة القسم'}
                            </button>
                            {editingId && (
                                <button type="button" onClick={() => { setFormData({ name: '', icon: '📦' }); setEditingId(null); }}
                                    className="btn btn-outline" style={{ padding: '14px' }}>إلغاء</button>
                            )}
                        </div>
                    </form>
                </div>

                {/* Categories List */}
                <div className="glass-card">
                    <h3 style={{ marginBottom: '20px' }}>الأقسام الحالية ({categories.length})</h3>
                    {fetchLoading ? (
                        [1, 2, 3].map(i => <div key={i} className="skeleton" style={{ height: '60px', borderRadius: '12px', marginBottom: '12px' }}></div>)
                    ) : categories.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-secondary)' }}>
                            <div style={{ fontSize: '3rem', marginBottom: '16px' }}>📂</div>
                            <p>لا توجد أقسام. أنشئ أقسامك لتنظيم المنتجات!</p>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            {categories.map(cat => (
                                <div key={cat.id} style={{
                                    display: 'flex', alignItems: 'center', gap: '16px', padding: '16px',
                                    background: 'var(--surface-color)', borderRadius: '12px', border: '1px solid var(--glass-border)',
                                }}>
                                    <div style={{
                                        width: '48px', height: '48px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        background: 'rgba(247,37,133,0.1)', fontSize: '1.5rem',
                                    }}>{cat.icon}</div>
                                    <div style={{ flex: 1 }}>
                                        <h4 style={{ margin: 0, fontSize: '1rem' }}>{cat.name}</h4>
                                        <p style={{ margin: '2px 0 0 0', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                                            {cat.products?.length || 0} منتج مرتبط
                                        </p>
                                    </div>
                                    <div style={{ display: 'flex', gap: '8px' }}>
                                        <button onClick={() => handleEdit(cat)}
                                            style={{ padding: '8px 14px', borderRadius: '8px', cursor: 'pointer', border: '1px solid rgba(76,201,240,0.3)', background: 'rgba(76,201,240,0.1)', color: '#4cc9f0', fontFamily: 'inherit', fontSize: '0.85rem' }}>
                                            ✏️
                                        </button>
                                        <button onClick={() => handleDelete(cat.id)}
                                            style={{ padding: '8px 14px', borderRadius: '8px', cursor: 'pointer', border: '1px solid rgba(239,68,68,0.3)', background: 'rgba(239,68,68,0.1)', color: '#f87171', fontFamily: 'inherit', fontSize: '0.85rem' }}>
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
