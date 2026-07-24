const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function run() {
  try {
    const product = await prisma.product.findFirst();
    if (!product) {
      console.log("No product found");
      return;
    }
    console.log("Product to update:", product.id);

    const res = await fetch(`http://localhost:3000/api/products/${product.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: product.title,
        description: product.description,
        price: product.price.toString(),
        image: product.image,
        stock: '100',
        rating: '5',
        categoryId: '',
        compareAtPrice: '300',
        offerEndsAt: '2026-10-10T12:00',
        showStock: true
      })
    });
    
    console.log("Status:", res.status);
    const json = await res.json();
    console.log("Response:", json);
  } catch(e) {
    console.log("Error:", e.name, e.message);
  }
}
run();
