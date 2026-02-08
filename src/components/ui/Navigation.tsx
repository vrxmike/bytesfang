'use client';

import { cn } from '@/lib/utils';
import { Command, Github, Linkedin, Menu, X } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { useState } from 'react';

interface NavigationProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
  setCommandOpen: (open: boolean) => void;
}

export default function Navigation({ activeSection, setActiveSection, setCommandOpen }: NavigationProps) {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { id: 'hero', label: 'Home' },
    { id: 'projects', label: 'Work' },
    { id: 'about', label: 'Info' },
    { id: 'contact', label: 'Contact' },
  ];

  const handleMobileNav = (sectionId: string) => {
    setActiveSection(sectionId);
    setIsOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 w-full z-40 p-4 md:p-6 flex justify-between items-center pointer-events-none">
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

      {/* Center Nav Pills (Desktop) */}
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

      {/* Right Actions (Desktop) */}
      <div className="pointer-events-auto hidden md:flex items-center gap-3">
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

      {/* Mobile Hamburger (Sheet) */}
      <div className="pointer-events-auto md:hidden">
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <button className="glass-button p-2.5 rounded-lg text-slate-900 dark:text-white">
              <Menu className="w-6 h-6" />
            </button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[300px] sm:w-[350px] pt-12 glass-panel border-l border-white/10">
            <SheetHeader className="mb-8">
              <SheetTitle className="text-left flex items-center gap-3">
                 <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-lg flex items-center justify-center text-white font-bold font-mono text-sm">
                  N
                </div>
                <span className="font-bold text-lg text-slate-900 dark:text-white">Nexus.Dev</span>
              </SheetTitle>
            </SheetHeader>

            <div className="flex flex-col gap-2">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleMobileNav(item.id)}
                  className={cn(
                    "w-full text-left px-4 py-3 rounded-xl transition-all duration-200 text-base font-medium",
                    activeSection === item.id
                      ? "bg-blue-500 text-white shadow-lg shadow-blue-500/20"
                      : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5"
                  )}
                >
                  {item.label}
                </button>
              ))}

               <div className="h-[1px] w-full bg-slate-200 dark:bg-white/10 my-4"></div>

               <button
                onClick={() => {
                  setCommandOpen(true);
                  setIsOpen(false);
                }}
                className="w-full text-left px-4 py-3 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5 flex items-center gap-3"
              >
                <Command className="w-5 h-5" />
                Command Palette
              </button>

               <div className="flex gap-2 mt-4 px-4">
                  <button className="glass-button p-3 rounded-xl flex-1 flex items-center justify-center gap-2 text-slate-600 dark:text-slate-300 hover:text-blue-500 transition-colors">
                      <Github className="w-5 h-5" />
                  </button>
                  <button className="glass-button p-3 rounded-xl flex-1 flex items-center justify-center gap-2 text-slate-600 dark:text-slate-300 hover:text-blue-500 transition-colors">
                      <Linkedin className="w-5 h-5" />
                  </button>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </nav>
  );
}
