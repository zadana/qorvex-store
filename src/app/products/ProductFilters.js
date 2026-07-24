'use client';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect, useTransition } from 'react';

export default function ProductFilters({ categories }) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [isPending, startTransition] = useTransition();

    const [search, setSearch] = useState(searchParams.get('search') || '');
    const [category, setCategory] = useState(searchParams.get('category') || 'all');

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            const currentSearch = searchParams.get('search') || '';
            const currentCat = searchParams.get('category') || 'all';

            // Only push if there's actually a difference
            if (search !== currentSearch || category !== currentCat) {
                const params = new URLSearchParams(searchParams.toString());
                if (search) {
                    params.set('search', search);
                } else {
                    params.delete('search');
                }
                
                if (category && category !== 'all') {
                    params.set('category', category);
                } else {
                    params.delete('category');
                }
                
                startTransition(() => {
                    router.push(`?${params.toString()}`);
                });
            }
        }, 300);
        
        return () => clearTimeout(timeoutId);
    }, [search, category, router, searchParams]);

    return (
        <div className="glass-card" style={{ marginBottom: '40px', padding: '20px', borderRadius: '20px', display: 'flex', flexWrap: 'wrap', gap: '20px', alignItems: 'center' }}>
            <div style={{ flex: '1 1 300px', position: 'relative' }}>
                <span style={{ position: 'absolute', right: '15px', top: '50%', transform: 'translateY(-50%)', opacity: 0.5 }}>🔍</span>
                <input 
                    type="text" 
                    placeholder="ابحث عن منتج..." 
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="input-field"
                    style={{ width: '100%', padding: '12px 40px 12px 20px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(0,0,0,0.2)', color: '#fff' }}
                />
            </div>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', flex: '2 1 400px' }}>
                <button 
                    onClick={() => setCategory('all')}
                    className="btn"
                    style={{ 
                        padding: '10px 20px', 
                        borderRadius: '20px', 
                        background: category === 'all' ? 'var(--primary-color)' : 'rgba(255,255,255,0.05)',
                        border: category === 'all' ? 'none' : '1px solid rgba(255,255,255,0.1)',
                        color: category === 'all' ? '#000' : '#fff',
                        transition: 'all 0.3s ease',
                        cursor: 'pointer'
                    }}
                >
                    الكل
                </button>
                {categories.map(c => (
                    <button 
                        key={c.id}
                        onClick={() => setCategory(c.id)}
                        className="btn"
                        style={{ 
                            padding: '10px 20px', 
                            borderRadius: '20px', 
                            background: category === c.id ? 'var(--primary-color)' : 'rgba(255,255,255,0.05)',
                            border: category === c.id ? 'none' : '1px solid rgba(255,255,255,0.1)',
                            color: category === c.id ? '#000' : '#fff',
                            transition: 'all 0.3s ease',
                            cursor: 'pointer',
                            display: 'flex',
                            gap: '8px',
                            alignItems: 'center'
                        }}
                    >
                        <span>{c.icon}</span>
                        <span>{c.name}</span>
                    </button>
                ))}
            </div>
            {isPending && <div style={{width: '100%', textAlign: 'center', color: 'var(--primary-color)', fontSize: '0.9rem', marginTop: '-10px'}}>جاري البحث...</div>}
        </div>
    );
}
