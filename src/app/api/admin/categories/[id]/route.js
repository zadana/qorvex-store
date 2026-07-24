import prisma from '../../../../../lib/prisma';
import { NextResponse } from 'next/server';

export async function DELETE(request, { params }) {
    try {
        const { id } = await params;
        await prisma.productCategory.deleteMany({ where: { categoryId: id } });
        await prisma.category.delete({ where: { id } });
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function PUT(request, { params }) {
    try {
        const { id } = await params;
        const body = await request.json();
        const updated = await prisma.category.update({
            where: { id },
            data: { name: body.name, icon: body.icon }
        });
        return NextResponse.json(updated);
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
