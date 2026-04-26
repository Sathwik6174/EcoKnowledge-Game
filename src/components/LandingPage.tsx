import React from 'react';
import { motion } from 'motion/react';
import { 
  ShieldCheck, 
  Cpu, 
  Globe, 
  ArrowRight, 
  Play, 
  Info, 
  Trees, 
  Waves, 
  Building2,
  Zap,
  Target,
  BarChart3,
  Activity,
  Box,
  Sun,
  Moon
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface LandingPageProps {
  onStart: () => void;
  onGreenField: () => void;
  onRandomized: () => void;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

export function LandingPage({ onStart, onGreenField, onRandomized, theme, toggleTheme }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-dashboard-bg text-text-primary selection:bg-brand/30 overflow-x-hidden transition-colors duration-300">
      {/* Background Glows */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-brand/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-brand/5 blur-[120px] rounded-full" />
      </div>

      <nav className="relative z-10 flex items-center justify-between px-10 py-8 border-b border-glass backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-brand rounded-xl flex items-center justify-center shadow-lg shadow-brand/20">
            <Trees size={20} className="text-white" />
          </div>
          <span className="text-2xl font-black tracking-tight">EcoCity <span className="text-brand">Architect</span></span>
        </div>
        <div className="hidden md:flex items-center gap-6 text-sm font-bold text-text-secondary uppercase tracking-widest">
          <a href="#how-to-play" className="hover:text-text-primary transition-colors">How to Play</a>
          <a href="#guidelines" className="hover:text-text-primary transition-colors">Guidelines</a>
          
          <div className="h-6 w-[1px] bg-glass" />
          
          <button 
            onClick={toggleTheme}
            className="p-2.5 glass-pill text-text-secondary hover:text-text-primary transition-all"
            title="Toggle Theme"
          >
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          <button 
            onClick={onStart}
            className="px-6 py-2.5 glass-pill text-text-primary border-glass hover:border-brand/50 transition-all font-black"
          >
            Launch Dashboard
          </button>
        </div>
      </nav>

      <main className="relative z-10 pt-24 pb-40">
        {/* Hero Section */}
        <div className="w-full px-6 md:px-12 lg:px-20">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand/10 border border-brand/20 text-brand text-xs font-black uppercase tracking-widest mb-8">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand/40 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-brand"></span>
                </span>
                Bio-City Architect v2.4 Active
              </div>
              <h1 className="text-6xl md:text-8xl font-black leading-[0.9] mb-8 tracking-tighter">
                Lead the Urban <span className="text-brand">Revolution.</span>
              </h1>
              <p className="text-xl text-text-secondary mb-12 leading-relaxed max-w-xl font-medium">
                A high-fidelity urban simulator focused on ecological equilibrium.
                Balance metropolitan growth with climate resilience using ecological intelligence.
              </p>
              <div className="flex flex-wrap gap-4">
                <button 
                  onClick={onStart}
                  className="px-8 py-5 bg-brand hover:opacity-90 text-white rounded-[20px] font-black text-lg flex items-center gap-2 shadow-2xl shadow-brand/30 transition-all hover:scale-[1.05] active:scale-[0.98]"
                >
                  Regional Mode <Play size={20} fill="currentColor" />
                </button>
                <button 
                  onClick={onGreenField}
                  className="px-8 py-5 bg-emerald-600 hover:opacity-90 text-white rounded-[20px] font-black text-lg flex items-center gap-2 shadow-2xl shadow-emerald-600/30 transition-all hover:scale-[1.05] active:scale-[0.98]"
                >
                  Green Field <Trees size={20} />
                </button>
                <button 
                  onClick={onRandomized}
                  className="px-8 py-5 bg-purple-600 hover:opacity-90 text-white rounded-[20px] font-black text-lg flex items-center gap-2 shadow-2xl shadow-purple-600/30 transition-all hover:scale-[1.05] active:scale-[0.98]"
                >
                  Chaos Matrix <Activity size={20} />
                </button>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="hidden lg:block relative"
            >
              <div className="relative aspect-square max-w-lg mx-auto">
                <div className="absolute inset-0 bg-brand/10 blur-[100px] rounded-full animate-pulse" />
                
                <div className="relative z-10 grid grid-cols-2 gap-4 p-4 h-full">
                  {/* Top Left: Eco-Processor Unit */}
                  <div className="premium-card p-6 flex flex-col justify-between border-emerald-500/20 bg-emerald-500/[0.02]">
                    <div className="flex items-center justify-between">
                      <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                        <Trees className="text-emerald-500" size={20} />
                      </div>
                      <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Active</span>
                    </div>
                    <div>
                      <p className="text-xs font-black mb-1">Eco-Processor</p>
                      <p className="text-[10px] text-text-secondary font-medium leading-tight">Managing atmospheric equilibrium & biomass density.</p>
                    </div>
                  </div>

                  {/* Top Right: Ecological Analysis Agent */}
                  <div className="premium-card p-6 flex flex-col justify-between border-brand/20 bg-brand/[0.02]">
                    <div className="flex items-center justify-between">
                      <div className="w-10 h-10 rounded-xl bg-brand/10 flex items-center justify-center border border-brand/20">
                        <Activity className="text-brand" size={20} />
                      </div>
                      <div className="flex gap-1">
                        {[1, 2, 3].map(i => <div key={i} className="w-1 h-3 rounded-full bg-brand/30 animate-pulse" style={{ animationDelay: `${i * 0.2}s` }} />)}
                      </div>
                    </div>
                    <div>
                      <p className="text-xs font-black mb-1">Ecological Analysis</p>
                      <p className="text-[10px] text-text-secondary font-medium leading-tight">Smart ecological feedback on urban planning.</p>
                    </div>
                  </div>

                  {/* Bottom Span: 3D Visualization Core */}
                  <div className="col-span-2 premium-card p-8 flex flex-col justify-between relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-brand/5 -rotate-45 translate-x-12 translate-y--12 group-hover:bg-brand/10 transition-colors" />
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center border border-glass shadow-inner">
                          <Box className="text-white" size={24} />
                        </div>
                        <div>
                          <p className="text-sm font-black uppercase tracking-tight">Eco-Structural Modeler</p>
                          <p className="text-[10px] text-text-secondary font-bold">REAL-TIME VOXEL RENDERING</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-black italic">60 FPS</p>
                        <p className="text-[9px] font-black text-emerald-500 uppercase">Latency: <span className="opacity-100">12ms</span></p>
                      </div>
                    </div>
                    
                    <div className="h-24 bg-dashboard-bg/50 rounded-2xl border border-glass flex items-end gap-1.5 p-4 overflow-hidden relative">
                       {[...Array(20)].map((_, i) => (
                         <motion.div
                            key={i}
                            initial={{ height: '30%' }}
                            animate={{ height: [`${Math.random() * 40 + 20}%`, `${Math.random() * 50 + 40}%`, `${Math.random() * 40 + 20}%`] }}
                            transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.1 }}
                            className="flex-1 bg-brand opacity-20 rounded-t-sm"
                         />
                       ))}
                       <div className="absolute inset-0 flex items-center justify-center">
                          <p className="text-[10px] font-mono font-black text-brand tracking-[0.3em] bg-dashboard-bg/80 px-3 py-1 rounded-full border border-brand/30">SIMULATING_DISTRICT_BKC-4</p>
                       </div>
                    </div>
                  </div>
                </div>

                {/* Decorative Elements */}
                <div className="absolute -top-10 -left-10 w-24 h-24 bg-brand/10 border border-brand/20 rounded-2xl rotate-12 -z-10 animate-float" />
                <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-emerald-500/10 border border-emerald-500/20 rounded-[30px] -rotate-12 -z-10 animate-float" style={{ animationDelay: '1s' }} />
              </div>
            </motion.div>
          </div>
        </div>

        {/* Guidelines Section */}
        <section id="guidelines" className="w-full px-6 md:px-12 lg:px-20 pt-48">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-black mb-6 tracking-tight">Core Architectural Standards</h2>
            <p className="text-text-secondary text-lg max-w-2xl mx-auto font-medium">
              Master the art of urban equilibrium by following our proven ecological guidelines protocols.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-10">
            <GuidelineCard 
              icon={Trees}
              iconColor="text-emerald-500"
              title="Ecological Connectivity"
              description="Never isolate your greenery. Connected green corridors significantly boost a region's AQI and biodiversity score by 40%."
            />
            <GuidelineCard 
              icon={Waves}
              iconColor="text-blue-500"
              title="Hydro-Mitigation"
              description="Strategic placement of water bodies acts as a critical thermal buffer, lowering the overall Land Surface Temperature."
            />
            <GuidelineCard 
              icon={Activity}
              iconColor="text-brand"
              title="Interleaved Densification"
              description="Instead of sterile concrete blocks, interleave high-density zones with bio-filters to prevent urban Heat Island formation."
            />
          </div>
        </section>

        {/* How to Play Section */}
        <section id="how-to-play" className="w-full px-6 md:px-12 lg:px-20 pt-48">
          <div className="premium-card overflow-hidden border-none p-0">
            <div className="grid lg:grid-cols-5 items-stretch">
              <div className="lg:col-span-2 bg-brand p-16 text-white flex flex-col justify-center gap-10">
                <h2 className="text-4xl font-black mb-4">Planning Directives</h2>
                <ul className="space-y-12">
                  <li className="flex gap-6">
                    <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center shrink-0 font-black text-xl border border-white/30 shadow-xl">1</div>
                    <div>
                      <p className="text-xl font-black mb-2">Initialize Territory</p>
                      <p className="text-white/80 font-medium">Choose from diverse global cities, each with unique geospatial constraints.</p>
                    </div>
                  </li>
                  <li className="flex gap-6">
                    <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center shrink-0 font-black text-xl border border-white/30 shadow-xl">2</div>
                    <div>
                      <p className="text-xl font-black mb-2">Execute Parameters</p>
                      <p className="text-white/80 font-medium">Meet district-specific targets for Greenery, Water, and Metropolitan Density.</p>
                    </div>
                  </li>
                  <li className="flex gap-6">
                    <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center shrink-0 font-black text-xl border border-white/30 shadow-xl">3</div>
                    <div>
                      <p className="text-xl font-black mb-2">Validate Logic</p>
                      <p className="text-white/80 font-medium">Utilize the Bio-IQ model to analyze your environmental impact and optimize city layout.</p>
                    </div>
                  </li>
                </ul>
              </div>
              <div className="lg:col-span-3 p-16 bg-surface-hover/50 flex flex-col justify-center">
                <div className="grid grid-cols-2 gap-10">
                  <div className="space-y-6">
                    <div className="p-6 bg-dashboard-bg/50 rounded-[24px] border border-glass shadow-premium">
                      <Building2 className="mb-4 text-text-secondary" />
                      <h4 className="font-black text-sm mb-2 uppercase tracking-widest text-text-primary">Housing Ecosystem</h4>
                      <p className="text-xs text-text-secondary font-medium leading-relaxed">Increases density. Intermingle with eco-tiles for maximum quality coefficient.</p>
                    </div>
                    <div className="p-6 bg-dashboard-bg/50 rounded-[24px] border border-glass shadow-premium">
                      <Target className="mb-4 text-emerald-500" />
                      <h4 className="font-black text-sm mb-2 uppercase tracking-widest text-text-primary">Heritage Anchor</h4>
                      <p className="text-xs text-text-secondary font-medium leading-relaxed">Fixed geological features. Must be preserved to maintain cultural stability.</p>
                    </div>
                  </div>
                  <div className="space-y-6 pt-12">
                    <div className="p-6 bg-dashboard-bg/50 rounded-[24px] border border-glass shadow-premium">
                      <BarChart3 className="mb-4 text-brand" />
                      <h4 className="font-black text-sm mb-2 uppercase tracking-widest text-text-primary">Biometric Telemetry</h4>
                      <p className="text-xs text-text-secondary font-medium leading-relaxed">Watch real-time AQI and LST oscillations react to every placement.</p>
                    </div>
                    <div className="p-6 bg-dashboard-bg/50 rounded-[24px] border border-glass shadow-premium">
                      <Trees className="mb-4 text-amber-500" />
                      <h4 className="font-black text-sm mb-2 uppercase tracking-widest text-text-primary">Hyper-Visual 3D</h4>
                      <p className="text-xs text-text-secondary font-medium leading-relaxed">Project your architecture into an immersive, atmospheric 3D viewport.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

      </main>

      <footer className="relative z-10 border-t border-glass py-16 px-10">
        <div className="w-full px-6 md:px-12 lg:px-20 flex flex-col md:flex-row justify-between items-center gap-10">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-white/5 dark:bg-black/5 rounded-xl border border-glass flex items-center justify-center">
              <Trees size={20} className="text-text-secondary opacity-50" />
            </div>
            <span className="text-xs font-black opacity-40 uppercase tracking-[0.3em]">Bio-City Architect Core v2.4.0</span>
          </div>
          <div className="flex gap-10 text-[10px] font-black uppercase tracking-[0.3em] opacity-40">
            <span>EcoKnowledge</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

function GuidelineCard({ icon: Icon, iconColor, title, description }: { icon: any, iconColor: string, title: string, description: string }) {
  return (
    <div className="premium-card p-10 group transition-all duration-500 hover:translate-y-[-8px]">
      <div className="w-16 h-16 bg-white/5 dark:bg-black/5 rounded-[20px] border border-glass flex items-center justify-center mb-8 group-hover:bg-brand group-hover:text-white transition-all duration-300 shadow-inner">
        <Icon size={28} className={iconColor} />
      </div>
      <h3 className="text-2xl font-black mb-5 tracking-tight">{title}</h3>
      <p className="text-text-secondary text-sm font-medium leading-relaxed">{description}</p>
    </div>
  );
}
