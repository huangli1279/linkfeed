import React from 'react';
import { ExternalLink } from 'lucide-react';
import chatgptLogo from '@/assets/ai-logos/chatgpt.svg';
import claudeLogo from '@/assets/ai-logos/claude.svg';
import geminiLogo from '@/assets/ai-logos/gemini.svg';
import deepseekLogo from '@/assets/ai-logos/deepseek.svg';
import kimiLogo from '@/assets/ai-logos/kimi.svg';
import doubaoLogo from '@/assets/ai-logos/doubao.svg';

const AIService: React.FC<{ name: string, description: string, color: string, logo: string }> = ({ name, description, color, logo }) => (
  <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-md hover:border-brand-100 transition-all duration-300 group">
    <div className={`w-12 h-12 rounded-xl ${color} flex items-center justify-center mb-4 text-white font-bold text-xl shadow-sm group-hover:scale-110 transition-transform p-2`}>
      <img src={logo} alt={`${name} logo`} className="w-full h-full object-contain filter brightness-0 invert" />
    </div>
    <h3 className="text-lg font-bold text-slate-900 mb-2 flex items-center">
      {name}
      <ExternalLink size={14} className="ml-2 text-slate-300 group-hover:text-brand-400 transition-colors opacity-0 group-hover:opacity-100" />
    </h3>
    <p className="text-sm text-slate-500">{description}</p>
  </div>
);

const SupportedAI: React.FC = () => {
  const services = [
    { name: 'ChatGPT', description: 'OpenAI\'s leading conversational model.', color: 'bg-emerald-500', logo: chatgptLogo },
    { name: 'Claude', description: 'Anthropic\'s AI, great for analysis.', color: 'bg-orange-600', logo: claudeLogo },
    { name: 'Gemini', description: 'Google\'s multimodal AI assistant.', color: 'bg-blue-500', logo: geminiLogo },
    { name: 'DeepSeek', description: 'Advanced coding and reasoning model.', color: 'bg-sky-600', logo: deepseekLogo },
    { name: 'Kimi', description: 'Moonshot AI with long context support.', color: 'bg-slate-800', logo: kimiLogo },
    { name: 'Doubao', description: 'ByteDance\'s helpful AI assistant.', color: 'bg-purple-500', logo: doubaoLogo },
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
