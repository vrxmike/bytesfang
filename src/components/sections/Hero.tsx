'use client';

import { ChevronRight } from 'lucide-react';

interface HeroProps {
    setActiveSection: (section: string) => void;
    setCommandOpen: (open: boolean) => void;
}

export default function Hero({ setActiveSection, setCommandOpen }: HeroProps) {
  return (
    <section className="absolute inset-0 flex items-center px-8 md:px-24 pointer-events-none">
      <div className="max-w-4xl pointer-events-auto">
         <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-500/10 border border-blue-100 dark:border-blue-500/20 text-blue-600 dark:text-blue-400 text-xs font-medium mb-6 backdrop-blur-sm">
           <span className="relative flex h-2 w-2">
             <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
             <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
           </span>
           Available for work
         </div>

         <h1 className="text-6xl md:text-8xl font-bold leading-tight mb-6 tracking-tight text-slate-900 dark:text-white">
           Building the <br/>
           <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-purple-500">
             Digital Future
           </span>
         </h1>

         <p className="text-xl text-slate-600 dark:text-slate-300 mb-10 max-w-xl leading-relaxed">
           Senior Full Stack Engineer combining WebGL visuals with robust distributed systems. Crafting the web of tomorrow, today.
         </p>

         <div className="flex flex-wrap gap-4">
           <button
             onClick={() => setActiveSection('projects')}
             className="bg-slate-900 dark:bg-white text-white dark:text-black px-8 py-4 font-bold rounded-xl hover:opacity-90 transition-opacity flex items-center gap-2 shadow-xl shadow-blue-900/10"
           >
             View Work <ChevronRight className="w-4 h-4" />
           </button>
           <button
             onClick={() => setCommandOpen(true)}
             className="glass-button px-8 py-4 font-medium rounded-xl text-slate-700 dark:text-white"
           >
             Press Cmd+K
           </button>
         </div>
      </div>
    </section>
  );
}
