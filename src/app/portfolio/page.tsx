'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Terminal, Award, Globe, Cpu, Server, Layers, Code2,
  Database, Layout, Workflow, Download, Github, Twitter,
  Mail, ChevronDown, Zap, Glasses, Monitor, ShieldCheck,
  ExternalLink, Rocket, Heart, Binary, Boxes,
  LucideIcon
} from 'lucide-react';
import * as THREE from 'three';

/* --- SUB-COMPONENTS --- */

interface ProjectBadgeProps {
  text: string;
  color?: string;
}

const ProjectBadge = ({ text, color = "white/10" }: ProjectBadgeProps) => (
  <span className={`px-2 py-1 bg-white/5 border border-${color} rounded text-[9px] font-mono text-gray-400 uppercase tracking-tighter`}>
    {text}
  </span>
);

interface SideProjectCardProps {
  title: string;
  sub: string;
  tags: string[];
  github: string;
  demo: string;
  icon: LucideIcon;
}

const SideProjectCard = ({ title, sub, tags, github, demo, icon: Icon }: SideProjectCardProps) => (
  <div className="group relative bg-[#0a0a0a]/80 border border-white/5 rounded-3xl p-6 transition-all duration-500 hover:border-amber-500/30 hover:bg-amber-500/[0.02] flex flex-col h-full shadow-lg">
    <div className="flex justify-between items-start mb-6">
      <div className="p-3 bg-amber-500/10 rounded-xl text-amber-500 group-hover:scale-110 transition-transform shadow-inner">
        <Icon className="w-6 h-6" />
      </div>
      <div className="flex gap-2">
        <button
          onClick={(e) => { e.stopPropagation(); window.open(github, '_blank'); }}
          className="p-2 hover:text-white text-gray-500 transition-colors"
          aria-label="GitHub"
        >
          <Github className="w-4 h-4" />
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); window.open(demo, '_blank'); }}
          className="p-2 hover:text-white text-gray-500 transition-colors"
          aria-label="Demo"
        >
          <ExternalLink className="w-4 h-4" />
        </button>
      </div>
    </div>
    <h3 className="text-xl font-bold text-white mb-2 group-hover:text-amber-400 transition-colors">{title}</h3>
    <p className="text-sm text-gray-400 mb-6 font-light leading-relaxed">{sub}</p>
    <div className="mt-auto flex flex-wrap gap-2">
      {tags.map(tag => (
        <span key={tag} className="text-[9px] font-mono text-amber-500/60 px-2 py-0.5 bg-amber-500/5 rounded border border-amber-500/10 uppercase tracking-widest">
          {tag}
        </span>
      ))}
    </div>
  </div>
);

interface BentoCardProps {
  title: string;
  sub: string;
  icon: React.ReactNode;
  className?: string;
  children?: React.ReactNode;
  href?: string;
}

const BentoCard = ({ title, sub, icon, className = "", children, href }: BentoCardProps) => (
  <div
    onClick={() => href && window.open(href, '_blank')}
    className={`group relative flex flex-col bg-[#080808]/50 backdrop-blur-3xl border border-white/5 rounded-[2.5rem] p-8 md:p-10 transition-all duration-700 hover:border-white/20 hover:bg-[#080808]/70 hover:shadow-[0_0_50px_rgba(59,130,246,0.15)] cursor-pointer overflow-hidden ${className}`}
  >
    <div className="absolute -top-24 -right-24 w-48 h-48 bg-blue-500/5 blur-[80px] group-hover:bg-blue-500/10 transition-colors pointer-events-none" />
    <div className="flex justify-between items-start mb-8 relative z-10">
      <div className="p-4 bg-white/5 rounded-2xl text-white border border-white/5 group-hover:border-white/20 transition-all shadow-xl backdrop-blur-sm">
        {icon}
      </div>
      <ProjectBadge text="ALX Certification" />
    </div>
    <div className="mt-auto relative z-10">
      <h3 className="text-2xl font-bold text-white mb-3 drop-shadow-md">{title}</h3>
      <p className="text-gray-400 font-light leading-relaxed text-sm md:text-base">{sub}</p>
      {children && <div className="mt-8">{children}</div>}
    </div>
  </div>
);

