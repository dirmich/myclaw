'use client';

import { useLocale, useTranslations } from 'next-intl';
import { useRouter, usePathname } from '@/i18n/routing';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

export default function LocaleSwitcher() {
    const locale = useLocale();
    const router = useRouter();
    const pathname = usePathname();

    const handleLocaleChange = (newLocale: string) => {
        router.replace(pathname, { locale: newLocale });
    };

    return (
        <Select value={locale} onValueChange={handleLocaleChange}>
            <SelectTrigger className="w-[180px] bg-white dark:bg-zinc-950">
                <SelectValue placeholder="언어 선택 (Select Language)" />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="en">English (영어)</SelectItem>
                <SelectItem value="ko">한국어 (Korean)</SelectItem>
                <SelectItem value="jp">日本語 (Japanese)</SelectItem>
                <SelectItem value="cn">中文 (Chinese)</SelectItem>
                <SelectItem value="es">Español (Spanish)</SelectItem>
            </SelectContent>
        </Select>
    );
}
