'use client';

import { Terminal, Download, Mail } from 'lucide-react';

export default function About() {
  return (
    <section className="absolute inset-0 flex items-center justify-center px-6 pointer-events-none pt-20 pb-10">
      <div className="max-w-5xl w-full pointer-events-auto glass-panel rounded-3xl p-8 md:p-12 overflow-y-auto max-h-full custom-scrollbar">
        <div className="flex flex-col md:flex-row gap-12">
           <div className="flex-1">
             <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-emerald-100 dark:bg-emerald-500/10 rounded-xl text-emerald-600 dark:text-emerald-400">
                    <Terminal className="w-6 h-6" />
                </div>
                <h2 className="text-3xl font-bold text-slate-900 dark:text-white">About Me</h2>
             </div>

             <div className="prose prose-slate dark:prose-invert">
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-6 text-lg">
                I engineer systems that scale. With over 5 years of experience in distributed systems and 3D web technologies, I bridge the gap between low-level performance and high-level interactivity.
                </p>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-8">
                Currently building the next generation of developer tools at <strong className="text-slate-900 dark:text-white">Nexus Industries</strong>. I specialize in Next.js, WebGL, and Rust.
                </p>
             </div>

             <div className="flex flex-wrap gap-4">
                <button className="glass-button px-6 py-3 rounded-xl flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-white">
                   <Download className="w-4 h-4" /> Download Resume
                </button>
                <button className="glass-button px-6 py-3 rounded-xl flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-white">
                   <Mail className="w-4 h-4" /> Contact Me
                </button>
             </div>
           </div>

           <div className="flex-1 space-y-8">
             {[
                 { label: "Frontend", color: "bg-blue-500", items: ["React / Next.js", "Three.js / WebGL", "Tailwind CSS", "TypeScript"] },
                 { label: "Backend", color: "bg-purple-500", items: ["Node.js / Bun", "PostgreSQL", "Redis", "Docker / K8s"] },
                 { label: "Design", color: "bg-pink-500", items: ["Figma", "Blender", "UI/UX Systems", "Motion Design"] }
             ].map((skill, i) => (
                 <div key={i}>
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">{skill.label}</h3>
                    <div className="grid grid-cols-2 gap-3">
                        {skill.items.map(item => (
                            <div key={item} className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5">
                                <div className={`w-2 h-2 rounded-full ${skill.color}`}></div>
                                <span className="text-sm font-medium text-slate-700 dark:text-slate-200">{item}</span>
                            </div>
                        ))}
                    </div>
                 </div>
             ))}
           </div>
        </div>
      </div>
    </section>
  );
}
