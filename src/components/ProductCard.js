"use client";

import { useCart } from "../context/CartContext";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ProductCard({ id, title, price, image, rating }) {
    const { addToCart } = useCart();
    const router = useRouter();
    const [isHovered, setIsHovered] = useState(false);

    const handleAddToCart = (e) => {
        e.stopPropagation();
        addToCart({ id, title, price, image });
    };

    const handleCardClick = () => {
        router.push(`/products/${id}`);
    };

    return (
        <div 
            onClick={handleCardClick}
            className="glass-card product-card-modern" 
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            style={{ 
                padding: '0', 
                overflow: 'hidden', 
                borderRadius: '24px',
                display: 'flex',
                flexDirection: 'column',
                position: 'relative',
                border: isHovered ? '1px solid rgba(247, 37, 133, 0.4)' : '1px solid var(--glass-border)',
                boxShadow: isHovered ? '0 20px 40px rgba(0,0,0,0.4), 0 0 20px rgba(247, 37, 133, 0.15)' : 'var(--glass-shadow)',
                transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                transform: isHovered ? 'translateY(-8px)' : 'translateY(0)',
                cursor: 'pointer'
            }}
        >
            {/* Floating Rating Badge */}
            <div style={{
                position: 'absolute',
                top: '16px',
                right: '16px',
                background: 'rgba(0, 0, 0, 0.65)',
                backdropFilter: 'blur(10px)',
                padding: '6px 12px',
                borderRadius: '30px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                zIndex: 2,
                border: '1px solid rgba(255, 255, 255, 0.1)',
                boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
            }}>
                <span style={{ color: '#fbbf24', fontSize: '0.9rem', lineHeight: 1 }}>★</span>
                <span style={{ color: '#fff', fontSize: '0.9rem', fontWeight: 'bold' }}>{rating}</span>
            </div>

            {/* Image Section */}
            <div style={{ width: '100%', position: 'relative', overflow: 'hidden', paddingTop: '100%', backgroundColor: 'rgba(255,255,255,0.02)' }}>
                <img 
                    src={image} 
                    alt={title} 
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        transition: 'transform 0.7s cubic-bezier(0.165, 0.84, 0.44, 1)',
                        transform: isHovered ? 'scale(1.1)' : 'scale(1)'
                    }} 
                />
                
                {/* Dark gradient overlay for smooth transition to text */}
                <div style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    width: '100%',
                    height: '60%',
                    background: 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0) 100%)',
                    pointerEvents: 'none'
                }}></div>
            </div>

            {/* Content Section */}
            <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '12px', flexGrow: 1, position: 'relative', marginTop: '-40px', zIndex: 3 }}>
                <h3 style={{ 
                    fontSize: '1.25rem', 
                    fontWeight: '700', 
                    lineHeight: '1.4', 
                    margin: 0,
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    display: '-webkit-box',
                    overflow: 'hidden',
                    color: '#fff',
                    textShadow: '0 2px 8px rgba(0,0,0,0.8)'
                }}>
                    {title}
                </h3>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto', paddingTop: '8px' }}>
                    <span style={{ 
                        fontSize: '1.5rem', 
                        fontWeight: '800', 
                        color: 'var(--primary-color)',
                        letterSpacing: '0.5px',
                        textShadow: '0 2px 10px rgba(247, 37, 133, 0.3)'
                    }}>
                        {price} <span style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.7)', fontWeight: 'normal' }}>ر.س</span>
                    </span>
                </div>
            </div>

            {/* Add to Cart Button */}
            <div style={{ padding: '0 24px 24px 24px', zIndex: 3 }}>
                <button 
                    onClick={handleAddToCart} 
                    className="btn"
                    style={{ 
                        width: '100%', 
                        padding: '12px', 
                        fontSize: '1rem',
                        fontWeight: '600',
                        borderRadius: '16px',
                        background: isHovered ? 'var(--primary-color)' : 'rgba(255,255,255,0.05)',
                        color: isHovered ? '#fff' : 'var(--text-primary)',
                        border: isHovered ? 'none' : '1px solid rgba(255,255,255,0.1)',
                        transition: 'all 0.3s ease',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px'
                    }}
                >
                    <span style={{ fontSize: '1.2rem', transform: isHovered ? 'scale(1.2)' : 'scale(1)', transition: 'transform 0.3s ease' }}>🛒</span> 
                    أضف للسلة
                </button>
            </div>
        </div>
    );
}
