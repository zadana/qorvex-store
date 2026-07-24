import prisma from '../../../lib/prisma';
import LandingClient from './LandingClient';
import Link from 'next/link';

export const revalidate = 0;

export async function generateMetadata({ params }) {
    const { slug } = await params;
    const landing = await prisma.landingPage.findUnique({
        where: { slug },
        include: { product: true }
    });

    if (!landing) {
        return { title: 'الصفحة غير موجودة' }
    }

    return {
        title: `${landing.heroTitle || landing.product.title} - اطلب الآن`,
        description: (landing.heroSubtitle || landing.product.description || '').substring(0, 160),
    }
}

export default async function LandingPage({ params }) {
    const { slug } = await params;

    const landing = await prisma.landingPage.findUnique({
        where: { slug },
        include: { product: true }
    });

    if (!landing || !landing.product) {
        return (
            <div style={{ textAlign: 'center', padding: '100px 20px', direction: 'rtl', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div>
                    <h1 style={{ color: 'var(--danger-color)', fontSize: '2rem' }}>عذراً، هذه الصفحة غير موجودة!</h1>
                    <Link href="/" style={{ color: 'var(--accent-color)', marginTop: '20px', display: 'inline-block' }}>العودة للصفحة الرئيسية</Link>
                </div>
            </div>
        );
    }

    // Serialize dates for client component
    const serializedLanding = {
        ...landing,
        offerEndsAt: landing.offerEndsAt ? landing.offerEndsAt.toISOString() : null,
        createdAt: landing.createdAt.toISOString(),
        updatedAt: landing.updatedAt.toISOString(),
    };

    const serializedProduct = {
        ...landing.product,
        offerEndsAt: landing.product.offerEndsAt ? landing.product.offerEndsAt.toISOString() : null,
        createdAt: landing.product.createdAt.toISOString(),
        updatedAt: landing.product.updatedAt.toISOString(),
    };

    return (
        <LandingClient landing={serializedLanding} product={serializedProduct} />
    );
}
