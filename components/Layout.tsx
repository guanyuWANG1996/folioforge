import React from 'react';
import { motion } from 'framer-motion';
import { LayoutDashboard, Layers, PenTool, Layout, Hexagon } from 'lucide-react';
import { AppRoute } from '../types';

interface LayoutProps {
  currentRoute: AppRoute;
  onNavigate: (route: AppRoute) => void;
  children: React.ReactNode;
}

const SidebarItem = ({ 
  icon: Icon, 
  label, 
  active, 
  onClick 
}: { 
  icon: any, 
  label: string, 
  active: boolean, 
  onClick: () => void 
}) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[14px] font-medium transition-all duration-300 group relative overflow-hidden ${
      active 
        ? 'text-white' 
        : 'text-text-secondary hover:text-white'
    }`}
  >
    {/* Active Background Glow */}
    {active && (
        <motion.div 
            layoutId="sidebar-active"
            className="absolute inset-0 bg-primary/10 border border-primary/20 rounded-xl"
            initial={false}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
        />
    )}

    <Icon className={`w-5 h-5 relative z-10 transition-colors ${active ? 'text-primary' : 'text-text-disabled group-hover:text-text-main'}`} strokeWidth={active ? 2 : 1.5} />
    <span className="tracking-tight relative z-10">{label}</span>
  </button>
);

const MobileTabItem = ({ 
    icon: Icon, 
    label, 
    active, 
    onClick 
  }: { 
    icon: any, 
    label: string, 
    active: boolean, 
    onClick: () => void 
  }) => (
    <button onClick={onClick} className="flex flex-col items-center justify-center flex-1 py-1">
        <Icon className={`w-6 h-6 mb-1 transition-colors ${active ? 'text-primary' : 'text-text-secondary'}`} strokeWidth={active ? 2 : 1.5} />
        <span className={`text-[10px] font-medium ${active ? 'text-primary' : 'text-text-secondary'}`}>{label}</span>
    </button>
);

export const LayoutWrapper: React.FC<LayoutProps> = ({ currentRoute, onNavigate, children }) => {
  return (
    <div className="min-h-screen bg-background text-text-main font-sans overflow-hidden relative">
      
      {/* --- Ambient Atmosphere Background --- */}
      <div className="bg-noise z-0" />
      
      {/* Orb 1: Top Left - Purple/Indigo */}
      <div className="fixed -top-[20%] -left-[10%] w-[50vw] h-[50vw] rounded-full bg-indigo-600/20 blur-[120px] animate-aurora pointer-events-none z-0 mix-blend-screen" />
      
      {/* Orb 2: Bottom Right - Cyan/Blue */}
      <div className="fixed top-[40%] -right-[10%] w-[40vw] h-[40vw] rounded-full bg-blue-600/10 blur-[100px] animate-pulse-slow pointer-events-none z-0 mix-blend-screen" />
      
      {/* Desktop Fixed Sidebar */}
      <aside className="fixed inset-y-0 left-0 w-[280px] glass-sidebar hidden md:flex flex-col z-50">
        <div className="h-20 flex items-center px-8">
          <div className="flex items-center gap-3 text-white">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-glow">
               <Hexagon className="w-6 h-6" fill="currentColor" fillOpacity={0.2} strokeWidth={1.5} />
            </div>
            <span className="text-xl font-bold font-display tracking-tight">
              FolioForge
            </span>
          </div>
        </div>

        <nav className="flex-1 px-6 space-y-2 mt-8">
          <div className="text-[11px] font-bold text-text-disabled/80 px-3 py-2 uppercase tracking-widest mb-2 font-display">Platform</div>
          <SidebarItem 
            icon={LayoutDashboard} 
            label="Dashboard" 
            active={currentRoute === 'dashboard'} 
            onClick={() => onNavigate('dashboard')} 
          />
          <SidebarItem 
            icon={Layers} 
            label="Templates" 
            active={currentRoute === 'templates'} 
            onClick={() => onNavigate('templates')} 
          />
          
          {(currentRoute === 'editor' || currentRoute === 'preview') && (
            <>
            <div className="text-[11px] font-bold text-text-disabled/80 px-3 py-2 mt-8 mb-2 uppercase tracking-widest font-display">Workspace</div>
            <SidebarItem 
                icon={PenTool} 
                label="Editor" 
                active={currentRoute === 'editor'} 
                onClick={() => onNavigate('editor')} 
            />
             <SidebarItem 
                icon={Layout} 
                label="Preview" 
                active={currentRoute === 'preview'} 
                onClick={() => onNavigate('preview')} 
            />
            </>
          )}
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="md:pl-[280px] min-h-screen flex flex-col pb-20 md:pb-0 relative z-10 transition-all duration-300">
        <div className="w-full max-w-[1600px] mx-auto p-6 md:p-10 lg:p-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {children}
        </div>
      </main>

      {/* Mobile Bottom TabBar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 glass-panel border-t border-white/10 z-50 pb-safe">
          <div className="flex justify-around items-center h-[60px] px-2">
              <MobileTabItem 
                  icon={LayoutDashboard} 
                  label="Dashboard" 
                  active={currentRoute === 'dashboard'} 
                  onClick={() => onNavigate('dashboard')} 
              />
              <MobileTabItem 
                  icon={PenTool} 
                  label="Editor" 
                  active={currentRoute === 'editor'} 
                  onClick={() => onNavigate('editor')} 
              />
               <MobileTabItem 
                  icon={Layout} 
                  label="Preview" 
                  active={currentRoute === 'preview'} 
                  onClick={() => onNavigate('preview')} 
              />
          </div>
      </div>
    </div>
  );
};