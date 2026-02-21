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
    aiProvider: z.string().default('openai'),
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
    const { confirm } = useDialogStore();
    const [isTesting, setIsTesting] = useState(false);
    const [testResult, setTestResult] = useState<{ success: boolean; message: string; models?: string[] } | null>(null);
    const [availableModels, setAvailableModels] = useState<string[]>([]);

    const handleBack = () => {
        confirm({
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

    async function onSubmit(values: KeysFormValues) {
        if (!values.aiKey && !values.telegramToken) {
            setKeys('', '');
            setStep(4);
            return;
        }

        // If models are already fetched and a model is selected, proceed to next step
        if (testResult?.success && values.aiModel) {
            setKeys(values.aiKey || '', values.telegramToken || '');
            setAIConfig(values.aiProvider, values.aiModel);
            setStep(4);
            return;
        }

        setIsTesting(true);
        setTestResult(null);

        try {
            const res = await fetch('/api/test-key', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(values),
            });
            const data = await res.json();

            setTestResult(data);

            if (data.success) {
                if (data.models) {
                    setAvailableModels(data.models);
                }
                setKeys(values.aiKey || '', values.telegramToken || '');
            }
        } catch (err) {
            setTestResult({ success: false, message: tc('error') });
        } finally {
            setIsTesting(false);
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
                                    <FormLabel>{t('provider_label')}</FormLabel>
                                    <Select
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                        disabled={testResult?.success}
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
                                    <FormLabel>{t('ai_label')}</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="password"
                                            placeholder="sk-..."
                                            {...field}
                                            disabled={testResult?.success}
                                        />
                                    </FormControl>
                                    <FormDescription>
                                        {t('ai_desc')}
                                    </FormDescription>
                                    <FormMessage />
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

                        <FormField<KeysFormValues>
                            control={form.control}
                            name="telegramToken"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{t('tg_label')}</FormLabel>
                                    <FormControl>
                                        <Input type="password" placeholder="..." {...field} />
                                    </FormControl>
                                    <FormDescription>
                                        {t('tg_desc')}
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {testResult && (
                            <Alert variant={testResult.success ? 'default' : 'destructive'} className={testResult.success ? 'border-emerald-500 text-emerald-700 bg-emerald-50 dark:bg-emerald-950/30' : ''}>
                                <AlertTitle>{testResult.success ? tc('success') : tc('failed')}</AlertTitle>
                                <AlertDescription>
                                    {testResult.message}
                                </AlertDescription>
                            </Alert>
                        )}

                    </CardContent>
                    <CardFooter className="flex justify-between bg-zinc-50 dark:bg-zinc-900/50 px-6 py-4 border-t border-zinc-200 dark:border-zinc-800">
                        <Button type="button" variant="outline" onClick={handleBack} disabled={isTesting}>
                            {tc('back')}
                        </Button>
                        <Button type="submit" disabled={isTesting} className={testResult?.success ? 'bg-emerald-600 hover:bg-emerald-700 text-white' : ''}>
                            {isTesting ? (
                                <span className="flex items-center">
                                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    {t('testing')}
                                </span>
                            ) : testResult?.success ? (
                                tc('proceeding')
                            ) : (
                                t('test_btn')
                            )}
                        </Button>
                    </CardFooter>
                </form>
            </Form>
        </Card>
    );
}
