'use client';

import { useInstallStore } from '@/store/useInstallStore';
import { Button } from '@/components/ui/button';
import { useTranslations } from 'next-intl';
import {
    Terminal,
    ShieldCheck,
    Cpu,
    Zap,
    ArrowRight,
    Github,
    MessageSquare,
    Sparkles
} from 'lucide-react';

export default function LandingPage() {
    const t = useTranslations('Landing');
    const tc = useTranslations('Common');
    const startWizard = useInstallStore((state) => state.startWizard);

    const FEATURES = [
        {
            icon: <Cpu className="w-10 h-10 text-emerald-500" />,
            title: t('feature_ai_title'),
            description: t('feature_ai_desc')
        },
        {
            icon: <ShieldCheck className="w-10 h-10 text-emerald-500" />,
            title: t('feature_secure_title'),
            description: t('feature_secure_desc')
        },
        {
            icon: <Zap className="w-10 h-10 text-emerald-500" />,
            title: t('feature_easy_title'),
            description: t('feature_easy_desc')
        },
        {
            icon: <Terminal className="w-10 h-10 text-emerald-500" />,
            title: t('feature_console_title'),
            description: t('feature_console_desc')
        },
        {
            icon: <MessageSquare className="w-10 h-10 text-emerald-500" />,
            title: t('feature_bot_title'),
            description: t('feature_bot_desc')
        },
        {
            icon: <Sparkles className="w-10 h-10 text-emerald-500" />,
            title: t('feature_auto_title'),
            description: t('feature_auto_desc')
        }
    ];

    return (
        <div className="flex flex-col w-full">
            {/* Hero Section */}
            <section className="relative py-20 overflow-hidden bg-white dark:bg-zinc-950">
                <div className="container relative px-4 mx-auto text-center">
                    <div className="inline-flex items-center px-3 py-1 mb-6 text-sm font-medium border rounded-full border-emerald-500/20 bg-emerald-500/5 text-emerald-600 dark:text-emerald-400">
                        <span className="flex w-2 h-2 mr-2 rounded-full bg-emerald-500 animate-pulse"></span>
                        {t('version_tag')}
                    </div>

                    <h1 className="mb-6 text-5xl font-extrabold tracking-tight md:text-7xl lg:text-8xl">
                        {t('hero_title_1')} <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-teal-500">
                            {t('hero_title_2')}
                        </span> {t('hero_title_3')}
                    </h1>

                    <p className="max-w-2xl mx-auto mb-10 text-lg text-zinc-600 dark:text-zinc-400 md:text-xl">
                        {t('hero_desc')}
                    </p>

                    <div className="flex flex-col items-center justify-center space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
                        <Button
                            size="lg"
                            className="w-full px-8 py-7 text-lg font-bold rounded-2xl shadow-xl shadow-emerald-500/20 bg-emerald-600 hover:bg-emerald-700 sm:w-auto"
                            onClick={startWizard}
                        >
                            {t('start_btn')} <ArrowRight className="ml-2 w-5 h-5" />
                        </Button>
                        <Button
                            size="lg"
                            variant="outline"
                            className="w-full px-8 py-7 text-lg font-bold border-2 rounded-2xl sm:w-auto"
                            asChild
                        >
                            <a href="https://github.com/dirmich/myclaw" target="_blank" rel="noopener noreferrer">
                                <Github className="mr-2 w-5 h-5" /> {t('github_btn')}
                            </a>
                        </Button>
                    </div>

                    <div className="mt-16 relative mx-auto max-w-5xl rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 p-2 shadow-2xl">
                        <div className="overflow-hidden rounded-2xl bg-zinc-100 dark:bg-zinc-950 aspect-video flex items-center justify-center border border-zinc-200 dark:border-zinc-800">
                            <div className="text-center p-8">
                                <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto mb-4">
                                    <Zap className="w-8 h-8 text-emerald-500" />
                                </div>
                                <p className="text-xl font-bold">{t('demo_title')}</p>
                                <p className="text-sm text-zinc-500">{t('demo_desc')}</p>
                            </div>
                        </div>
                        <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-emerald-500/10 blur-[120px] rounded-full"></div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-24 bg-zinc-50 dark:bg-zinc-900/30">
                <div className="container px-4 mx-auto">
                    <div className="max-w-3xl mx-auto mb-16 text-center">
                        <h2 className="mb-4 text-3xl font-bold md:text-4xl">{t('features_title')}</h2>
                        <p className="text-zinc-600 dark:text-zinc-400">
                            {t('features_desc')}
                        </p>
                    </div>

                    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                        {FEATURES.map((feature, idx) => (
                            <div
                                key={idx}
                                className="p-8 transition-all border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 rounded-3xl hover:shadow-2xl hover:shadow-emerald-500/5 hover:-translate-y-1"
                            >
                                <div className="mb-6 p-3 w-fit rounded-2xl bg-emerald-50 dark:bg-emerald-950/30">
                                    {feature.icon}
                                </div>
                                <h3 className="mb-3 text-xl font-bold">{feature.title}</h3>
                                <p className="text-zinc-600 dark:text-zinc-400">
                                    {feature.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Footer / CTA section */}
            <section className="py-24">
                <div className="container px-4 mx-auto">
                    <div className="p-12 text-center rounded-3xl bg-emerald-600 text-white relative overflow-hidden">
                        <div className="relative z-10">
                            <h2 className="mb-6 text-3xl font-bold md:text-4xl text-white">{t('cta_title')}</h2>
                            <p className="max-w-2xl mx-auto mb-10 text-emerald-50">
                                {t('cta_desc')}
                            </p>
                            <Button
                                variant="secondary"
                                size="lg"
                                className="px-8 py-7 text-lg font-bold rounded-2xl shadow-lg hover:scale-105 transition-transform"
                                onClick={startWizard}
                            >
                                {t('cta_btn')}
                            </Button>
                        </div>
                        <div className="absolute top-0 right-0 w-64 h-64 -mr-32 -mt-32 rounded-full bg-emerald-500/20 blur-3xl"></div>
                        <div className="absolute bottom-0 left-0 w-64 h-64 -ml-32 -mb-32 rounded-full bg-emerald-400/20 blur-3xl"></div>
                    </div>
                </div>
            </section>

            <footer className="py-12 border-t border-zinc-200 dark:border-zinc-800">
                <div className="container px-4 mx-auto text-center">
                    <p className="text-sm text-zinc-500">
                        {t('footer')}
                    </p>
                </div>
            </footer>
        </div>
    );
}
