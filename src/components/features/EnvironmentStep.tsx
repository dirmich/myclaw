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
                    <RadioGroup onValueChange={setEnvironment} value={selectedValue} className="grid grid-cols-1 md:grid-cols-3 gap-4 border-none">

                        {/* Option 1: VirtualBox */}
                        <div>
                            <RadioGroupItem value="virtualbox" id="env-virtualbox" className="peer sr-only" />
                            <Label
                                htmlFor="env-virtualbox"
                                className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-emerald-600 peer-data-[state=checked]:bg-emerald-50 dark:peer-data-[state=checked]:bg-emerald-950/20 [&:has([data-state=checked])]:border-emerald-600 focus-within:ring-2 focus-within:ring-emerald-500 focus-within:ring-offset-2 transition-all cursor-pointer h-full"
                            >
                                <div className="mb-3 rounded-full bg-zinc-100 dark:bg-zinc-800 p-3">
                                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-box text-emerald-600">
                                        <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"></path>
                                        <path d="m3.3 7 8.7 5 8.7-5"></path>
                                        <path d="M12 22V12"></path>
                                    </svg>
                                </div>
                                <div className="space-y-1 text-center">
                                    <p className="font-semibold text-sm">Local VirtualBox</p>
                                    <p className="text-[10px] text-muted-foreground">Setup natively on a local Linux VM</p>
                                </div>
                            </Label>
                        </div>

                        {/* Option 2: AWS EC2 */}
                        <div>
                            <RadioGroupItem value="aws" id="env-aws" className="peer sr-only" />
                            <Label
                                htmlFor="env-aws"
                                className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-emerald-600 peer-data-[state=checked]:bg-emerald-50 dark:peer-data-[state=checked]:bg-emerald-950/20 [&:has([data-state=checked])]:border-emerald-600 focus-within:ring-2 focus-within:ring-emerald-500 focus-within:ring-offset-2 transition-all cursor-pointer h-full"
                            >
                                <div className="mb-3 rounded-full bg-zinc-100 dark:bg-zinc-800 p-3">
                                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-cloud text-emerald-600">
                                        <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"></path>
                                    </svg>
                                </div>
                                <div className="space-y-1 text-center">
                                    <p className="font-semibold text-sm">AWS EC2</p>
                                    <p className="text-[10px] text-muted-foreground">Install on a remote EC2 Compute Instance</p>
                                </div>
                            </Label>
                        </div>

                        {/* Option 3: Mac Mini */}
                        <div>
                            <RadioGroupItem value="mac" id="env-mac" className="peer sr-only" />
                            <Label
                                htmlFor="env-mac"
                                className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-emerald-600 peer-data-[state=checked]:bg-emerald-50 dark:peer-data-[state=checked]:bg-emerald-950/20 [&:has([data-state=checked])]:border-emerald-600 focus-within:ring-2 focus-within:ring-emerald-500 focus-within:ring-offset-2 transition-all cursor-pointer h-full"
                            >
                                <div className="mb-3 rounded-full bg-zinc-100 dark:bg-zinc-800 p-3">
                                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-monitor text-emerald-600">
                                        <rect width="20" height="14" x="2" y="3" rx="2"></rect>
                                        <line x1="8" x2="16" y1="21" y2="21"></line>
                                        <line x1="12" x2="12" y1="17" y2="21"></line>
                                    </svg>
                                </div>
                                <div className="space-y-1 text-center">
                                    <p className="font-semibold text-sm">Mac Mini / macOS</p>
                                    <p className="text-[10px] text-muted-foreground">Local installation for Apple Silicon or Intel</p>
                                </div>
                            </Label>
                        </div>

                    </RadioGroup>

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
                        disabled={!selectedValue}
                        className="px-8 shadow-md"
                    >
                        {tc('continue')}
                    </Button>
                </CardFooter>
            </Card>

        </>
    );
}
