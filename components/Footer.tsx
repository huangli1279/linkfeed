import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Github, Twitter } from 'lucide-react';

const Footer: React.FC = () => {
  const { t } = useTranslation();
  return (
    <footer className="bg-white border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <span className="font-bold text-xl tracking-tight text-slate-900">LinkFeed</span>
            <p className="text-sm text-slate-500 mt-1">{t('footer.slogan')}</p>
          </div>

          <div className="flex space-x-6">
            <a href="https://github.com/huangli1279/linkfeed" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-slate-900 transition-colors">
              <span className="sr-only">GitHub</span>
              <Github size={24} />
            </a>
            {/* <a href="#" className="text-slate-400 hover:text-blue-400 transition-colors">
              <span className="sr-only">Twitter</span>
              <Twitter size={24} />
            </a> */}
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-slate-100 flex flex-col md:flex-row justify-between text-sm text-slate-500">
          <p>&copy; {new Date().getFullYear()} {t('footer.copyright')}</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link to="/privacy-policy" className="hover:text-slate-900">{t('footer.privacy')}</Link>
            {/* <a href="#" className="hover:text-slate-900">Terms</a> */}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
