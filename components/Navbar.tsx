import React from 'react';
import { Link2, Github } from 'lucide-react';
import logo from '@/assets/icons/logo48.png';

const Navbar: React.FC = () => {
  return (
    <nav className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-2 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <img src={logo} alt="LinkFeed Logo" className="w-8 h-8 rounded-lg" />
            <span className="font-bold text-xl tracking-tight text-slate-900">LinkFeed</span>
          </div>
          
          <div className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-sm font-medium text-slate-600 hover:text-brand-600 transition-colors">Features</a>
            <a href="#how-it-works" className="text-sm font-medium text-slate-600 hover:text-brand-600 transition-colors">How it Works</a>
            <a href="https://github.com/yourusername/link-helper" target="_blank" rel="noopener noreferrer" className="flex items-center space-x-2 text-slate-600 hover:text-slate-900 transition-colors">
              <Github size={20} />
            </a>
            <a href="https://github.com/yourusername/link-helper" className="px-4 py-2 text-sm font-semibold text-white bg-brand-600 hover:bg-brand-700 rounded-full transition-all shadow-sm hover:shadow-md">
              Download Extension
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;