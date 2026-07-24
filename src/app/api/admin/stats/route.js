import prisma from '../../../../lib/prisma';
import { NextResponse } from 'next/server';

// GET /api/admin/stats - Dashboard statistics
export async function GET() {
    try {
        const [products, orders, users, categories, coupons] = await Promise.all([
            prisma.product.findMany({ include: { orderItems: true } }),
            prisma.order.findMany({ include: { items: { include: { product: true } } }, orderBy: { createdAt: 'desc' } }),
            prisma.user.findMany({ include: { orders: true } }),
            prisma.category.findMany({ include: { products: true } }),
            prisma.coupon.findMany(),
        ]);

        const totalRevenue = orders.filter(o => o.status !== 'cancelled').reduce((acc, o) => acc + o.totalAmount, 0);
        const pendingOrders = orders.filter(o => o.status === 'pending').length;
        const processingOrders = orders.filter(o => o.status === 'processing').length;
        const deliveredOrders = orders.filter(o => o.status === 'delivered').length;
        const cancelledOrders = orders.filter(o => o.status === 'cancelled').length;

        // Monthly revenue (last 6 months)
        const now = new Date();
        const arabicMonths = ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'];
        const monthlyRevenue = [];
        for (let i = 5; i >= 0; i--) {
            const monthStart = new Date(now.getFullYear(), now.getMonth() - i, 1);
            const monthEnd = new Date(now.getFullYear(), now.getMonth() - i + 1, 0, 23, 59, 59);
            const monthOrders = orders.filter(o => {
                const d = new Date(o.createdAt);
                return d >= monthStart && d <= monthEnd && o.status !== 'cancelled';
            });
            monthlyRevenue.push({
                month: arabicMonths[monthStart.getMonth()] + ' ' + monthStart.getFullYear(),
                revenue: monthOrders.reduce((a, o) => a + o.totalAmount, 0),
                orders: monthOrders.length,
            });
        }

        // Top selling products
        const productSales = {};
        orders.filter(o => o.status !== 'cancelled').forEach(order => {
            order.items.forEach(item => {
                if (!productSales[item.productId]) {
                    productSales[item.productId] = {
                        id: item.productId,
                        title: item.product?.title || 'محذوف',
                        image: item.product?.image || '',
                        totalSold: 0,
                        totalRevenue: 0
                    };
                }
                productSales[item.productId].totalSold += item.quantity;
                productSales[item.productId].totalRevenue += item.price * item.quantity;
            });
        });
        const topProducts = Object.values(productSales).sort((a, b) => b.totalSold - a.totalSold).slice(0, 5);

        // Today's stats
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const todayOrders = orders.filter(o => new Date(o.createdAt) >= today);
        const todayRevenue = todayOrders.filter(o => o.status !== 'cancelled').reduce((a, o) => a + o.totalAmount, 0);

        // Payment methods breakdown
        const codOrders = orders.filter(o => o.paymentMethod === 'cod').length;
        const cardOrders = orders.filter(o => o.paymentMethod === 'card').length;

        return NextResponse.json({
            totalProducts: products.length,
            activeProducts: products.filter(p => p.isActive).length,
            totalOrders: orders.length,
            totalRevenue,
            pendingOrders,
            processingOrders,
            deliveredOrders,
            cancelledOrders,
            totalCustomers: users.filter(u => u.role !== 'admin').length,
            totalCategories: categories.length,
            totalCoupons: coupons.length,
            activeCoupons: coupons.filter(c => c.isActive).length,
            monthlyRevenue,
            topProducts,
            todayOrders: todayOrders.length,
            todayRevenue,
            codOrders,
            cardOrders,
            recentOrders: orders.slice(0, 10),
            averageOrderValue: orders.filter(o => o.status !== 'cancelled').length > 0 ? totalRevenue / orders.filter(o => o.status !== 'cancelled').length : 0,
        });
    } catch (error) {
        console.error('Stats Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
