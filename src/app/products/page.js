import ProductCard from '../../components/ProductCard';
import prisma from '../../lib/prisma';
import ProductFilters from './ProductFilters';

export const revalidate = 0; // Disable static rendering for realtime products

export default async function ProductsPage({ searchParams }) {
    // Next.js 15 requires awaiting searchParams, Promise.resolve handles Next 14 as well
    const awaitedParams = await Promise.resolve(searchParams);
    const search = awaitedParams?.search || '';
    const categoryId = awaitedParams?.category || 'all';

    const categories = await prisma.category.findMany();

    let whereClause = { isActive: true };

    if (search) {
        whereClause.OR = [
            { title: { contains: search } },
            { description: { contains: search } }
        ];
    }

    if (categoryId && categoryId !== 'all') {
        whereClause.categories = {
            some: {
                categoryId: categoryId
            }
        };
    }

    const products = await prisma.product.findMany({
        where: whereClause,
        orderBy: { createdAt: 'desc' }
    });

    return (
        <>
            <main className="container" style={{ paddingTop: '120px', minHeight: '80vh', paddingBottom: '80px', direction: 'rtl' }}>
                <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                    <h1 className="text-gradient">تصفح التشكيلة الكاملة 🛍️</h1>
                    <p style={{ color: 'var(--text-secondary)', marginTop: '10px', fontSize: '1.1rem' }}>
                        نوفر لك أحدث المنتجات وأرقاها في مكان واحد، اكتشف ما يناسب ذوقك وتميزك.
                    </p>
                </div>

                <ProductFilters categories={categories} />

                <div className="grid grid-cols-4 animate-fade-in" style={{ gap: '30px', marginTop: '20px' }}>
                    {products.length === 0 ? (
                        <div className="glass-card" style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '60px' }}>
                            <div style={{ fontSize: '3rem', marginBottom: '16px' }}>📭</div>
                            <p style={{ color: 'var(--text-secondary)' }}>لا توجد منتجات مطابقة لبحثك.</p>
                        </div>
                    ) : products.map(product => (
                        <ProductCard key={product.id} {...product} />
                    ))}
                </div>
            </main>
        </>
    );
}
