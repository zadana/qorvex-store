import prisma from '../../../../../lib/prisma';
import { NextResponse } from 'next/server';

export async function DELETE(request, { params }) {
    try {
        const { id } = await params;
        await prisma.coupon.delete({ where: { id } });
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function PUT(request, { params }) {
    try {
        const { id } = await params;
        const body = await request.json();
        const updated = await prisma.coupon.update({
            where: { id },
            data: {
                code: body.code?.toUpperCase(),
                discount: body.discount ? parseFloat(body.discount) : undefined,
                type: body.type,
                maxUses: body.maxUses ? parseInt(body.maxUses) : undefined,
                isActive: body.isActive,
                expiresAt: body.expiresAt ? new Date(body.expiresAt) : null,
            }
        });
        return NextResponse.json(updated);
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
