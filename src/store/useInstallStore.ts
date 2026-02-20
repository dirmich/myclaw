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
    setStep: (step: number) => void;
    setEnvironment: (env: string) => void;
    setSSHConfig: (config: Partial<SSHConfig>) => void;
    setKeys: (aiKey: string, telegramToken: string) => void;
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
    setStep: (step) => set({ currentStep: step }),
    setEnvironment: (env) => set({ environment: env }),
    setSSHConfig: (config) =>
        set((state) => ({ sshConfig: { ...state.sshConfig, ...config } })),
    setKeys: (aiKey, telegramToken) => set({ aiKey, telegramToken }),
}));
