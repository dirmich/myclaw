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
    aiKey: z.string().optional(),
    aiModel: z.string().optional(),
    telegramToken: z.string().optional(),
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
        telegramToken: defaultTelegramToken
    } = useInstallStore();
    const { confirm: showConfirm } = useDialogStore();
    const [isAiTesting, setIsAiTesting] = useState(false);
    const [isTgTesting, setIsTgTesting] = useState(false);
    const [aiTestResult, setAiTestResult] = useState<{ success: boolean; message: string; models?: string[] } | null>(null);
    const [tgTestResult, setTgTestResult] = useState<{ success: boolean; message: string } | null>(null);
    const [availableModels, setAvailableModels] = useState<string[]>([]);

    const aiVerified = aiTestResult?.success || false;
    const tgVerified = tgTestResult?.success || false;

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
        },
    });

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

    async function onSubmit(values: KeysFormValues) {
        if (aiVerified && tgVerified && values.aiModel) {
            setKeys(values.aiKey || '', values.telegramToken || '');
            setAIConfig(values.aiProvider, values.aiModel);
            setStep(4);
        }
    }

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
                                    <FormItem className="animate-in fade-in slide-in-from-top-2 duration-300">
                                        <FormLabel>{t('model_label')}</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
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

                        <FormField<KeysFormValues>
                            control={form.control}
                            name="telegramToken"
                            render={({ field }) => (
                                <FormItem>
                                    <div className="flex justify-between items-center">
                                        <FormLabel>{t('tg_label')}</FormLabel>
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

                    </CardContent>
                    <CardFooter className="flex justify-between bg-zinc-50 dark:bg-zinc-900/50 px-6 py-4 border-t border-zinc-200 dark:border-zinc-800">
                        <Button type="button" variant="outline" onClick={handleBack} disabled={isAiTesting || isTgTesting}>
                            {tc('back')}
                        </Button>
                        <Button
                            type="submit"
                            disabled={!aiVerified || !tgVerified || !form.watch('aiModel')}
                            className={aiVerified && tgVerified && form.watch('aiModel') ? 'bg-emerald-600 hover:bg-emerald-700 text-white' : ''}
                        >
                            {(!aiVerified || !tgVerified || !form.watch('aiModel')) ? t('verify_required') : tc('proceeding')}
                        </Button>
                    </CardFooter>
                </form>
            </Form>
        </Card>
    );
}
