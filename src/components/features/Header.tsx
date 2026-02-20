import LocaleSwitcher from '@/components/features/LocaleSwitcher';

export default function Header() {
    return (
        <header className="fixed top-0 w-full z-50 border-b border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                    {/* Logo Placeholder */}
                    <div className="font-bold text-xl tracking-tighter">MyClaw</div>
                    <div className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                        v0.1.0-alpha
                    </div>
                    <div className="text-sm text-zinc-500 hidden sm:block">OpenClaw Web Installer</div>
                </div>

                <div className="flex items-center space-x-4">
                    <LocaleSwitcher />
                </div>
            </div>
        </header>
    );
}
