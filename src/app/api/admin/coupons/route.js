import prisma from '../../../../lib/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
    try {
        const coupons = await prisma.coupon.findMany({ orderBy: { createdAt: 'desc' } });
        return NextResponse.json(coupons);
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(request) {
    try {
        const body = await request.json();
        const coupon = await prisma.coupon.create({
            data: {
                code: body.code.toUpperCase(),
                discount: parseFloat(body.discount),
                type: body.type || 'percentage',
                maxUses: parseInt(body.maxUses) || 100,
                isActive: true,
                expiresAt: body.expiresAt ? new Date(body.expiresAt) : null,
            }
        });
        return NextResponse.json(coupon);
    } catch (error) {
        if (error.code === 'P2002') {
            return NextResponse.json({ error: 'كود الكوبون موجود بالفعل' }, { status: 400 });
        }
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
