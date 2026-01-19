import React from 'react';
import { useTranslation } from 'react-i18next';
import { Globe } from 'lucide-react';

const LanguageSwitcher: React.FC = () => {
    const { i18n, t } = useTranslation();

    const toggleLanguage = () => {
        const currentLang = i18n.language;
        const nextLang = currentLang === 'en' ? 'zh' : 'en';
        i18n.changeLanguage(nextLang);
    };

    return (
        <button
            onClick={toggleLanguage}
            className="flex items-center space-x-1 text-slate-600 hover:text-slate-900 transition-colors p-2 rounded-md hover:bg-slate-100"
            aria-label="Switch Language"
            title={t('language.title')}
        >
            <Globe size={20} />
            <span className="text-sm font-medium uppercase">{i18n.language === 'zh' || i18n.language?.startsWith('zh') ? 'EN' : '中'}</span>
        </button>
    );
};

export default LanguageSwitcher;
