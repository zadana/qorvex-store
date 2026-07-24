"use client";

import { useCart } from "../context/CartContext";
import { useRouter } from "next/navigation";

export default function CartSidebar() {
    const { isCartOpen, closeCart, cartItems, removeFromCart, updateQuantity, totalAmount } = useCart();
    const router = useRouter();

    if (!isCartOpen) return null;

    const handleCheckout = () => {
        closeCart();
        router.push('/checkout');
    };

    return (
        <>
            <div
                style={{
                    position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
                    backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1000,
                    backdropFilter: 'blur(5px)'
                }}
                onClick={closeCart}
            ></div>

            <div className="glass animate-slide-in" style={{
                position: 'fixed', top: 0, left: 0, width: '420px', maxWidth: '100vw', height: '100vh',
                zIndex: 1001, padding: '24px', display: 'flex', flexDirection: 'column',
                boxShadow: 'var(--glass-shadow)', borderRight: '1px solid var(--glass-border)'
            }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                    <h2 className="text-gradient" style={{ margin: 0 }}>🛒 عربة التسوق</h2>
                    <button onClick={closeCart} className="btn btn-outline" style={{ padding: '8px 16px' }}>إغلاق ✕</button>
                </div>

                <div style={{ flex: 1, overflowY: 'auto', paddingLeft: '4px' }}>
                    {cartItems.length === 0 ? (
                        <div style={{ textAlign: 'center', marginTop: '60px' }}>
                            <div style={{ fontSize: '4rem', marginBottom: '16px' }}>🛒</div>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>عربة التسوق فارغة</p>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '8px' }}>أضف منتجات من المتجر للبدء</p>
                        </div>
                    ) : (
                        cartItems.map((item) => (
                            <div key={item.id} className="glass-card" style={{ display: 'flex', gap: '16px', marginBottom: '16px', padding: '16px' }}>
                                <img src={item.image} alt={item.title} style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '10px', boxShadow: '0 4px 10px rgba(0,0,0,0.3)' }} />
                                <div style={{ flex: 1 }}>
                                    <h4 style={{ margin: '0 0 8px 0', fontSize: '1rem' }}>{item.title}</h4>
                                    <p style={{ color: 'var(--primary-color)', fontWeight: 'bold', margin: '0 0 10px 0' }}>{item.price} ر.س</p>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <button
                                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                style={{ width: '30px', height: '30px', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'var(--surface-color)', color: 'white', cursor: 'pointer', fontSize: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                            >−</button>
                                            <span style={{ fontWeight: '600', minWidth: '20px', textAlign: 'center' }}>{item.quantity}</span>
                                            <button
                                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                style={{ width: '30px', height: '30px', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'var(--surface-color)', color: 'white', cursor: 'pointer', fontSize: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                            >+</button>
                                        </div>
                                        <button onClick={() => removeFromCart(item.id)} style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: '#f87171', cursor: 'pointer', fontFamily: 'inherit', padding: '6px 12px', borderRadius: '8px', fontSize: '0.85rem' }}>حذف</button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {cartItems.length > 0 && (
                    <div style={{ padding: '20px 0', borderTop: '1px solid var(--glass-border)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.95rem', color: 'var(--text-secondary)' }}>
                            <span>عدد المنتجات:</span>
                            <span>{cartItems.reduce((a, i) => a + i.quantity, 0)} منتج</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', fontSize: '1.3rem', fontWeight: 'bold' }}>
                            <span>الإجمالي:</span>
                            <span className="text-gradient" style={{ fontSize: '1.5rem' }}>{totalAmount} ر.س</span>
                        </div>
                        <button
                            onClick={handleCheckout}
                            className="btn btn-primary"
                            style={{ width: '100%', fontSize: '1.1rem', padding: '16px' }}
                        >
                            إتمام الطلب 🔐
                        </button>
                    </div>
                )}
            </div>
        </>
    );
}
