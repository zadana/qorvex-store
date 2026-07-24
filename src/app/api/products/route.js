import prisma from '../../../lib/prisma';
import { NextResponse } from 'next/server';

export async function GET(request) {
    try {
        const products = await prisma.product.findMany({
            include: {
                categories: {
                    include: { category: true }
                }
            }
        });
        return NextResponse.json(products);
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(request) {
    try {
        const body = await request.json();
        const newProduct = await prisma.product.create({
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
                categories: body.categoryId ? {
                    create: { categoryId: body.categoryId }
                } : undefined
            },
            include: { categories: { include: { category: true } } }
        });
        return NextResponse.json(newProduct);
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
