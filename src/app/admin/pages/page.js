"use client";

import { useState, useEffect } from 'react';
import RichTextEditor from './RichTextEditor';

export default function AdminPages() {
    const [pages, setPages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingPage, setEditingPage] = useState(null);
    const [formData, setFormData] = useState({ title: '', slug: '', content: '' });

    const fetchPages = async () => {
        try {
            const res = await fetch('/api/admin/pages');
            if (res.ok) {
                setPages(await res.json());
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchPages(); }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const url = editingPage ? `/api/admin/pages/${editingPage.id}` : '/api/admin/pages';
            const method = editingPage ? 'PUT' : 'POST';
            
            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            
            if (res.ok) {
                fetchPages();
                setEditingPage(null);
                setFormData({ title: '', slug: '', content: '' });
                alert('تم الحفظ بنجاح!');
            } else {
                alert('خطأ أثناء الحفظ');
            }
        } catch (error) {
            console.error(error);
            alert('حدث خطأ');
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('هل تأكد من حذف هذه الصفحة؟')) return;
        try {
            const res = await fetch(`/api/admin/pages/${id}`, { method: 'DELETE' });
            if (res.ok) fetchPages();
        } catch (error) {
            console.error(error);
        }
    };

    const handleEdit = (page) => {
        setEditingPage(page);
        setFormData({ title: page.title, slug: page.slug, content: page.content });
    };

    const resetForm = () => {
        setEditingPage(null);
        setFormData({ title: '', slug: '', content: '' });
    };

    return (
        <div className="animate-fade-in" style={{ padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                <div>
                    <h1 className="text-gradient" style={{ fontSize: '2.5rem', marginBottom: '10px' }}>الصفحات الإضافية المخصصة</h1>
                    <p style={{ color: 'var(--text-secondary)' }}>أنشئ صفحات حرة بكود HTML وضع روابطها في القوائم (مثل: سياسة الاستخدام، من نحن).</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2" style={{ gap: '30px' }}>
                <div className="glass-card">
                    <h3 style={{ marginBottom: '20px', color: 'var(--primary-color)' }}>{editingPage ? 'تعديل الصفحة' : '➕ إنشاء صفحة جديدة'}</h3>
                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                        <div>
                            <label className="form-label">عنوان الصفحة</label>
                            <input type="text" className="form-input" required value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} />
                        </div>
                        <div>
                            <label className="form-label">رابط الصفحة (Slug) - (تلقائياً سيكون الرابط المُنشأ هو /p/الاسم)</label>
                            <input type="text" className="form-input" required value={formData.slug} onChange={(e) => setFormData({...formData, slug: e.target.value.replace(/\s+/g, '-').toLowerCase()})} placeholder="about-us" style={{ direction: 'ltr', textAlign: 'left' }} />
                        </div>
                        <div>
                            <label className="form-label">محتوى HTML للصفحة</label>
                            <RichTextEditor value={formData.content} onChange={(html) => setFormData({...formData, content: html})} />
                            <small style={{ color: 'var(--text-secondary)' }}>يمكنك إضافة أي أكواد HTML عادية أو حتى فيديوهات يوتيوب هنا.</small>
                        </div>
                        <div style={{ display: 'flex', gap: '10px' }}>
                            <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>{editingPage ? '💾 حفظ التعديلات' : '✅ إنشاء الصفحة'}</button>
                            {editingPage && (
                                <button type="button" onClick={resetForm} className="btn btn-outline" style={{ background: 'transparent' }}>إلغاء</button>
                            )}
                        </div>
                    </form>
                </div>

                <div className="glass-card">
                    <h3 style={{ marginBottom: '20px', color: 'var(--primary-color)' }}>📋 الصفحات الحالية</h3>
                    {loading ? <p>جاري التحميل...</p> : pages.length === 0 ? <p style={{ color: 'var(--text-secondary)' }}>لا توجد صفحات مضافة حالياً.</p> : (
                        <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '15px' }}>
                            {pages.map(page => (
                                <li key={page.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px', background: 'rgba(255,255,255,0.05)', borderRadius: '12px', border: '1px solid var(--glass-border)' }}>
                                    <div>
                                        <div style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>{page.title}</div>
                                        <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginTop: '4px' }}>الرابط: <a href={`/p/${page.slug}`} target="_blank" style={{ color: 'var(--primary-color)' }}>/p/{page.slug}</a></div>
                                    </div>
                                    <div style={{ display: 'flex', gap: '8px' }}>
                                        <button onClick={() => handleEdit(page)} className="btn" style={{ padding: '6px 12px', background: 'rgba(59, 130, 246, 0.2)', color: '#60a5fa' }}>✏️</button>
                                        <button onClick={() => handleDelete(page.id)} className="btn" style={{ padding: '6px 12px', background: 'rgba(239, 68, 68, 0.2)', color: '#f87171' }}>🗑️</button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </div>
    );
}
