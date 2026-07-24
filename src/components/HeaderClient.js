"use client";

import { useCart } from "../context/CartContext";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function HeaderClient({ menus = [{ title: "الرئيسية", url: "/" }, { title: "المنتجات", url: "/products" }], storeName = "QORVEX" }) {
    const { cartItems, openCart } = useCart();
    const [user, setUser] = useState(null);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            try {
                setUser(JSON.parse(storedUser));
            } catch (e) {
                console.error(e);
            }
        }
    }, []);

    const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

    return (
        <>
            <header className="glass main-header" style={{ padding: '0', borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                <div className="container nav-content" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '80px' }}>

                    {/* Logo Area */}
                    <div className="header-logo-section" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <button className="mobile-menu-btn" onClick={() => setIsMenuOpen(!isMenuOpen)} aria-label="Menu">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
                        </button>
                        <Link href="/" className="logo text-gradient" style={{ textDecoration: 'none', fontSize: '1.8rem', fontWeight: '800', letterSpacing: '1px' }}>
                            {storeName}
                        </Link>
                    </div>

                    {/* Desktop Center Menu & Search */}
                    <nav className={`header-nav ${isMenuOpen ? 'open' : ''}`}>
                        <ul className="nav-links">
                            {menus.map((m, i) => (
                                <li key={i}>
                                    <Link href={m.url || "/"}>{m.title}</Link>
                                </li>
                            ))}
                        </ul>

                        <form className="header-search-form" action="/search" method="GET">
                            <div className="search-input-wrapper">
                                <svg className="search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                                <input
                                    name="q" type="text" placeholder="ابحث عن منتج..."
                                    className="search-input"
                                />
                            </div>
                        </form>
                    </nav>

                    {/* Actions Area */}
                    <div className="header-actions">
                        {/* Account */}
                        {user ? (
                            <Link href="/dashboard" className="action-btn account-action" title={`حسابي (${user.name})`}>
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                                <span className="action-text">حسابي</span>
                            </Link>
                        ) : (
                            <Link href="/login" className="action-btn account-action">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path><polyline points="10 17 15 12 10 7"></polyline><line x1="15" y1="12" x2="3" y2="12"></line></svg>
                                <span className="action-text">دخول</span>
                            </Link>
                        )}

                        <div className="action-divider"></div>

                        {/* Cart */}
                        <button className="action-btn cart-action" onClick={openCart}>
                            <div className="cart-icon-wrapper">
                                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
                                {cartCount > 0 && (
                                    <span className="cart-badge">{cartCount}</span>
                                )}
                            </div>
                            <span className="action-text">السلة</span>
                        </button>
                    </div>
                </div>
            </header>

            <style>{`
            .main-header {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                width: 100%;
                z-index: 2000;
                background: rgba(11, 9, 10, 0.85) !important;
                backdrop-filter: blur(24px) saturate(180%);
                -webkit-backdrop-filter: blur(24px) saturate(180%);
                transition: var(--transition);
            }
            .mobile-menu-btn {
                display: none;
                background: none;
                border: none;
                color: var(--text-primary);
                cursor: pointer;
                padding: 4px;
                border-radius: 8px;
                transition: var(--transition);
            }
            .mobile-menu-btn:hover {
                background: rgba(255,255,255,0.1);
            }
            
            .header-nav {
                flex: 1;
                display: flex;
                justify-content: center;
                gap: 40px;
                align-items: center;
                margin: 0 20px;
            }
            
            .nav-links {
                margin: 0;
                padding: 0;
                display: flex;
                gap: 32px;
                list-style: none;
                align-items: center;
            }
            
            .nav-links a {
                color: var(--text-primary);
                text-decoration: none;
                font-weight: 500;
                font-size: 1.05rem;
                opacity: 0.85;
                transition: var(--transition);
                position: relative;
                padding: 8px 0;
            }
            
            .nav-links a:hover {
                opacity: 1;
                color: var(--accent-color);
            }
            .nav-links a::after {
                content: '';
                position: absolute;
                bottom: 2px;
                right: 0;
                width: 0;
                height: 2px;
                background: var(--primary-color);
                transition: 0.3s ease-out;
                border-radius: 2px;
            }
            .nav-links a:hover::after {
                width: 100%;
            }

            .header-search-form {
                max-width: 300px;
                flex: 1;
            }
            
            .search-input-wrapper {
                position: relative;
                display: flex;
                align-items: center;
            }
            
            .search-icon {
                position: absolute;
                left: 16px;
                right: auto;
                color: var(--text-secondary);
                opacity: 0.7;
                pointer-events: none;
            }
            
            .search-input {
                width: 100%;
                padding: 10px 16px 10px 44px;
                border-radius: 24px;
                border: 1px solid rgba(255,255,255,0.15);
                background: rgba(255,255,255,0.06);
                color: white;
                font-size: 0.95rem;
                outline: none;
                transition: var(--transition);
            }
            
            .search-input:focus {
                border-color: var(--primary-color);
                background: rgba(255,255,255,0.1);
                box-shadow: 0 0 0 3px rgba(247, 37, 133, 0.15);
            }
            
            .search-input::placeholder {
                color: rgba(255,255,255,0.4);
            }
            
            .header-actions {
                display: flex;
                align-items: center;
                gap: 12px;
            }
            
            .action-divider {
                width: 1px;
                height: 24px;
                background: rgba(255,255,255,0.1);
                margin: 0 8px;
            }

            .action-btn {
                display: flex;
                align-items: center;
                gap: 10px;
                background: transparent;
                border: 1px solid transparent;
                color: var(--text-primary);
                font-family: inherit;
                cursor: pointer;
                padding: 8px 16px;
                border-radius: 24px;
                text-decoration: none;
                font-weight: 500;
                font-size: 0.95rem;
                transition: var(--transition);
            }
            
            .action-btn:hover {
                background: rgba(255,255,255,0.06);
            }

            .cart-action {
                background: rgba(247, 37, 133, 0.1);
                color: var(--primary-color);
                border: 1px solid rgba(247, 37, 133, 0.2);
            }
            .cart-action:hover {
                background: rgba(247, 37, 133, 0.15);
            }
            .cart-action svg {
                stroke: var(--primary-color);
            }

            .cart-icon-wrapper {
                position: relative;
                display: flex;
                align-items: center;
                justify-content: center;
            }

            .cart-badge {
                position: absolute;
                top: -8px;
                right: -8px;
                background: var(--primary-color);
                color: white;
                border-radius: 50%;
                min-width: 18px;
                height: 18px;
                padding: 0 4px;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 0.7rem;
                font-weight: 800;
                box-shadow: 0 2px 6px rgba(247, 37, 133, 0.5);
            }

            @media (max-width: 992px) {
                .header-nav {
                    display: none;
                    position: absolute;
                    top: 80px;
                    left: 0;
                    right: 0;
                    background: rgba(11, 9, 10, 0.98);
                    flex-direction: column;
                    padding: 20px;
                    border-bottom: 1px solid rgba(255,255,255,0.1);
                    margin: 0;
                    box-shadow: 0 10px 30px rgba(0,0,0,0.6);
                    z-index: 1999;
                }
                .header-nav.open {
                    display: flex;
                }
                .mobile-menu-btn {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .nav-links {
                    width: 100%;
                    flex-direction: column;
                    gap: 0;
                    text-align: right;
                }
                .nav-links li {
                    width: 100%;
                }
                .nav-links a {
                    display: block;
                    width: 100%;
                    padding: 12px 16px;
                    border-bottom: 1px solid rgba(255,255,255,0.05);
                    font-size: 1.1rem;
                }
                .header-search-form {
                    width: 100%;
                    max-width: 100%;
                    margin-top: 16px;
                }
                .action-text {
                    display: none;
                }
                .action-btn {
                    padding: 8px 12px;
                }
                .action-divider {
                    margin: 0 4px;
                }
            }
        `}</style>
        </>
    );
}
