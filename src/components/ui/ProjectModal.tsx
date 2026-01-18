'use client';

import { X, ExternalLink } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export interface Project {
    id: number;
    title: string;
    desc: string;
    longDesc: string;
    tags: string[];
    icon: React.ReactNode;
}

interface ProjectModalProps {
  project: Project | null;
  onClose: () => void;
}

export default function ProjectModal({ project, onClose }: ProjectModalProps) {
  return (
    <AnimatePresence>
      {project && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-end md:pr-0 bg-black/40 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg h-full bg-white dark:bg-slate-950 border-l border-slate-200 dark:border-white/10 p-8 flex flex-col shadow-2xl overflow-y-auto"
          >
            {/* Header */}
            <div className="flex justify-between items-start mb-8">
              <div className="p-4 bg-blue-50 dark:bg-blue-500/10 rounded-2xl text-blue-600 dark:text-blue-400">
                {project.icon}
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-slate-100 dark:hover:bg-white/10 rounded-full transition-colors"
              >
                <X className="w-6 h-6 text-slate-400" />
              </button>
            </div>

            {/* Content */}
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">{project.title}</h2>

            <div className="flex items-center gap-2 mb-8">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
              <span className="text-xs font-semibold tracking-wide text-slate-500 uppercase">Deployed & Live</span>
            </div>

            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-8 text-lg">
              {project.longDesc}
            </p>

            <div className="space-y-8 mb-8">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-3">Tech Stack</h3>
                <div className="flex flex-wrap gap-2">
                  {project.tags.map(tag => (
                    <span key={tag} className="px-3 py-1 bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-full text-xs font-medium text-slate-600 dark:text-slate-300">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-3">Stats</h3>
                <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5">
                        <div className="text-xs text-slate-500 uppercase mb-1">Performance</div>
                        <div className="text-xl font-bold text-emerald-500">99/100</div>
                    </div>
                    <div className="p-4 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5">
                        <div className="text-xs text-slate-500 uppercase mb-1">Users</div>
                        <div className="text-xl font-bold text-blue-500">10k+</div>
                    </div>
                </div>
              </div>
            </div>

            {/* Footer Action */}
            <div className="mt-auto pt-8 border-t border-slate-100 dark:border-white/10">
              <button className="w-full bg-slate-900 dark:bg-white text-white dark:text-black font-bold py-4 rounded-xl flex items-center justify-center gap-2 hover:opacity-90 transition-opacity">
                View Project <ExternalLink className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
