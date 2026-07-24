"use client";

import { useCart } from "../../context/CartContext";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function CartPage() {
    const { cartItems, removeFromCart, updateQuantity, totalAmount } = useCart();
    const router = useRouter();

    return (
        <div className="container" style={{ paddingTop: '120px', paddingBottom: '60px', minHeight: '80vh' }}>
            <h1 className="text-gradient" style={{ fontSize: '2rem', marginBottom: '40px', textAlign: 'center' }}>🛒 سلة المشتريات</h1>

            {cartItems.length === 0 ? (
                <div style={{ textAlign: 'center', marginTop: '60px' }}>
                    <div style={{ fontSize: '5rem', marginBottom: '24px' }}>🛒</div>
                    <h2 style={{ color: 'var(--text-secondary)', fontSize: '1.3rem', marginBottom: '16px' }}>سلة التسوق فارغة</h2>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', marginBottom: '30px' }}>أضف منتجات من المتجر للبدء في التسوق</p>
                    <Link href="/products" className="btn btn-primary" style={{ padding: '14px 36px', fontSize: '1.05rem' }}>
                        تصفح المنتجات
                    </Link>
                </div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: '40px', alignItems: 'start' }}>
                    {/* Cart Items */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        {cartItems.map((item) => (
                            <div key={item.id} className="glass-card" style={{ display: 'flex', gap: '20px', padding: '20px', alignItems: 'center' }}>
                                <img
                                    src={item.image}
                                    alt={item.title}
                                    style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '12px', boxShadow: '0 4px 10px rgba(0,0,0,0.3)' }}
                                />
                                <div style={{ flex: 1 }}>
                                    <h3 style={{ margin: '0 0 8px 0', fontSize: '1.1rem' }}>{item.title}</h3>
                                    <p style={{ color: 'var(--primary-color)', fontWeight: 'bold', margin: '0 0 12px 0', fontSize: '1.1rem' }}>{item.price} ر.س</p>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                        <button
                                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                            style={{ width: '34px', height: '34px', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'var(--surface-color)', color: 'white', cursor: 'pointer', fontSize: '1.1rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                        >−</button>
                                        <span style={{ fontWeight: '600', minWidth: '24px', textAlign: 'center', fontSize: '1.05rem' }}>{item.quantity}</span>
                                        <button
                                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                            style={{ width: '34px', height: '34px', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'var(--surface-color)', color: 'white', cursor: 'pointer', fontSize: '1.1rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                        >+</button>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '12px' }}>
                                    <span style={{ fontWeight: '700', fontSize: '1.15rem', color: 'var(--text-primary)' }}>
                                        {(item.price * item.quantity).toFixed(2)} ر.س
                                    </span>
                                    <button
                                        onClick={() => removeFromCart(item.id)}
                                        style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: '#f87171', cursor: 'pointer', fontFamily: 'inherit', padding: '8px 16px', borderRadius: '8px', fontSize: '0.9rem', transition: 'var(--transition)' }}
                                    >
                                        حذف
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Summary */}
                    <div className="glass-card" style={{ padding: '28px', position: 'sticky', top: '100px' }}>
                        <h3 style={{ margin: '0 0 24px 0', fontSize: '1.2rem' }}>ملخص الطلب</h3>

                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', color: 'var(--text-secondary)' }}>
                            <span>عدد المنتجات</span>
                            <span>{cartItems.reduce((a, i) => a + i.quantity, 0)} منتج</span>
                        </div>

                        <div style={{ borderTop: '1px solid var(--glass-border)', marginTop: '16px', paddingTop: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontWeight: '700', fontSize: '1.15rem' }}>الإجمالي</span>
                            <span className="text-gradient" style={{ fontSize: '1.5rem', fontWeight: '800' }}>{totalAmount} ر.س</span>
                        </div>

                        <button
                            onClick={() => router.push('/checkout')}
                            className="btn btn-primary"
                            style={{ width: '100%', fontSize: '1.1rem', padding: '16px', marginTop: '24px' }}
                        >
                            إتمام الطلب 🔐
                        </button>

                        <Link
                            href="/products"
                            style={{ display: 'block', textAlign: 'center', marginTop: '16px', color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.95rem' }}
                        >
                            متابعة التسوق ←
                        </Link>
                    </div>
                </div>
            )}

            <style>{`
                @media (max-width: 768px) {
                    .container > div[style*="grid-template-columns"] {
                        grid-template-columns: 1fr !important;
                    }
                }
            `}</style>
        </div>
    );
}
