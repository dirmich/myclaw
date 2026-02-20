import { create } from 'zustand';

interface SSHConfig {
    host: string;
    port: number;
    username: string;
    authType: 'password' | 'key';
    password?: string;
    privateKey?: string;
}

interface InstallState {
    currentStep: number;
    environment: string;
    sshConfig: SSHConfig;
    aiKey: string;
    telegramToken: string;
    installStatus: 'idle' | 'installing' | 'success' | 'error';
    installProgress: number;
    installLogs: string[];
    isWizardStarted: boolean;
    setStep: (step: number) => void;
    setEnvironment: (env: string) => void;
    setSSHConfig: (config: Partial<SSHConfig>) => void;
    setKeys: (aiKey: string, telegramToken: string) => void;
    setInstallStatus: (status: 'idle' | 'installing' | 'success' | 'error') => void;
    setInstallProgress: (progress: number) => void;
    addInstallLog: (log: string) => void;
    startWizard: () => void;
}

export const useInstallStore = create<InstallState>((set) => ({
    currentStep: 1,
    environment: '',
    sshConfig: {
        host: '',
        port: 22,
        username: 'root',
        authType: 'password',
    },
    aiKey: '',
    telegramToken: '',
    installStatus: 'idle',
    installProgress: 0,
    installLogs: [],
    isWizardStarted: false,
    setStep: (step) => set({ currentStep: step }),
    setEnvironment: (env) => set({ environment: env }),
    setSSHConfig: (config) =>
        set((state) => ({ sshConfig: { ...state.sshConfig, ...config } })),
    setKeys: (aiKey, telegramToken) => set({ aiKey, telegramToken }),
    setInstallStatus: (status) => set({ installStatus: status }),
    setInstallProgress: (progress) => set({ installProgress: progress }),
    addInstallLog: (log) => set((state) => ({ installLogs: [...state.installLogs, log] })),
    startWizard: () => set({ isWizardStarted: true }),
}));
