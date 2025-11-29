
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Eye, Zap, ArrowRight, Clock, Globe, MoreHorizontal, Sparkles, Layout, Rocket, ChevronRight, Trash2, ExternalLink } from 'lucide-react';
import { Button, SpotlightCard, Badge, Input, Card, ProjectStatusBadge } from '../components/ui';
import { AppRoute, Template, ViewMode } from '../types';
import { PreviewFrame } from '../components/PreviewFrame';
import { getRenderedDemoHtml } from '../constants';

interface DashboardItem {
  id: string;
  name: string;
  title?: string;
  isPublished: boolean;
  lastModified: Date;
  lastPublished?: Date;
}

interface DashboardProps {
  items: DashboardItem[];
  onNavigate: (route: AppRoute) => void;
  onEdit: (portfolioId: string) => void;
  onDelete: (portfolioId: string) => void;
  onCreate: () => void;
  onUpdateName?: (id: string, newName: string) => void;
  trendingTemplates?: Template[];
  onUseTemplate?: (template: Template) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ items, onNavigate, onEdit, onDelete, onCreate, onUpdateName, trendingTemplates = [], onUseTemplate }) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [tempName, setTempName] = useState('');
  const [selectedPreview, setSelectedPreview] = useState<Template | null>(null);
  const [previewViewMode, setPreviewViewMode] = useState<ViewMode>('desktop');
  const [compiledHtml, setCompiledHtml] = useState<string>('');

  // Sort portfolios: Latest modified first
  const sortedPortfolios = [...items].sort((a, b) => b.lastModified.getTime() - a.lastModified.getTime());
  const latestProject = sortedPortfolios[0];
  const olderProjects = sortedPortfolios.slice(1);
  const hasProjects = items.length > 0;

  const startEditingName = (p: DashboardItem, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingId(p.id);
    setTempName(p.name);
  };

  const saveName = (id: string) => {
    if (onUpdateName && tempName.trim()) {
        onUpdateName(id, tempName);
    }
    setEditingId(null);
  };

  React.useEffect(() => {
    setCompiledHtml('');
    if (!selectedPreview) return;
    getRenderedDemoHtml(selectedPreview).then(setCompiledHtml).catch(() => setCompiledHtml(''));
  }, [selectedPreview]);

  // --- Empty State / Onboarding View ---
  if (!hasProjects) {
      return (
          <div className="max-w-5xl mx-auto pb-20 space-y-16">
              {/* Hero Section */}
              <div className="text-center space-y-6 pt-10">
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-widest mb-4"
                  >
                      <Sparkles className="w-3 h-3" />
                      <span>Welcome to FolioForge</span>
                  </motion.div>
                  
                  <motion.h1 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="text-6xl md:text-7xl font-bold font-display tracking-tighter text-white"
                  >
                      Build your legacy,<br/>
                      <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">effortlessly.</span>
                  </motion.h1>
                  
                  <motion.p 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="text-xl text-text-secondary font-light max-w-2xl mx-auto leading-relaxed"
                  >
                      Create a professional, AI-powered portfolio in minutes. 
                      No coding required. just your story.
                  </motion.p>

                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="pt-4"
                  >
                      <Button size="lg" onClick={onCreate} icon={<Plus className="w-5 h-5"/>} className="h-14 px-8 text-lg rounded-full shadow-[0_0_40px_rgba(99,102,241,0.4)]">
                          Start Your First Project
                      </Button>
                  </motion.div>
              </div>

              {/* Steps */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
                  <div className="absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent hidden md:block" />
                  
                  {[
                      { icon: Layout, title: "1. Select Template", desc: "Choose a style that matches your vibe." },
                      { icon: Zap, title: "2. AI Polish", desc: "Let Gemini refine your bio and projects." },
                      { icon: Rocket, title: "3. Publish", desc: "Deploy to Vercel with one click." }
                  ].map((step, idx) => (
                      <motion.div 
                        key={idx}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 + (idx * 0.1) }}
                        className="relative bg-surface border border-white/5 rounded-2xl p-6 text-center z-10 hover:border-white/10 transition-colors group"
                      >
                          <div className="w-12 h-12 mx-auto bg-white/5 rounded-full flex items-center justify-center mb-4 group-hover:bg-primary/20 group-hover:text-primary transition-colors">
                              <step.icon className="w-6 h-6" />
                          </div>
                          <h3 className="text-lg font-bold text-white mb-2">{step.title}</h3>
                          <p className="text-sm text-text-secondary">{step.desc}</p>
                      </motion.div>
                  ))}
              </div>

              {/* Featured Templates Teaser */}
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
                className="space-y-6"
              >
                  <div className="flex items-center justify-between">
                      <h3 className="text-lg font-bold text-white flex items-center gap-2">
                          <Layout className="w-5 h-5 text-primary" />
                          Trending Templates
                      </h3>
                      <button 
                        onClick={() => onNavigate('templates')} 
                        className="text-sm text-text-secondary hover:text-white flex items-center gap-1 transition-colors"
                      >
                          View All <ChevronRight className="w-4 h-4" />
                      </button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                       {(trendingTemplates || []).slice(0, 3).map((template) => (
                           <Card 
                                key={template.id} 
                                className="group cursor-pointer hover:border-primary/30 transition-all active:scale-[0.98] overflow-hidden"
                            >
                               <div className="aspect-[16/9] bg-black/50 rounded-lg mb-4 overflow-hidden relative">
                                   <img src={template.thumbnail} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500" />
                                   <div className="absolute inset-0 bg-indigo-900/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-sm gap-3">
                                     <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 flex gap-3">
                                       <Button 
                                         variant="secondary" 
                                         className="shadow-xl" 
                                         icon={<Eye className="w-4 h-4" />} 
                                         onClick={(e) => { e.stopPropagation(); setSelectedPreview(template); }}
                                       >
                                         Preview
                                       </Button>
                                       <Button 
                                         variant="primary" 
                                         className="shadow-2xl" 
                                         icon={<ChevronRight className="w-4 h-4" />} 
                                         onClick={(e) => { e.stopPropagation(); onUseTemplate && onUseTemplate(template); }}
                                       >
                                         Use
                                       </Button>
                                     </div>
                                   </div>
                               </div>
                               <div className="flex justify-between items-center">
                                   <h4 className="font-bold text-white group-hover:text-primary transition-colors">{template.name}</h4>
                                   <Badge variant="outline">{template.style}</Badge>
                               </div>
                           </Card>
                       ))}
                  </div>
              </motion.div>
              {/* Preview Modal for Trending Templates */}
              {selectedPreview && (
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-xl flex flex-col"
                >
                    <div className="h-16 border-b border-white/10 flex items-center justify-between px-6 bg-[#030014] shrink-0">
                        <div className="flex items-center gap-4">
                            <h2 className="text-white font-display font-bold text-lg">{selectedPreview.name}</h2>
                            <Badge variant="outline">{selectedPreview.style}</Badge>
                        </div>
                        <div className="flex items-center gap-3">
                            <Button variant="ghost" onClick={() => setSelectedPreview(null)} className="text-text-secondary hover:text-white">Cancel</Button>
                            <Button onClick={() => { onUseTemplate && onUseTemplate(selectedPreview); setSelectedPreview(null); }} icon={<ChevronRight className="w-4 h-4" />}>Use Template</Button>
                        </div>
                    </div>
                    <div className="flex-1 overflow-hidden relative bg-[#050505] flex items-center justify-center p-4 md:p-8">
                        <PreviewFrame 
                            compiledHtml={compiledHtml}
                            template={selectedPreview}
                            viewMode={previewViewMode}
                            className="h-full bg-transparent"
                        />
                    </div>
                </motion.div>
              )}
          </div>
      );
  }

  // --- Active Dashboard (Existing Logic with Refinements) ---
  return (
    <div className="space-y-10 pb-20">
      {/* --- Header Section --- */}
      <div className="flex flex-col gap-2 relative z-10">
        <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-6xl md:text-8xl font-bold font-display tracking-tighter text-white"
        >
            Dashboard
        </motion.h1>
        <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-text-secondary font-light tracking-wide max-w-lg"
        >
            Welcome back, Alex. Continue building your presence.
        </motion.p>
      </div>

      {/* --- Bento Grid --- */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 auto-rows-[minmax(280px,auto)]">
        
        {/* 1. Create New (Vertical Strip) */}
        <button
            onClick={onCreate}
            className="md:col-span-1 rounded-[32px] bg-gradient-to-b from-indigo-600 via-purple-700 to-indigo-900 p-[1px] relative overflow-hidden group text-left shadow-2xl shadow-indigo-500/20 w-full h-full transition-transform duration-200 active:scale-[0.98]"
        >
            <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
            
            <div className="h-full bg-black/20 backdrop-blur-sm rounded-[31px] p-8 flex flex-col justify-between relative z-10 hover:bg-transparent transition-colors duration-500">
                <div className="w-14 h-14 rounded-full bg-white/10 border border-white/20 flex items-center justify-center backdrop-blur-md group-hover:bg-white/20 transition-colors">
                    <Plus className="w-7 h-7 text-white" />
                </div>
                <div>
                <h3 className="text-4xl font-display font-bold text-white leading-[0.9] mb-3 tracking-tighter">
                    Create<br/>New
                </h3>
                <div className="flex items-center gap-2 text-white/60 text-sm font-medium group-hover:text-white transition-colors">
                    <span>Start Building</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
                </div>
            </div>
        </button>

        {/* 2. Spotlight Project (Expanded to 3 columns) */}
        <div 
            className="md:col-span-3 relative group rounded-[32px] overflow-hidden border border-white/10 bg-surface shadow-2xl min-h-[400px]"
        >
           {latestProject ? (
             <div 
                className="w-full h-full relative cursor-pointer"
                onClick={() => onEdit(latestProject.id)}
             >
                {/* Background Image - Stable, no heavy zoom */}
                <div className="absolute inset-0">
                    <img 
                        src={`https://picsum.photos/seed/${latestProject.id}/1200/800`} 
                        className="w-full h-full object-cover opacity-60 group-hover:opacity-70 transition-opacity duration-500" 
                        alt="Latest Project"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#030014] via-[#030014]/40 to-transparent" />
                    <div className="absolute inset-0 bg-gradient-to-r from-[#030014]/80 via-transparent to-transparent" />
                </div>

                {/* Content */}
                <div className="absolute bottom-0 left-0 p-10 w-full z-20">
                   <div className="flex items-center justify-between mb-6">
                        {latestProject.isPublished ? (
                             <a 
                                href={`https://folioforge.vercel.app/${latestProject.id}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={(e) => e.stopPropagation()}
                                className="group/badge relative"
                             >
                                <ProjectStatusBadge 
                                    isPublished={latestProject.isPublished} 
                                    lastModified={latestProject.lastModified}
                                    lastPublished={latestProject.lastPublished}
                                    className="group-hover/badge:pr-6 transition-all duration-300"
                                />
                                <ExternalLink className="w-3 h-3 text-emerald-500 absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover/badge:opacity-100 transition-opacity" />
                             </a>
                        ) : (
                            <ProjectStatusBadge 
                                isPublished={latestProject.isPublished} 
                                lastModified={latestProject.lastModified}
                                lastPublished={latestProject.lastPublished}
                            />
                        )}
                        
                        <span className="text-xs font-bold uppercase tracking-widest text-text-secondary bg-black/40 px-3 py-1 rounded-full backdrop-blur-md border border-white/10">
                            Latest Work
                        </span>
                   </div>
                   
                   <h2 className="text-6xl font-display font-bold text-white mb-3 tracking-tighter group-hover:text-indigo-200 transition-colors duration-300 max-w-3xl truncate">
                        {latestProject.name}
                   </h2>
                   <p className="text-text-secondary text-xl font-light group-hover:text-white transition-colors">
                        {latestProject.title || "Untitled Position"}
                   </p>

                   {/* Quick Actions */}
                   <div className="mt-8 flex gap-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        {/* Use standard button click without magnetic wrapper propagation issues */}
                        <div onClick={(e) => e.stopPropagation()}>
                            <Button onClick={() => onEdit(latestProject.id)}>
                                Edit Project
                            </Button>
                        </div>
                        {latestProject.isPublished && (
                             <div onClick={(e) => e.stopPropagation()}>
                                <Button variant="secondary" onClick={() => window.open(`https://folioforge.vercel.app/${latestProject.id}`, '_blank')}>
                                    Visit Site
                                </Button>
                             </div>
                        )}
                        {!latestProject.isPublished && (
                             <div onClick={(e) => e.stopPropagation()}>
                                <Button 
                                    variant="danger" 
                                    onClick={() => onDelete(latestProject.id)}
                                    icon={<Trash2 className="w-4 h-4" />}
                                >
                                    Delete
                                </Button>
                             </div>
                        )}
                   </div>
                </div>
             </div>
           ) : (
             <div className="h-full flex flex-col items-center justify-center p-8 text-center bg-white/5">
                <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4">
                    <Clock className="w-8 h-8 text-text-disabled" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">No projects yet</h3>
             </div>
           )}
        </div>
      </div>

      {/* --- Archive Section --- */}
      {olderProjects.length > 0 && (
        <div className="mt-16 animate-in slide-in-from-bottom-8 duration-700 delay-200">
            <div className="flex items-center gap-4 mb-6">
                <h3 className="text-xs font-bold uppercase tracking-widest text-text-disabled">Archive</h3>
                <div className="h-px bg-white/5 flex-1" />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {olderProjects.map((portfolio) => (
                <SpotlightCard key={portfolio.id} className="group hover:border-white/20 bg-surface/30">
                    <div className="flex items-start justify-between mb-6">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-800 to-black border border-white/10 flex items-center justify-center text-xs font-bold text-white font-display">
                            {portfolio.name.substring(0,2).toUpperCase()}
                        </div>
                        
                        <div className="flex items-center gap-2">
                             {/* Delete Button - Only for unpublished (per requirements to cleanup trash) */}
                             {!portfolio.isPublished && (
                                <button
                                    className="text-text-disabled hover:text-error hover:bg-error/10 transition-colors p-2 rounded-md group/trash relative z-20"
                                    onClick={(e) => { 
                                        e.stopPropagation(); 
                                        e.preventDefault();
                                        onDelete(portfolio.id); 
                                    }}
                                    title="Delete Draft"
                                >
                                    <Trash2 className="w-4 h-4 group-hover/trash:scale-110 transition-transform" />
                                </button>
                             )}
                            <button 
                                className="text-text-disabled hover:text-white transition-colors p-1.5"
                                onClick={(e) => { e.stopPropagation(); onEdit(portfolio.id); }}
                            >
                                <MoreHorizontal className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                    
                    <div className="space-y-1">
                        {editingId === portfolio.id ? (
                            <Input 
                                autoFocus
                                value={tempName}
                                onChange={(e) => setTempName(e.target.value)}
                                onBlur={() => saveName(portfolio.id)}
                                onKeyDown={(e) => e.key === 'Enter' && saveName(portfolio.id)}
                                className="h-8 text-sm"
                            />
                        ) : (
                            <h3 
                                className="text-lg font-bold text-text-main group-hover:text-primary transition-colors cursor-pointer truncate"
                                onClick={() => onEdit(portfolio.id)}
                            >
                                {portfolio.name}
                            </h3>
                        )}
                        <p className="text-sm text-text-secondary truncate">{portfolio.title || "No Title"}</p>
                    </div>

                    <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between text-xs text-text-disabled">
                        <span>{portfolio.lastModified.toLocaleDateString()}</span>
                        
                        {/* Live Link on Badge for published items */}
                        {portfolio.isPublished ? (
                            <a
                                href={`https://folioforge.vercel.app/${portfolio.id}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={(e) => e.stopPropagation()}
                                className="cursor-pointer hover:scale-105 transition-transform flex items-center gap-1 group/link relative z-20"
                                title="Visit Live Site"
                            >
                                <ProjectStatusBadge 
                                    isPublished={portfolio.isPublished} 
                                    lastModified={portfolio.lastModified}
                                    lastPublished={portfolio.lastPublished}
                                />
                                <ExternalLink className="w-3 h-3 text-emerald-500 opacity-0 group-hover/link:opacity-100 transition-opacity" />
                            </a>
                        ) : (
                            <ProjectStatusBadge 
                                isPublished={portfolio.isPublished} 
                                lastModified={portfolio.lastModified}
                                lastPublished={portfolio.lastPublished}
                            />
                        )}
                    </div>
                </SpotlightCard>
            ))}
            </div>
        </div>
      )}
    </div>
  );
};
