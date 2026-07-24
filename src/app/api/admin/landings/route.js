import prisma from '../../../../lib/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
    try {
        const landings = await prisma.landingPage.findMany({
            include: { product: true },
            orderBy: { createdAt: 'desc' }
        });
        return NextResponse.json(landings);
    } catch (e) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}

export async function POST(req) {
    try {
        const body = await req.json();

        let slug = body.slug;
        if (!slug) {
            slug = "l-" + Math.random().toString(36).substring(7);
        }

        let finalProductId = body.productId;

        if (body.isNewProduct && body.newProductData) {
            const newProduct = await prisma.product.create({
                data: {
                    title: body.newProductData.title,
                    price: body.newProductData.price,
                    description: body.newProductData.description,
                    image: body.newProductData.image,
                    isActive: false
                }
            });
            finalProductId = newProduct.id;
        }

        const landing = await prisma.landingPage.create({
            data: {
                slug,
                productId: finalProductId,
                heroTitle: body.heroTitle || null,
                heroSubtitle: body.heroSubtitle || null,
                themeColor: body.themeColor || "#f72585",
                ctaText: body.ctaText || "اطلب الآن",
                videoUrl: body.videoUrl || null,
                features: body.features || null,
                compareAtPrice: body.compareAtPrice ? parseFloat(body.compareAtPrice) : null,
                offerEndsAt: body.offerEndsAt ? new Date(body.offerEndsAt) : null,
                showStock: body.showStock ?? false,
                fakeStock: body.fakeStock ? parseInt(body.fakeStock) : 7,
                showViewers: body.showViewers ?? true,
                viewersMin: body.viewersMin ? parseInt(body.viewersMin) : 20,
                viewersMax: body.viewersMax ? parseInt(body.viewersMax) : 50,
                showSoldCount: body.showSoldCount ?? true,
                fakeSoldCount: body.fakeSoldCount ? parseInt(body.fakeSoldCount) : 143,
                urgencyText: body.urgencyText || null,
                guaranteeText: body.guaranteeText || null,
                testimonials: body.testimonials || null,
            },
            include: { product: true }
        });
        return NextResponse.json(landing);
    } catch (e) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}

export async function PUT(req) {
    try {
        const body = await req.json();
        const { id, ...data } = body;

        const updateData = {};
        if (data.heroTitle !== undefined) updateData.heroTitle = data.heroTitle || null;
        if (data.heroSubtitle !== undefined) updateData.heroSubtitle = data.heroSubtitle || null;
        if (data.themeColor !== undefined) updateData.themeColor = data.themeColor;
        if (data.ctaText !== undefined) updateData.ctaText = data.ctaText;
        if (data.videoUrl !== undefined) updateData.videoUrl = data.videoUrl || null;
        if (data.features !== undefined) updateData.features = data.features || null;
        if (data.compareAtPrice !== undefined) updateData.compareAtPrice = data.compareAtPrice ? parseFloat(data.compareAtPrice) : null;
        if (data.offerEndsAt !== undefined) updateData.offerEndsAt = data.offerEndsAt ? new Date(data.offerEndsAt) : null;
        if (data.showStock !== undefined) updateData.showStock = data.showStock;
        if (data.fakeStock !== undefined) updateData.fakeStock = parseInt(data.fakeStock);
        if (data.showViewers !== undefined) updateData.showViewers = data.showViewers;
        if (data.viewersMin !== undefined) updateData.viewersMin = parseInt(data.viewersMin);
        if (data.viewersMax !== undefined) updateData.viewersMax = parseInt(data.viewersMax);
        if (data.showSoldCount !== undefined) updateData.showSoldCount = data.showSoldCount;
        if (data.fakeSoldCount !== undefined) updateData.fakeSoldCount = parseInt(data.fakeSoldCount);
        if (data.urgencyText !== undefined) updateData.urgencyText = data.urgencyText || null;
        if (data.guaranteeText !== undefined) updateData.guaranteeText = data.guaranteeText || null;
        if (data.testimonials !== undefined) updateData.testimonials = data.testimonials || null;

        const landing = await prisma.landingPage.update({
            where: { id },
            data: updateData,
            include: { product: true }
        });
        return NextResponse.json(landing);
    } catch (e) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
