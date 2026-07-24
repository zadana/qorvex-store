import prisma from '../../../../lib/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
    try {
        const reviews = await prisma.review.findMany({
            include: { product: true, user: true },
            orderBy: { createdAt: 'desc' }
        });
        return NextResponse.json(reviews);
    } catch (e) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
