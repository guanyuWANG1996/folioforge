import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Smartphone, Tablet, Monitor, ArrowLeft, Rocket, CheckCircle2, Copy } from 'lucide-react';
import { Button } from '../components/ui';
import { PreviewFrame } from '../components/PreviewFrame';
import { ViewMode } from '../types';

interface PreviewProps {
  data: Record<string, any>;
  onBack: () => void;
  onPublish: () => void;
}

export const Preview: React.FC<PreviewProps> = ({ data, onBack, onPublish }) => {
  const [viewMode, setViewMode] = useState<ViewMode>('desktop');
  const [isPublishing, setIsPublishing] = useState(false);
  const [published, setPublished] = useState(false);

  const handlePublish = () => {
    setIsPublishing(true);
    setTimeout(() => {
        setIsPublishing(false);
        setPublished(true);
        onPublish();
    }, 2500);
  };

  if (published) {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center text-center p-6 bg-background relative overflow-hidden">
            <div className="bg-noise z-0" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-success/10 to-transparent pointer-events-none" />
            
            <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 20 }}
                className="w-24 h-24 bg-success/20 text-success rounded-full flex items-center justify-center mb-8 shadow-glow relative z-10 border border-success/30"
            >
                <CheckCircle2 className="w-12 h-12" />
            </motion.div>
            <h1 className="text-5xl font-bold font-display text-white mb-4 tracking-tight z-10">Congratulations!</h1>
            <p className="text-text-secondary mb-12 text-lg z-10">Your portfolio is now live and ready to share.</p>
            
            <div className="bg-surface border border-white/10 rounded-xl p-2 pl-4 mb-8 flex items-center gap-4 max-w-md w-full shadow-lg z-10">
                <span className="text-primary-glow truncate flex-1 font-medium select-all">https://folioforge.vercel.app/preview</span>
                <Button size="sm" variant="ghost" icon={<Copy className="w-4 h-4"/>}>Copy</Button>
            </div>
            
            <div className="flex gap-4 z-10">
                <Button variant="secondary" onClick={onBack}>Back to Editor</Button>
                <Button onClick={() => window.open('https://example.com', '_blank')}>View Live Site</Button>
            </div>
        </div>
    );
  }

  return (
    <div className="h-screen flex flex-col relative bg-background overflow-hidden">
      <div className="bg-noise z-0" />
      {/* Background gradients specific to preview focus */}
      <div className="absolute top-[-20%] left-[20%] w-[60vw] h-[60vw] rounded-full bg-indigo-500/10 blur-[100px] pointer-events-none" />

      {/* Floating Toolbar */}
      <div className="absolute top-6 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2 p-2 bg-[#0F1123]/80 backdrop-blur-xl rounded-full shadow-2xl border border-white/10">
        <Button variant="ghost" size="sm" onClick={onBack} icon={<ArrowLeft className="w-4 h-4"/>} className="rounded-full w-10 h-10 p-0 flex items-center justify-center text-white" />

        <div className="w-px h-6 bg-white/10 mx-1" />

        <div className="flex bg-white/5 rounded-full p-1 border border-white/5">
            {[
                { mode: 'desktop', icon: Monitor },
                { mode: 'tablet', icon: Tablet },
                { mode: 'mobile', icon: Smartphone }
            ].map(({ mode, icon: Icon }) => (
                <button 
                    key={mode}
                    onClick={() => setViewMode(mode as any)}
                    className={`p-2 rounded-full transition-all ${viewMode === mode ? 'bg-surface text-white shadow-md border border-white/10' : 'text-text-secondary hover:text-white'}`}
                >
                    <Icon className="w-4 h-4" />
                </button>
            ))}
        </div>

        <div className="w-px h-6 bg-white/10 mx-1" />

        <Button 
            onClick={handlePublish} 
            isLoading={isPublishing}
            icon={<Rocket className="w-4 h-4" />}
            className="rounded-full px-6"
        >
            {isPublishing ? 'Deploying...' : 'Publish'}
        </Button>
      </div>

      {/* Frame Container */}
      <div className="flex-1 overflow-hidden flex justify-center items-end pt-28 pb-0 md:pb-10 px-4 relative z-10">
          <PreviewFrame data={data} viewMode={viewMode} className="bg-transparent" />
      </div>
    </div>
  );
};
