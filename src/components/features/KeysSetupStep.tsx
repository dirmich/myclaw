'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useInstallStore } from '@/store/useInstallStore';
import { useDialogStore } from '@/store/useDialogStore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const keysSchema = z.object({
    aiProvider: z.string().min(1),
    aiKey: z.string().min(1, "AI Key is required"),
    aiModel: z.string().optional(),
    telegramToken: z.string().optional(),
    discordToken: z.string().optional(),
}).refine(data => data.telegramToken || data.discordToken, {
    message: "At least one channel (Telegram or Discord) is required",
    path: ["telegramToken"],
});

type KeysFormValues = z.infer<typeof keysSchema>;

import { useTranslations } from 'next-intl';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

export default function KeysSetupStep() {
    const t = useTranslations('Keys');
    const tc = useTranslations('Common');
    const td = useTranslations('Dialog');
    const {
        setStep,
        setKeys,
        setAIConfig,
        aiKey: defaultAiKey,
        aiProvider: defaultAiProvider,
        aiModel: defaultAiModel,
        telegramToken: defaultTelegramToken,
        discordToken: defaultDiscordToken
    } = useInstallStore();
    const { confirm: showConfirm, alert: showAlert } = useDialogStore();
    const [isAiTesting, setIsAiTesting] = useState(false);
    const [isTgTesting, setIsTgTesting] = useState(false);
    const [isDsTesting, setIsDsTesting] = useState(false);

    const [aiTestResult, setAiTestResult] = useState<{ success: boolean; message: string; models?: string[] } | null>(null);
    const [tgTestResult, setTgTestResult] = useState<{ success: boolean; message: string } | null>(null);
    const [dsTestResult, setDsTestResult] = useState<{ success: boolean; message: string } | null>(null);

    const [availableModels, setAvailableModels] = useState<string[]>([]);

    const aiVerified = aiTestResult?.success || false;
    const tgVerified = tgTestResult?.success || false;
    const dsVerified = dsTestResult?.success || false;

    // Both channel verified is not required, at least one is.
    const channelVerified = tgVerified || dsVerified;

    const handleBack = () => {
        showConfirm({
            title: td('back_title'),
            description: td('back_desc'),
            confirmText: td('move'),
            cancelText: tc('cancel'),
            onConfirm: () => setStep(2)
        });
    };

    const form = useForm<KeysFormValues>({
        resolver: zodResolver(keysSchema),
        defaultValues: {
            aiProvider: defaultAiProvider || 'openai',
            aiKey: defaultAiKey,
            aiModel: defaultAiModel,
            telegramToken: defaultTelegramToken,
            discordToken: defaultDiscordToken,
        },
    });

    const showHelp = (type: 'tg' | 'discord') => {
        if (type === 'tg') {
            showAlert({
                title: t('help_tg_title'),
                description: t('help_tg_guide'),
                confirmText: tc('confirm')
            });
        } else {
            showAlert({
                title: t('help_discord_title'),
                description: t('help_discord_guide'),
                confirmText: tc('confirm')
            });
        }
    };

    async function verifyAI() {
        const values = form.getValues();
        if (!values.aiKey) return;

        setIsAiTesting(true);
        setAiTestResult(null);

        try {
            const res = await fetch('/api/test-key', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    type: 'ai',
                    aiProvider: values.aiProvider,
                    aiKey: values.aiKey
                }),
            });
            const data = await res.json();
            setAiTestResult(data);
            if (data.success && data.models) {
                setAvailableModels(data.models);
                if (data.models.length > 0) {
                    form.setValue('aiModel', data.models[0]);
                }
            }
        } catch (err) {
            setAiTestResult({ success: false, message: tc('error') });
        } finally {
            setIsAiTesting(false);
        }
    }

    async function verifyTelegram() {
        const values = form.getValues();
        if (!values.telegramToken) return;

        setIsTgTesting(true);
        setTgTestResult(null);

        try {
            const res = await fetch('/api/test-key', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    type: 'telegram',
                    telegramToken: values.telegramToken
                }),
            });
            const data = await res.json();
            setTgTestResult(data);
        } catch (err) {
            setTgTestResult({ success: false, message: tc('error') });
        } finally {
            setIsTgTesting(false);
        }
    }

    async function verifyDiscord() {
        const values = form.getValues();
        if (!values.discordToken) return;

        setIsDsTesting(true);
        setDsTestResult(null);

        try {
            const res = await fetch('/api/test-key', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    type: 'discord',
                    discordToken: values.discordToken
                }),
            });
            const data = await res.json();
            setDsTestResult(data);
        } catch (err) {
            setDsTestResult({ success: false, message: tc('error') });
        } finally {
            setIsDsTesting(false);
        }
    }

    async function onSubmit(values: KeysFormValues) {
        if (aiVerified && channelVerified && values.aiModel) {
            setKeys(values.aiKey || '', values.telegramToken || '', values.discordToken || '');
            setAIConfig(values.aiProvider, values.aiModel);
            setStep(4);
        }
    }

    const canProceed = aiVerified && channelVerified && !!form.watch('aiModel');

    return (
        <Card className="w-full mt-6 shadow-sm border-zinc-200 dark:border-zinc-800">
            <CardHeader>
                <CardTitle>{t('title')}</CardTitle>
                <CardDescription>
                    {t('desc')}
                </CardDescription>
            </CardHeader>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit as any)} className="space-y-6">
                    <CardContent className="space-y-4">

                        <FormField<KeysFormValues>
                            control={form.control}
                            name="aiProvider"
                            render={({ field }) => (
                                <FormItem>
                                    <Select
                                        onValueChange={(val) => {
                                            field.onChange(val);
                                            setAiTestResult(null);
                                            setAvailableModels([]);
                                            form.setValue('aiModel', '');
                                        }}
                                        defaultValue={field.value}
                                        disabled={aiVerified}
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select provider" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="openai">OpenAI</SelectItem>
                                            <SelectItem value="anthropic">Anthropic</SelectItem>
                                            <SelectItem value="openrouter">OpenRouter</SelectItem>
                                            <SelectItem value="gemini">Google Gemini</SelectItem>
                                            <SelectItem value="groq">Groq</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField<KeysFormValues>
                            control={form.control}
                            name="aiKey"
                            render={({ field }) => (
                                <FormItem>
                                    <div className="flex justify-between items-center">
                                        <FormLabel>{t('ai_label')}</FormLabel>
                                        {aiVerified && <span className="text-xs text-emerald-600 font-medium flex items-center">
                                            <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                                            {t('verified')}
                                        </span>}
                                    </div>
                                    <div className="flex gap-2">
                                        <FormControl>
                                            <Input
                                                type="password"
                                                placeholder="sk-..."
                                                {...field}
                                                onChange={(e) => {
                                                    field.onChange(e);
                                                    setAiTestResult(null);
                                                    setAvailableModels([]);
                                                    form.setValue('aiModel', '');
                                                }}
                                                disabled={aiVerified}
                                            />
                                        </FormControl>
                                        <Button
                                            type="button"
                                            variant={aiVerified ? "ghost" : "outline"}
                                            size="sm"
                                            onClick={verifyAI}
                                            disabled={isAiTesting || aiVerified || !field.value}
                                            className="shrink-0"
                                        >
                                            {isAiTesting ? t('testing') : aiVerified ? tc('success') : t('test_ai_btn')}
                                        </Button>
                                    </div>
                                    <FormDescription>
                                        {t('ai_desc')}
                                    </FormDescription>
                                    <FormMessage />
                                    {aiTestResult && !aiTestResult.success && (
                                        <p className="text-[0.8rem] font-medium text-destructive">{aiTestResult.message}</p>
                                    )}
                                </FormItem>
                            )}
                        />

                        {availableModels.length > 0 && (
                            <FormField<KeysFormValues>
                                control={form.control}
                                name="aiModel"
                                render={({ field }) => (
                                    <FormItem className="animate-in fade-in slide-in-from-top-2 duration-300 border-l-2 border-emerald-500 pl-4 py-1">
                                        <FormLabel className="text-emerald-700 dark:text-emerald-400 font-bold">{t('model_label')}</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger className="border-emerald-200 dark:border-emerald-900/50">
                                                    <SelectValue placeholder="Select AI model" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {availableModels.map(model => (
                                                    <SelectItem key={model} value={model}>{model}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormDescription>
                                            {t('model_desc')}
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        )}

                        <div className="py-2">
                            <hr className="border-zinc-200 dark:border-zinc-800" />
                        </div>

                        {/* Telegram Channel */}
                        <FormField<KeysFormValues>
                            control={form.control}
                            name="telegramToken"
                            render={({ field }) => (
                                <FormItem>
                                    <div className="flex justify-between items-center">
                                        <div className="flex items-center space-x-2">
                                            <FormLabel>{t('tg_label')}</FormLabel>
                                            <button
                                                type="button"
                                                onClick={() => showHelp('tg')}
                                                className="text-zinc-400 hover:text-zinc-600 transition-colors"
                                            >
                                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" /><path d="M12 17h.01" /></svg>
                                            </button>
                                        </div>
                                        {tgVerified && <span className="text-xs text-emerald-600 font-medium flex items-center">
                                            <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                                            {t('verified')}
                                        </span>}
                                    </div>
                                    <div className="flex gap-2">
                                        <FormControl>
                                            <Input
                                                type="password"
                                                placeholder="..."
                                                {...field}
                                                onChange={(e) => {
                                                    field.onChange(e);
                                                    setTgTestResult(null);
                                                }}
                                                disabled={tgVerified}
                                            />
                                        </FormControl>
                                        <Button
                                            type="button"
                                            variant={tgVerified ? "ghost" : "outline"}
                                            size="sm"
                                            onClick={verifyTelegram}
                                            disabled={isTgTesting || tgVerified || !field.value}
                                            className="shrink-0"
                                        >
                                            {isTgTesting ? t('testing') : tgVerified ? tc('success') : t('test_tg_btn')}
                                        </Button>
                                    </div>
                                    <FormDescription>
                                        {t('tg_desc')}
                                    </FormDescription>
                                    <FormMessage />
                                    {tgTestResult && !tgTestResult.success && (
                                        <p className="text-[0.8rem] font-medium text-destructive">{tgTestResult.message}</p>
                                    )}
                                </FormItem>
                            )}
                        />

                        {/* Discord Channel */}
                        <FormField<KeysFormValues>
                            control={form.control}
                            name="discordToken"
                            render={({ field }) => (
                                <FormItem>
                                    <div className="flex justify-between items-center">
                                        <div className="flex items-center space-x-2">
                                            <FormLabel>{t('discord_label')}</FormLabel>
                                            <button
                                                type="button"
                                                onClick={() => showHelp('discord')}
                                                className="text-zinc-400 hover:text-zinc-600 transition-colors"
                                            >
                                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" /><path d="M12 17h.01" /></svg>
                                            </button>
                                        </div>
                                        {dsVerified && <span className="text-xs text-emerald-600 font-medium flex items-center">
                                            <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                                            {t('verified')}
                                        </span>}
                                    </div>
                                    <div className="flex gap-2">
                                        <FormControl>
                                            <Input
                                                type="password"
                                                placeholder="..."
                                                {...field}
                                                onChange={(e) => {
                                                    field.onChange(e);
                                                    setDsTestResult(null);
                                                }}
                                                disabled={dsVerified}
                                            />
                                        </FormControl>
                                        <Button
                                            type="button"
                                            variant={dsVerified ? "ghost" : "outline"}
                                            size="sm"
                                            onClick={verifyDiscord}
                                            disabled={isDsTesting || dsVerified || !field.value}
                                            className="shrink-0"
                                        >
                                            {isDsTesting ? t('testing') : dsVerified ? tc('success') : t('test_discord_btn')}
                                        </Button>
                                    </div>
                                    <FormDescription>
                                        {t('discord_desc')}
                                    </FormDescription>
                                    <FormMessage />
                                    {dsTestResult && !dsTestResult.success && (
                                        <p className="text-[0.8rem] font-medium text-destructive">{dsTestResult.message}</p>
                                    )}
                                </FormItem>
                            )}
                        />

                        {!channelVerified && (
                            <div className="mt-4 p-3 rounded-md bg-amber-50 border border-amber-100 dark:bg-amber-950/20 dark:border-amber-900/30 text-[11px] text-amber-700 dark:text-amber-400 flex items-center italic">
                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
                                {t('channel_required')}
                            </div>
                        )}

                    </CardContent>
                    <CardFooter className="flex justify-between bg-zinc-50 dark:bg-zinc-900/50 px-6 py-4 border-t border-zinc-200 dark:border-zinc-800">
                        <Button type="button" variant="outline" onClick={handleBack} disabled={isAiTesting || isTgTesting || isDsTesting}>
                            {tc('back')}
                        </Button>
                        <Button
                            type="submit"
                            disabled={!canProceed}
                            className={canProceed ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-md' : ''}
                        >
                            {!canProceed ? t('verify_required') : t('proceed_install')}
                        </Button>
                    </CardFooter>
                </form>
            </Form>
        </Card>
    );
}
