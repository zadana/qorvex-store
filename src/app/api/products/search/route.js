import prisma from '../../../../lib/prisma';
import { NextResponse } from 'next/server';

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get('q') || '';
    const minPrice = parseFloat(searchParams.get('minPrice')) || 0;
    const maxPrice = parseFloat(searchParams.get('maxPrice')) || 999999;
    const categoryId = searchParams.get('categoryId');

    try {
        const whereClause = {
            AND: [
                {
                    OR: [
                        { title: { contains: q } },
                        { description: { contains: q } }
                    ]
                },
                { price: { gte: minPrice } },
                { price: { lte: maxPrice } }
            ]
        };

        if (categoryId && categoryId !== 'all') {
            whereClause.AND.push({
                categories: { some: { categoryId: categoryId } }
            });
        }

        const products = await prisma.product.findMany({
            where: whereClause,
            orderBy: { createdAt: 'desc' }
        });

        return NextResponse.json(products);
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
