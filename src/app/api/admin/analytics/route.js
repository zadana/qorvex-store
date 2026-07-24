import prisma from '../../../../lib/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
    try {
        const visits = await prisma.visit.findMany();

        let totalVisits = visits.length;
        let todayVisits = 0;
        const uniqueVisitors = new Set();
        const todayUniqueVisitors = new Set();
        const topProductsMap = {};

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        for (const visit of visits) {
            uniqueVisitors.add(visit.ip || "unknown");

            const visitDate = new Date(visit.createdAt);
            if (visitDate >= today) {
                todayVisits++;
                todayUniqueVisitors.add(visit.ip || "unknown");
            }

            if (visit.productId && visit.productId !== 'null' && visit.productId !== 'undefined') {
                if (!topProductsMap[visit.productId]) {
                    topProductsMap[visit.productId] = 0;
                }
                topProductsMap[visit.productId]++;
            }
        }

        const products = await prisma.product.findMany({
            where: { id: { in: Object.keys(topProductsMap) } },
            select: { id: true, title: true, image: true }
        });

        const topProducts = products.map(p => ({
            id: p.id,
            title: p.title,
            image: p.image,
            visits: topProductsMap[p.id]
        })).sort((a, b) => b.visits - a.visits).slice(0, 5);

        return NextResponse.json({
            totalVisits,
            todayVisits,
            totalUniqueVisitors: uniqueVisitors.size,
            todayUniqueVisitors: todayUniqueVisitors.size,
            topProducts
        });
    } catch (e) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
