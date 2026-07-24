import ProductCard from '../components/ProductCard';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const revalidate = 0; // Disable static rendering for realtime products

export default async function Home() {
  const products = await prisma.product.findMany({
    where: { isActive: true }, orderBy: { createdAt: 'desc' },
    take: 6 // فقط أحدث 6 منتجات كما طلب المستخدم
  });

  const settingsRecords = await prisma.setting.findMany({
    where: {
      key: { in: ['heroTitle', 'heroSubtitle', 'heroCtaPrimaryText', 'heroCtaPrimaryUrl', 'heroCtaSecondaryText', 'heroCtaSecondaryUrl', 'homeProductsTitle'] }
    }
  });

  const settings = {};
  settingsRecords.forEach(s => { settings[s.key] = s.value; });

  const heroTitle = settings.heroTitle || 'اكتشف الفخامة والأناقة في <span class="text-gradient">مكان واحد</span>';
  const heroSubtitle = settings.heroSubtitle || 'منتجات مميزة، خدمة ممتازة، تسوق بثقة، دائمًا.';
  const heroCtaPrimaryText = settings.heroCtaPrimaryText || 'تسوق الآن';
  const heroCtaPrimaryUrl = settings.heroCtaPrimaryUrl || '/products';
  const heroCtaSecondaryText = settings.heroCtaSecondaryText || 'أحدث المنتجات';
  const heroCtaSecondaryUrl = settings.heroCtaSecondaryUrl || '#products';
  const homeProductsTitle = settings.homeProductsTitle || 'وصلنا حديثاً';

  return (
    <>
      <main>
        <section className="hero">
          <div className="hero-blob"></div>
          <div className="container grid grid-cols-2">
            <div className="hero-content animate-fade-in">
              <h1 className="hero-title" dangerouslySetInnerHTML={{ __html: heroTitle }}></h1>
              <p className="hero-subtitle">
                {heroSubtitle}
              </p>
              <div className="hero-actions">
                <a href={heroCtaPrimaryUrl} className="btn btn-primary">{heroCtaPrimaryText}</a>
                <a href={heroCtaSecondaryUrl} className="btn btn-outline">{heroCtaSecondaryText}</a>
              </div>
            </div>
            <div className="hero-image-container animate-fade-in delay-1" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <div style={{ width: '400px', height: '400px', background: 'var(--glass-bg)', border: '1px solid var(--glass-border)', borderRadius: '24px', boxShadow: 'var(--glass-shadow)', display: 'flex', justifyContent: 'center', alignItems: 'center', backdropFilter: 'blur(20px)' }}>
                <img src="https://images.unsplash.com/photo-1445205170230-053b83016050?q=80&w=2071&auto=format&fit=crop" alt="Fashion" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '24px' }} />
              </div>
            </div>
          </div>
        </section>

        <section id="products" className="products-section container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
            <h2 className="section-title text-gradient animate-fade-in delay-2" style={{ margin: 0 }}>{homeProductsTitle}</h2>
            <a href="/products" className="btn btn-outline animate-fade-in delay-2" style={{ padding: '10px 20px' }}>عرض كل المنتجات ⬅️</a>
          </div>

          <div className="grid grid-cols-3 animate-fade-in delay-3" style={{ gap: '30px' }}>
            {products.length === 0 ? (
              <p style={{ gridColumn: 'span 3', textAlign: 'center', color: 'var(--text-secondary)' }}>
                لا توجد منتجات حالياً. تفضل بزيارة صفحة الإدارة لإضافة منتجات.
              </p>
            ) : products.map(product => (
              <ProductCard key={product.id} {...product} />
            ))}
          </div>
        </section>
      </main>
    </>
  );
}
