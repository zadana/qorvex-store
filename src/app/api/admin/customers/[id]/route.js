import prisma from '../../../../../lib/prisma';
import { NextResponse } from 'next/server';

export async function DELETE(request, { params }) {
    try {
        const { id } = await params;
        // Delete user's order items then orders then user
        const userOrders = await prisma.order.findMany({ where: { userId: id } });
        for (const order of userOrders) {
            await prisma.orderItem.deleteMany({ where: { orderId: order.id } });
        }
        await prisma.order.deleteMany({ where: { userId: id } });
        await prisma.user.delete({ where: { id } });
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function PUT(request, { params }) {
    try {
        const { id } = await params;
        const body = await request.json();
        const updated = await prisma.user.update({
            where: { id },
            data: {
                name: body.name,
                email: body.email,
                role: body.role,
                phone: body.phone,
            }
        });
        return NextResponse.json(updated);
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
