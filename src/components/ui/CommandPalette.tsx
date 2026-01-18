'use client';

import { useEffect, useState, useRef } from 'react';
import { Search, Code, User, Mail, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface CommandPaletteProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  setSection: (section: string) => void;
}

export default function CommandPalette({ isOpen, setIsOpen, setSection }: CommandPaletteProps) {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
        setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  const commands = [
    { id: 'projects', label: 'Go to Projects', icon: Code, action: () => setSection('projects') },
    { id: 'about', label: 'Go to About Me', icon: User, action: () => setSection('about') },
    { id: 'contact', label: 'Go to Contact', icon: Mail, action: () => setSection('contact') },
    { id: 'hero', label: 'Go Home', icon: Zap, action: () => setSection('hero') },
  ];

  const filtered = commands.filter(c => c.label.toLowerCase().includes(query.toLowerCase()));

  const handleSelect = (action: () => void) => {
    action();
    setIsOpen(false);
    setQuery('');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-start justify-center pt-[20vh] px-4 bg-black/20 backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        >
          <motion.div
            initial={{ scale: 0.95, y: -20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.95, y: -20 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-white/10 rounded-xl shadow-2xl overflow-hidden backdrop-blur-xl"
          >
            {/* Search Header */}
            <div className="flex items-center px-4 py-3 border-b border-slate-200 dark:border-white/10 gap-3">
              <Search className="w-5 h-5 text-slate-400" />
              <input
                ref={inputRef}
                type="text"
                placeholder="Type a command or search..."
                className="flex-1 bg-transparent outline-none text-slate-800 dark:text-slate-100 placeholder-slate-400"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              <div className="text-xs font-mono text-slate-400 border border-slate-200 dark:border-white/10 px-1.5 py-0.5 rounded">ESC</div>
            </div>

            {/* Results */}
            <div className="p-2 max-h-[300px] overflow-y-auto">
              {filtered.length > 0 ? (
                <div className="space-y-1">
                    <div className="px-2 py-1.5 text-xs font-semibold text-slate-400 uppercase tracking-wider">Navigation</div>
                    {filtered.map((cmd) => (
                        <button
                        key={cmd.id}
                        onClick={() => handleSelect(cmd.action)}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/5 transition-colors group"
                        >
                        <div className="p-2 bg-slate-100 dark:bg-white/5 rounded-md text-slate-500 group-hover:text-blue-500 transition-colors">
                            <cmd.icon className="w-4 h-4" />
                        </div>
                        <span>{cmd.label}</span>
                        </button>
                    ))}
                </div>
              ) : (
                <div className="p-8 text-center text-slate-500">
                    No results found.
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="px-4 py-2 bg-slate-50 dark:bg-white/5 border-t border-slate-200 dark:border-white/10 flex justify-between items-center text-[10px] text-slate-500">
                <div className="flex gap-2">
                    <span>Select <kbd className="font-sans">↵</kbd></span>
                    <span>Navigate <kbd className="font-sans">↑↓</kbd></span>
                </div>
                <div>Nexus OS 2.6</div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
