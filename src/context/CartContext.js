"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const CartContext = createContext();

export function CartProvider({ children }) {
    const [cartItems, setCartItems] = useState([]);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);

    // Load cart from localStorage on mount
    useEffect(() => {
        try {
            const savedCart = localStorage.getItem('elegance_cart');
            if (savedCart) {
                const parsed = JSON.parse(savedCart);
                if (Array.isArray(parsed)) {
                    setCartItems(parsed);
                }
            }
        } catch (e) {
            console.error('Failed to load cart from localStorage:', e);
        }
        setIsLoaded(true);
    }, []);

    // Save cart to localStorage whenever it changes (but only after initial load)
    useEffect(() => {
        if (isLoaded) {
            try {
                localStorage.setItem('elegance_cart', JSON.stringify(cartItems));
            } catch (e) {
                console.error('Failed to save cart to localStorage:', e);
            }
        }
    }, [cartItems, isLoaded]);

    const addToCart = useCallback((product) => {
        setCartItems(prev => {
            const existing = prev.find(item => item.id === product.id);
            if (existing) {
                return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
            }
            return [...prev, { ...product, quantity: 1 }];
        });
        setIsCartOpen(true);
    }, []);

    const removeFromCart = useCallback((id) => {
        setCartItems(prev => prev.filter(item => item.id !== id));
    }, []);

    const updateQuantity = useCallback((id, quantity) => {
        if (quantity <= 0) {
            setCartItems(prev => prev.filter(item => item.id !== id));
        } else {
            setCartItems(prev => prev.map(item => item.id === id ? { ...item, quantity } : item));
        }
    }, []);

    const openCart = useCallback(() => setIsCartOpen(true), []);
    const closeCart = useCallback(() => setIsCartOpen(false), []);
    const clearCart = useCallback(() => {
        setCartItems([]);
        localStorage.removeItem('elegance_cart');
    }, []);

    const totalAmount = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

    return (
        <CartContext.Provider value={{
            cartItems, addToCart, removeFromCart, updateQuantity, clearCart,
            isCartOpen, openCart, closeCart, totalAmount, cartCount, isLoaded
        }}>
            {children}
        </CartContext.Provider>
    );
}

export const useCart = () => useContext(CartContext);
