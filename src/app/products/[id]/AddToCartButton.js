"use client";

import { useCart } from '../../../context/CartContext';

export default function AddToCartButton({ product }) {
    const { addToCart } = useCart();

    return (
        <button className="btn btn-primary" onClick={() => addToCart(product)} style={{ flex: 1, fontSize: '1.2rem', padding: '16px' }}>
            🛒 أضف إلى السلة
        </button>
    );
}
