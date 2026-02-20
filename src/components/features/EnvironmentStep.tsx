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
    const { currentStep, setStep, environment: selectedValue, setEnvironment } = useInstallStore();

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
                </CardContent>
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
