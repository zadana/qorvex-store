import "./globals.css";
import ClientLayout from "./ClientLayout";
import prisma from "../lib/prisma";

export async function generateMetadata() {
  let title = "QORVEX";
  let description = "منتجات مميزة، خدمة ممتازة، تسوق بثقة، دائمًا.";
  try {
    const st = await prisma.setting.findMany({ where: { key: { in: ['storeName', 'storeDescription'] } } });
    st.forEach(s => {
      if (s.key === 'storeName') title = s.value;
      if (s.key === 'storeDescription') description = s.value;
    });
  } catch (e) { }
  return { title, description };
}

export default async function RootLayout({ children }) {
  let footerSettings = {};
  let headerSettings = { menus: [{ title: 'الرئيسية', url: '/' }, { title: 'المنتجات', url: '/products' }], storeName: 'QORVEX' };

  try {
    const settingsObj = await prisma.setting.findMany({
      where: {
        OR: [
          { key: { startsWith: 'footer' } },
          { key: 'topMenu' },
          { key: 'storeName' }
        ]
      }
    });
    settingsObj.forEach(s => {
      if (s.key.startsWith('footer')) {
        footerSettings[s.key] = s.value;
      }
      if (s.key === 'topMenu') {
        headerSettings.menus = JSON.parse(s.value);
      }
      if (s.key === 'storeName') {
        headerSettings.storeName = s.value;
      }
    });
  } catch (e) { }

  return (
    <html lang="ar" dir="rtl">
      <body>
        <ClientLayout footerSettings={footerSettings} headerSettings={headerSettings}>
          {children}
        </ClientLayout>
      </body>
    </html>
  );
}
