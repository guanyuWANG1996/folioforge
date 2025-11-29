
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button, Card, Badge } from '../components/ui';
import { Template, ViewMode } from '../types';
import { Layout, Palette, Briefcase, Eye, Check, X, Smartphone, Tablet, Monitor } from 'lucide-react';
import { PreviewFrame } from '../components/PreviewFrame';
import { getRenderedDemoHtml } from '../constants';

interface TemplateGalleryProps {
  templates: Template[];
  onSelect: (template: Template) => void;
}

const categories = [
    { id: 'All', label: 'All', icon: Layout },
    { id: 'Minimal', label: 'Minimal', icon: Layout },
    { id: 'Creative', label: 'Creative', icon: Palette },
    { id: 'Corporate', label: 'Corporate', icon: Briefcase }
];

export const TemplateGallery: React.FC<TemplateGalleryProps> = ({ templates, onSelect }) => {
  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedPreview, setSelectedPreview] = useState<Template | null>(null);
  const [previewViewMode, setPreviewViewMode] = useState<ViewMode>('desktop');
  const [compiledHtml, setCompiledHtml] = useState<string>('');

  const filteredTemplates = templates.filter(t => 
    activeCategory === 'All' || t.style.toLowerCase() === activeCategory.toLowerCase()
  );

  React.useEffect(() => {
    setCompiledHtml('');
    if (!selectedPreview) return;
    getRenderedDemoHtml(selectedPreview).then(setCompiledHtml).catch(() => setCompiledHtml(''));
  }, [selectedPreview]);

  const previewData = React.useMemo(() => {
    if (!selectedPreview) return {} as any;
    const dd: any = selectedPreview.demoData || {};
    const normalized: any = { ...dd };
    if (dd.basics) Object.assign(normalized, dd.basics);
    if (dd.design) Object.assign(normalized, dd.design);
    if (dd.portfolio) normalized.projects = dd.portfolio;
    if (dd.projects) normalized.projects = dd.projects;
    return normalized;
  }, [selectedPreview]);

  return (
    <div className="space-y-16 pb-20">
      
      {/* Header */}
      <div className="relative pt-12 md:pt-20 px-4 text-center overflow-hidden">
        {/* Decorative Background Text */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 text-[12rem] md:text-[20rem] font-bold font-display text-white/[0.02] tracking-tighter leading-none pointer-events-none select-none">
            CANVAS
        </div>

        <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative z-10"
        >
            <Badge variant="outline" className="mb-6 px-4 py-1.5 border-primary/20 bg-primary/5 text-primary">
                Template Library
            </Badge>
            <h1 className="text-5xl md:text-7xl font-bold font-display text-white tracking-tighter mb-6">
                Choose your <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-indigo-400 animate-gradient-x">foundation</span>.
            </h1>
            <p className="text-text-secondary text-xl font-light max-w-2xl mx-auto leading-relaxed">
                Select a starting point. Evaluate with real-time previews before you build.
            </p>
        </motion.div>
      </div>

      {/* Filter Bar */}
      <div className="flex justify-center">
         <div className="inline-flex p-1.5 bg-white/5 border border-white/5 rounded-2xl backdrop-blur-md">
            {categories.map((cat) => {
                const isActive = activeCategory === cat.id;
                return (
                    <button
                        key={cat.id}
                        onClick={() => setActiveCategory(cat.id)}
                        className={`
                            relative px-6 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 flex items-center gap-2
                            ${isActive ? 'text-white' : 'text-text-secondary hover:text-white'}
                        `}
                    >
                        {isActive && (
                            <motion.div 
                                layoutId="activeFilter"
                                className="absolute inset-0 bg-surface shadow-lg rounded-xl border border-white/10"
                                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            />
                        )}
                        <span className="relative z-10 flex items-center gap-2">
                             {cat.label}
                        </span>
                    </button>
                )
            })}
         </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-4">
        {filteredTemplates.map((template, index) => (
          <motion.div
            key={template.id}
            layout
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
          >
            <Card 
                className="h-full group cursor-pointer border-white/10 bg-surface/40 hover:bg-surface/80 hover:border-primary/30 transition-all duration-500 overflow-visible flex flex-col" 
                noPadding 
            >
              <div className="p-3">
                  <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-black/50 relative">
                    <img 
                      src={template.thumbnail} 
                      alt={template.name} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-80 group-hover:opacity-100"
                    />
                    
                    {/* Overlay Action */}
                    <div className="absolute inset-0 bg-indigo-900/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-sm gap-3">
                         <motion.div 
                            initial={{ y: 20, opacity: 0 }}
                            whileInView={{ y: 0, opacity: 1 }}
                            className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 flex gap-3"
                         >
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
                                icon={<Check className="w-4 h-4" />}
                                onClick={() => onSelect(template)}
                            >
                                Use
                            </Button>
                        </motion.div>
                    </div>

                    <div className="absolute top-3 left-3">
                        <div className="bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 text-[10px] font-bold uppercase tracking-widest text-white">
                            {template.style}
                        </div>
                    </div>
                  </div>
              </div>

              <div className="px-6 pb-6 pt-2 flex flex-col flex-1">
                <h3 className="text-2xl font-bold font-display text-white mb-2 group-hover:text-primary transition-colors">{template.name}</h3>
                <p className="text-text-secondary text-sm line-clamp-2 leading-relaxed mb-4 font-light flex-1">{template.description}</p>
                
                <div className="flex flex-wrap gap-2">
                    {template.tags.slice(0, 3).map(tag => (
                        <span key={tag} className="text-[10px] text-text-secondary bg-white/5 px-2 py-1 rounded-md border border-white/5 uppercase tracking-wide">
                            {tag}
                        </span>
                    ))}
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* --- Full Screen Preview Modal --- */}
      <AnimatePresence>
        {selectedPreview && (
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-xl flex flex-col"
            >
                {/* Header Toolbar */}
                <div className="h-16 border-b border-white/10 flex items-center justify-between px-6 bg-[#030014] shrink-0">
                    <div className="flex items-center gap-4">
                        <h2 className="text-white font-display font-bold text-lg">{selectedPreview.name}</h2>
                        <Badge variant="outline">{selectedPreview.style}</Badge>
                    </div>

                    {/* View Toggles */}
                    <div className="hidden md:flex bg-white/5 rounded-full p-1 border border-white/5">
                        {[
                            { mode: 'desktop', icon: Monitor },
                            { mode: 'tablet', icon: Tablet },
                            { mode: 'mobile', icon: Smartphone }
                        ].map(({ mode, icon: Icon }) => (
                            <button 
                                key={mode}
                                onClick={() => setPreviewViewMode(mode as any)}
                                className={`p-2 rounded-full transition-all ${previewViewMode === mode ? 'bg-surface text-white shadow-md border border-white/10' : 'text-text-secondary hover:text-white'}`}
                            >
                                <Icon className="w-4 h-4" />
                            </button>
                        ))}
                    </div>

                    <div className="flex items-center gap-3">
                         <Button 
                            variant="ghost" 
                            onClick={() => setSelectedPreview(null)}
                            className="text-text-secondary hover:text-white"
                         >
                            Cancel
                         </Button>
                         <Button 
                            onClick={() => { onSelect(selectedPreview); setSelectedPreview(null); }}
                            icon={<Check className="w-4 h-4" />}
                         >
                            Use Template
                         </Button>
                    </div>
                </div>

                {/* Preview Content */}
                <div className="flex-1 overflow-hidden relative bg-[#050505] flex items-center justify-center p-4 md:p-8">
                     <div className="absolute inset-0 bg-noise opacity-20 pointer-events-none" />
                     
                     <PreviewFrame 
                        compiledHtml={compiledHtml}
                        template={selectedPreview}
                        data={previewData}
                        viewMode={previewViewMode}
                        className="h-full bg-transparent"
                     />
                </div>
            </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
