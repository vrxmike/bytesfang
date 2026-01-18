'use client';

import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Scene from '@/components/canvas/Scene';
import Navigation from '@/components/ui/Navigation';
import CommandPalette from '@/components/ui/CommandPalette';
import Hero from '@/components/sections/Hero';
import Projects from '@/components/sections/Projects';
import About from '@/components/sections/About';
import Contact from '@/components/sections/Contact';
import ProjectModal, { Project } from '@/components/ui/ProjectModal';
import { ShieldCheck, Cpu, Globe } from 'lucide-react';

export default function Home() {
  const [activeSection, setActiveSection] = useState('hero');
  const [commandOpen, setCommandOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  // Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setCommandOpen(prev => !prev);
      }
      if (e.key === 'Escape') {
        setCommandOpen(false);
        setSelectedProject(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Mock Project Data
  const projectsData: Project[] = [
    {
      id: 1,
      title: "Cyber_Sentinel",
      desc: "Real-time threat visualization using Three.js instancing.",
      longDesc: "An advanced dashboard for visualizing DDoS attacks and server vulnerabilities in real-time. Built using WebGL for high-performance rendering of global data points and WebSocket for live feeds.",
      tags: ["Next.js", "WebGL", "Socket.io", "Redis"],
      icon: <ShieldCheck className="w-6 h-6" />
    },
    {
      id: 2,
      title: "Neural_Net_Viz",
      desc: "Interactive AI training playground.",
      longDesc: "A visual education tool allowing users to adjust hyperparameters and watch a neural network learn to classify data in real-time. Bridges the gap between complex math and visual intuition.",
      tags: ["TypeScript", "TensorFlow.js", "D3", "React"],
      icon: <Cpu className="w-6 h-6" />
    },
    {
      id: 3,
      title: "Global_OSINT",
      desc: "Geospatial data mapping dashboard.",
      longDesc: "Open Source Intelligence gathering tool that scrapes public data repositories and maps them geospatially for analysis. Features clustering algorithms and heatmap visualizations.",
      tags: ["React", "Mapbox", "Redis", "PostgreSQL"],
      icon: <Globe className="w-6 h-6" />
    }
  ];

  return (
    <main className="relative w-full h-screen overflow-hidden bg-slate-50 dark:bg-slate-950 selection:bg-blue-500 selection:text-white">

      {/* 3D Background */}
      <Scene activeSection={activeSection} />

      {/* Navigation */}
      <Navigation
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        setCommandOpen={setCommandOpen}
      />

      {/* Main Content Transitions */}
      <AnimatePresence mode="wait">
        {activeSection === 'hero' && (
          <motion.div
            key="hero"
            initial={{ opacity: 0, y: 20, filter: 'blur(10px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: -20, filter: 'blur(10px)' }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0"
          >
            <Hero setActiveSection={setActiveSection} setCommandOpen={setCommandOpen} />
          </motion.div>
        )}

        {activeSection === 'projects' && (
          <motion.div
            key="projects"
            initial={{ opacity: 0, x: 50, filter: 'blur(10px)' }}
            animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, x: 50, filter: 'blur(10px)' }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0"
          >
            <Projects projects={projectsData} onSelectProject={setSelectedProject} />
          </motion.div>
        )}

        {activeSection === 'about' && (
          <motion.div
            key="about"
            initial={{ opacity: 0, scale: 0.95, filter: 'blur(10px)' }}
            animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0, scale: 0.95, filter: 'blur(10px)' }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0"
          >
            <About />
          </motion.div>
        )}

        {activeSection === 'contact' && (
          <motion.div
            key="contact"
            initial={{ opacity: 0, y: 50, filter: 'blur(10px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: 50, filter: 'blur(10px)' }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0"
          >
            <Contact />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Overlays */}
      <CommandPalette
        isOpen={commandOpen}
        setIsOpen={setCommandOpen}
        setSection={setActiveSection}
      />

      <ProjectModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
      />

      {/* Footer / Status */}
      <footer className="fixed bottom-6 left-6 right-6 flex justify-between items-end pointer-events-none z-30 text-[10px] text-slate-400 font-mono mix-blend-difference">
         <div className="flex gap-4">
            <div>FRAMEWORK: NEXT.JS 15</div>
            <div>RENDER: R3F / WEBGL</div>
         </div>
         <div>© 2026 NEXUS INDUSTRIES</div>
      </footer>

    </main>
  );
}
