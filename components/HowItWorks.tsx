import React from 'react';
import { useTranslation } from 'react-i18next';

const Step = ({ number, title, desc }: { number: string, title: string, desc: string }) => (
  <div className="relative flex flex-col items-center text-center max-w-xs mx-auto">
    <div className="w-12 h-12 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-lg mb-6 shadow-lg z-10 relative">
      {number}
    </div>
    <h3 className="text-xl font-bold text-slate-900 mb-2">{title}</h3>
    <p className="text-slate-600">{desc}</p>
  </div>
);

const HowItWorks: React.FC = () => {
  const { t } = useTranslation();
  return (
    <section id="how-it-works" className="py-24 bg-slate-50 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-slate-900">{t('howItWorks.title')}</h2>
        </div>

        <div className="relative grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Connecting Line (Desktop) */}
          <div className="hidden md:block absolute top-6 left-[16%] right-[16%] h-0.5 bg-slate-200 -z-0"></div>

          <Step
            number="1"
            title={t('howItWorks.steps.browse.title')}
            desc={t('howItWorks.steps.browse.desc')}
          />
          <Step
            number="2"
            title={t('howItWorks.steps.click.title')}
            desc={t('howItWorks.steps.click.desc')}
          />
          <Step
            number="3"
            title={t('howItWorks.steps.analyze.title')}
            desc={t('howItWorks.steps.analyze.desc')}
          />
        </div>

        {/* Technical Diagram Section */}
        <div className="mt-20 bg-white rounded-3xl p-8 border border-slate-200 shadow-sm max-w-4xl mx-auto">
          <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-6">{t('howItWorks.hood')}</h3>
          <div className="font-mono text-sm bg-slate-900 text-slate-300 p-6 rounded-xl overflow-x-auto">
            <div className="flex flex-col space-y-2">
              <span className="text-green-400">User</span>
              <span className="pl-4">└── Click Extension Icon</span>
              <span className="pl-8 text-brand-400">└── LinkFeed (Service Worker)</span>
              <span className="pl-12">├── Capture activeTab URL</span>
              <span className="pl-12">├── Generate Prompt: "Read this content: [URL]..."</span>
              <span className="pl-12">└── Open New Tab (chatgpt.com)</span>
              <span className="pl-16 text-purple-400">└── Content Script</span>
              <span className="pl-20">├── Wait for DOM ready</span>
              <span className="pl-20">├── Find Input (selector logic)</span>
              <span className="pl-20">└── Inject Value & Dispatch Events</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;