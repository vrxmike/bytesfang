'use client';

import { cn } from '@/lib/utils';
import { Command, Github, Linkedin } from 'lucide-react';

interface NavigationProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
  setCommandOpen: (open: boolean) => void;
}

export default function Navigation({ activeSection, setActiveSection, setCommandOpen }: NavigationProps) {
  const navItems = [
    { id: 'hero', label: 'Home' },
    { id: 'projects', label: 'Work' },
    { id: 'about', label: 'Info' },
    { id: 'contact', label: 'Contact' },
  ];

  return (
    <nav className="fixed top-0 left-0 w-full z-40 p-6 flex justify-between items-center pointer-events-none">
      {/* Brand */}
      <div
        className="pointer-events-auto flex items-center gap-3 cursor-pointer group"
        onClick={() => setActiveSection('hero')}
      >
        <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform duration-300 text-white font-bold font-mono">
          N
        </div>
        <div className="hidden sm:block text-slate-800 dark:text-white">
          <h1 className="font-bold text-lg tracking-tight">Nexus<span className="text-blue-500">.Dev</span></h1>
          <p className="text-[10px] text-slate-500 dark:text-slate-400 font-mono tracking-widest uppercase">Portfolio 2026</p>
        </div>
      </div>

      {/* Center Nav Pills */}
      <div className="pointer-events-auto glass-panel rounded-full px-2 py-1.5 hidden md:flex gap-1 shadow-sm">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveSection(item.id)}
            className={cn(
              "px-4 py-1.5 text-sm font-medium rounded-full transition-all duration-300",
              activeSection === item.id
                ? "bg-white dark:bg-white/10 text-slate-900 dark:text-white shadow-sm"
                : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            )}
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* Right Actions */}
      <div className="pointer-events-auto flex items-center gap-3">
        <button
          onClick={() => setCommandOpen(true)}
          className="glass-button px-3 py-2 rounded-lg flex items-center gap-2 text-xs font-mono text-slate-600 dark:text-slate-300 group"
        >
          <Command className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">CMD+K</span>
        </button>

        <div className="h-8 w-[1px] bg-slate-200 dark:bg-white/10 hidden sm:block"></div>

        <div className="flex gap-2">
            <button className="glass-button p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:text-blue-500 transition-colors">
                <Github className="w-5 h-5" />
            </button>
            <button className="glass-button p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:text-blue-500 transition-colors">
                <Linkedin className="w-5 h-5" />
            </button>
        </div>
      </div>
    </nav>
  );
}
