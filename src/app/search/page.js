"use client";

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import ProductCard from '../../components/ProductCard';

function SearchContent() {
    const searchParams = useSearchParams();
    const q = searchParams.get('q') || '';
    const initialCategory = searchParams.get('category') || 'all';

    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [minPrice, setMinPrice] = useState(0);
    const [maxPrice, setMaxPrice] = useState(10000);
    const [selectedCategory, setSelectedCategory] = useState(initialCategory);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await fetch('/api/admin/categories');
                if (res.ok) {
                    setCategories(await res.json());
                }
            } catch (e) {
                console.error(e);
            }
        };
        fetchCategories();
    }, []);

    const fetchResults = async (searchQ, min, max, catId) => {
        setLoading(true);
        try {
            const res = await fetch(`/api/products/search?q=${searchQ}&minPrice=${min}&maxPrice=${max}&categoryId=${catId}`);
            if (res.ok) {
                setProducts(await res.json());
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchResults(q, minPrice, maxPrice, selectedCategory);
    }, [q]);

    const handleFilter = (e) => {
        e.preventDefault();
        fetchResults(q, minPrice, maxPrice, selectedCategory);
    };

    return (
        <>
            <main className="container" style={{ paddingTop: '120px', minHeight: '80vh', direction: 'rtl', paddingBottom: '60px' }}>
                <h1 className="text-gradient">نتائج البحث {q ? `عن "${q}"` : 'المتقدم'}</h1>

                <div style={{ display: 'flex', gap: '40px', marginTop: '40px', alignItems: 'flex-start' }}>
                    {/* Sidebar Filters */}
                    <div className="glass-card" style={{ width: '320px', position: 'sticky', top: '100px', border: '1px solid rgba(255,255,255,0.1)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px', borderBottom: '1px solid var(--glass-border)', paddingBottom: '12px' }}>
                            <div style={{ fontSize: '1.5rem' }}>🎛️</div>
                            <h3 style={{ margin: 0 }}>فلترة النتائج</h3>
                        </div>

                        <form onSubmit={handleFilter} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                            {/* Categories Filter */}
                            <div>
                                <label style={{ display: 'block', color: 'var(--text-secondary)', marginBottom: '12px', fontWeight: 'bold' }}>الأقسام</label>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '200px', overflowY: 'auto', paddingRight: '5px' }}>
                                    <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', padding: '8px', borderRadius: '8px', background: selectedCategory === 'all' ? 'rgba(247,37,133,0.1)' : 'transparent', transition: 'var(--transition)' }}>
                                        <input type="radio" name="category" value="all" checked={selectedCategory === 'all'} onChange={(e) => setSelectedCategory(e.target.value)} style={{ accentColor: 'var(--primary-color)' }} />
                                        <span>🌐 جميع الأقسام</span>
                                    </label>
                                    {categories.map(cat => (
                                        <label key={cat.id} style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', padding: '8px', borderRadius: '8px', background: selectedCategory === cat.id ? 'rgba(247,37,133,0.1)' : 'transparent', transition: 'var(--transition)' }}>
                                            <input type="radio" name="category" value={cat.id} checked={selectedCategory === cat.id} onChange={(e) => setSelectedCategory(e.target.value)} style={{ accentColor: 'var(--primary-color)' }} />
                                            <span>{cat.icon} {cat.name}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Price Filters */}
                            <div style={{ padding: '16px', background: 'var(--surface-color)', borderRadius: '12px', border: '1px solid var(--glass-border)' }}>
                                <label style={{ display: 'block', color: 'var(--text-secondary)', marginBottom: '16px', fontWeight: 'bold' }}>نطاق السعر</label>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <div style={{ flex: 1 }}>
                                        <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>الحد الأدنى</span>
                                        <input
                                            type="number" value={minPrice} onChange={e => setMinPrice(e.target.value)}
                                            dir="ltr" lang="en" min="0"
                                            style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'var(--glass-bg)', color: 'white', textAlign: 'center', fontWeight: 'bold', fontFamily: 'system-ui, sans-serif' }}
                                        />
                                    </div>
                                    <div style={{ color: 'var(--text-secondary)' }}>-</div>
                                    <div style={{ flex: 1 }}>
                                        <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>الحد الأقصى</span>
                                        <input
                                            type="number" value={maxPrice} onChange={e => setMaxPrice(e.target.value)}
                                            dir="ltr" lang="en" min="0"
                                            style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'var(--glass-bg)', color: 'white', textAlign: 'center', fontWeight: 'bold', fontFamily: 'system-ui, sans-serif' }}
                                        />
                                    </div>
                                </div>
                            </div>

                            <button type="submit" className="btn btn-primary" style={{ padding: '14px', fontSize: '1.1rem', fontWeight: 'bold', letterSpacing: '1px' }}>
                                🔍 تطبيق الفلاتر
                            </button>
                        </form>
                    </div>

                    {/* Results Grid */}
                    <div style={{ flex: 1 }}>
                        {loading ? (
                            <div className="grid grid-cols-3">
                                {[1, 2, 3, 4, 5, 6].map(i => (
                                    <div key={i} className="skeleton" style={{ height: '350px', borderRadius: '16px' }}></div>
                                ))}
                            </div>
                        ) : products.length === 0 ? (
                            <div className="glass-card" style={{ padding: '60px 40px', textAlign: 'center' }}>
                                <div style={{ fontSize: '4rem', marginBottom: '20px', opacity: 0.8 }}>📭</div>
                                <h3 style={{ fontSize: '1.8rem', marginBottom: '12px' }}>لم يتم العثور على أي منتجات</h3>
                                <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>النتائج لا تتطابق مع بحثك أو مع فلاتر السعر والأقسام الحالية.</p>
                                <button type="button" onClick={() => { setMinPrice(0); setMaxPrice(10000); setSelectedCategory('all'); fetchResults(q, 0, 10000, 'all'); }} className="btn btn-outline" style={{ marginTop: '24px' }}>إعادة ضبط الفلاتر</button>
                            </div>
                        ) : (
                            <div className="grid grid-cols-3">
                                {products.map(product => (
                                    <ProductCard key={product.id} {...product} />
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </>
    );
}

export default function SearchPage() {
    return (
        <Suspense fallback={<p style={{ textAlign: 'center', padding: '100px' }}>جاري التحميل...</p>}>
            <SearchContent />
        </Suspense>
    )
}
