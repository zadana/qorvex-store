import prisma from '../../../lib/prisma';
import { notFound } from 'next/navigation';

export default async function CustomPage({ params }) {
    const { slug } = await params;
    const page = await prisma.page.findUnique({
        where: { slug }
    });

    if (!page) {
        notFound();
    }

    return (
        <>
            <main className="container" style={{ paddingTop: '120px', minHeight: '80vh', paddingBottom: '80px', direction: 'rtl' }}>
                <div className="glass-card animate-fade-in" style={{ padding: '40px' }}>
                    <h1 className="text-gradient" style={{ marginBottom: '30px', borderBottom: '1px solid var(--glass-border)', paddingBottom: '15px' }}>
                        {page.title}
                    </h1>

                    <div
                        className="custom-html-content"
                        dangerouslySetInnerHTML={{ __html: page.content }}
                        style={{ lineHeight: '1.8', fontSize: '1.05rem', color: 'var(--text-secondary)' }}
                    />
                </div>
            </main>
        </>
    );
}

// Generate metadata dynamically
export async function generateMetadata({ params }) {
    const { slug } = await params;
    const page = await prisma.page.findUnique({
        where: { slug }
    });

    return {
        title: page ? `${page.title} | QORVEX` : 'صفحة غير موجودة'
    };
}
