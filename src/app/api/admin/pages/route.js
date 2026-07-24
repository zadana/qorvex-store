import prisma from '../../../../lib/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
    try {
        const pages = await prisma.page.findMany({ orderBy: { createdAt: 'desc' } });
        return NextResponse.json(pages);
    } catch (e) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}

export async function POST(req) {
    try {
        const body = await req.json();
        const page = await prisma.page.create({
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
