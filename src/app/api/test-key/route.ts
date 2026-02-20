import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { aiKey, telegramToken } = body;

        // We allow either one to be present or both, but at least one should ideally be tested
        // For this mock, we just check if they are provided and have minimum length
        if (!aiKey && !telegramToken) {
            return NextResponse.json({ success: false, message: 'Please provide at least one key to test.' }, { status: 400 });
        }

        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 1500));

        // Mock validation logic
        if (aiKey && aiKey.startsWith('sk-fail')) {
            return NextResponse.json({ success: false, message: 'Invalid AI Provider Key.' }, { status: 403 });
        }

        if (telegramToken && telegramToken.startsWith('fail')) {
            return NextResponse.json({ success: false, message: 'Invalid Telegram Bot Token.' }, { status: 403 });
        }

        return NextResponse.json({ success: true, message: 'Keys validated successfully!' });
    } catch (error) {
        return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
    }
}
