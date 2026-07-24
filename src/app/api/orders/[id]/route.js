import prisma from '../../../../lib/prisma';
import { NextResponse } from 'next/server';

export async function PUT(request, { params }) {
    try {
        const { id } = await params;
        const body = await request.json();

        if (!body.status) {
            return NextResponse.json({ error: 'الحالة مطلوبة' }, { status: 400 });
        }

        const updatedOrder = await prisma.order.update({
            where: { id },
            data: { status: body.status }
        });

        return NextResponse.json(updatedOrder);
    } catch (error) {
        console.error("Error updating order:", error);
        return NextResponse.json({ error: 'حدث خطأ أثناء التحديث' }, { status: 500 });
    }
}

export async function DELETE(request, { params }) {
    try {
        const { id } = await params;

        // Delete related items
        await prisma.orderItem.deleteMany({ where: { orderId: id } });
        // Delete order
        await prisma.order.delete({ where: { id } });

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
