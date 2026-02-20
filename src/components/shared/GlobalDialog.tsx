'use client';

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useDialogStore } from "@/store/useDialogStore";
import { useTranslations } from 'next-intl';

export function GlobalDialog() {
    const { isOpen, options, close } = useDialogStore();
    const tc = useTranslations('Common');

    if (!options) return null;

    const handleConfirm = () => {
        if (options.onConfirm) options.onConfirm();
        close();
    };

    const handleCancel = () => {
        if (options.onCancel) options.onCancel();
        close();
    };

    return (
        <AlertDialog open={isOpen} onOpenChange={(open) => !open && close()}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>{options.title}</AlertDialogTitle>
                    <AlertDialogDescription>
                        {options.description}
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    {options.type === 'confirm' && (
                        <AlertDialogCancel onClick={handleCancel}>
                            {options.cancelText || tc('cancel')}
                        </AlertDialogCancel>
                    )}
                    <AlertDialogAction
                        onClick={handleConfirm}
                        className={options.variant === 'destructive' ? 'bg-destructive text-destructive-foreground hover:bg-destructive/90' : ''}
                    >
                        {options.confirmText || tc('confirm')}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
