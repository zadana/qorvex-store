import prisma from '../../../../lib/prisma';
import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request) {
    try {
        const { name, email, password } = await request.json();

        if (!name || !email || !password) {
            return NextResponse.json({ error: 'جميع الحقول مطلوبة' }, { status: 400 });
        }

        const existing = await prisma.user.findUnique({ where: { email } });
        if (existing) {
            return NextResponse.json({ error: 'البريد الإلكتروني مسجل مسبقاً' }, { status: 400 });
        }

        const user = await prisma.user.create({
            data: { name, email, password, role: 'user' }
        });

        // ==========================================
        //  إرسال التنبيه عبر الإيميل
        // ==========================================
        try {
            // إعداد ناقل الرسالة (Transporter) باستخدام Gmail
            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: process.env.EMAIL_USER || 'ok7070rr@gmail.com',
                    pass: process.env.EMAIL_PASS // هنا ستحتاج لوضع كلمة مرور التطبيقات في ملف .env
                }
            });

            // محتوى الرسالة
            const mailOptions = {
                from: process.env.EMAIL_USER || 'ok7070rr@gmail.com',
                to: 'ok7070rr@gmail.com',
                subject: '🔔 عميل جديد سجل في متجر QORVEX',
                html: `
                    <div style="font-family: inherit; direction: rtl; text-align: right; background-color: #f9f9f9; padding: 20px; border-radius: 10px;">
                        <h2 style="color: #f72585;">تسجيل جديد في المتجر! 🎉</h2>
                        <p>لقد قام عميل جديد بإنشاء حساب للتو:</p>
                        <ul style="background: white; padding: 15px; border-radius: 8px; border: 1px solid #ddd; list-style-type: none;">
                            <li style="margin-bottom: 10px;"><strong>الاسم:</strong> ${name}</li>
                            <li><strong>البريد الإلكتروني:</strong> ${email}</li>
                        </ul>
                        <p style="color: #555; font-size: 14px;">شكراً,<br>نظام الإشعارات الآلي - متجر QORVEX</p>
                    </div>
                `
            };

            // إرسال الإيميل (لا نعطل التسجيل إذا فشل الإرسال)
            transporter.sendMail(mailOptions).catch(console.error);

        } catch (emailError) {
            console.error('Failed to send registration email:', emailError);
        }
        // ==========================================

        return NextResponse.json({ user: { id: user.id, name: user.name, email: user.email, role: user.role } });
    } catch (error) {
        return NextResponse.json({ error: 'خطأ في الخادم: ' + error.message }, { status: 500 });
    }
}
