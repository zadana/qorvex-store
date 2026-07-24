import prisma from '../../../lib/prisma';
import AddToCartButton from './AddToCartButton';
import CountdownTimer from '../../../components/CountdownTimer';
import ProductReviews from './ProductReviews';
import Link from 'next/link';

// Dynamic SEO Generation
export async function generateMetadata({ params }) {
    try {
        const { id } = await params;
        const product = await prisma.product.findUnique({ where: { id } });

        if (!product) {
            return { title: 'المنتج غير موجود' }
        }

        return {
            title: `${product.title} | متجري`,
            description: product.description.substring(0, 160),
            openGraph: {
                images: [product.image],
            },
        }
    } catch (e) {
        console.error('Product metadata DB error:', e?.message);
        return { title: 'المنتج' };
    }
}

export default async function ProductDetails({ params }) {
    let product = null;
    let relatedProducts = [];
    let globalFeaturesList = ['شحن مجاني للطلبات فوق 500 ر.س', 'إرجاع مجاني خلال 14 يوماً', 'دفع آمن 100%'];
    let dbError = false;

    try {
        const { id } = await params;
        product = await prisma.product.findUnique({
            where: { id },
            include: { reviews: { orderBy: { createdAt: 'desc' } } }
        });

        if (product) {
            // Fetch related products (Cross-sell / Upsell)
            relatedProducts = await prisma.product.findMany({
                where: { id: { not: id } },
                take: 4,
                orderBy: { createdAt: 'desc' }
            });

            const settings = await prisma.setting.findMany({ where: { key: 'productFeatures' } });
            const globalRawFeatures = settings.length > 0 && settings[0].value ? settings[0].value : 'شحن مجاني للطلبات فوق 500 ر.س\nإرجاع مجاني خلال 14 يوماً\nدفع آمن 100%';
            globalFeaturesList = globalRawFeatures.split('\n').filter(f => f.trim() !== '');
        }
    } catch (e) {
        console.error('Product details DB error:', e?.message);
        dbError = true;
    }

    if (dbError) {
        return (
            <>
                <main className="container" style={{ paddingTop: '150px', textAlign: 'center', direction: 'rtl' }}>
                    <h2>حدث خطأ في تحميل المنتج. يرجى المحاولة لاحقاً.</h2>
                </main>
            </>
        );
    }

    if (!product) {
        return (
            <>
                <main className="container" style={{ paddingTop: '150px', textAlign: 'center', direction: 'rtl' }}>
                    <h2>عذراً، المنتج الذي تبحث عنه غير موجود!</h2>
                </main>
            </>
        );
    }

    const hasCustomFeatures = !!product.features && product.features.trim() !== '';

    let featuresContent = null;
    if (hasCustomFeatures) {
        if (/<[a-z][\s\S]*>/i.test(product.features)) {
            featuresContent = <div className="custom-html-content" style={{ color: 'var(--text-secondary)' }} dangerouslySetInnerHTML={{ __html: product.features }} />;
        } else {
            const lines = product.features.split('\n').filter(f => f.trim() !== '');
            featuresContent = (
                <ul style={{ listStylePosition: 'inside', color: 'var(--text-secondary)', display: 'grid', gap: '8px' }}>
                    {lines.map((f, i) => <li key={i}><span style={{ marginRight: '8px' }}>{f}</span></li>)}
                </ul>
            );
        }
    } else {
        featuresContent = (
            <ul style={{ listStylePosition: 'inside', color: 'var(--text-secondary)', display: 'grid', gap: '8px' }}>
                {globalFeaturesList.map((f, i) => <li key={i}><span style={{ marginRight: '8px' }}>{f}</span></li>)}
            </ul>
        );
    }

    return (
        <>
            <main className="container product-page-main" style={{ minHeight: '80vh', direction: 'rtl', paddingTop: '120px' }}>
                <div className="grid grid-cols-2 animate-fade-in product-grid" style={{ gap: '40px', alignItems: 'flex-start' }}>
                    <div className="glass" style={{ padding: '20px', borderRadius: '24px' }}>
                        <img src={product.image} alt={product.imageAlt || product.title} style={{ width: '100%', borderRadius: '16px', objectFit: 'cover', height: 'auto', maxHeight: '500px' }} />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                        {/* H1 Tags for On-Page SEO */}
                        <h1 className="text-gradient product-title-main" style={{ margin: 0 }}>{product.title}</h1>

                        <div>
                            <span style={{ fontSize: '2.5rem', fontWeight: 'bold' }}>{product.price} ر.س</span>
                            {product.compareAtPrice && product.compareAtPrice > product.price && (
                                <span style={{ textDecoration: 'line-through', color: 'var(--text-secondary)', fontSize: '1.5rem', marginRight: '16px' }}>
                                    {product.compareAtPrice} ر.س
                                </span>
                            )}
                        </div>

                        {product.showStock && product.stock > 0 && (
                            <div style={{ color: '#f72585', fontWeight: 'bold', fontSize: '1.1rem' }}>
                                🔥 لم يتبقى سوى {product.stock} قطعة في المخزون!
                            </div>
                        )}

                        <p style={{ fontSize: '1.2rem', color: 'var(--text-secondary)', lineHeight: 1.8 }}>
                            {product.description}
                        </p>

                        {product.offerEndsAt && (
                            <CountdownTimer endDate={product.offerEndsAt.toISOString()} />
                        )}

                        <div style={{ borderTop: '1px solid var(--glass-border)', paddingTop: '24px', display: 'flex', gap: '16px' }}>
                            <AddToCartButton product={product} />
                            <button className="btn btn-outline" style={{ flex: 1, fontSize: '1.2rem', padding: '16px' }}>
                                ❤️ أضف للمفضلة
                            </button>
                        </div>

                        <div style={{ marginTop: '24px' }}>
                            <h3 style={{ marginBottom: '16px' }}>المميزات</h3>
                            {featuresContent}
                        </div>
                    </div>
                </div>

                {/* ─── Product Reviews ─── */}
                <ProductReviews productId={product.id} initialReviews={product.reviews} />

                {/* ─── Related Products ─── */}
                {relatedProducts && relatedProducts.length > 0 && (
                    <div style={{ marginTop: '80px', paddingTop: '40px', borderTop: '1px solid var(--glass-border)' }}>
                        <h2 className="text-gradient" style={{ textAlign: 'center', marginBottom: '40px', fontSize: '2rem' }}>
                            منتجات قد تعجبك أيضاً
                        </h2>
                        <div className="grid grid-cols-4">
                            {relatedProducts.map(rp => (
                                <div key={rp.id} className="glass-card" style={{ padding: '16px', display: 'flex', flexDirection: 'column' }}>
                                    <Link href={`/products/${rp.id}`} style={{ textDecoration: 'none' }}>
                                        <img src={rp.image} alt={rp.title} style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '12px', marginBottom: '16px' }} />
                                    </Link>
                                    <h4 style={{ margin: '0 0 8px 0', fontSize: '1rem', minHeight: '48px' }}>
                                        <Link href={`/products/${rp.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>{rp.title}</Link>
                                    </h4>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' }}>
                                        <div>
                                            <div style={{ fontWeight: 'bold', color: 'var(--primary-color)', fontSize: '1.2rem' }}>{rp.price} ر.س</div>
                                            {rp.compareAtPrice && rp.compareAtPrice > rp.price && (
                                                <div style={{ textDecoration: 'line-through', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{rp.compareAtPrice} ر.س</div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </main>
        </>
    );
}
