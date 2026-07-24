"use client";

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

export default function LandingClient({ landing, product }) {
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [address, setAddress] = useState('');
    const [quantity, setQuantity] = useState(1);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const router = useRouter();

    const themeColor = landing.themeColor || '#f72585';

    // ─── Fake Live Viewers ───
    const [viewers, setViewers] = useState(0);
    useEffect(() => {
        if (!landing.showViewers) return;
        const min = landing.viewersMin || 20;
        const max = landing.viewersMax || 50;
        setViewers(Math.floor(Math.random() * (max - min + 1)) + min);
        const interval = setInterval(() => {
            setViewers(prev => {
                const change = Math.random() > 0.5 ? 1 : -1;
                let next = prev + change;
                if (next < min) next = min + Math.floor(Math.random() * 3);
                if (next > max) next = max - Math.floor(Math.random() * 3);
                return next;
            });
        }, 3000 + Math.random() * 2000);
        return () => clearInterval(interval);
    }, [landing.showViewers, landing.viewersMin, landing.viewersMax]);

    // ─── Countdown Timer ───
    const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
    const [timerExpired, setTimerExpired] = useState(false);
    useEffect(() => {
        if (!landing.offerEndsAt) return;
        const target = new Date(landing.offerEndsAt).getTime();
        const interval = setInterval(() => {
            const now = new Date().getTime();
            const diff = target - now;
            if (diff < 0) { clearInterval(interval); setTimerExpired(true); return; }
            setTimeLeft({
                days: Math.floor(diff / (1000 * 60 * 60 * 24)),
                hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
                minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
                seconds: Math.floor((diff % (1000 * 60)) / 1000)
            });
        }, 1000);
        return () => clearInterval(interval);
    }, [landing.offerEndsAt]);

    // ─── Fake "just purchased" notification ───
    const [notification, setNotification] = useState(null);
    const fakeNames = ['أحمد', 'محمد', 'سارة', 'فاطمة', 'خالد', 'عبدالله', 'نورة', 'ريم', 'سلطان', 'هند'];
    const fakeCities = ['الرياض', 'جدة', 'الدمام', 'مكة', 'المدينة', 'الطائف', 'تبوك', 'أبها', 'حائل', 'الخبر'];
    useEffect(() => {
        const showNotification = () => {
            const fakeName = fakeNames[Math.floor(Math.random() * fakeNames.length)];
            const fakeCity = fakeCities[Math.floor(Math.random() * fakeCities.length)];
            const minutesAgo = Math.floor(Math.random() * 15) + 1;
            setNotification({ name: fakeName, city: fakeCity, time: minutesAgo });
            setTimeout(() => setNotification(null), 5000);
        };
        const firstTimeout = setTimeout(showNotification, 8000);
        const interval = setInterval(showNotification, 25000 + Math.random() * 15000);
        return () => { clearTimeout(firstTimeout); clearInterval(interval); };
    }, []);

    // ─── Pulse animation for CTA ───
    const formRef = useRef(null);
    const scrollToForm = () => {
        formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    };

    // ─── Features ───
    const featuresSource = landing.features || product.features || '';
    let featuresContent = null;
    if (featuresSource) {
        if (/<[a-z][\s\S]*>/i.test(featuresSource)) {
            featuresContent = <div dangerouslySetInnerHTML={{ __html: featuresSource }} />;
        } else {
            const lines = featuresSource.split('\n').filter(f => f.trim());
            featuresContent = (
                <ul style={{ listStyle: 'none', padding: 0, display: 'grid', gap: '12px' }}>
                    {lines.map((f, i) => (
                        <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', background: 'rgba(255,255,255,0.03)', borderRadius: '12px', border: '1px solid var(--glass-border)' }}>
                            <span style={{ color: themeColor, fontSize: '1.3rem', flexShrink: 0 }}>✓</span>
                            <span style={{ fontSize: '1.05rem' }}>{f}</span>
                        </li>
                    ))}
                </ul>
            );
        }
    }

    // ─── Testimonials ───
    let testimonialsContent = null;
    if (landing.testimonials) {
        const lines = landing.testimonials.split('\n').filter(l => l.trim());
        testimonialsContent = lines.map((line, i) => {
            const parts = line.split('|').map(p => p.trim());
            return (
                <div key={i} style={{ background: 'var(--surface-color)', padding: '20px', borderRadius: '16px', border: '1px solid var(--glass-border)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                        <span style={{ fontWeight: 'bold' }}>{parts[0] || 'عميل'}</span>
                        <span style={{ color: '#fbbf24', letterSpacing: '2px' }}>{parts[1] || '⭐⭐⭐⭐⭐'}</span>
                    </div>
                    <p style={{ color: 'var(--text-secondary)', margin: 0, fontSize: '0.95rem' }}>{parts[2] || ''}</p>
                </div>
            );
        });
    }

    const displayPrice = landing.compareAtPrice || product.compareAtPrice;
    const actualPrice = product.price;

    // ─── Submit Order ───
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await fetch('/api/orders', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    items: [{ id: product.id, quantity, price: actualPrice }],
                    paymentMethod: 'cod',
                    customerData: { name, phone, address }
                })
            });
            if (res.ok) setSuccess(true);
            else alert('حدث خطأ أثناء معالجة الطلب');
        } catch (err) { console.error(err); }
        finally { setLoading(false); }
    };

    // ─── Success Screen ───
    if (success) {
        return (
            <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', direction: 'rtl', background: 'var(--bg-color)', padding: '20px' }}>
                <div className="glass-card animate-fade-in" style={{ textAlign: 'center', maxWidth: '500px', width: '100%', padding: '50px 40px' }}>
                    <div style={{ fontSize: '5rem', marginBottom: '20px' }}>🎉</div>
                    <h2 style={{ color: themeColor, marginBottom: '15px', fontSize: '1.8rem' }}>تم استقبال طلبك بنجاح!</h2>
                    <p style={{ color: 'var(--text-secondary)', marginBottom: '30px', fontSize: '1.1rem', lineHeight: 1.8 }}>
                        شكراً لك <strong>{name}</strong>! سنتواصل معك قريباً على الرقم <strong dir="ltr">{phone}</strong> لتأكيد الطلب وتنسيق التوصيل.
                    </p>
                    <div style={{ background: 'rgba(16, 185, 129, 0.1)', padding: '15px', borderRadius: '12px', marginBottom: '25px' }}>
                        <p style={{ margin: 0, color: '#10b981', fontWeight: 'bold' }}>المبلغ المطلوب عند الاستلام: {(actualPrice * quantity).toFixed(2)} ر.س</p>
                    </div>
                    <button onClick={() => router.push('/')} className="btn" style={{ background: themeColor, color: '#fff', width: '100%', padding: '14px' }}>
                        العودة للمتجر
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div style={{ minHeight: '100vh', direction: 'rtl', background: 'var(--bg-color)', fontFamily: 'var(--font-ar)' }}>

            {/* ─── Top Urgency Banner ─── */}
            {(landing.urgencyText || (displayPrice && displayPrice > actualPrice)) && (
                <div style={{ background: `linear-gradient(135deg, ${themeColor}, ${themeColor}dd)`, color: '#fff', textAlign: 'center', padding: '12px 20px', fontSize: '1rem', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 4px 15px rgba(0,0,0,0.2)' }} onClick={scrollToForm}>
                    {landing.urgencyText || `🔥 عرض حصري! وفر ${(displayPrice - actualPrice).toFixed(0)} ر.س - لفترة محدودة`}
                </div>
            )}

            {/* ─── Fake Purchase Notification ─── */}
            {notification && (
                <div style={{
                    position: 'fixed', bottom: '20px', right: '20px', zIndex: 9999,
                    background: 'var(--surface-color)', border: '1px solid var(--glass-border)',
                    borderRadius: '16px', padding: '16px 20px', maxWidth: '320px',
                    boxShadow: `0 8px 32px rgba(0,0,0,0.5), 0 0 0 1px ${themeColor}33`,
                    animation: 'slideInRight 0.5s ease', direction: 'rtl'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ width: '45px', height: '45px', borderRadius: '50%', background: `${themeColor}22`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem', flexShrink: 0 }}>🛒</div>
                        <div>
                            <p style={{ margin: 0, fontSize: '0.95rem', fontWeight: 'bold', color: '#fff' }}>{notification.name} من {notification.city}</p>
                            <p style={{ margin: '4px 0 0 0', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>قام بشراء هذا المنتج منذ {notification.time} دقيقة</p>
                        </div>
                    </div>
                </div>
            )}

            <main className="container" style={{ paddingTop: '30px', paddingBottom: '80px', maxWidth: '1100px' }}>
                <div className="landing-grid" style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.15fr) minmax(0, 0.85fr)', gap: '30px', alignItems: 'start' }}>

                    {/* ─── LEFT PANE (Media -> Viewers -> Timer -> Stock -> Testimonials) ─── */}
                    <div className="left-pane animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

                        {/* 1. Media (Image/Video) */}
                        <div className="glass-card" style={{ padding: 0, overflow: 'hidden', borderRadius: '24px', border: `1px solid ${themeColor}33`, position: 'relative', boxShadow: `0 10px 40px rgba(0,0,0,0.2)` }}>
                            {landing.videoUrl ? (
                                <div style={{ position: 'relative', paddingBottom: '100%', height: 0 }}>
                                    <iframe src={landing.videoUrl.replace('watch?v=', 'embed/')} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 'none' }} allowFullScreen></iframe>
                                </div>
                            ) : (
                                <div style={{ position: 'relative', width: '100%', paddingTop: '100%' }}>
                                    <img src={product.image} alt={product.title} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                                </div>
                            )}
                        </div>

                        {/* 2. Live Viewers Count */}
                        {landing.showViewers && (
                            <div style={{
                                width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px',
                                background: 'rgba(255,255,255,0.03)', padding: '16px 20px', borderRadius: '16px',
                                border: '1px solid var(--glass-border)', fontSize: '1.1rem'
                            }}>
                                <span style={{ width: '14px', height: '14px', borderRadius: '50%', background: '#ef4444', display: 'inline-block', animation: 'pulse 1.5s infinite', boxShadow: '0 0 12px #ef4444' }}></span>
                                <span>يوجد الآن </span>
                                <span style={{ fontWeight: '900', color: themeColor, fontSize: '1.6rem' }}>{viewers}</span>
                                <span> زائر يشاهدون هذا العرض 👁️</span>
                            </div>
                        )}

                        {/* 3. Countdown Timer */}
                        {landing.offerEndsAt && !timerExpired && (
                            <div style={{
                                background: `linear-gradient(135deg, rgba(15,15,15,0.9), rgba(247,37,133,0.08))`,
                                padding: '24px', borderRadius: '20px', textAlign: 'center',
                                border: `1px solid ${themeColor}55`, boxShadow: `0 15px 35px ${themeColor}15`
                            }}>
                                <h3 style={{ color: '#fff', marginBottom: '20px', fontSize: '1.3rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                                    ⏳ <span style={{ color: themeColor }}>ينتهي العرض خلال</span>
                                </h3>
                                <div style={{ display: 'flex', justifyContent: 'center', gap: '15px', direction: 'ltr' }}>
                                    {[
                                        { val: timeLeft.days, label: 'أيام' },
                                        { val: timeLeft.hours, label: 'ساعات' },
                                        { val: timeLeft.minutes, label: 'دقائق' },
                                        { val: timeLeft.seconds, label: 'ثواني' },
                                    ].map((t, i) => (
                                        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                            <div style={{
                                                background: '#000', padding: '16px', borderRadius: '16px',
                                                minWidth: '70px', border: '1px solid rgba(255,255,255,0.1)',
                                                boxShadow: 'inset 0 4px 15px rgba(0,0,0,0.5), 0 4px 10px rgba(0,0,0,0.2)'
                                            }}>
                                                <div style={{ fontSize: '2rem', fontWeight: '900', lineHeight: 1, color: '#fff' }}>{String(t.val).padStart(2, '0')}</div>
                                                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '8px', fontWeight: 'bold' }}>{t.label}</div>
                                            </div>
                                            {i < 3 && <span style={{ color: themeColor, fontSize: '1.8rem', fontWeight: 'bold', animation: 'pulse 1s infinite' }}>:</span>}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Stock Warning */}
                        {landing.showStock && (
                            <div className="animate-pulse-slow" style={{
                                background: 'rgba(239, 68, 68, 0.08)', border: '1px dashed rgba(239, 68, 68, 0.5)',
                                padding: '16px 20px', borderRadius: '16px',
                                display: 'flex', alignItems: 'center', gap: '16px'
                            }}>
                                <div style={{ fontSize: '2.5rem' }}>🔥</div>
                                <div>
                                    <h4 style={{ color: '#ef4444', margin: '0 0 6px 0', fontSize: '1.15rem' }}>سارع قبل نفاد الكمية!</h4>
                                    <div style={{ color: 'var(--text-secondary)', fontSize: '1.05rem' }}>
                                        لم يتبق سوى <strong style={{ color: '#fff', fontSize: '1.3rem', padding: '0 4px' }}>{landing.fakeStock || 7}</strong> قطع فقط بسعر العرض.
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Testimonials */}
                        {testimonialsContent && (
                            <div className="glass-card" style={{ padding: '25px', borderRadius: '20px' }}>
                                <h3 style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '1.25rem' }}>💬 <span>آراء عملائنا السعداء</span></h3>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                    {testimonialsContent}
                                </div>
                            </div>
                        )}

                    </div>

                    {/* ─── RIGHT PANE (Product Info -> Guarantee -> Form -> Features) ─── */}
                    <div className="right-pane" style={{ display: 'flex', flexDirection: 'column', gap: '20px', position: 'sticky', top: '20px' }}>

                        {/* 4. Product Info (Title & Price) */}
                        <div className="glass-card animate-fade-in" style={{ padding: '30px', borderRadius: '20px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px', flexWrap: 'wrap' }}>
                                <span style={{ background: `${themeColor}22`, color: themeColor, padding: '6px 14px', borderRadius: '8px', fontSize: '0.9rem', fontWeight: 'bold' }}>حصري 🔥</span>
                                {landing.showSoldCount && <span style={{ color: '#fbbf24', fontSize: '0.95rem', fontWeight: 'bold', background: 'rgba(251, 191, 36, 0.1)', padding: '6px 14px', borderRadius: '8px' }}>⭐⭐⭐⭐⭐ 4.9 ({landing.fakeSoldCount || 143}+ تقييم)</span>}
                            </div>

                            <h1 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.4rem)', fontWeight: '900', lineHeight: 1.3, marginBottom: '15px' }}>
                                {landing.heroTitle || product.title}
                            </h1>

                            {(landing.heroSubtitle || product.description) && (
                                <p style={{ fontSize: '1.15rem', color: 'var(--text-secondary)', lineHeight: 1.8, margin: '0 0 25px 0' }}>
                                    {landing.heroSubtitle || product.description}
                                </p>
                            )}

                            {/* Price Block */}
                            <div style={{
                                background: 'rgba(255,255,255,0.03)', border: '1px solid var(--glass-border)',
                                borderRadius: '18px', padding: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '20px'
                            }}>
                                <div>
                                    <div style={{ color: 'var(--text-secondary)', fontSize: '1rem', marginBottom: '6px' }}>سعر العرض المميز:</div>
                                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                                        <h2 style={{ fontSize: '3rem', margin: 0, fontWeight: '900', color: themeColor }}>{actualPrice}</h2>
                                        <span style={{ fontSize: '1.4rem', color: 'var(--text-secondary)', fontWeight: 'bold' }}>ر.س</span>
                                    </div>
                                </div>
                                {displayPrice && displayPrice > actualPrice && (
                                    <div style={{ textAlign: 'left', display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                                        <div style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', textDecoration: 'line-through', marginBottom: '8px' }}>{displayPrice} ر.س</div>
                                        <div style={{ background: '#ef4444', color: '#fff', padding: '8px 16px', borderRadius: '10px', fontSize: '1rem', fontWeight: '900', boxShadow: '0 4px 15px rgba(239,68,68,0.3)' }}>
                                            وفر {Math.round(((displayPrice - actualPrice) / displayPrice) * 100)}%
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Guarantee Badge */}
                        {landing.guaranteeText && (
                            <div className="glass-card" style={{
                                background: 'rgba(16, 185, 129, 0.05)', border: '1px solid rgba(16,185,129,0.2)',
                                padding: '20px', borderRadius: '20px',
                                display: 'flex', alignItems: 'center', gap: '20px'
                            }}>
                                <span style={{ fontSize: '2.5rem', filter: 'drop-shadow(0 4px 8px rgba(16,185,129,0.4))' }}>🛡️</span>
                                <div>
                                    <div style={{ fontWeight: '900', color: '#10b981', marginBottom: '6px', fontSize: '1.2rem' }}>ضمان ذهبي</div>
                                    <div style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', lineHeight: 1.6 }}>{landing.guaranteeText}</div>
                                </div>
                            </div>
                        )}

                        {/* 5. Order Form */}
                        <div ref={formRef} className="glass-card" style={{ padding: '30px', borderRadius: '20px', border: `2px solid ${themeColor}66`, boxShadow: `0 0 40px ${themeColor}15` }}>
                            <h3 style={{ textAlign: 'center', marginBottom: '25px', fontSize: '1.6rem', fontWeight: '900' }}>🛒 أكمل بياناتك للطلب الآن</h3>
                            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

                                {/* Quantity selector */}
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(0,0,0,0.2)', padding: '16px 24px', borderRadius: '16px', border: '1px solid var(--glass-border)' }}>
                                    <span style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>الكمية المطلوبة:</span>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                                        <button type="button" onClick={() => setQuantity(Math.max(1, quantity - 1))} className="btn btn-outline" style={{ padding: '6px 18px', fontSize: '1.6rem', borderRadius: '10px' }}>-</button>
                                        <span style={{ fontSize: '1.6rem', fontWeight: '900', minWidth: '40px', textAlign: 'center' }}>{quantity}</span>
                                        <button type="button" onClick={() => setQuantity(quantity + 1)} className="btn btn-outline" style={{ padding: '6px 18px', fontSize: '1.6rem', borderRadius: '10px' }}>+</button>
                                    </div>
                                </div>

                                <div>
                                    <input type="text" required className="form-input" placeholder="الاسم الكريم بالكامل *" value={name} onChange={e => setName(e.target.value)} style={{ padding: '20px', fontSize: '1.15rem', borderRadius: '16px' }} />
                                </div>
                                <div>
                                    <input type="tel" required className="form-input" placeholder="رقم الجوال للتواصل (مثال: 05XXXXXXXX) *" value={phone} onChange={e => setPhone(e.target.value)} dir="ltr" style={{ textAlign: 'right', padding: '20px', fontSize: '1.15rem', borderRadius: '16px' }} />
                                </div>
                                <div>
                                    <textarea required className="form-input" placeholder="العنوان بالتفصيل (المدينة، الحي، الشارع...) *" rows="3" value={address} onChange={e => setAddress(e.target.value)} style={{ padding: '20px', fontSize: '1.15rem', borderRadius: '16px', resize: 'none' }}></textarea>
                                </div>

                                <button type="submit" disabled={loading} className="btn landing-cta-btn" style={{
                                    background: `linear-gradient(135deg, ${themeColor}, ${themeColor}dd)`,
                                    color: '#fff', width: '100%', fontSize: '1.5rem', padding: '22px',
                                    fontWeight: '900', borderRadius: '16px',
                                    textShadow: '0 2px 4px rgba(0,0,0,0.3)',
                                    boxShadow: `0 10px 40px ${themeColor}77, inset 0 2px 0 rgba(255,255,255,0.2)`,
                                    animation: 'ctaPulse 2s infinite',
                                    transition: 'all 0.3s ease',
                                    marginTop: '10px'
                                }}>
                                    {loading ? '⏳ جاري إرسال الطلب بسرعة...' : (landing.ctaText || '🛒 إتمام الطلب والدفع عند الاستلام')}
                                </button>

                                <div style={{ display: 'flex', justifyContent: 'center', gap: '25px', flexWrap: 'wrap', opacity: 0.9, marginTop: '10px', fontSize: '0.95rem', fontWeight: 'bold' }}>
                                    <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>🚚 توصيل سريع</span>
                                    <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>🔒 دفع آمن</span>
                                    <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>↩️ استرجاع سهل</span>
                                </div>
                            </form>
                        </div>

                        {/* 6. Product Features */}
                        {featuresContent && (
                            <div className="glass-card" style={{ padding: '30px', borderRadius: '20px' }}>
                                <h3 style={{ marginBottom: '25px', fontSize: '1.3rem', display: 'flex', alignItems: 'center', gap: '10px' }}>✨ <span>لماذا هذا المنتج هو الأفضل؟</span></h3>
                                {featuresContent}
                            </div>
                        )}
                    </div>
                </div>
            </main>

            {/* ─── Styles ─── */}
            <style>{`
                @keyframes ctaPulse {
                    0%, 100% { transform: scale(1); }
                    50% { transform: scale(1.02); }
                }
                @keyframes slideInRight {
                    from { opacity: 0; transform: translateX(40px); }
                    to { opacity: 1; transform: translateX(0); }
                }
                @keyframes pulse {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0.4; }
                }
                .animate-pulse-slow {
                    animation: pulse 3s infinite;
                }
                .landing-cta-btn:hover {
                    filter: brightness(1.15) !important;
                    transform: translateY(-2px);
                }
                .landing-cta-btn:disabled {
                    animation: none !important;
                    opacity: 0.7;
                    transform: none;
                }
                /* Mobile Styles to Ensure Media matches request (Left Pane stacks first by default) */
                @media (max-width: 900px) {
                    .landing-grid {
                        grid-template-columns: 1fr !important;
                        gap: 25px !important;
                    }
                    .right-pane {
                        position: relative !important;
                        top: 0 !important;
                    }
                }
            `}</style>
        </div>
    );
}
