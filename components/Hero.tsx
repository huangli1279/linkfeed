import React from 'react';
import { ArrowRight, Zap } from 'lucide-react';
import logo from '@/assets/icons/logo48.png';
import chatgptLogo from '@/assets/ai-logos/chatgpt.svg';
import geminiLogo from '@/assets/ai-logos/gemini.svg';
import doubaoLogo from '@/assets/ai-logos/doubao.svg';
import deepseekLogo from '@/assets/ai-logos/deepseek.svg';
import yuanbaoLogo from '@/assets/ai-logos/yuanbao.svg';
import grokLogo from '@/assets/ai-logos/grok.svg';
import claudeLogo from '@/assets/ai-logos/claude.svg';
import kimiLogo from '@/assets/ai-logos/kimi.svg';
import qwenLogo from '@/assets/ai-logos/qianwen.svg';

const Hero: React.FC = () => {
  return (
    <div className="relative overflow-hidden pt-16 pb-24 lg:pt-32 lg:pb-40">
      {/* Background decoration */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-brand-100 rounded-full blur-3xl opacity-30 translate-x-1/3 -translate-y-1/4"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-100 rounded-full blur-3xl opacity-30 -translate-x-1/4 translate-y-1/4"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center">

          {/* Left Column: Text */}
          <div className="max-w-2xl">
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-brand-50 border border-brand-100 text-brand-600 text-xs font-semibold uppercase tracking-wide mb-6">
              <Zap size={14} className="mr-1.5" />
              Manifest V3 Ready
            </div>
            <h1 className="text-4xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-tight mb-6">
              Don't copy-paste, <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 to-purple-600">
                just feed it.
              </span>
            </h1>
            <p className="text-lg text-slate-600 mb-8 leading-relaxed max-w-lg">
              Instantly inject the current webpage URL into your favorite AI chat services. No more manual copying, pasting, and writing context prompts.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-10">
              <a
                href="https://chromewebstore.google.com/detail/linkfeed-ai-context-reade/objjmehgikoblklomllillnlblgfbfgb"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center px-8 py-3.5 text-base font-bold text-white bg-slate-900 rounded-xl hover:bg-slate-800 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
              >
                Install for Chrome
                <ArrowRight size={18} className="ml-2" />
              </a>
              <a
                href="https://github.com/huangli1279/linkfeed/releases/download/v1.0.0/objjmehgikoblklomllillnlblgfbfgb.crx"
                className="flex items-center justify-center px-8 py-3.5 text-base font-bold text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm hover:shadow-md hover:-translate-y-0.5"
              >
                Download CRX
                <ArrowRight size={18} className="ml-2" />
              </a>
            </div>

            <p className="text-sm text-slate-500">
              Open source & privacy focused. Your data stays local.
            </p>
          </div>

          {/* Right Column: Visual Mockup */}
          <div className="relative flex justify-center lg:justify-end animate-float">
            {/* The "Extension" UI Mockup */}
            <div className="relative w-[340px] bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden z-20">
              {/* Header */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 bg-slate-50/50">
                <div className="flex items-center space-x-2">
                  <img src={logo} alt="LinkFeed" className="w-6 h-6 rounded-md" />
                  <span className="font-bold text-slate-800">LinkFeed</span>
                </div>
              </div>

              {/* Subheader */}
              <div className="px-5 py-3 text-xs text-center text-slate-500 bg-slate-50 border-b border-slate-100">
                Select an AI to analyze this page
              </div>

              {/* Grid */}
              <div className="grid grid-cols-3 gap-3 p-5 bg-white">
                <MockAppIcon color="text-emerald-600" bg="bg-emerald-50" label="ChatGPT" icon={chatgptLogo} />
                <MockAppIcon color="text-blue-600" bg="bg-blue-50" label="Gemini" icon={geminiLogo} />
                <MockAppIcon color="text-purple-600" bg="bg-purple-50" label="Doubao" icon={doubaoLogo} />
                <MockAppIcon color="text-sky-600" bg="bg-sky-50" label="DeepSeek" icon={deepseekLogo} />
                <MockAppIcon color="text-green-600" bg="bg-green-50" label="Yuanbao" icon={yuanbaoLogo} />
                <MockAppIcon color="text-slate-800" bg="bg-slate-100" label="Grok" icon={grokLogo} />
                <MockAppIcon color="text-orange-600" bg="bg-orange-50" label="Claude" icon={claudeLogo} />
                <MockAppIcon color="text-indigo-600" bg="bg-indigo-50" label="Kimi" icon={kimiLogo} />
                <MockAppIcon color="text-violet-600" bg="bg-violet-50" label="Qwen" icon={qwenLogo} />
              </div>

              {/* Footer */}
              <div className="px-5 py-3 border-t border-slate-100 bg-slate-50 flex justify-center">
                <div className="w-8 h-1 rounded-full bg-slate-200"></div>
              </div>
            </div>

            {/* Decorative elements behind the mock */}
            <div className="absolute -z-10 top-10 -right-10 w-full h-full bg-slate-900 rounded-2xl opacity-5 transform rotate-6 scale-95"></div>
            <div className="absolute -z-10 -bottom-10 -left-10 w-32 h-32 bg-brand-500 rounded-full blur-3xl opacity-20"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper for the mockup grid
const MockAppIcon = ({ color, bg, label, icon }: { color: string, bg: string, label: string, icon: string }) => (
  <div className={`flex flex-col items-center justify-center p-3 rounded-xl border border-transparent hover:border-brand-200 hover:shadow-sm hover:scale-105 transition-all cursor-pointer group ${bg} bg-opacity-40 hover:bg-opacity-100`}>
    <div className={`mb-2 w-6 h-6 group-hover:scale-110 transition-transform`}>
      <img src={icon} alt={label} className="w-full h-full object-contain" />
    </div>
    <span className="text-[10px] font-medium text-slate-600">{label}</span>
  </div>
);

export default Hero;