/* --- MAIN APPLICATION --- */

export default function PortfolioPage() {
  const [activeSection, setActiveSection] = useState('home');
  const mountRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef('home');
  const mousePos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mousePos.current = {
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: -(e.clientY / window.innerHeight) * 2 + 1
      };
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        const touch = e.touches[0];
        mousePos.current = {
          x: (touch.clientX / window.innerWidth) * 2 - 1,
          y: -(touch.clientY / window.innerHeight) * 2 + 1
        };
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchmove', handleTouchMove, { passive: true });

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
    };
  }, []);

  useEffect(() => {
    const sections = ['home', 'curriculum', 'side-projects', 'about'];
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
          sectionRef.current = entry.target.id;
        }
      });
    }, { threshold: 0.25 });

    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  /**
   * THREE.JS SPATIAL ENGINE
   * Enhanced with cleanup and stability fixes
   */
  useEffect(() => {
    let renderer: THREE.WebGLRenderer, scene: THREE.Scene, camera: THREE.PerspectiveCamera, innerMesh: THREE.Mesh, outerMesh: THREE.Mesh, point1: THREE.PointLight;
    let animationFrameId: number;
    let innerGeo: THREE.IcosahedronGeometry;
    let innerMat: THREE.MeshPhysicalMaterial;
    let outerGeo: THREE.DodecahedronGeometry;
    let outerMat: THREE.MeshBasicMaterial;

    if (!mountRef.current) return;

    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 10;

    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mountRef.current.appendChild(renderer.domElement);

    innerGeo = new THREE.IcosahedronGeometry(2.2, 12);
    innerMat = new THREE.MeshPhysicalMaterial({
      color: 0x888888,
      metalness: 0.9,
      roughness: 0.1,
      transmission: 0.6,
      thickness: 1,
    });
    innerMesh = new THREE.Mesh(innerGeo, innerMat);
    scene.add(innerMesh);

    outerGeo = new THREE.DodecahedronGeometry(3.8, 1);
    outerMat = new THREE.MeshBasicMaterial({
      color: 0x3b82f6,
      wireframe: true,
      transparent: true,
      opacity: 0.1,
    });
    outerMesh = new THREE.Mesh(outerGeo, outerMat);
    scene.add(outerMesh);

    point1 = new THREE.PointLight(0x3b82f6, 12, 50);
    point1.position.set(10, 10, 10);
    scene.add(point1);

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const time = performance.now() * 0.001;
      const current = sectionRef.current;

      innerMesh.rotation.y += 0.005;
      innerMesh.rotation.x = mousePos.current.y * 0.25;
      innerMesh.rotation.z = mousePos.current.x * 0.25;
      outerMesh.rotation.y -= 0.002;

      let s = 1;
      let c = new THREE.Color(0x3b82f6);

      if (current === 'curriculum') {
        s = 0.6;
        c.setHex(0xa855f7);
      } else if (current === 'side-projects') {
        s = 0.85;
        c.setHex(0xf59e0b);
      } else if (current === 'about') {
        s = 1.3;
        c.setHex(0x10b981);
      }

      const pulse = 1 + Math.sin(time * 2) * 0.04;
      const targetScale = s * pulse;
      innerMesh.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.05);
      point1.color.lerp(c, 0.05);
      outerMat.color.lerp(c, 0.05);

      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      if (!renderer || !camera) return;
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    // Store cleanup logic
    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      if (mountRef.current?.contains(renderer.domElement)) {
        mountRef.current.removeChild(renderer.domElement);
      }
      innerGeo.dispose();
      innerMat.dispose();
      outerGeo.dispose();
      outerMat.dispose();
      renderer.dispose();
    };

  }, []);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="relative w-full min-h-screen bg-[#030303] text-white selection:bg-blue-500/30 font-sans overflow-x-hidden">

      {/* 3D ENGINE */}
      <div ref={mountRef} className="fixed inset-0 z-0 opacity-60 pointer-events-none" />
      <div className="fixed inset-0 z-[5] pointer-events-none bg-[radial-gradient(circle_at_center,transparent_0%,rgba(3,3,3,0.6)_60%,rgba(3,3,3,1)_100%)]" />

      {/* NAVIGATION */}
      <header className="fixed top-8 left-1/2 -translate-x-1/2 z-[100] flex items-center gap-6 bg-black/40 backdrop-blur-3xl border border-white/5 px-8 py-4 rounded-full shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-600 via-purple-600 to-amber-600 flex items-center justify-center font-black text-xs shadow-lg">V</div>
        <nav className="hidden md:flex items-center gap-8 text-[10px] font-black uppercase tracking-[0.25em] text-gray-500">
          {['home', 'curriculum', 'side-projects', 'about'].map((id) => (
            <button
              key={id}
              onClick={() => scrollTo(id)}
              className={`hover:text-white transition-all relative px-1 py-1 ${activeSection === id ? 'text-white' : ''}`}
            >
              {id.replace('-', ' ')}
              {activeSection === id && <span className="absolute -bottom-1 left-0 w-full h-1 bg-white rounded-full shadow-[0_0_8px_rgba(255,255,255,0.5)]" />}
            </button>
          ))}
        </nav>
      </header>

      {/* HERO SECTION */}
      <section id="home" className="relative min-h-screen flex flex-col items-center justify-center z-10 px-6 text-center pt-20 pb-10">
        <div className="max-w-4xl relative">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-blue-500/20 bg-blue-500/5 backdrop-blur-3xl text-[10px] font-bold tracking-[0.3em] text-blue-400 mb-8 md:mb-12 uppercase">
            <ShieldCheck className="w-4 h-4" /> <span>ALX Software Engineering Alumni</span>
          </div>
          <h1 className="text-5xl sm:text-7xl md:text-[10rem] font-black tracking-tighter mb-8 md:mb-10 leading-[0.9] md:leading-[0.8] drop-shadow-[0_10px_40px_rgba(0,0,0,0.5)]">
            Software <br /> Architect.
          </h1>
          <p className="text-base sm:text-xl md:text-2xl text-gray-400 font-light mb-12 md:mb-16 max-w-2xl mx-auto leading-relaxed drop-shadow-md">
            From the grit of <span className="text-white font-medium uppercase tracking-widest text-sm md:text-lg">C Systems</span> to the innovation of <span className="text-white font-medium uppercase tracking-widest text-sm md:text-lg">Spatial Products</span>.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-6 items-center w-full">
            <button onClick={() => scrollTo('curriculum')} className="w-full sm:w-auto bg-white text-black px-12 py-5 rounded-full font-black text-xs uppercase tracking-[0.2em] hover:scale-105 active:scale-95 transition-all shadow-2xl">
              Foundation
            </button>
            <button onClick={() => scrollTo('side-projects')} className="w-full sm:w-auto px-12 py-5 rounded-full font-black text-xs uppercase tracking-[0.2em] border border-amber-500/30 bg-amber-500/5 backdrop-blur-3xl hover:bg-amber-500/10 transition-all text-amber-500 flex items-center justify-center gap-3">
              <Rocket className="w-4 h-4" /> Side Projects
            </button>
          </div>
        </div>
        <div className="absolute bottom-8 md:bottom-12 animate-bounce opacity-20 cursor-pointer hover:opacity-100 transition-opacity" onClick={() => scrollTo('curriculum')}>
          <ChevronDown className="w-8 h-8" />
        </div>
      </section>

      {/* CURRICULUM SECTION (FOUNDATION) */}
      <section id="curriculum" className="relative min-h-screen z-10 flex flex-col justify-center py-20 md:py-40 px-6 md:px-24">
        <div className="max-w-7xl mx-auto w-full">
          <div className="mb-16 md:mb-24">
            <span className="text-purple-500 font-black text-[10px] uppercase tracking-[0.5em] mb-6 block">Curriculum Vitae</span>
            <h2 className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tight mb-8">ALX Mastery.</h2>
            <p className="text-gray-500 text-lg md:text-xl font-light max-w-2xl leading-relaxed">The foundational grit. A journey from manually managing memory in C to architecting distributed cloud systems.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            <BentoCard
              title="Low-Level & Shell"
              sub="Mastering the metal. Built a custom Simple Shell and Monty interpreter."
              icon={<Terminal className="w-8 h-8 text-green-400" />}
              className="md:col-span-8"
            >
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-10">
                 <div className="p-4 bg-white/5 rounded-2xl border border-white/5 hover:bg-white/10 transition-colors">
                    <div className="text-[10px] font-black text-blue-400 mb-2 uppercase tracking-widest">Memory Management</div>
                    <p className="text-[11px] text-gray-400 leading-relaxed font-light">Direct manipulation of malloc/free, pointers, and heap/stack mechanics using C.</p>
                 </div>
                 <div className="p-4 bg-white/5 rounded-2xl border border-white/5 hover:bg-white/10 transition-colors">
                    <div className="text-[10px] font-black text-blue-400 mb-2 uppercase tracking-widest">System Calls</div>
                    <p className="text-[11px] text-gray-400 leading-relaxed font-light">Interfacing with the Linux kernel through fork, execve, and wait systems.</p>
                 </div>
               </div>
            </BentoCard>

            <BentoCard
              title="Backend Engine"
              sub="Scalable Python logic & SQL relations."
              icon={<Database className="w-8 h-8 text-yellow-500" />}
              className="md:col-span-4"
            />

            <BentoCard
              title="DevOps & Infra"
              sub="Nginx, Docker, and Puppet automation."
              icon={<Server className="w-8 h-8 text-emerald-500" />}
              className="md:col-span-12 h-[300px] flex items-center justify-center"
            >
               <div className="flex gap-4 opacity-40 hover:opacity-80 transition-opacity">
                  {['CI/CD', 'Automated Testing', 'Load Balancing'].map(tag => (
                    <span key={tag} className="text-xs font-mono border border-white/10 px-4 py-1 rounded-full uppercase tracking-tighter">{tag}</span>
                  ))}
               </div>
            </BentoCard>
          </div>
        </div>
      </section>

      {/* SIDE PROJECTS SECTION (CREATIVITY) */}
      <section id="side-projects" className="relative min-h-screen z-10 flex flex-col justify-center py-20 md:py-40 px-6 md:px-24 bg-amber-500/[0.005]">
        <div className="max-w-7xl mx-auto w-full">
          <div className="mb-16 md:mb-24 flex flex-col md:flex-row justify-between items-end gap-10">
            <div className="max-w-2xl">
              <span className="text-amber-500 font-black text-[10px] uppercase tracking-[0.5em] mb-6 block">Independent Works</span>
              <h2 className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tight mb-8">Personal Lab.</h2>
              <p className="text-gray-500 text-lg md:text-xl font-light leading-relaxed">Where curiosity meets production. Exploring Spatial UI, Real-time data, and SaaS architecture.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <SideProjectCard
              title="SpatialOS Dashboard"
              sub="A 3D spatial interface for monitoring real-time server telemetry. Built with custom WebGL shaders."
              tags={['Three.js', 'Next.js', 'WebSockets']}
              icon={Boxes}
              github="#"
              demo="#"
            />
            <SideProjectCard
              title="Neural Graph Explorer"
              sub="Visualizing complex data relations through an interactive force-directed graph engine."
              tags={['D3.js', 'React', 'Node.js']}
              icon={Binary}
              github="#"
              demo="#"
            />
            <SideProjectCard
              title="Fintech Flow"
              sub="A lightweight, high-performance financial tracking API with specialized double-entry bookkeeping."
              tags={['Python', 'PostgreSQL', 'Redis']}
              icon={Zap}
              github="#"
              demo="#"
            />
          </div>

          <div className="mt-20 p-12 bg-white/[0.02] border border-white/5 rounded-[3rem] text-center backdrop-blur-sm">
            <Heart className="w-10 h-10 text-amber-500/40 mx-auto mb-6" />
            <h4 className="text-xl font-bold text-white mb-2">Constantly Building.</h4>
            <p className="text-gray-500 font-light max-w-lg mx-auto mb-10 italic text-sm">"The curriculum teaches you how to think; the side projects teach you how to ship."</p>
            <button className="text-amber-500 font-black text-[10px] uppercase tracking-[0.4em] hover:text-white transition-all hover:bg-amber-500/10 px-8 py-3 rounded-full border border-amber-500/20">
              View All Experiments on GitHub →
            </button>
          </div>
        </div>
      </section>

      {/* ABOUT SECTION */}
      <section id="about" className="relative min-h-screen z-10 flex items-center py-20 md:py-40 px-6 md:px-24">
        <div className="max-w-6xl mx-auto w-full">
          <div className="bg-[#080808]/80 backdrop-blur-3xl border border-white/5 rounded-[2.5rem] md:rounded-[4rem] p-8 md:p-24 shadow-[0_32px_64px_rgba(0,0,0,0.6)] relative overflow-hidden">
            <div className="flex flex-col lg:flex-row items-center lg:items-start gap-12 lg:gap-20 relative z-10">
              <div className="flex-shrink-0 text-center lg:text-left">
                <div className="relative w-32 h-32 md:w-64 md:h-64 rounded-full bg-black border-4 border-white/10 flex items-center justify-center text-5xl md:text-7xl font-black shadow-2xl mb-8 md:mb-12 mx-auto lg:mx-0">
                  AM
                </div>
                <h2 className="text-4xl md:text-7xl font-black tracking-tighter mb-4">Alvin Mike</h2>
                <div className="px-6 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 inline-block">
                  <span className="text-blue-400 font-black text-xs tracking-[0.4em] uppercase">Engineer & Maker</span>
                </div>
              </div>

              <div className="flex-grow space-y-10 md:space-y-16">
                <p className="text-2xl md:text-5xl text-gray-200 font-light leading-[1.2] drop-shadow-md text-center lg:text-left">
                  A developer who bridges the gap between <strong className="text-white font-black">low-level grit</strong> and <strong className="text-white font-black">spatial innovation.</strong>
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
                  <div className="space-y-8 text-gray-400 leading-relaxed text-lg font-light">
                    <p>
                      My graduation from ALX provided the technical bedrock. My side projects provide the creative playground.
                    </p>
                    <p>
                      I thrive in environments that require both systems-thinking and aesthetic-thinking.
                    </p>
                    <div className="flex gap-10 pt-6">
                      <Github className="w-8 h-8 cursor-pointer hover:text-white transition-all hover:scale-110" />
                      <Twitter className="w-8 h-8 cursor-pointer hover:text-white transition-all hover:scale-110" />
                      <Mail className="w-8 h-8 cursor-pointer hover:text-white transition-all hover:scale-110" />
                    </div>
                  </div>

                  <div className="space-y-10">
                    {[
                      { label: 'Engineering Core', val: 'ALX SE Specialization' },
                      { label: 'Special Interest', val: 'Spatial Computing & WebGL' },
                      { label: 'Project Count', val: '12+ Production Deploys' }
                    ].map((item, i) => (
                      <div key={i} className="group border-b border-white/5 pb-8">
                        <div className="text-[9px] text-gray-600 uppercase tracking-[0.5em] font-black mb-4">{item.label}</div>
                        <div className="text-white font-bold text-xl md:text-2xl group-hover:text-amber-400 transition-colors duration-500">{item.val}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="py-40 text-center z-10 opacity-20">
        <p className="text-[10px] font-black tracking-[1em] text-gray-500 uppercase">
          ALX Alumni // 2026 // Spatial Architecture
        </p>
      </footer>

      <style dangerouslySetInnerHTML={{ __html: `
        html { scroll-behavior: smooth; background-color: #030303; }
        ::-webkit-scrollbar { width: 5px; }
        ::-webkit-scrollbar-track { background: #030303; }
        ::-webkit-scrollbar-thumb { background: #333; border-radius: 10px; }
        ::-webkit-scrollbar-thumb:hover { background: #444; }
      `}} />
    </div>
  );
}
