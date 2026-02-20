import { cn } from "@/lib/utils";

interface InstallationStepperProps {
    currentStep: number;
}

const STEPS = [
    { id: 1, title: 'Environment' },
    { id: 2, title: 'SSH Settings' },
    { id: 3, title: 'Keys Setup' },
    { id: 4, title: 'Install' }
];

export default function InstallationStepper({ currentStep }: InstallationStepperProps) {
    return (
        <div className="w-full max-w-3xl mx-auto my-8 px-4">
            <div className="flex items-center justify-between relative">
                {/* Background Line */}
                <div className="absolute top-1/2 left-0 w-full h-1 bg-zinc-200 dark:bg-zinc-800 -z-10 -translate-y-1/2 rounded" />
                {/* Progress Line */}
                <div
                    className="absolute top-1/2 left-0 h-1 bg-emerald-500 -z-10 -translate-y-1/2 rounded transition-all duration-300 ease-in-out"
                    style={{ width: `${((currentStep - 1) / (STEPS.length - 1)) * 100}%` }}
                />

                {STEPS.map((step) => {
                    const isActive = step.id === currentStep;
                    const isCompleted = step.id < currentStep;

                    return (
                        <div key={step.id} className="flex flex-col items-center">
                            <div
                                className={cn(
                                    "w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300",
                                    isActive ? "bg-emerald-600 text-white shadow-md ring-4 ring-emerald-600/20" :
                                        isCompleted ? "bg-emerald-500 text-white" : "bg-white dark:bg-zinc-900 border-2 border-zinc-200 dark:border-zinc-700 text-zinc-400 dark:text-zinc-600"
                                )}
                            >
                                {isCompleted ? (
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-check w-5 h-5">
                                        <polyline points="20 6 9 17 4 12"></polyline>
                                    </svg>
                                ) : (
                                    step.id
                                )}
                            </div>
                            <span className={cn(
                                "mt-2 text-xs font-medium uppercase tracking-wider absolute pt-12",
                                isActive ? "text-emerald-600 font-bold" : "text-zinc-500"
                            )}>
                                {step.title}
                            </span>
                        </div>
                    );
                })}
            </div>
            <div className="h-6" /> {/* spacer for absolute labels */}
        </div>
    );
}
