import prisma from '../../../lib/prisma';
import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function GET(request) {
    try {
        const orders = await prisma.order.findMany({
            include: {
                items: {
                    include: {
                        product: true
                    }
                }
            },
            orderBy: { createdAt: 'desc' }
        });
        return NextResponse.json(orders);
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(request) {
    try {
        const body = await request.json();
        const { items, userId } = body;

        let totalAmount = 0;
        const orderItemsData = [];

        // Transaction to ensure stock updates and order creation are atomic
        const newOrder = await prisma.$transaction(async (tx) => {
            for (const item of items) {
                const product = await tx.product.findUnique({ where: { id: item.id } });
                if (product) {
                    totalAmount += product.price * item.quantity;
                    orderItemsData.push({
                        productId: product.id,
                        quantity: item.quantity,
                        price: product.price,
                        title: product.title // fetch for email context
                    });

                    // Update stock
                    if (product.stock >= item.quantity) {
                        await tx.product.update({
                            where: { id: product.id },
                            data: { stock: product.stock - item.quantity }
                        });
                    }
                }
            }

            return await tx.order.create({
                data: {
                    userId: userId || null,
                    totalAmount,
                    status: "pending",
                    paymentMethod: body.paymentMethod || "cod",
                    customerData: body.customerData ? JSON.stringify(body.customerData) : null,
                    items: {
                        create: orderItemsData.map(i => ({ productId: i.productId, quantity: i.quantity, price: i.price }))
                    }
                },
                include: { items: true }
            });
        });

        // ==========================================
        //  إرسال التنبيه للإدارة بوجود طلب جديد (بدون علم العميل)
        // ==========================================
        try {
            const customerName = body.customerData?.name || 'زائر';
            const customerPhone = body.customerData?.phone || 'غير محدد';
            const customerAddress = body.customerData?.address || 'غير محدد';

            let itemsHtml = '';
            orderItemsData.forEach(item => {
                itemsHtml += `<li style="margin-bottom: 8px;">🛒 <strong>${item.title}</strong> - الكمية: ${item.quantity} (بمبلغ ${item.price} ر.س)</li>`;
            });

            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: process.env.EMAIL_USER || 'ok7070rr@gmail.com',
                    pass: process.env.EMAIL_PASS
                }
            });

            const mailOptions = {
                from: process.env.EMAIL_USER || 'ok7070rr@gmail.com',
                to: 'ok7070rr@gmail.com',
                subject: `💰 طلب جديد برقم #${newOrder.id.slice(-6).toUpperCase()} - متجر QORVEX`,
                html: `
                    <div style="font-family: inherit; direction: rtl; text-align: right; background-color: #f4f7f6; padding: 30px; border-radius: 12px;">
                        <h2 style="color: #34d399; margin-top: 0;">طلب جديد وصل متجرك! 🚀</h2>
                        <p style="font-size: 16px; color: #333;">تفاصيل الطلب الجديد:</p>
                        
                        <div style="background: white; padding: 20px; border-radius: 8px; border: 1px solid #ddd; margin-bottom: 20px;">
                            <h3 style="margin-top: 0; color: #f72585; border-bottom: 2px solid #f0f0f0; padding-bottom: 10px;">بيانات العميل 👤</h3>
                            <p><strong>الاسم:</strong> ${customerName}</p>
                            <p><strong>رقم الجوال:</strong> <a href="tel:${customerPhone}">${customerPhone}</a></p>
                            <p><strong>العنوان:</strong> ${customerAddress}</p>
                        </div>

                        <div style="background: white; padding: 20px; border-radius: 8px; border: 1px solid #ddd;">
                            <h3 style="margin-top: 0; color: #4cc9f0; border-bottom: 2px solid #f0f0f0; padding-bottom: 10px;">تفاصيل الطلب 📦</h3>
                            <ul style="list-style-type: none; padding: 0;">
                                ${itemsHtml}
                            </ul>
                            <div style="margin-top: 20px; padding-top: 15px; border-top: 2px dashed #ddd; font-size: 18px;">
                                <strong>الإجمالي الكلي المطلوب دفعه للمندوب:</strong> <span style="color: #f72585; font-size: 22px;">${totalAmount} ر.س</span>
                            </div>
                        </div>
                        
                        <p style="color: #777; font-size: 13px; text-align: center; margin-top: 20px;">يرجى التواصل مع العميل لتأكيد الطلب وتجهيزه. بالتوفيق!</p>
                    </div>
                `
            };

            // الإرسال في الخلفية بصمت
            transporter.sendMail(mailOptions).catch(console.error);

        } catch (emailError) {
            console.error('Failed to send order email:', emailError);
        }
        // ==========================================

        return NextResponse.json(newOrder);
    } catch (error) {
        console.error("Order Creation Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
