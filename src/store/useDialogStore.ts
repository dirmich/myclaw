import { create } from 'zustand';

interface DialogOptions {
    title: string;
    description: string;
    confirmText?: string;
    cancelText?: string;
    onConfirm?: () => void;
    onCancel?: () => void;
    variant?: 'default' | 'destructive';
    type: 'alert' | 'confirm';
}

interface DialogState {
    isOpen: boolean;
    options: DialogOptions | null;
    alert: (options: Omit<DialogOptions, 'type'>) => void;
    confirm: (options: Omit<DialogOptions, 'type'>) => void;
    close: () => void;
}

export const useDialogStore = create<DialogState>((set) => ({
    isOpen: false,
    options: null,
    alert: (options) => set({ isOpen: true, options: { ...options, type: 'alert' } }),
    confirm: (options) => set({ isOpen: true, options: { ...options, type: 'confirm' } }),
    close: () => set({ isOpen: false }),
}));
