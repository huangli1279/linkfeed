import React from 'react';
import { ExternalLink } from 'lucide-react';
import chatgptLogo from '@/assets/ai-logos/chatgpt.svg';
import claudeLogo from '@/assets/ai-logos/claude.svg';
import geminiLogo from '@/assets/ai-logos/gemini.svg';
import deepseekLogo from '@/assets/ai-logos/deepseek.svg';
import kimiLogo from '@/assets/ai-logos/kimi.svg';
import doubaoLogo from '@/assets/ai-logos/doubao.svg';
import grokLogo from '@/assets/ai-logos/grok.svg';
import qianwenLogo from '@/assets/ai-logos/qianwen.svg';
import yuanbaoLogo from '@/assets/ai-logos/yuanbao.svg';

const AIService: React.FC<{ name: string, description: string, color: string, logo: string, url: string }> = ({ name, description, color, logo, url }) => (
  <a 
    href={url} 
    target="_blank" 
    rel="noopener noreferrer"
    className="block bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-md hover:border-brand-100 transition-all duration-300 group cursor-pointer"
  >
    <div className={`w-12 h-12 rounded-xl ${color} flex items-center justify-center mb-4 text-xl shadow-sm group-hover:scale-110 transition-transform p-2`}>
      <img src={logo} alt={`${name} logo`} className="w-full h-full object-contain" />
    </div>
    <h3 className="text-lg font-bold text-slate-900 mb-2 flex items-center">
      {name}
      <ExternalLink size={14} className="ml-2 text-slate-300 group-hover:text-brand-400 transition-colors opacity-0 group-hover:opacity-100" />
    </h3>
    <p className="text-sm text-slate-500">{description}</p>
  </a>
);

const SupportedAI: React.FC = () => {
  const services = [
    { 
      name: 'ChatGPT', 
      description: 'OpenAI\'s leading conversational model.', 
      color: 'bg-emerald-50', 
      logo: chatgptLogo,
      url: 'https://chatgpt.com'
    },
    { 
      name: 'Gemini', 
      description: 'Google\'s multimodal AI assistant.', 
      color: 'bg-blue-50', 
      logo: geminiLogo,
      url: 'https://gemini.google.com'
    },
    { 
      name: 'Doubao', 
      description: 'ByteDance\'s helpful AI assistant.', 
      color: 'bg-purple-50', 
      logo: doubaoLogo,
      url: 'https://www.doubao.com'
    },
    { 
      name: 'DeepSeek', 
      description: 'Advanced coding and reasoning model.', 
      color: 'bg-sky-50', 
      logo: deepseekLogo,
      url: 'https://chat.deepseek.com'
    },
    {
      name: 'Yuanbao',
      description: 'Tencent\'s helpful AI assistant.',
      color: 'bg-blue-50', 
      logo: yuanbaoLogo,
      url: 'https://yuanbao.tencent.com'
    },
    {
      name: 'Grok',
      description: 'X\'s AI with real-time knowledge.',
      color: 'bg-slate-100', 
      logo: grokLogo,
      url: 'https://x.com/i/grok'
    },
    { 
      name: 'Claude', 
      description: 'Anthropic\'s AI, great for analysis.', 
      color: 'bg-orange-50', 
      logo: claudeLogo,
      url: 'https://claude.ai'
    },
    { 
      name: 'Kimi', 
      description: 'Moonshot AI with long context support.', 
      color: 'bg-slate-100', 
      logo: kimiLogo,
      url: 'https://kimi.moonshot.cn'
    },
    {
      name: 'Tongyi Qianwen',
      description: 'Alibaba\'s versatile language model.',
      color: 'bg-indigo-50', 
      logo: qianwenLogo,
      url: 'https://tongyi.aliyun.com'
    }
  ];

  return (
    <section className="py-24 bg-slate-50 border-y border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-base font-semibold text-brand-600 tracking-wide uppercase">Integrations</h2>
          <p className="mt-2 text-3xl font-extrabold text-slate-900 sm:text-4xl">
            Works with your favorite AI tools
          </p>
          <p className="mt-4 text-lg text-slate-600">
            LinkFeed automatically detects the correct input field for these services and injects your context seamlessly.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service) => (
            <AIService key={service.name} {...service} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default SupportedAI;