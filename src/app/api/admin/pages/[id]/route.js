import prisma from '../../../../../lib/prisma';
import { NextResponse } from 'next/server';

export async function PUT(req, { params }) {
    try {
        const { id } = await params;
        const body = await req.json();
        const page = await prisma.page.update({
            where: { id },
            data: {
                title: body.title,
                slug: body.slug,
                content: body.content
            }
        });
        return NextResponse.json({ success: true, page });
    } catch (e) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}

export async function DELETE(req, { params }) {
    try {
        const { id } = await params;
        await prisma.page.delete({ where: { id } });
        return NextResponse.json({ success: true });
    } catch (e) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
