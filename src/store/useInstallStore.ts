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
    aiProvider: string;
    aiModel: string;
    telegramToken: string;
    discordToken: string;
    installStatus: 'idle' | 'installing' | 'success' | 'error';
    installProgress: number;
    installLogs: string[];
    isWizardStarted: boolean;
    installType: 'native' | 'docker';
    gatewayToken: string;
    setStep: (step: number) => void;
    setEnvironment: (env: string) => void;
    setInstallType: (type: 'native' | 'docker') => void;
    setSSHConfig: (config: Partial<SSHConfig>) => void;
    setKeys: (aiKey: string, telegramToken: string, discordToken: string) => void;
    setAIConfig: (provider: string, model: string) => void;
    setInstallStatus: (status: 'idle' | 'installing' | 'success' | 'error') => void;
    setInstallProgress: (progress: number) => void;
    addInstallLog: (log: string) => void;
    setGatewayToken: (token: string) => void;
    startWizard: () => void;
    resetInstall: () => void;
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
    aiProvider: 'openai',
    aiModel: '',
    telegramToken: '',
    discordToken: '',
    installStatus: 'idle',
    installProgress: 0,
    installLogs: [],
    isWizardStarted: false,
    installType: 'docker',
    gatewayToken: '',
    setStep: (step) => set({ currentStep: step }),
    setEnvironment: (env) => set({ environment: env }),
    setInstallType: (type) => set({ installType: type }),
    setSSHConfig: (config) =>
        set((state) => ({ sshConfig: { ...state.sshConfig, ...config } })),
    setKeys: (aiKey, telegramToken, discordToken) => set({ aiKey, telegramToken, discordToken }),
    setAIConfig: (aiProvider, aiModel) => set({ aiProvider, aiModel }),
    setInstallStatus: (status) => set({ installStatus: status }),
    setInstallProgress: (progress) => set({ installProgress: progress }),
    addInstallLog: (log) => set((state) => ({ installLogs: [...state.installLogs, log] })),
    setGatewayToken: (token) => set({ gatewayToken: token }),
    startWizard: () => set({ isWizardStarted: true }),
    resetInstall: () => set({
        currentStep: 1,
        environment: '',
        sshConfig: {
            host: '',
            port: 22,
            username: 'root',
            authType: 'password',
        },
        aiKey: '',
        aiProvider: 'openai',
        aiModel: '',
        telegramToken: '',
        discordToken: '',
        installStatus: 'idle',
        installProgress: 0,
        installLogs: [],
        isWizardStarted: false,
        gatewayToken: '',
    }),
}));
