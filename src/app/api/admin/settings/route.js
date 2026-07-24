import prisma from '../../../../lib/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
    try {
        const settings = await prisma.setting.findMany();
        const settingsObj = {};
        settings.forEach(s => { settingsObj[s.key] = s.value; });
        return NextResponse.json(settingsObj);
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(request) {
    try {
        const body = await request.json();
        const results = [];
        for (const [key, value] of Object.entries(body)) {
            const setting = await prisma.setting.upsert({
                where: { key },
                update: { value: String(value) },
                create: { key, value: String(value) },
            });
            results.push(setting);
        }
        return NextResponse.json({ success: true, settings: results });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
