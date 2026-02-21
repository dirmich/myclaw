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

        // Return models based on provider (simplified for now)
        let provider = body.aiProvider || 'openai';
        if (!body.aiProvider && aiKey) {
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
            message: 'Keys validated successfully!',
            provider,
            models: models[provider] || ['default']
        });
    } catch (error) {
        return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
    }
}
