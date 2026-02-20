'use client';

import { useInstallStore } from '@/store/useInstallStore';
import EnvironmentStep from '@/components/features/EnvironmentStep';
import SSHConnectionStep from '@/components/features/SSHConnectionStep';
import InstallationStepper from '@/components/features/InstallationStepper';
import { useTranslations } from 'next-intl';

export default function MainPage() {
  const { currentStep } = useInstallStore();
  const t = useTranslations('Index');

  return (
    <div className="container mx-auto max-w-4xl px-4 flex flex-col items-center">

      {currentStep > 1 && (
        <>
          <h1 className="text-3xl font-bold tracking-tight mb-2 text-center">{t('title')}</h1>
          <p className="text-zinc-500 mb-8 max-w-lg text-center">
            Follow these steps to quickly get OpenClaw running on your preferred environment.
          </p>
          <InstallationStepper currentStep={currentStep} />
        </>
      )}

      {currentStep === 1 && <EnvironmentStep />}
      {currentStep === 2 && <SSHConnectionStep />}
      {currentStep === 3 && (
        <div className="w-full mt-6 p-8 flex flex-col items-center justify-center border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-lg">
          <p className="text-zinc-500 mb-4">Step 3: Keys Setup (Coming soon)</p>
        </div>
      )}
      {currentStep === 4 && (
        <div className="w-full mt-6 p-8 flex flex-col items-center justify-center border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-lg">
          <p className="text-zinc-500 mb-4">Step 4: Installation (Coming soon)</p>
        </div>
      )}

    </div>
  );
}
