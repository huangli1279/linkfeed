import React from 'react';
import { MousePointerClick, RefreshCcw, ClipboardCopy, Moon } from 'lucide-react';

const FeatureCard = ({ icon: Icon, title, desc }: { icon: any, title: string, desc: string }) => (
  <div className="flex flex-col items-start p-6 rounded-2xl transition-colors hover:bg-white hover:shadow-lg hover:shadow-slate-200/50">
    <div className="p-3 bg-brand-50 rounded-xl text-brand-600 mb-5">
      <Icon size={28} />
    </div>
    <h3 className="text-xl font-bold text-slate-900 mb-3">{title}</h3>
    <p className="text-slate-600 leading-relaxed">{desc}</p>
  </div>
);

const Features: React.FC = () => {
  return (
    <section id="features" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-slate-900 sm:text-4xl">
            Built for speed and simplicity.
          </h2>
          <p className="mt-4 text-xl text-slate-500 max-w-2xl">
            Everything you need to bridge the gap between your browser and your AI assistant.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <FeatureCard 
            icon={MousePointerClick}
            title="One-Click Feed"
            desc="Simply click an AI icon. We open the tab and fill the context automatically."
          />
          <FeatureCard 
            icon={RefreshCcw}
            title="Smart Injection"
            desc="Auto-detects when the AI chat is ready with a 10-second retry mechanism."
          />
          <FeatureCard 
            icon={ClipboardCopy}
            title="Clipboard Fallback"
            desc="If injection fails, your prompt is safely copied to the clipboard. Just paste."
          />
          <FeatureCard 
            icon={Moon}
            title="Dark Mode"
            desc="Fully compatible with system theme preferences for late-night coding sessions."
          />
        </div>
      </div>
    </section>
  );
};

export default Features;