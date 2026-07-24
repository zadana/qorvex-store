import { NextResponse } from 'next/server';
import path from 'path';
import { promises as fs } from 'fs';

export async function POST(req) {
    try {
        const formData = await req.formData();
        const file = formData.get('file');

        if (!file) {
            return NextResponse.json({ error: "لا يوجد ملف." }, { status: 400 });
        }

        const buffer = Buffer.from(await file.arrayBuffer());
        // Clean filename and make it unique
        const originName = typeof file.name === 'string' ? file.name : 'upload.png';
        const filename = Date.now() + '_' + originName.replace(/\s+/g, '_');

        const uploadDir = path.join(process.cwd(), 'public', 'uploads');
        // Ensure upload directory exists
        await fs.mkdir(uploadDir, { recursive: true });

        const filePath = path.join(uploadDir, filename);
        await fs.writeFile(filePath, buffer);

        return NextResponse.json({ url: `/uploads/${filename}` });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
