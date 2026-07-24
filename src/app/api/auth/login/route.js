import prisma from '../../../../lib/prisma';
import { NextResponse } from 'next/server';

export async function POST(request) {
    try {
        const { email, password } = await request.json();

        const user = await prisma.user.findUnique({ where: { email } });
        if (!user || user.password !== password) {
            return NextResponse.json({ error: 'بيانات الدخول غير صحيحة' }, { status: 401 });
        }

        // Build response with user data including role
        const userData = { id: user.id, name: user.name, email: user.email, role: user.role || 'user' };
        const response = NextResponse.json({ user: userData });

        // Set admin cookie if user is admin
        if (user.role === 'admin') {
            response.cookies.set('admin_token', user.id, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                path: '/',
                maxAge: 60 * 60 * 24 * 7 // 7 days
            });
        }

        return response;
    } catch (error) {
        return NextResponse.json({ error: 'خطأ في الخادم: ' + error.message }, { status: 500 });
    }
}
