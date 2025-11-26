

import React, { useState, useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { motion, AnimatePresence, Reorder } from 'framer-motion';
import { Wand2, Save, Eye, Plus, Trash2, ArrowLeft, Upload, FileText, CheckCircle2, GripVertical, Sidebar, Monitor, Smartphone, Tablet, Sparkles, FileDown, Rocket, ExternalLink, ArrowRight, Check, Bot, Layout, Terminal, Palette, Briefcase, User, Type, BoxSelect } from 'lucide-react';
import { Button, Input, Textarea, SpotlightCard, Badge, Modal, Confetti, MagicButton, AiProcessingOverlay, DiffModal, cn, useDebounce, Toast, ProjectStatusBadge } from '../components/ui';
import { PreviewFrame } from '../components/PreviewFrame';
import { PortfolioData } from '../types';
import { polishText, generateStructure } from '../services/geminiService';

interface EditorProps {
  portfolio: PortfolioData;
  onSave: (data: PortfolioData) => void;
  onPreview: () => void;
  onBack: () => void;
}

type DeployStage = 'idle' | 'review' | 'building' | 'success';

// --- Deployment Overlay Component ---
const DeploymentOverlay: React.FC<{ 
    stage: DeployStage; 
    progress: number; 
    log: string; 
    portfolioName: string; 
    portfolioId: string;
    onClose: () => void; 
    onConfirm: () => void; 
    onVisit: () => void;
}> = ({ stage, progress, log, portfolioName, portfolioId, onClose, onConfirm, onVisit }) => {
    if (stage === 'idle') return null;

    return (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-xl flex items-center justify-center p-6"
        >
            <div className="max-w-2xl w-full">
                {/* Stage 1: Review */}
                {stage === 'review' && (
                    <motion.div 
                      initial={{ scale: 0.95, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="bg-[#0F1123] border border-white/10 shadow-2xl rounded-[24px] overflow-hidden p-8"
                    >
                        <div className="text-center mb-8">
                            <h2 className="text-2xl font-bold font-display text-white mb-2">Ready to Publish?</h2>
                            <p className="text-text-secondary">Review your portfolio details before going live.</p>
                        </div>

                        <div className="bg-white/5 border border-white/5 rounded-2xl p-6 mb-8 flex items-start gap-6">
                            <div className="w-24 h-24 bg-surface rounded-xl shadow-inner overflow-hidden flex-shrink-0 border border-white/10">
                                {/* Mini Preview Mockup */}
                                <div className="w-full h-full bg-gradient-to-br from-indigo-500/20 to-purple-500/20 flex items-center justify-center text-primary font-bold text-2xl font-display">
                                    {portfolioName.charAt(0) || "P"}
                                </div>
                            </div>
                            <div className="flex-1">
                                <h3 className="font-bold text-lg text-white mb-1">{portfolioName}</h3>
                                <p className="text-text-secondary text-sm mb-4">Portfolio Website</p>
                                <div className="flex gap-4 text-sm text-text-secondary">
                                    <div className="flex items-center gap-1.5 text-xs uppercase tracking-wider font-bold">
                                        <FileText className="w-4 h-4 text-primary" /> Optimized Assets
                                    </div>
                                    <div className="flex items-center gap-1.5 text-xs uppercase tracking-wider font-bold">
                                        <Sparkles className="w-4 h-4 text-primary" /> SEO Ready
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <Button variant="secondary" onClick={onClose} className="flex-1">Keep Editing</Button>
                            <Button onClick={onConfirm} icon={<Rocket className="w-4 h-4" />} className="flex-1">Publish Now</Button>
                        </div>
                    </motion.div>
                )}

                {/* Stage 2: Building */}
                {stage === 'building' && (
                    <motion.div 
                      initial={{ scale: 0.95, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="bg-[#0F1123] border border-white/10 shadow-2xl rounded-[24px] overflow-hidden p-12 text-center"
                    >
                        <div className="mb-8 relative flex justify-center">
                            {/* Circular Pulse */}
                            <div className="w-20 h-20 rounded-full border-4 border-white/5 border-t-primary animate-spin" />
                            <div className="absolute inset-0 flex items-center justify-center">
                                <Terminal className="w-8 h-8 text-primary/50" />
                            </div>
                        </div>
                        <h2 className="text-xl font-bold font-display text-white mb-2">Deploying your site</h2>
                        <p className="text-text-secondary font-mono text-sm h-6 mb-8">{log}</p>
                        
                        {/* Progress Bar */}
                        <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                            <motion.div 
                              className="h-full bg-primary shadow-glow"
                              initial={{ width: "0%" }}
                              animate={{ width: `${progress}%` }}
                              transition={{ type: "spring", stiffness: 50 }}
                            />
                        </div>
                    </motion.div>
                )}

                {/* Stage 3: Success */}
                {stage === 'success' && (
                    <motion.div 
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="bg-[#0F1123] border border-white/10 shadow-2xl rounded-[24px] overflow-hidden p-10 text-center relative"
                    >
                        <div className="w-24 h-24 bg-success/20 text-success rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(52,211,153,0.3)]">
                            <Check className="w-12 h-12" strokeWidth={3} />
                        </div>
                        
                        <h2 className="text-3xl font-bold font-display text-white mb-4 tracking-tight">You're Live!</h2>
                        <p className="text-text-secondary mb-10 text-lg">Your portfolio has been successfully deployed to Vercel.</p>

                        <div className="flex flex-col gap-3">
                            <button 
                                onClick={onVisit}
                                className="flex items-center justify-center gap-2 w-full h-14 rounded-xl bg-primary text-white font-bold text-lg hover:shadow-glow hover:scale-[1.02] transition-all"
                            >
                                Visit Live Site <ExternalLink className="w-5 h-5" />
                            </button>
                        </div>
                    </motion.div>
                )}
            </div>
        </motion.div>
    );
};

export const Editor: React.FC<EditorProps> = ({ portfolio, onSave, onPreview, onBack }) => {
  const [activeTab, setActiveTab] = useState<'basics' | 'projects' | 'design'>('basics');
  
  // AI State
  const [isAiProcessing, setIsAiProcessing] = useState(false);
  const [optimizingFieldId, setOptimizingFieldId] = useState<string | null>(null);
  const [activeField, setActiveField] = useState<string | null>(null);
  const [warningFieldId, setWarningFieldId] = useState<string | null>(null);
  
  // Diff Modal State
  const [diffData, setDiffData] = useState<{ original: string, modified: string, field: any } | null>(null);
  
  // Ghost Text State
  const [ghostText, setGhostText] = useState<string>('');
  
  const [splitView, setSplitView] = useState(true);

  // Resume Import State
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [resumeText, setResumeText] = useState('');
  const [isParsing, setIsParsing] = useState(false);
  const [parsedData, setParsedData] = useState<any>(null);
  const [aiStep, setAiStep] = useState(0);
  const aiSteps = [
    "Scanning document structure...",
    "Extracting professional experience...",
    "Identifying key technologies...",
    "Polishing bio and descriptions...",
    "Structuring portfolio data..."
  ];

  // Manual Save State
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
  const [saveName, setSaveName] = useState(portfolio.name);
  const [showToast, setShowToast] = useState(false);

  // Deployment State
  const [deployStage, setDeployStage] = useState<DeployStage>('idle');
  const [deployProgress, setDeployProgress] = useState(0);
  const [deployLog, setDeployLog] = useState<string>('Initializing...');

  const { register, control, handleSubmit, setValue, watch, getValues } = useForm<PortfolioData>({
    defaultValues: portfolio
  });

  const { fields, append, remove, replace: replaceFields } = useFieldArray({
    control,
    name: "projects"
  });

  const currentValues = watch(); 
  // We use useDebounce here primarily to feed the PreviewFrame without causing lag on every keystroke
  const debouncedValues = useDebounce(currentValues, 300);

  const bioValue = watch('bio');

  // Determine Sync Status for UI
  const isUnsynced = portfolio.isPublished && portfolio.lastPublished && 
      new Date(portfolio.lastModified).getTime() > new Date(portfolio.lastPublished).getTime() + 1000;

  // Simulate Ghost Text Logic
  useEffect(() => {
    if (activeField === 'bio' && bioValue) {
        // Simple mock simulation of AI predicting completion
        const timer = setTimeout(() => {
             // If user ends with specific words, show suggestions (Mock for demo)
             if (!bioValue.endsWith('.') && bioValue.length > 10) {
                 const suggestions = [
                     "and creating intuitive user experiences.",
                     "with a focus on performance and scalability.",
                     "specializing in modern frontend architectures."
                 ];
                 setGhostText(suggestions[Math.floor(Math.random() * suggestions.length)]);
             } else {
                 setGhostText('');
             }
        }, 800);
        return () => clearTimeout(timer);
    } else {
        setGhostText('');
    }
  }, [bioValue, activeField]);

  const handleAcceptSuggestion = () => {
      if (ghostText && activeField === 'bio') {
          setValue('bio', bioValue + " " + ghostText, { shouldDirty: true });
          setGhostText('');
      }
  };

  const handleAiPolish = async (
      field: keyof PortfolioData | `projects.${number}.description`, 
      context: 'bio' | 'project' | 'title'
  ) => {
    const currentValue = getValues(field as any);
    
    // Check if empty
    if (!currentValue || typeof currentValue !== 'string' || !currentValue.trim()) {
        setWarningFieldId(field);
        setTimeout(() => setWarningFieldId(null), 1500); // Clear warning after animation
        return;
    }

    setOptimizingFieldId(field);
    setIsAiProcessing(true);
    
    try {
      const polished = await polishText(currentValue, context, 'professional');
      // Open Diff Modal with result
      setDiffData({
          original: currentValue,
          modified: polished,
          field: field
      });
    } finally {
      setIsAiProcessing(false);
      setOptimizingFieldId(null);
    }
  };

  const applyAiChanges = (finalText: string) => {
      if (diffData) {
          setValue(diffData.field, finalText);
          setDiffData(null);
      }
  };

  // Render the AI action button for input labels
  const renderAiAction = (fieldId: string, context: 'bio' | 'project' | 'title') => (
      <button 
          type="button"
          onClick={() => handleAiPolish(fieldId as any, context)}
          disabled={isAiProcessing && optimizingFieldId === fieldId}
          className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-primary hover:text-white transition-colors group disabled:opacity-50 disabled:cursor-not-allowed"
      >
          {isAiProcessing && optimizingFieldId === fieldId ? (
              <>
                 <Sparkles className="w-3 h-3 animate-spin" />
                 Thinking...
              </>
          ) : (
              <>
                <Wand2 className="w-3 h-3 group-hover:rotate-12 transition-transform" />
                AI Optimize
              </>
          )}
      </button>
  );

  // Manual Save Handlers
  const handleManualSaveClick = () => {
      setSaveName(getValues('name') || portfolio.name);
      setIsSaveModalOpen(true);
  };

  const confirmSave = () => {
      const currentData = getValues();
      
      // Update the form name field locally too, so header reflects it if needed immediately
      setValue('name', saveName);

      onSave({
          ...currentData,
          name: saveName,
          lastModified: new Date()
      });
      
      setIsSaveModalOpen(false);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
  };

  const handleDeployStart = () => {
      setDeployStage('review');
  };

  const handleDeployConfirm = () => {
      setDeployStage('building');
      setDeployProgress(0);
      
      const steps = [
          { p: 10, log: 'Validating configuration...' },
          { p: 30, log: 'Optimizing assets and images...' },
          { p: 60, log: 'Building React production bundle...' },
          { p: 80, log: 'Deploying to Edge Network...' },
          { p: 95, log: 'Finalizing deployment...' },
          { p: 100, log: 'Live!' }
      ];

      let stepIndex = 0;
      const interval = setInterval(() => {
          if (stepIndex >= steps.length) {
              clearInterval(interval);
              setDeployStage('success');
              const currentData = getValues();
              const now = new Date();
              onSave({ 
                  ...currentData, 
                  isPublished: true, 
                  publishedUrl: `https://folioforge.vercel.app/${portfolio.id}`,
                  lastModified: now,
                  lastPublished: now
              });
              return;
          }
          const step = steps[stepIndex];
          setDeployProgress(step.p);
          setDeployLog(step.log);
          stepIndex++;
      }, 800); 
  };

  const handleDeployClose = () => {
      setDeployStage('idle');
  };

  const handleVisitLiveSite = () => {
      window.open(`https://folioforge.vercel.app/${portfolio.id}`, '_blank');
      handleDeployClose();
      onBack(); 
  };

  const handleReorder = (newOrder: any[]) => {
      replaceFields(newOrder);
  };

  const handleResumeAnalysis = async () => {
      if (!resumeText.trim()) return;
      setIsParsing(true);
      setAiStep(0);
      
      const stepInterval = setInterval(() => {
          setAiStep(prev => (prev < aiSteps.length - 1 ? prev + 1 : prev));
      }, 1200);

      try {
          const result = await generateStructure(resumeText);
          await new Promise(resolve => setTimeout(resolve, 3500));
          setParsedData(result);
      } catch (e) {
          console.error(e);
      } finally {
          clearInterval(stepInterval);
          setIsParsing(false);
      }
  };

  const applyImportedData = () => {
      if (!parsedData) return;
      if (parsedData.fullName) setValue('fullName', parsedData.fullName, { shouldDirty: true });
      if (parsedData.title) setValue('title', parsedData.title, { shouldDirty: true });
      if (parsedData.email) setValue('email', parsedData.email, { shouldDirty: true });
      if (parsedData.bio) setValue('bio', parsedData.bio, { shouldDirty: true });
      if (parsedData.projects) {
           replaceFields(parsedData.projects.map((p: any) => ({
              id: Date.now().toString() + Math.random(),
              title: p.title || 'Untitled',
              description: p.description || '',
              technologies: Array.isArray(p.technologies) ? p.technologies.join(', ') : '',
              imageUrl: ''
          })));
      }
      setIsImportModalOpen(false);
      setParsedData(null);
      setResumeText('');
  };

  const fillDemoData = () => {
      append([
          { id: 'd1', title: 'E-Commerce Dashboard', description: 'A comprehensive analytics platform for online retailers.', technologies: 'React, Recharts, Tailwind', imageUrl: '' },
          { id: 'd2', title: 'Travel App UI', description: 'Modern interface design for a travel booking application.', technologies: 'Figma, Flutter', imageUrl: '' }
      ]);
  };

  const tabItems = [
    { id: 'basics', label: 'Basics', icon: User },
    { id: 'projects', label: 'Projects', icon: Briefcase },
    { id: 'design', label: 'Visual Identity', icon: Palette }
  ];

  return (
    <motion.div 
        className="h-[calc(100vh-theme(spacing.20))] md:h-screen flex flex-col md:overflow-hidden relative bg-background origin-top"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
    >
        {/* --- Header --- */}
        <header className="h-16 border-b border-white/10 flex items-center justify-between px-6 bg-[#030014]/50 backdrop-blur-md z-30 shrink-0">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="sm" onClick={onBack} icon={<ArrowLeft className="w-4 h-4"/>} className="text-text-secondary" />
                <div className="h-6 w-px bg-white/10" />
                <h1 className="font-display font-bold text-lg text-white truncate max-w-[200px]">{portfolio.name}</h1>
                <ProjectStatusBadge 
                    isPublished={portfolio.isPublished} 
                    lastModified={portfolio.lastModified} 
                    lastPublished={portfolio.lastPublished} 
                />
            </div>

            <div className="flex items-center gap-3">
                {/* View Toggle */}
                <div className="hidden md:flex bg-white/5 rounded-lg p-0.5 border border-white/5 mr-4">
                    <button 
                        onClick={() => setSplitView(false)}
                        className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${!splitView ? 'bg-surface text-white shadow-sm' : 'text-text-secondary hover:text-white'}`}
                    >
                        Focus
                    </button>
                    <button 
                        onClick={() => setSplitView(true)}
                        className={`px-3 py-1.5 rounded-md text-xs font-medium flex items-center gap-1.5 transition-all ${splitView ? 'bg-surface text-white shadow-sm' : 'text-text-secondary hover:text-white'}`}
                    >
                        <Sidebar className="w-3 h-3" /> Split
                    </button>
                </div>

                <Button variant="ghost" size="sm" icon={<Save className="w-4 h-4" />} onClick={handleManualSaveClick}>
                    Save
                </Button>
                <Button variant="secondary" size="sm" icon={<FileDown className="w-4 h-4" />} onClick={() => setIsImportModalOpen(true)}>
                    Import
                </Button>
                
                {/* State-Aware Publish Button */}
                <Button 
                    variant={isUnsynced ? "primary" : "secondary"} 
                    size="sm" 
                    icon={<Rocket className="w-4 h-4" />}
                    onClick={handleDeployStart}
                    className={cn(isUnsynced && "relative border-amber-500/50 hover:border-amber-500/80")}
                >
                    {isUnsynced && (
                        <span className="absolute -top-1 -right-1 flex h-3 w-3">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500"></span>
                        </span>
                    )}
                    {isUnsynced ? 'Publish Changes' : (portfolio.isPublished ? 'Republish' : 'Publish')}
                </Button>
            </div>
        </header>

        {/* --- Main Content --- */}
        <div className="flex-1 flex overflow-hidden">
            
            {/* --- Editor Panel --- */}
            <div className={cn(
                "flex-1 flex flex-col transition-all duration-500 bg-background relative z-20",
                splitView ? "w-1/2 max-w-[50%]" : "w-full max-w-3xl mx-auto"
            )}>
                {/* Tabs */}
                <div className="flex items-center border-b border-white/10 px-6">
                    {tabItems.map((tab) => {
                        const Icon = tab.icon;
                        const isActive = activeTab === tab.id;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id as any)}
                                className={cn(
                                    "flex items-center gap-2 px-6 py-4 text-sm font-medium border-b-2 transition-all",
                                    isActive ? "border-primary text-white" : "border-transparent text-text-secondary hover:text-white hover:border-white/10"
                                )}
                            >
                                <Icon className="w-4 h-4" />
                                {tab.label}
                            </button>
                        );
                    })}
                </div>

                {/* Form Area */}
                <div className="flex-1 overflow-y-auto custom-scrollbar p-6 md:p-8 space-y-8">
                    
                    <form onSubmit={(e) => e.preventDefault()} className="space-y-8 pb-20">
                        <AnimatePresence mode="wait">
                            
                            {/* BASICS TAB */}
                            {activeTab === 'basics' && (
                                <motion.div 
                                    key="basics"
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20 }}
                                    className="space-y-8"
                                >
                                    <div className="flex items-center gap-2 mb-2">
                                        <User className="w-5 h-5 text-primary" />
                                        <h2 className="text-lg font-bold font-display text-white">Personal Info</h2>
                                        <div className="h-px bg-white/10 flex-1 ml-4" />
                                    </div>

                                    <div className="grid grid-cols-2 gap-6">
                                        <Input 
                                            label="Full Name" 
                                            placeholder="e.g. Alex Chen" 
                                            {...register("fullName")} 
                                        />
                                        <Input 
                                            label="Job Title" 
                                            // REMOVED AI ACTION FROM JOB TITLE
                                            placeholder="e.g. Senior Product Designer"
                                            {...register("title")} 
                                        />
                                    </div>

                                    <Input 
                                        label="Email Contact" 
                                        placeholder="alex@example.com" 
                                        {...register("email")} 
                                    />

                                    <Textarea 
                                        label="Professional Bio" 
                                        labelAction={renderAiAction('bio', 'bio')}
                                        placeholder="Tell your story..." 
                                        className="h-40"
                                        {...register("bio")}
                                        onFocus={() => setActiveField('bio')}
                                        onBlur={() => setActiveField(null)}
                                        ghostText={ghostText}
                                        onAcceptSuggestion={handleAcceptSuggestion}
                                        isOptimizing={optimizingFieldId === 'bio'}
                                        isWarning={warningFieldId === 'bio'}
                                    />
                                </motion.div>
                            )}

                            {/* PROJECTS TAB */}
                            {activeTab === 'projects' && (
                                <motion.div 
                                    key="projects"
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20 }}
                                    className="space-y-6"
                                >
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex items-center gap-2">
                                            <Briefcase className="w-5 h-5 text-primary" />
                                            <h2 className="text-lg font-bold font-display text-white">Experience</h2>
                                        </div>
                                        <Button size="sm" onClick={() => append({ id: Date.now().toString(), title: '', description: '', technologies: '', imageUrl: '' })} icon={<Plus className="w-4 h-4"/>}>
                                            Add Project
                                        </Button>
                                    </div>

                                    <div className="space-y-6">
                                        {fields.map((field, index) => (
                                            <SpotlightCard key={field.id} className="p-6 bg-surface/50 border border-white/5 relative group">
                                                <button 
                                                    onClick={() => remove(index)}
                                                    className="absolute top-4 right-4 p-2 text-text-disabled hover:text-error hover:bg-error/10 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>

                                                <div className="grid grid-cols-1 gap-4">
                                                    <Input 
                                                        label="Project Title" 
                                                        placeholder="e.g. E-Commerce Redesign" 
                                                        {...register(`projects.${index}.title` as const)} 
                                                    />
                                                    
                                                    <Textarea 
                                                        label="Description" 
                                                        labelAction={renderAiAction(`projects.${index}.description`, 'project')}
                                                        isOptimizing={optimizingFieldId === `projects.${index}.description`}
                                                        isWarning={warningFieldId === `projects.${index}.description`}
                                                        placeholder="Describe the project impact..."
                                                        className="min-h-[100px]"
                                                        {...register(`projects.${index}.description` as const)} 
                                                    />

                                                    <Input 
                                                        label="Technologies" 
                                                        placeholder="e.g. React, TypeScript, Tailwind" 
                                                        {...register(`projects.${index}.technologies` as const)} 
                                                    />
                                                </div>
                                            </SpotlightCard>
                                        ))}
                                        {fields.length === 0 && (
                                            <div className="text-center py-12 border border-dashed border-white/10 rounded-2xl bg-white/5">
                                                <p className="text-text-secondary mb-4">No projects added yet.</p>
                                                <div className="flex justify-center gap-4">
                                                    <Button variant="secondary" onClick={fillDemoData}>Fill Demo Data</Button>
                                                    <Button onClick={() => append({ id: Date.now().toString(), title: '', description: '', technologies: '', imageUrl: '' })}>Add Manually</Button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </motion.div>
                            )}

                             {/* DESIGN TAB */}
                            {activeTab === 'design' && (
                                <motion.div 
                                    key="design"
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20 }}
                                    className="space-y-10"
                                >
                                    
                                    {/* Typography Section */}
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-2 mb-2">
                                            <Type className="w-5 h-5 text-primary" />
                                            <h2 className="text-lg font-bold font-display text-white">Typography</h2>
                                            <div className="h-px bg-white/10 flex-1 ml-4" />
                                        </div>
                                        
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                            {[
                                                { id: 'sans', label: 'Modern Sans', font: 'Inter, sans-serif', desc: 'Clean & Contemporary' },
                                                { id: 'serif', label: 'Classic Serif', font: 'Playfair Display, serif', desc: 'Elegant & Timeless' },
                                                { id: 'mono', label: 'Tech Mono', font: 'JetBrains Mono, monospace', desc: 'Raw & Technical' },
                                            ].map((type) => {
                                                const isActive = watch('typography') === type.id;
                                                return (
                                                    <div 
                                                        key={type.id}
                                                        onClick={() => setValue('typography', type.id as any, { shouldDirty: true })}
                                                        className={cn(
                                                            "cursor-pointer relative group overflow-hidden rounded-xl border transition-all duration-300",
                                                            isActive ? "bg-primary/10 border-primary" : "bg-surface border-white/5 hover:border-white/20"
                                                        )}
                                                    >
                                                        <div className="p-4 flex flex-col items-center justify-center min-h-[120px] gap-2">
                                                            <div className="text-3xl" style={{ fontFamily: type.font }}>Aa</div>
                                                            <div className="text-center">
                                                                <div className={cn("text-sm font-bold", isActive ? "text-primary" : "text-white")}>{type.label}</div>
                                                                <div className="text-[10px] text-text-secondary uppercase tracking-wider">{type.desc}</div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )
                                            })}
                                        </div>
                                    </div>

                                    {/* Shape System Section */}
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-2 mb-2">
                                            <BoxSelect className="w-5 h-5 text-primary" />
                                            <h2 className="text-lg font-bold font-display text-white">Shape System</h2>
                                            <div className="h-px bg-white/10 flex-1 ml-4" />
                                        </div>
                                        
                                        <div className="grid grid-cols-3 gap-4">
                                            {[
                                                { id: 'sharp', label: 'Sharp', class: 'rounded-none' },
                                                { id: 'smooth', label: 'Smooth', class: 'rounded-lg' },
                                                { id: 'round', label: 'Round', class: 'rounded-2xl' },
                                            ].map((shape) => {
                                                const isActive = watch('cornerRadius') === shape.id;
                                                return (
                                                    <div 
                                                        key={shape.id}
                                                        onClick={() => setValue('cornerRadius', shape.id as any, { shouldDirty: true })}
                                                        className={cn(
                                                            "cursor-pointer flex flex-col items-center gap-3 p-4 rounded-xl border transition-all duration-300",
                                                            isActive ? "bg-primary/10 border-primary" : "bg-surface border-white/5 hover:border-white/20"
                                                        )}
                                                    >
                                                        <div className={cn("w-12 h-12 bg-white/10 border border-white/10", shape.class)} />
                                                        <span className={cn("text-xs font-bold uppercase tracking-wider", isActive ? "text-primary" : "text-text-secondary")}>
                                                            {shape.label}
                                                        </span>
                                                    </div>
                                                )
                                            })}
                                        </div>
                                    </div>

                                    {/* Color Section (Enhanced) */}
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-2 mb-2">
                                            <Palette className="w-5 h-5 text-primary" />
                                            <h2 className="text-lg font-bold font-display text-white">Accent Color</h2>
                                            <div className="h-px bg-white/10 flex-1 ml-4" />
                                        </div>

                                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                                            {[
                                                { color: '#6366f1', name: 'Indigo' },
                                                { color: '#ec4899', name: 'Pink' },
                                                { color: '#10b981', name: 'Emerald' },
                                                { color: '#f59e0b', name: 'Amber' },
                                                { color: '#3b82f6', name: 'Blue' },
                                                { color: '#8b5cf6', name: 'Violet' },
                                                { color: '#ef4444', name: 'Red' },
                                                { color: '#18181b', name: 'Zinc' }, // Added Zinc/Black option
                                            ].map(({ color, name }) => {
                                                const isActive = watch('themeColor') === color;
                                                return (
                                                    <button
                                                        key={color}
                                                        onClick={() => setValue('themeColor', color, { shouldDirty: true })}
                                                        className={cn(
                                                            "group relative flex items-center gap-3 p-2 rounded-xl border transition-all duration-300",
                                                            isActive ? "bg-white/5 border-white/20" : "border-transparent hover:bg-white/5"
                                                        )}
                                                    >
                                                        <div 
                                                            className={cn(
                                                                "w-8 h-8 rounded-full shadow-lg transition-transform",
                                                                isActive && "scale-110 ring-2 ring-white ring-offset-2 ring-offset-[#0F1123]"
                                                            )}
                                                            style={{ backgroundColor: color }}
                                                        />
                                                        <span className={cn("text-sm font-medium", isActive ? "text-white" : "text-text-secondary")}>
                                                            {name}
                                                        </span>
                                                    </button>
                                                )
                                            })}
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                        </AnimatePresence>
                    </form>
                </div>
            </div>

            {/* --- Live Preview Panel --- */}
            {splitView && (
                <div className="w-1/2 border-l border-white/10 bg-[#050505] relative hidden md:block">
                     <div className="absolute top-4 right-4 z-10 bg-black/50 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-[10px] uppercase font-bold tracking-widest text-white/80">Live Preview</span>
                     </div>
                     <PreviewFrame portfolio={debouncedValues} viewMode="desktop" scale={1} className="h-full" />
                </div>
            )}
        </div>

        {/* --- Modals --- */}
        
        {/* Import Modal */}
        <Modal isOpen={isImportModalOpen} onClose={() => setIsImportModalOpen(false)} title="Import from Resume">
             {!isParsing && !parsedData ? (
                 <div className="space-y-4">
                     <p className="text-text-secondary text-sm">Paste your resume text below. Our AI will structure it into a portfolio format.</p>
                     <textarea 
                        className="w-full h-64 bg-black/20 border border-white/10 rounded-xl p-4 text-sm text-text-main focus:border-primary/50 focus:outline-none resize-none custom-scrollbar"
                        placeholder="Paste resume content here..."
                        value={resumeText}
                        onChange={(e) => setResumeText(e.target.value)}
                     />
                     <div className="flex justify-end gap-3">
                         <Button variant="ghost" onClick={() => { setResumeText(''); setIsImportModalOpen(false); }}>Cancel</Button>
                         <MagicButton 
                            onClick={handleResumeAnalysis} 
                            disabled={!resumeText.trim()}
                            icon={<Sparkles className="w-4 h-4" />}
                         >
                            Analyze & Import
                         </MagicButton>
                     </div>
                 </div>
             ) : isParsing ? (
                 <AiProcessingOverlay steps={aiSteps} currentStep={aiStep} />
             ) : (
                 <div className="space-y-6">
                     <div className="flex items-center gap-3 text-success bg-success/10 p-4 rounded-xl border border-success/20">
                         <CheckCircle2 className="w-6 h-6" />
                         <div>
                             <h4 className="font-bold text-white">Import Successful</h4>
                             <p className="text-xs text-success/80">Found {parsedData?.projects?.length || 0} projects and bio information.</p>
                         </div>
                     </div>
                     <div className="grid grid-cols-2 gap-4">
                         <div className="bg-white/5 p-4 rounded-xl">
                             <span className="text-xs text-text-secondary uppercase">Name</span>
                             <p className="font-medium text-white">{parsedData?.fullName || 'N/A'}</p>
                         </div>
                         <div className="bg-white/5 p-4 rounded-xl">
                             <span className="text-xs text-text-secondary uppercase">Role</span>
                             <p className="font-medium text-white">{parsedData?.title || 'N/A'}</p>
                         </div>
                     </div>
                     <Button onClick={applyImportedData} className="w-full">Apply to Portfolio</Button>
                 </div>
             )}
        </Modal>

        {/* Save Modal */}
        <Modal isOpen={isSaveModalOpen} onClose={() => setIsSaveModalOpen(false)} title="Save Portfolio">
            <div className="space-y-4">
                <Input 
                    label="Portfolio Name"
                    value={saveName}
                    onChange={(e) => setSaveName(e.target.value)}
                    placeholder="e.g. My 2024 Design Portfolio"
                />
                <div className="flex justify-end gap-3 pt-4">
                    <Button variant="ghost" onClick={() => setIsSaveModalOpen(false)}>Cancel</Button>
                    <Button onClick={confirmSave}>Save Changes</Button>
                </div>
            </div>
        </Modal>

        {/* Diff Review Modal */}
        {diffData && (
            <DiffModal 
                isOpen={!!diffData} 
                onClose={() => setDiffData(null)}
                original={diffData.original}
                modified={diffData.modified}
                onAccept={applyAiChanges}
            />
        )}

        {/* Deployment Overlay */}
        <DeploymentOverlay 
            stage={deployStage} 
            progress={deployProgress} 
            log={deployLog}
            portfolioName={portfolio.name}
            portfolioId={portfolio.id}
            onClose={handleDeployClose}
            onConfirm={handleDeployConfirm}
            onVisit={handleVisitLiveSite}
        />

        {showToast && <Toast message="Portfolio saved successfully" onClose={() => setShowToast(false)} />}
        {deployStage === 'success' && <Confetti />}

    </motion.div>
  );
};
