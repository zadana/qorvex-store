"use client";

import { useState } from 'react';
import { useCart } from '../../context/CartContext';
import Link from 'next/link';

export default function CheckoutPage() {
    const { cartItems, totalAmount, clearCart, isLoaded } = useCart();
    const [formData, setFormData] = useState({ name: '', address: '', phone: '' });
    const paymentMethod = 'cod';
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [orderId, setOrderId] = useState(null);
    const [finalPaidAmount, setFinalPaidAmount] = useState(0);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!isLoaded || cartItems.length === 0) return alert("سلة التسوق فارغة");

        setLoading(true);
        try {
            const storedUser = localStorage.getItem('user');
            const userId = storedUser ? JSON.parse(storedUser).id : null;

            const currentTotal = totalAmount; // Save it before clearing cart

            const res = await fetch('/api/orders', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId,
                    customerData: formData,
                    paymentMethod,
                    items: cartItems.map(item => ({ id: item.id, quantity: item.quantity }))
                })
            });

            if (res.ok) {
                const order = await res.json();
                setFinalPaidAmount(currentTotal);
                setSuccess(true);
                setOrderId(order.id);
                clearCart();
            } else {
                alert("حدث خطأ أثناء معالجة الطلب.");
            }
        } catch (error) {
            console.error(error);
            alert("تعذر الاتصال بالخادم.");
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <>
                <main className="container animate-fade-in" style={{ paddingTop: '150px', textAlign: 'center', minHeight: '80vh', direction: 'rtl' }}>
                    <div className="glass-card" style={{ maxWidth: '600px', margin: '0 auto', padding: '60px' }}>
                        <div style={{ fontSize: '4rem', marginBottom: '20px' }}>✅</div>
                        <h1 className="text-gradient" style={{ fontSize: '2.5rem' }}>تم تأكيد طلبك بنجاح!</h1>
                        <p style={{ fontSize: '1.2rem', marginTop: '20px' }}>رقم الطلب الخاص بك هو: <strong style={{ color: 'var(--primary-color)', fontSize: '1.5rem', display: 'block', margin: '14px 0' }}>#{orderId?.slice(-6).toUpperCase()}</strong></p>

                        <div style={{ background: 'var(--surface-color)', padding: '24px', borderRadius: '16px', marginTop: '30px', border: '1px solid var(--glass-border)' }}>
                            <p style={{ color: 'var(--text-secondary)' }}>سنتواصل معك قريباً لتأكيد موعد التوصيل عبر الرقم <strong style={{ color: 'white' }}>{formData.phone}</strong></p>
                            <div style={{ marginTop: '16px', background: 'rgba(16,185,129,0.1)', padding: '12px', border: '1px solid rgba(16,185,129,0.3)', borderRadius: '12px' }}>
                                <p style={{ color: '#34d399', margin: 0, fontWeight: '600' }}>يرجى تحضير المبلغ ({finalPaidAmount} ر.س) نقدًا للمندوب عند الاستلام 💵</p>
                            </div>
                        </div>

                        <Link href="/" className="btn btn-primary" style={{ marginTop: '40px', padding: '14px 36px', fontSize: '1.1rem' }}>العودة للتسوق</Link>
                    </div>
                </main>
            </>
        );
    }

    return (
        <>
            <main className="container animate-fade-in" style={{ paddingTop: '120px', minHeight: '80vh', direction: 'rtl', paddingBottom: '60px' }}>
                <h1 className="text-gradient" style={{ marginBottom: '40px' }}>🔐 إتمام الطلب والدفع الآمن</h1>

                <div className="grid grid-cols-2" style={{ gap: '40px' }}>
                    <div className="glass-card" style={{ height: 'fit-content' }}>
                        <h3 style={{ marginBottom: '24px', borderBottom: '1px solid var(--glass-border)', paddingBottom: '16px' }}>📍 بيانات الشحن والتوصيل</h3>

                        {!isLoaded ? (
                            <div style={{ textAlign: 'center', padding: '40px 20px' }}>
                                <div className="skeleton" style={{ height: '200px', borderRadius: '16px' }}></div>
                            </div>
                        ) : cartItems.length === 0 ? (
                            <div style={{ textAlign: 'center', padding: '40px 20px' }}>
                                <div style={{ fontSize: '3rem', marginBottom: '16px' }}>🛒</div>
                                <h3 style={{ color: 'var(--text-secondary)' }}>لا يمكنك إتمام الطلب</h3>
                                <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>يجب أن تحتوي سلة التسوق على منتج واحد على الأقل لتتمكن من تعبئة البيانات.</p>
                                <Link href="/" className="btn btn-primary">تصفح المنتجات الآن</Link>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                <div>
                                    <label className="form-label">الاسم الكامل</label>
                                    <input
                                        type="text" required placeholder="أدخل اسمك الثلاثي"
                                        value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })}
                                        className="form-input"
                                    />
                                </div>
                                <div>
                                    <label className="form-label">رقم الهاتف (للتواصل)</label>
                                    <input
                                        type="tel" required placeholder="05XXXXXXXX"
                                        value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                        className="form-input" style={{ direction: 'ltr', textAlign: 'right' }}
                                    />
                                </div>
                                <div>
                                    <label className="form-label">العنوان التفصيلي</label>
                                    <textarea
                                        required placeholder="المدينة، الحي، الشارع، رقم المبنى..."
                                        value={formData.address} onChange={e => setFormData({ ...formData, address: e.target.value })}
                                        className="form-input" style={{ minHeight: '100px', resize: 'vertical' }}
                                    ></textarea>
                                </div>

                                <h3 style={{ marginTop: '10px', marginBottom: '10px', borderBottom: '1px solid var(--glass-border)', paddingBottom: '16px' }}>💳 طريقة الدفع</h3>

                                <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
                                    <div style={{ flex: '1', display: 'flex', alignItems: 'center', gap: '12px', background: 'rgba(247,37,133,0.1)', padding: '16px', borderRadius: '12px', border: '1px solid var(--primary-color)' }}>
                                        <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: 'var(--primary-color)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'white' }}></div>
                                        </div>
                                        <span style={{ fontWeight: '600' }}>الدفع نقدًا عند الاستلام 💵</span>
                                    </div>
                                </div>

                                <button type="submit" className="btn btn-primary" style={{ marginTop: '20px', padding: '18px', fontSize: '1.2rem', fontWeight: 'bold', letterSpacing: '1px' }} disabled={loading}>
                                    {loading ? "جاري معالجة الطلب..." : `تأكيد الطلب (${totalAmount} ر.س)`}
                                </button>
                            </form>
                        )}
                    </div>

                    <div className="glass-card" style={{ height: 'fit-content', position: 'sticky', top: '100px' }}>
                        <h3 style={{ marginBottom: '24px', borderBottom: '1px solid var(--glass-border)', paddingBottom: '16px' }}>🛍️ ملخص السلة ({cartItems.length} منتج)</h3>

                        {cartItems.length === 0 ? (
                            <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-secondary)' }}>عربة التسوق فارغة تماماً.</div>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxHeight: '400px', overflowY: 'auto', paddingRight: '10px' }}>
                                {cartItems.map(item => (
                                    <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px outset rgba(255,255,255,0.05)', paddingBottom: '16px', background: 'rgba(0,0,0,0.1)', padding: '12px', borderRadius: '12px' }}>
                                        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                                            <img src={item.image} alt={item.title} style={{ width: '65px', height: '65px', objectFit: 'cover', borderRadius: '10px', boxShadow: '0 4px 10px rgba(0,0,0,0.3)' }} />
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                                <span style={{ fontWeight: '600' }}>{item.title}</span>
                                                <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>الكمية: {item.quantity} × {item.price} ر.س</span>
                                            </div>
                                        </div>
                                        <strong style={{ color: 'var(--primary-color)', alignSelf: 'center', fontSize: '1.1rem' }}>{item.price * item.quantity} ر.س</strong>
                                    </div>
                                ))}
                            </div>
                        )}
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '24px', paddingTop: '24px', borderTop: '2px dashed var(--glass-border)', fontSize: '1.4rem', fontWeight: 'bold' }}>
                            <span>الإجمالي الكلي:</span>
                            <span className="text-gradient" style={{ fontSize: '1.8rem' }}>{totalAmount} ر.س</span>
                        </div>
                    </div>
                </div>
            </main>
        </>
    );
}
