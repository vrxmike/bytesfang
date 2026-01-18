'use client';

import { ExternalLink } from 'lucide-react';
import { Project } from '../ui/ProjectModal';

interface ProjectsProps {
    projects: Project[];
    onSelectProject: (p: Project) => void;
}

export default function Projects({ projects, onSelectProject }: ProjectsProps) {
  return (
    <section className="absolute inset-0 flex items-center justify-end px-4 md:px-24 pointer-events-none">
      <div className="w-full max-w-md pointer-events-auto flex flex-col gap-4 h-[75vh] md:h-[85vh] pt-20 overflow-y-auto pr-2 pb-20 custom-scrollbar">
        <div className="sticky top-0 z-10 py-4 mb-2 bg-gradient-to-b from-[#f8fafc] via-[#f8fafc] to-transparent dark:from-[#0f172a] dark:via-[#0f172a]">
           <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Selected Works</h2>
           <p className="text-sm text-slate-500">2024 — 2026</p>
        </div>

        {projects.map((p) => (
          <div
            key={p.id}
            onClick={() => onSelectProject(p)}
            className="group glass-panel p-6 rounded-2xl hover:border-blue-500/30 transition-all cursor-pointer transform hover:-translate-y-1 hover:shadow-2xl"
          >
            <div className="flex justify-between items-start mb-4">
               <div className="p-3 bg-slate-100 dark:bg-white/5 rounded-xl text-slate-900 dark:text-white group-hover:bg-blue-500 group-hover:text-white transition-colors duration-300">
                   {p.icon}
               </div>
               <div className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-white/10 transition-colors">
                   <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white" />
               </div>
            </div>

            <h3 className="text-xl font-bold mb-2 text-slate-900 dark:text-white">{p.title}</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-4 leading-relaxed line-clamp-2">{p.desc}</p>

            <div className="flex flex-wrap gap-2">
              {p.tags.slice(0, 3).map(t => (
                <span key={t} className="text-[10px] font-medium bg-slate-100 dark:bg-white/5 px-2.5 py-1 rounded-full text-slate-600 dark:text-slate-300 uppercase tracking-wide">
                    {t}
                </span>
              ))}
            </div>
          </div>
        ))}
        {/* Spacer for scrolling */}
        <div className="h-10"></div>
      </div>
    </section>
  );
}
