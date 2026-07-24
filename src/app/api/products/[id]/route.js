import prisma from '../../../../lib/prisma';
import { NextResponse } from 'next/server';

export async function GET(request, { params }) {
    try {
        const { id } = await params;
        const product = await prisma.product.findUnique({
            where: { id },
            include: { categories: { include: { category: true } } }
        });
        if (!product) return NextResponse.json({ error: 'المنتج غير موجود' }, { status: 404 });
        return NextResponse.json(product);
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function DELETE(request, { params }) {
    try {
        const { id } = await params;

        // Delete related order items first
        await prisma.orderItem.deleteMany({ where: { productId: id } });
        // Delete product categories
        await prisma.productCategory.deleteMany({ where: { productId: id } });
        // Delete the product
        await prisma.product.delete({ where: { id } });

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function PUT(request, { params }) {
    try {
        const { id } = await params;
        const body = await request.json();

        if (body.categoryId) {
            await prisma.productCategory.deleteMany({ where: { productId: id } });
            await prisma.productCategory.create({ data: { productId: id, categoryId: body.categoryId } });
        } else if (body.categoryId === '') {
            await prisma.productCategory.deleteMany({ where: { productId: id } });
        }

        const updated = await prisma.product.update({
            where: { id },
            data: {
                title: body.title,
                description: body.description,
                price: parseFloat(body.price),
                image: body.image,
                imageAlt: body.imageAlt || null,
                rating: body.rating !== undefined && body.rating !== '' ? parseFloat(body.rating) : 0,
                stock: body.stock !== undefined && body.stock !== '' ? parseInt(body.stock) : 100,
                compareAtPrice: body.compareAtPrice && !isNaN(parseFloat(body.compareAtPrice)) ? parseFloat(body.compareAtPrice) : null,
                offerEndsAt: body.offerEndsAt && !isNaN(new Date(body.offerEndsAt).getTime()) ? new Date(body.offerEndsAt) : null,
                showStock: body.showStock === true,
                features: body.features !== undefined ? body.features : null,
            },
            include: { categories: { include: { category: true } } }
        });

        return NextResponse.json(updated);
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
