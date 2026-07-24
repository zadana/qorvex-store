import prisma from '../../../../lib/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
    try {
        const categories = await prisma.category.findMany({
            include: { products: { include: { product: true } } },
            orderBy: { name: 'asc' }
        });
        return NextResponse.json(categories);
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(request) {
    try {
        const body = await request.json();
        const category = await prisma.category.create({
            data: { name: body.name, icon: body.icon || '📦' }
        });
        return NextResponse.json(category);
    } catch (error) {
        if (error.code === 'P2002') {
            return NextResponse.json({ error: 'هذا القسم موجود بالفعل' }, { status: 400 });
        }
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
