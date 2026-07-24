"use client";
import MenuBuilder from "./components/MenuBuilder";

import { useEffect, useState } from 'react';

export default function AdminSettings() {
    const [settings, setSettings] = useState({
        storeName: 'QORVEX',
        storeDescription: 'منتجات مميزة، خدمة ممتازة، تسوق بثقة، دائمًا.',
        contactEmail: 'support@qorvex.shop',
        contactPhone: '+966500000000',
        currency: 'ر.س',
        taxRate: '15',
        shippingFee: '35',
        freeShippingThreshold: '500',
        enableCod: 'true',
        enableCard: 'true',
        facebookUrl: '',
        instagramUrl: '',
        twitterUrl: '',
        whatsappNumber: '+966500000000',
        topMenu: '[{"title":"الرئيسية","url":"/"},{"title":"المنتجات","url":"/products"}]',
        heroTitle: 'اكتشف الفخامة والأناقة في <span class="text-gradient">مكان واحد</span>',
        heroSubtitle: 'منتجات مميزة، خدمة ممتازة، تسوق بثقة، دائمًا.',
        heroCtaPrimaryText: 'تسوق الآن',
        heroCtaPrimaryUrl: '/products',
        heroCtaSecondaryText: 'أحدث المنتجات',
        heroCtaSecondaryUrl: '#products',
        homeProductsTitle: 'وصلنا حديثاً',
        footerAboutTitle: 'QORVEX',
        footerAboutText: 'نقدم لك تجربة تسوق فريدة ومميزة تناسب ذوقك الرفيع. الجودة والفخامة هي شعارنا الدائم.',
        footerQuickLinks: '[{"title":"الرئيسية","url":"/"},{"title":"تصفح المنتجات","url":"/search"},{"title":"تسجيل الدخول","url":"/login"},{"title":"السلة والدفع","url":"/checkout"}]',
        footerServiceLinks: '[{"title":"سياسة الاسترجاع","url":"/p/refund-policy"},{"title":"الشروط والأحكام","url":"/p/terms"},{"title":"الأسئلة الشائعة","url":"/p/faq"},{"title":"اتصل بنا","url":"/p/contact"}]',
        footerNewsletterTitle: 'النشرة البريدية',
        footerNewsletterText: 'اشترك ليصلك كل جديد وعروض حصرية.',
        footerShowNewsletter: 'true',
        footerCopyright: '© 2026 متجر QORVEX. جميع الحقوق محفوظة.'
    });

    const [loading, setLoading] = useState(false);
    const [fetchLoading, setFetchLoading] = useState(true);
    const [toast, setToast] = useState(null);

    const showToast = (message, type = 'success') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3000);
    };

    const fetchSettings = async () => {
        try {
            const res = await fetch('/api/admin/settings');
            if (res.ok) {
                const data = await res.json();
                if (Object.keys(data).length > 0) {
                    setSettings(prev => ({ ...prev, ...data }));
                }
            }
        } catch (e) {
            console.error(e);
        } finally {
            setFetchLoading(false);
        }
    };

    useEffect(() => { fetchSettings(); }, []);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setSettings(prev => ({ ...prev, [name]: type === 'checkbox' ? (checked ? 'true' : 'false') : value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await fetch('/api/admin/settings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(settings)
            });
            if (res.ok) {
                showToast('تم حفظ الإعدادات بنجاح 💾');
                // You could also trigger a revalidation of client layout here if needed
            } else {
                showToast('حدث خطأ أثناء الحفظ', 'error');
            }
        } catch (e) {
            showToast('تعذر الاتصال بالخادم', 'error');
        } finally {
            setLoading(false);
        }
    };

    if (fetchLoading) {
        return (
            <div className="animate-fade-in">
                <h1 className="text-gradient" style={{ marginBottom: '30px' }}>⚙️ إعدادات النظام</h1>
                <div className="skeleton" style={{ height: '400px', borderRadius: '16px' }}></div>
            </div>
        );
    }

    return (
        <div className="animate-fade-in">
            {toast && <div className={`toast toast-${toast.type}`}>{toast.message}</div>}

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                <div>
                    <h1 className="text-gradient" style={{ margin: 0 }}>⚙️ إعدادات النظام</h1>
                    <p style={{ color: 'var(--text-secondary)', marginTop: '8px' }}>تحكم في خصائص وبيانات متجرك الأساسية</p>
                </div>
                <button onClick={handleSubmit} className="btn btn-primary" style={{ padding: '12px 24px', fontSize: '1.1rem' }} disabled={loading}>
                    {loading ? 'جاري الحفظ...' : '💾 حفظ جميع الإعدادات'}
                </button>
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-2" style={{ gap: '30px' }}>

                {/* General Info */}
                <div className="glass-card">
                    <h3 style={{ marginBottom: '20px', borderBottom: '1px solid var(--glass-border)', paddingBottom: '12px' }}>🏪 البيانات الأساسية</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <div>
                            <label className="form-label">اسم المتجر</label>
                            <input type="text" name="storeName" value={settings.storeName} onChange={handleChange} className="form-input" required />
                        </div>
                        <div>
                            <label className="form-label">وصف المتجر (لتحسين محركات البحث SEO)</label>
                            <textarea name="storeDescription" value={settings.storeDescription} onChange={handleChange} className="form-input" style={{ minHeight: '80px', resize: 'vertical' }} required></textarea>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                            <div>
                                <label className="form-label">البريد الإلكتروني للدعم</label>
                                <input type="email" name="contactEmail" value={settings.contactEmail} onChange={handleChange} className="form-input" required style={{ direction: 'ltr', textAlign: 'right' }} />
                            </div>
                            <div>
                                <label className="form-label">رقم الهاتف الأساسي</label>
                                <input type="tel" name="contactPhone" value={settings.contactPhone} onChange={handleChange} className="form-input" required style={{ direction: 'ltr', textAlign: 'right' }} />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Financial Settings */}
                <div className="glass-card">
                    <h3 style={{ marginBottom: '20px', borderBottom: '1px solid var(--glass-border)', paddingBottom: '12px' }}>💰 الإعدادات المالية والشحن</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                            <div>
                                <label className="form-label">العملة الأساسية</label>
                                <input type="text" name="currency" value={settings.currency} onChange={handleChange} className="form-input" required />
                            </div>
                            <div>
                                <label className="form-label">نسبة الضريبة (%)</label>
                                <input type="number" name="taxRate" value={settings.taxRate} onChange={handleChange} className="form-input" required min="0" step="0.1" />
                            </div>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                            <div>
                                <label className="form-label">تكلفة الشحن الثابتة</label>
                                <input type="number" name="shippingFee" value={settings.shippingFee} onChange={handleChange} className="form-input" required min="0" />
                            </div>
                            <div>
                                <label className="form-label">الشحن المجاني للطلبات فوق (اختياري)</label>
                                <input type="number" name="freeShippingThreshold" value={settings.freeShippingThreshold} onChange={handleChange} className="form-input" min="0" />
                            </div>
                        </div>

                        <div style={{ marginTop: '10px' }}>
                            <label className="form-label">طرق الدفع المفعلة</label>
                            <div style={{ display: 'flex', gap: '20px', padding: '16px', background: 'var(--surface-color)', borderRadius: '12px', border: '1px solid var(--glass-border)' }}>
                                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                                    <input type="checkbox" name="enableCod" checked={settings.enableCod === 'true'} onChange={handleChange} style={{ width: '18px', height: '18px', accentColor: 'var(--primary-color)' }} />
                                    <span>الدفع عند الاستلام 💵</span>
                                </label>
                                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                                    <input type="checkbox" name="enableCard" checked={settings.enableCard === 'true'} onChange={handleChange} style={{ width: '18px', height: '18px', accentColor: 'var(--primary-color)' }} />
                                    <span>الدفع بالبطاقة 💳</span>
                                </label>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Social Media Links */}
                <div className="glass-card" style={{ gridColumn: 'span 2' }}>
                    <h3 style={{ marginBottom: '20px', borderBottom: '1px solid var(--glass-border)', paddingBottom: '12px' }}>🔗 روابط منصات التواصل الاجتماعي</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                        <div>
                            <label className="form-label">رقم الواتساب (للتواصل المباشر)</label>
                            <input type="text" name="whatsappNumber" value={settings.whatsappNumber} onChange={handleChange} className="form-input" placeholder="+966..." style={{ direction: 'ltr', textAlign: 'right' }} />
                        </div>
                        <div>
                            <label className="form-label">رابط صفحة الانستجرام</label>
                            <input type="url" name="instagramUrl" value={settings.instagramUrl} onChange={handleChange} className="form-input" placeholder="https://instagram.com/..." style={{ direction: 'ltr', textAlign: 'right' }} />
                        </div>
                        <div>
                            <label className="form-label">رابط حساب تويتر (X)</label>
                            <input type="url" name="twitterUrl" value={settings.twitterUrl} onChange={handleChange} className="form-input" placeholder="https://twitter.com/..." style={{ direction: 'ltr', textAlign: 'right' }} />
                        </div>
                        <div>
                            <label className="form-label">رابط صفحة فيسبوك</label>
                            <input type="url" name="facebookUrl" value={settings.facebookUrl} onChange={handleChange} className="form-input" placeholder="https://facebook.com/..." style={{ direction: 'ltr', textAlign: 'right' }} />
                        </div>
                    </div>
                </div>


                {/* Content & Menus Section */}
                <div className="glass-card" style={{ gridColumn: 'span 2' }}>
                    <h3 style={{ marginBottom: '20px', borderBottom: '1px solid var(--glass-border)', paddingBottom: '12px' }}>📝 المحتوى والقوائم (Content & Menus)</h3>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
                        {/* Top Menu */}
                        <div>
                            <h4 style={{ marginBottom: '12px', color: 'var(--primary-color)' }}>القائمة العلوية للموقع</h4>
                            <MenuBuilder
                                initialValue={settings.topMenu}
                                onChange={(val) => setSettings(prev => ({ ...prev, topMenu: val }))}
                            />
                        </div>

                        <hr style={{ borderColor: 'rgba(255,255,255,0.1)' }} />

                        {/* Hero Section */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <h4 style={{ marginBottom: '4px', color: 'var(--primary-color)' }}>نصوص الصفحة الرئيسية (الواجهة)</h4>

                            <div>
                                <label className="form-label">العنوان الرئيسي (Hero Title)</label>
                                <input type="text" name="heroTitle" value={settings.heroTitle} onChange={handleChange} className="form-input" style={{ direction: 'rtl' }} />
                                <small style={{ color: 'var(--text-secondary)' }}>ملاحظة: يمكنك استخدام <code>&lt;span class="text-gradient"&gt;كلمة مميزة&lt;/span&gt;</code> لتلوين كلمة التدرج.</small>
                            </div>

                            <div>
                                <label className="form-label">النص الفرعي (Hero Subtitle)</label>
                                <textarea name="heroSubtitle" value={settings.heroSubtitle} onChange={handleChange} className="form-input" style={{ minHeight: '80px', resize: 'vertical' }}></textarea>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                <div>
                                    <label className="form-label">نص الزر الأساسي (Primary Button)</label>
                                    <input type="text" name="heroCtaPrimaryText" value={settings.heroCtaPrimaryText} onChange={handleChange} className="form-input" />
                                </div>
                                <div>
                                    <label className="form-label">رابط الزر الأساسي (Primary Url)</label>
                                    <input type="text" name="heroCtaPrimaryUrl" value={settings.heroCtaPrimaryUrl} onChange={handleChange} className="form-input" style={{ direction: 'ltr', textAlign: 'right' }} />
                                </div>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                <div>
                                    <label className="form-label">نص الزر الثانوي (Secondary Button)</label>
                                    <input type="text" name="heroCtaSecondaryText" value={settings.heroCtaSecondaryText} onChange={handleChange} className="form-input" />
                                </div>
                                <div>
                                    <label className="form-label">رابط الزر الثانوي (Secondary Url)</label>
                                    <input type="text" name="heroCtaSecondaryUrl" value={settings.heroCtaSecondaryUrl} onChange={handleChange} className="form-input" style={{ direction: 'ltr', textAlign: 'right' }} />
                                </div>
                            </div>
                        </div>

                        <hr style={{ borderColor: 'rgba(255,255,255,0.1)' }} />


                        <hr style={{ borderColor: 'rgba(255,255,255,0.1)' }} />


                        <hr style={{ borderColor: 'rgba(255,255,255,0.1)' }} />

                        <div>
                            <h4 style={{ marginBottom: '12px', color: 'var(--primary-color)' }}>مميزات المنتجات (Guarantees)</h4>
                            <div>
                                <label className="form-label">قائمة المميزات (كل ميزة في سطر جديد)</label>
                                <textarea name="productFeatures" value={settings.productFeatures} onChange={handleChange} className="form-input" style={{ minHeight: '100px', resize: 'vertical' }}></textarea>
                            </div>
                        </div>

                        {/* Footer Section */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            <h4 style={{ marginBottom: '4px', color: 'var(--primary-color)' }}>تذييل الموقع (Footer)</h4>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                <div>
                                    <label className="form-label">عنوان معلومات المتجر</label>
                                    <input type="text" name="footerAboutTitle" value={settings.footerAboutTitle} onChange={handleChange} className="form-input" />
                                </div>
                                <div style={{ gridColumn: 'span 2' }}>
                                    <label className="form-label">وصف المتجر القصير</label>
                                    <textarea name="footerAboutText" value={settings.footerAboutText} onChange={handleChange} className="form-input"></textarea>
                                </div>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
                                <div>
                                    <label className="form-label">قائمة (روابط سريعة)</label>
                                    <MenuBuilder
                                        initialValue={settings.footerQuickLinks}
                                        onChange={(val) => setSettings(prev => ({ ...prev, footerQuickLinks: val }))}
                                    />
                                </div>
                                <div>
                                    <label className="form-label">قائمة (خدمة العملاء)</label>
                                    <MenuBuilder
                                        initialValue={settings.footerServiceLinks}
                                        onChange={(val) => setSettings(prev => ({ ...prev, footerServiceLinks: val }))}
                                    />
                                </div>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginTop: '20px' }}>
                                <div>
                                    <label className="form-label">عنوان النشرة البريدية</label>
                                    <input type="text" name="footerNewsletterTitle" value={settings.footerNewsletterTitle} onChange={handleChange} className="form-input" />
                                </div>
                                <div>

                                    <div style={{ marginTop: '10px' }}>
                                        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                                            <input type="checkbox" name="footerShowNewsletter" checked={settings.footerShowNewsletter === 'true'} onChange={(e) => setSettings(prev => ({ ...prev, footerShowNewsletter: e.target.checked ? 'true' : 'false' }))} style={{ width: '18px', height: '18px', accentColor: 'var(--primary-color)' }} />
                                            <span>تفعيل النشرة البريدية (إظهار/إخفاء)</span>
                                        </label>
                                    </div>

                                    <label className="form-label">نص النشرة البريدية</label>
                                    <input type="text" name="footerNewsletterText" value={settings.footerNewsletterText} onChange={handleChange} className="form-input" />
                                </div>
                            </div>

                            <div>
                                <label className="form-label">حقوق النشر</label>
                                <input type="text" name="footerCopyright" value={settings.footerCopyright} onChange={handleChange} className="form-input" style={{ direction: 'rtl' }} />
                            </div>
                        </div>

                        {/* Recent Products Title */}
                        <div>
                            <h4 style={{ marginBottom: '12px', color: 'var(--primary-color)' }}>أقسام المنتجات (Products Sections)</h4>
                            <div>
                                <label className="form-label">عنوان قسم المنتجات الحديثة</label>
                                <input type="text" name="homeProductsTitle" value={settings.homeProductsTitle} onChange={handleChange} className="form-input" />
                            </div>
                        </div>

                    </div>
                </div>

            </form>
        </div>
    );
}
