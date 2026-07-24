import prisma from '../../../lib/prisma';
import { NextResponse } from 'next/server';

export async function POST(request) {
    try {
        const body = await request.json();

        let productId = null;
        if (body.url && body.url.includes('/products/')) {
            const parts = body.url.split('/products/');
            if (parts.length > 1) {
                productId = parts[1].split('/')[0];
            }
        }

        const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
        const userAgent = request.headers.get('user-agent') || 'unknown';

        await prisma.visit.create({
            data: {
                url: body.url,
                productId: productId,
                ip: ip,
                userAgent: userAgent
            }
        });

        return NextResponse.json({ success: true });
    } catch (e) {
        // Fail silently for tracking
        return NextResponse.json({ success: false, error: e.message });
    }
}
