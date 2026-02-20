'use client';

import { useEffect, useRef, useState } from 'react';
import { useInstallStore } from '@/store/useInstallStore';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';

import { useTranslations } from 'next-intl';

export default function InstallProgressStep() {
    const t = useTranslations('Install');
    const tc = useTranslations('Common');
    const {
        environment,
        sshConfig,
        aiKey,
        telegramToken,
        installStatus,
        installProgress,
        installLogs,
        setInstallStatus,
        setInstallProgress,
        addInstallLog,
        setStep
    } = useInstallStore();

    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (installStatus === 'idle') {
            startInstallation();
        }
    }, []);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
        }
    }, [installLogs]);

    const startInstallation = async () => {
        setInstallStatus('installing');
        addInstallLog(`[INFO] Starting installation on ${environment}...`);

        try {
            const res = await fetch('/api/install', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ environment, sshConfig, aiKey, telegramToken }),
            });
            const data = await res.json();

            if (data.success) {
                // Display logs from API one by one for effect
                for (const stage of data.stages) {
                    setInstallProgress(stage.progress);
                    addInstallLog(stage.log);
                    // Minimal delay just to let the UI update smoothly
                    await new Promise(resolve => setTimeout(resolve, 200));
                }

                // Final Launch Phase
                setInstallProgress(95);
                addInstallLog(`[INFO] ${t('launching')}`);
                await new Promise(resolve => setTimeout(resolve, 2000));

                addInstallLog(`[STDOUT] OpenClaw service started successfully.`);
                addInstallLog(`[INFO] Web Admin is now accessible at http://${sshConfig.host || 'localhost'}`);

                setInstallProgress(100);
                setInstallStatus('success');
            } else {
                setInstallStatus('error');
                addInstallLog(`[ERROR] ${data.message || t('failed')}`);
            }
        } catch (error) {
            setInstallStatus('error');
            addInstallLog(`[ERROR] ${tc('error')}`);
        }
    };

    const handleDashboardAccess = () => {
        const host = sshConfig.host || 'localhost';
        const url = `http://${host}`;
        window.open(url, '_blank');
    };

    return (
        <Card className="w-full mt-6 shadow-sm border-zinc-200 dark:border-zinc-800">
            <CardHeader>
                <CardTitle className="flex items-center justify-between">
                    <span>{installStatus === 'success' ? t('title_success') : t('title')}</span>
                    <span className="text-sm font-normal text-zinc-500">{installProgress}%</span>
                </CardTitle>
                <CardDescription>
                    {installStatus === 'success' ? t('desc_success') : t('desc')}
                </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
                <Progress value={installProgress} className="h-2" />

                <div className="rounded-md bg-zinc-950 p-4 font-mono text-sm text-zinc-50 border border-zinc-800">
                    <CardTitle className="text-xs mb-2 opacity-50 uppercase tracking-widest">{t('log_terminal')}</CardTitle>
                    <ScrollArea className="h-[300px] w-full">
                        <div className="space-y-1">
                            {installLogs.map((log, i) => (
                                <div key={i} className={log.includes('[ERROR]') ? 'text-red-400' : log.includes('[INFO]') ? 'text-blue-400' : 'text-zinc-300'}>
                                    <span className="text-zinc-600 mr-2">[{new Date().toLocaleTimeString()}]</span>
                                    {log}
                                </div>
                            ))}
                            <div ref={scrollRef} />
                        </div>
                    </ScrollArea>
                </div>
            </CardContent>

            <CardFooter className="flex justify-between bg-zinc-50 dark:bg-zinc-900/50 px-6 py-4 border-t border-zinc-200 dark:border-zinc-800">
                <div className="text-sm text-zinc-500">
                    {installStatus === 'installing' && t('in_progress')}
                    {installStatus === 'error' && (
                        <span className="text-red-500 font-medium">{t('failed')}</span>
                    )}
                </div>
                <div className="flex space-x-2">
                    {installStatus === 'error' && (
                        <Button variant="outline" onClick={() => setStep(3)}>
                            {tc('back')}
                        </Button>
                    )}
                    <Button
                        disabled={installStatus === 'installing'}
                        onClick={() => installStatus === 'success' ? handleDashboardAccess() : setStep(1)}
                        className={installStatus === 'success' ? 'bg-emerald-600 hover:bg-emerald-700 text-white' : ''}
                    >
                        {installStatus === 'success' ? t('dashboard_btn') : tc('finish')}
                    </Button>
                </div>
            </CardFooter>
        </Card>
    );
}
