'use client';

import { useTranslations } from 'next-intl';
import InstallationStepper from '@/components/features/InstallationStepper';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { useInstallStore } from '@/store/useInstallStore';

export default function EnvironmentStep() {
    const t = useTranslations('Environment');
    const tc = useTranslations('Common');
    const { currentStep, setStep, environment: selectedValue, setEnvironment, installType, setInstallType } = useInstallStore();

    const handleNext = () => {
        if (selectedValue) {
            setStep(2);
        }
    };

    return (
        <>
            <h1 className="text-3xl font-bold tracking-tight mb-2 text-center">{t('title')}</h1>
            <p className="text-zinc-500 mb-8 max-w-lg text-center">
                {useTranslations('Index')('description')}
            </p>

            <InstallationStepper currentStep={1} />

            <Card className="w-full mt-6 shadow-sm border-zinc-200 dark:border-zinc-800">
                <CardHeader>
                    <CardTitle>{t('title')}</CardTitle>
                    <CardDescription>
                        {t('desc')}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <RadioGroup onValueChange={setEnvironment} value={selectedValue} className="grid grid-cols-1 md:grid-cols-2 gap-4 border-none">
                        {/* Option 1: Linux / SSH Based (Grouping VirtualBox, AWS, macOS) */}
                        <div>
                            <RadioGroupItem value="linux" id="env-linux" className="peer sr-only" />
                            <Label
                                htmlFor="env-linux"
                                className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-emerald-600 peer-data-[state=checked]:bg-emerald-50 dark:peer-data-[state=checked]:bg-emerald-950/20 [&:has([data-state=checked])]:border-emerald-600 focus-within:ring-2 focus-within:ring-emerald-500 focus-within:ring-offset-2 transition-all cursor-pointer h-full"
                            >
                                <div className="mb-3 rounded-full bg-zinc-100 dark:bg-zinc-800 p-3">
                                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-linux text-emerald-600">
                                        <path d="M12 2c-3.3 0-6 2.7-6 6v2c-2 0-3 1.5-3 3 0 1.5 1 2.5 1 2.5V20c0 1 1 1 2 1h12c1 0 2 0 2-1v-4.5s1-1 1-2.5c0-1.5-1-3-3-3v-2c0-3.3-2.7-6-6-6Z" />
                                        <path d="M9 11s0 1 1 1 1-1 1-1" />
                                        <path d="M13 11s0 1 1 1 1-1 1-1" />
                                        <path d="m11 15 1 1 1-1" />
                                    </svg>
                                </div>
                                <div className="space-y-1 text-center">
                                    <p className="font-semibold text-sm">Linux / SSH Based</p>
                                    <p className="text-[10px] text-muted-foreground">AWS EC2, VirtualBox, macOS, Remote Linux Servers</p>
                                </div>
                            </Label>
                        </div>

                        {/* Option 2: Windows (TODO) */}
                        <div>
                            <RadioGroupItem value="windows" id="env-windows" className="peer sr-only" />
                            <Label
                                htmlFor="env-windows"
                                className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-zinc-100 dark:hover:bg-zinc-900 peer-data-[state=checked]:border-blue-400 peer-data-[state=checked]:bg-blue-50/50 dark:peer-data-[state=checked]:bg-blue-950/10 [&:has([data-state=checked])]:border-blue-400 focus-within:ring-2 focus-within:ring-blue-400 focus-within:ring-offset-2 transition-all cursor-pointer h-full relative"
                            >
                                <div className="mb-3 rounded-full bg-zinc-100 dark:bg-zinc-800 p-3 opacity-50">
                                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-layout text-blue-600">
                                        <rect width="18" height="18" x="3" y="3" rx="2" />
                                        <path d="M3 9h18" />
                                        <path d="M9 21V9" />
                                    </svg>
                                </div>
                                <div className="space-y-1 text-center">
                                    <p className="font-semibold text-sm text-zinc-400">Windows</p>
                                    <p className="text-[10px] text-zinc-400">Native Windows Installation</p>
                                </div>
                                <div className="absolute top-2 right-2 px-1.5 py-0.5 rounded bg-blue-100 dark:bg-blue-900/30 text-[8px] font-bold text-blue-600 tracking-wider">
                                    TODO
                                </div>
                            </Label>
                        </div>
                    </RadioGroup>

                    {selectedValue === 'windows' && (
                        <div className="mt-4 p-3 rounded-md bg-blue-50 border border-blue-100 dark:bg-blue-900/20 dark:border-blue-900/30 text-xs text-blue-700 dark:text-blue-400 text-center animate-in fade-in slide-in-from-top-2">
                            Coming soon: Native Windows support is currently under development. Please use the Linux/SSH option for now.
                        </div>
                    )}

                    {/* Minimum Requirements Info Card */}
                    <div className="mt-8 rounded-lg border border-amber-200 bg-amber-50/50 p-4 dark:border-amber-900/30 dark:bg-amber-950/10">
                        <div className="flex items-start space-x-3">
                            <div className="mt-0.5 p-1 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-600">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" /></svg>
                            </div>
                            <div className="flex-1">
                                <h4 className="text-sm font-bold text-amber-900 dark:text-amber-400 mb-2">{t('resources_title')}</h4>
                                <ul className="grid grid-cols-1 md:grid-cols-3 gap-2">
                                    <li className="flex items-center text-xs text-amber-800 dark:text-amber-500/80">
                                        <div className="w-1.5 h-1.5 rounded-full bg-amber-400 mr-2" />
                                        {t('resources_ram')}
                                    </li>
                                    <li className="flex items-center text-xs text-amber-800 dark:text-amber-500/80">
                                        <div className="w-1.5 h-1.5 rounded-full bg-amber-400 mr-2" />
                                        {t('resources_cpu')}
                                    </li>
                                    <li className="flex items-center text-xs text-amber-800 dark:text-amber-500/80">
                                        <div className="w-1.5 h-1.5 rounded-full bg-amber-400 mr-2" />
                                        {t('resources_storage')}
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </CardContent>

                <div className="px-6 py-4 border-t border-zinc-100 dark:border-zinc-800 bg-blue-50/30 dark:bg-blue-900/10">
                    <div className="flex items-center space-x-3">
                        <div className="p-2 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 12.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5V9a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 .5.5v3.5zM2 12.5a.5.5 0 0 0 .5.5h2a.5.5 0 0 0 .5-.5V9a.5.5 0 0 0-.5-.5h-2a.5.5 0 0 0-.5.5v3.5zM12 2a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-.5.5H9a.5.5 0 0 1-.5-.5v-2a.5.5 0 0 1 .5-.5h3zM12 22a.5.5 0 0 0 .5-.5v-2a.5.5 0 0 0-.5-.5H9a.5.5 0 0 0-.5.5v2a.5.5 0 0 0 .5.5h3z" /><path d="M7 11.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zM20 11.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z" /><path d="M12 11.5h.01" /><rect width="18" height="12" x="3" y="6" rx="2" /><path d="M7 18h10" /></svg>
                        </div>
                        <div>
                            <CardTitle className="text-sm font-semibold">{t('type_docker')}</CardTitle>
                            <CardDescription className="text-xs">
                                {t('type_docker_desc')} (Stable)
                            </CardDescription>
                        </div>
                    </div>
                </div>
                <CardFooter className="flex justify-end bg-zinc-50 dark:bg-zinc-900/50 px-6 py-4 mt-4 border-t border-zinc-200 dark:border-zinc-800">
                    <Button
                        onClick={handleNext}
                        disabled={!selectedValue || selectedValue === 'windows'}
                        className="px-8 shadow-md"
                    >
                        {tc('continue')}
                    </Button>
                </CardFooter>
            </Card>

        </>
    );
}
