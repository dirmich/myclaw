'use client';

import { useInstallStore } from '@/store/useInstallStore';
import EnvironmentStep from '@/components/features/EnvironmentStep';
import SSHConnectionStep from '@/components/features/SSHConnectionStep';
import KeysSetupStep from '@/components/features/KeysSetupStep';
import InstallProgressStep from '@/components/features/InstallProgressStep';
import LandingPage from '@/components/features/LandingPage';
import InstallationStepper from '@/components/features/InstallationStepper';
import { useTranslations } from 'next-intl';

export default function MainPage() {
  const { currentStep, isWizardStarted } = useInstallStore();
  const t = useTranslations('Index');

  if (!isWizardStarted) {
    return <LandingPage />;
  }

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
      {currentStep === 3 && <KeysSetupStep />}
      {currentStep === 4 && <InstallProgressStep />}
    </div>
  );
}
