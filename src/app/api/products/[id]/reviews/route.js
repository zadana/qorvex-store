import prisma from '../../../../../lib/prisma';
import { NextResponse } from 'next/server';

export async function GET(request, { params }) {
    try {
        const { id } = await params;
        const reviews = await prisma.review.findMany({
            where: { productId: id },
            orderBy: { createdAt: 'desc' }
        });
        return NextResponse.json(reviews);
    } catch (e) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}

export async function POST(request, { params }) {
    try {
        const { id } = await params;
        const body = await request.json();

        // Basic validation
        if (!body.rating) {
            return NextResponse.json({ error: 'التقييم مطلوب' }, { status: 400 });
        }
        if (!body.userId) {
            return NextResponse.json({ error: 'يرجى تسجيل الدخول للتقييم' }, { status: 401 });
        }

        // Check if user purchased this product
        const userOrders = await prisma.orderItem.findMany({
            where: {
                productId: id,
                order: { userId: body.userId }
            },
            include: { order: true },
            orderBy: { order: { createdAt: 'asc' } }
        });

        if (userOrders.length === 0) {
            return NextResponse.json({ error: 'لا يمكنك تقييم هذا المنتج لأنك لم تقم بشرائه' }, { status: 403 });
        }

        const deliveredOrders = userOrders.filter(o => o.order.status === 'delivered');

        if (deliveredOrders.length === 0) {
            return NextResponse.json({ error: 'لا يمكنك التقييم حتى يتم توصيل طلبك' }, { status: 403 });
        }

        // Check if 24 hours have passed since the oldest purchase of this product (must be delivered)
        const firstOrderDate = new Date(deliveredOrders[0].order.createdAt);
        const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

        if (firstOrderDate > twentyFourHoursAgo) {
            return NextResponse.json({ error: 'عذراً، يجب مرور 24 ساعة على الأقل من وقت الطلب لتتمكن من إضافة تقييم' }, { status: 403 });
        }

        const review = await prisma.review.create({
            data: {
                productId: id,
                name: body.name,
                rating: parseInt(body.rating),
                comment: body.comment || '',
                image: body.image || null,
                verified: true, // we assume it's verified for demo or you can tie it to auth
            }
        });

        return NextResponse.json(review);
    } catch (e) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
