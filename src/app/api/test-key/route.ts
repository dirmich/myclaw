import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { type, aiKey, telegramToken, aiProvider: providerReq } = body;

        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 1500));

        if (type === 'ai') {
            if (!aiKey) {
                return NextResponse.json({ success: false, message: 'Please provide an AI Key.' }, { status: 400 });
            }

            if (aiKey.startsWith('sk-fail')) {
                return NextResponse.json({ success: false, message: 'Invalid AI Provider Key.' }, { status: 403 });
            }

            let provider = providerReq || 'openai';
            if (!providerReq && aiKey) {
                if (aiKey.startsWith('sk-ant-')) provider = 'anthropic';
                else if (aiKey.startsWith('sk-or-')) provider = 'openrouter';
            }

            const models: Record<string, string[]> = {
                openai: ['gpt-4o', 'gpt-4o-mini', 'gpt-4-turbo', 'gpt-3.5-turbo'],
                anthropic: ['claude-3-5-sonnet-20240620', 'claude-3-opus-20240229', 'claude-3-sonnet-20240229', 'claude-3-haiku-20240307'],
                openrouter: ['anthropic/claude-3.5-sonnet', 'openai/gpt-4o', 'meta-llama/llama-3.1-405b-instruct', 'google/gemini-pro-1.5'],
                gemini: ['gemini-1.5-pro', 'gemini-1.5-flash', 'gemini-1.0-pro'],
                groq: ['llama3-70b-8192', 'llama3-8b-8240', 'mixtral-8x7b-32768'],
            };

            return NextResponse.json({
                success: true,
                message: 'AI Key validated successfully!',
                provider,
                models: models[provider] || ['default']
            });
        }

        if (type === 'telegram') {
            if (!telegramToken) {
                return NextResponse.json({ success: false, message: 'Please provide a Telegram Token.' }, { status: 400 });
            }

            if (telegramToken.startsWith('fail')) {
                return NextResponse.json({ success: false, message: 'Invalid Telegram Bot Token.' }, { status: 403 });
            }

            return NextResponse.json({
                success: true,
                message: 'Telegram Token validated successfully!'
            });
        }

        if (type === 'discord') {
            if (!body.discordToken) {
                return NextResponse.json({ success: false, message: 'Please provide a Discord Token.' }, { status: 400 });
            }

            if (body.discordToken.startsWith('fail')) {
                return NextResponse.json({ success: false, message: 'Invalid Discord Bot Token.' }, { status: 403 });
            }

            return NextResponse.json({
                success: true,
                message: 'Discord Token validated successfully!'
            });
        }
    } catch (error) {
        return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
    }
}
