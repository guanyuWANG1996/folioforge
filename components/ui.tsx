import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, HTMLMotionProps, AnimatePresence, useMotionValue, useSpring } from 'framer-motion';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Loader2, Check, X, Sparkles, ScanLine, BrainCircuit, Database, GitCompare, Keyboard, Cloud, CheckCircle2, Edit3, Wand2, AlertCircle, Globe, File, RefreshCw } from 'lucide-react';

// Utility for merging tailwind classes
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// --- Hook: useDebounce ---
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

// --- Toast ---
export const Toast: React.FC<{ message: string; type?: 'success' | 'error'; onClose: () => void }> = ({ message, type = 'success', onClose }) => {
    useEffect(() => {
        const timer = setTimeout(onClose, 3000);
        return () => clearTimeout(timer);
    }, [onClose]);

    return (
        <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className={cn(
                "fixed bottom-8 left-1/2 -translate-x-1/2 z-[100] px-6 py-3 rounded-full shadow-2xl flex items-center gap-3 backdrop-blur-md border",
                type === 'success' ? "bg-[#0F1123]/90 border-success/20 text-success" : "bg-[#0F1123]/90 border-error/20 text-error"
            )}
        >
            {type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <X className="w-5 h-5" />}
            <span className="font-medium text-sm text-white">{message}</span>
        </motion.div>
    );
};

// --- Magnetic Wrapper ---
export const Magnetic: React.FC<{ children: React.ReactNode; className?: string; intensity?: number }> = ({ 
    children, className, intensity = 0.2 
}) => {
    const ref = useRef<HTMLDivElement>(null);
    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const xSpring = useSpring(x, { mass: 0.1, stiffness: 150, damping: 15 });
    const ySpring = useSpring(y, { mass: 0.1, stiffness: 150, damping: 15 });

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!ref.current) return;
        const { left, top, width, height } = ref.current.getBoundingClientRect();
        const centerX = left + width / 2;
        const centerY = top + height / 2;
        x.set((e.clientX - centerX) * intensity);
        y.set((e.clientY - centerY) * intensity);
    };

    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
    };

    return (
        <motion.div
            ref={ref}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{ x: xSpring, y: ySpring }}
            className={className}
        >
            {children}
        </motion.div>
    );
};

// --- Spotlight Card ---
export const SpotlightCard: React.FC<React.HTMLAttributes<HTMLDivElement> & { noPadding?: boolean } & HTMLMotionProps<"div">> = ({ 
  children, className = "", noPadding = false, ...props 
}) => {
  const divRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!divRef.current) return;
    const rect = divRef.current.getBoundingClientRect();
    setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  return (
    <motion.div
      ref={divRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setOpacity(1)}
      onMouseLeave={() => setOpacity(0)}
      className={cn(
        "relative overflow-hidden rounded-[24px] border border-white/10 bg-[#0F1123]/90 backdrop-blur-xl shadow-xl group",
        className
      )}
      {...props}
    >
      <div
        className="pointer-events-none absolute -inset-px opacity-0 transition duration-300 z-0"
        style={{
          opacity,
          background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, rgba(129,140,248,0.1), transparent 40%)`
        }}
      />
      <div className={cn("relative z-10 h-full", noPadding ? "" : "p-6")}>
        {children}
      </div>
    </motion.div>
  );
};

// --- Button ---
interface ButtonProps extends Omit<HTMLMotionProps<"button">, "children"> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  icon?: React.ReactNode;
  children?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({ 
  className, variant = 'primary', size = 'md', isLoading, icon, children, ...props 
}) => {
  const baseStyles = "inline-flex items-center justify-center rounded-[12px] font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-50 disabled:cursor-not-allowed tracking-tight select-none relative overflow-hidden";
  
  const variants = {
    primary: "bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:shadow-glow hover:scale-[1.02] border border-white/10", 
    secondary: "bg-surface text-text-main border border-white/10 hover:bg-surface-light hover:border-white/20 shadow-sm",
    ghost: "bg-transparent text-text-secondary hover:text-white hover:bg-white/5",
    danger: "bg-error/10 text-error border border-error/20 hover:bg-error/20"
  };

  const sizes = {
    sm: "h-8 px-3 text-xs",
    md: "h-[42px] px-5 text-[14px]", 
    lg: "h-12 px-8 text-[16px]"
  };

  return (
    <motion.button
      whileTap={{ scale: 0.96 }}
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {/* Shine effect for primary buttons */}
      {variant === 'primary' && (
          <div className="absolute inset-0 -translate-x-full group-hover:animate-sheen bg-gradient-to-r from-transparent via-white/20 to-transparent z-0 pointer-events-none" />
      )}
      
      <span className="relative z-10 flex items-center">
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {!isLoading && icon && <span className="mr-2">{icon}</span>}
        {children}
      </span>
    </motion.button>
  );
};

// --- Magic AI Button ---
export const MagicButton: React.FC<ButtonProps> = ({ className, icon, children, isLoading, ...props }) => {
  return (
    <Magnetic intensity={0.3}>
      <motion.button
        className={cn(
          "relative inline-flex h-12 w-full overflow-hidden rounded-xl p-[1px] focus:outline-none focus:ring-2 focus:ring-primary/40 focus:ring-offset-2 focus:ring-offset-slate-900 transition-transform active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed group",
          className
        )}
        disabled={isLoading || props.disabled}
        {...props}
      >
        <span className="absolute inset-[-1000%] animate-[spin_3s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />
        <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-[11px] bg-slate-950 px-6 py-1 text-sm font-medium text-white backdrop-blur-3xl gap-2 transition-colors group-hover:bg-slate-900/80">
          {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin text-primary" />
          ) : (
              <>
                  {icon && <span className="text-primary group-hover:text-white transition-colors">{icon}</span>}
                  <span className="bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent font-semibold">
                      {children}
                  </span>
              </>
          )}
        </span>
      </motion.button>
    </Magnetic>
  );
};

// --- AI Processing Overlay ---
export const AiProcessingOverlay: React.FC<{ steps: string[], currentStep: number }> = ({ steps, currentStep }) => {
    const icons = [ScanLine, BrainCircuit, Database, Sparkles];
    const CurrentIcon = icons[Math.min(currentStep, icons.length - 1)] || Sparkles;

    return (
        <div className="flex flex-col items-center justify-center py-16 space-y-8 relative overflow-hidden">
            {/* Background effects */}
            <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/10 to-transparent pointer-events-none" />
            
            <div className="relative w-24 h-24">
                <div className="absolute inset-0 bg-primary/20 rounded-full animate-ping duration-[3s]" />
                <div className="absolute inset-4 bg-primary/30 rounded-full animate-pulse duration-[2s]" />
                
                {/* Rotating ring */}
                <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-[-8px] rounded-full border-2 border-transparent border-t-primary border-r-purple-500"
                />

                <div className="absolute inset-0 flex items-center justify-center z-10 bg-surface rounded-full border border-white/10 shadow-glow">
                    <motion.div
                        key={currentStep}
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    >
                         <CurrentIcon className="w-10 h-10 text-primary" strokeWidth={1.5} />
                    </motion.div>
                </div>
            </div>

            <div className="space-y-2 text-center z-10 max-w-xs">
                <h3 className="text-xl font-bold font-display bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">
                    AI Analysis in Progress
                </h3>
                 <div className="h-8 overflow-hidden relative w-full flex justify-center">
                    <AnimatePresence mode="wait">
                        <motion.p
                            key={currentStep}
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: -20, opacity: 0 }}
                            className="text-sm text-text-secondary font-medium"
                        >
                            {steps[currentStep]}
                        </motion.p>
                    </AnimatePresence>
                 </div>
            </div>

            {/* Progress Indicators */}
            <div className="flex gap-2">
                {steps.map((_, idx) => (
                    <motion.div
                        key={idx}
                        className={cn(
                            "h-1 rounded-full transition-all duration-500",
                            idx <= currentStep ? "w-8 bg-primary shadow-glow" : "w-2 bg-white/10"
                        )}
                    />
                ))}
            </div>
        </div>
    );
};

// --- Input ---
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  labelAction?: React.ReactNode;
  error?: string;
  rightElement?: React.ReactNode;
  isLoading?: boolean;
  isSuccess?: boolean;
  isOptimizing?: boolean;
  isWarning?: boolean;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(({ label, labelAction, error, rightElement, isLoading, isSuccess, isOptimizing, isWarning, className, ...props }, ref) => {
  const [focused, setFocused] = React.useState(false);
  const { onFocus, onBlur, ...restProps } = props;

  return (
    <div className="w-full space-y-1.5">
      <div className="flex justify-between items-center ml-1">
          {label && (
            <label className={cn(
              "text-[10px] font-bold uppercase tracking-[0.2em] transition-colors duration-200 select-none",
              focused ? "text-primary" : "text-slate-300"
            )}>
              {label}
            </label>
          )}
          {labelAction && <div>{labelAction}</div>}
      </div>
      <motion.div 
          animate={isWarning ? { x: [-5, 5, -5, 5, 0] } : {}}
          transition={{ duration: 0.4 }}
          className={cn(
            "relative group rounded-[12px] transition-all duration-300",
            isOptimizing && "p-[1px]"
          )}
      >
        {/* Magic background glow when optimizing */}
        {isOptimizing && <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 blur-sm opacity-50 animate-pulse rounded-[12px]" />}
        {isOptimizing && <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 animate-gradient-x rounded-[12px]" />}
        
        <div className={cn("relative h-[48px] w-full bg-[#0F1123] rounded-[11px]", isOptimizing ? "bg-surface" : "")}>
            <input
            ref={ref}
            onFocus={(e) => { 
                setFocused(true); 
                onFocus?.(e); 
            }}
            onBlur={(e) => { 
                setFocused(false); 
                onBlur?.(e); 
            }}
            disabled={isOptimizing}
            className={cn(
                "flex h-full w-full rounded-[11px] border border-white/10 bg-black/20 px-4 py-2 text-[15px] text-text-main placeholder:text-text-disabled/40 focus:border-primary/50 focus:bg-black/40 focus:outline-none focus:shadow-glow transition-all pr-10 tracking-tight font-sans",
                !isOptimizing && !isWarning && "hover:border-white/20",
                isOptimizing && "border-transparent bg-surface text-text-disabled cursor-not-allowed",
                isWarning && "border-error focus:border-error bg-error/5 placeholder:text-error/70",
                error && "border-error/50 focus:border-error focus:ring-error/20",
                className
            )}
            {...restProps}
            />
             {isWarning && (
                <motion.div 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-y-0 left-4 flex items-center pointer-events-none"
                >
                    <span className="text-error text-sm font-medium bg-[#0F1123] px-1">Please enter content first...</span>
                </motion.div>
            )}

            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2 pointer-events-none">
                {isLoading && <Loader2 className="h-4 w-4 animate-spin text-primary" />}
                {isSuccess && <motion.div initial={{scale:0}} animate={{scale:1}} exit={{scale:0}}><Check className="h-4 w-4 text-success" /></motion.div>}
                {isOptimizing && <Sparkles className="h-4 w-4 text-primary animate-pulse" />}
                {isWarning && <AlertCircle className="h-4 w-4 text-error" />}
                {!isLoading && !isSuccess && !isOptimizing && !isWarning && rightElement}
            </div>
        </div>
      </motion.div>
      {error && <p className="text-xs text-error mt-1 ml-1 font-medium">{error}</p>}
    </div>
  );
});

// --- Textarea ---
interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  labelAction?: React.ReactNode;
  error?: string;
  isLoading?: boolean;
  isSuccess?: boolean;
  isTyping?: boolean; // For typewriter effect
  isOptimizing?: boolean;
  isWarning?: boolean;
  ghostText?: string; // For suggestion
  onAcceptSuggestion?: () => void;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(({ 
    label, labelAction, error, isLoading, isSuccess, isTyping, isOptimizing, isWarning, ghostText, onAcceptSuggestion, className, ...props 
}, ref) => {
  const [focused, setFocused] = React.useState(false);
  const { onFocus, onBlur, onKeyDown, ...restProps } = props;

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === 'Tab' && ghostText) {
          e.preventDefault();
          onAcceptSuggestion?.();
      }
      onKeyDown?.(e);
  };

  return (
    <div className="w-full space-y-1.5 relative">
      <div className="flex justify-between items-center ml-1">
          {label && (
            <label className={cn(
              "text-[10px] font-bold uppercase tracking-[0.2em] transition-colors duration-200 select-none",
              focused ? "text-primary" : "text-slate-300"
            )}>
              {label}
            </label>
          )}
          <div className="flex items-center gap-2">
            {labelAction}
            {isTyping && <span className="text-[10px] uppercase font-bold tracking-wider text-primary flex items-center gap-1 animate-pulse"><Loader2 className="h-3 w-3 animate-spin" /> AI Typing...</span>}
            {!isTyping && isLoading && <span className="text-[10px] uppercase font-bold tracking-wider text-primary flex items-center gap-1"><Loader2 className="h-3 w-3 animate-spin" /> Optimizing</span>}
            {isSuccess && <span className="text-[10px] uppercase font-bold tracking-wider text-success flex items-center gap-1"><Check className="h-3 w-3" /> Done</span>}
          </div>
      </div>
      
      <motion.div
        animate={isWarning ? { x: [-5, 5, -5, 5, 0] } : {}}
        transition={{ duration: 0.4 }}
        className={cn(
          "relative group rounded-[12px] transition-all duration-300",
          isOptimizing && "p-[1px]"
        )}
      >
        {/* Magic background glow when optimizing */}
        {isOptimizing && <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 blur-sm opacity-50 animate-pulse rounded-[12px]" />}
        {isOptimizing && <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 animate-gradient-x rounded-[12px]" />}
        
        <div className={cn("relative w-full bg-[#0F1123] rounded-[11px]", isOptimizing ? "bg-surface" : "")}>
            <textarea
                ref={ref}
                onFocus={(e) => { 
                    setFocused(true); 
                    onFocus?.(e); 
                }}
                onBlur={(e) => { 
                    setFocused(false); 
                    onBlur?.(e); 
                }}
                onKeyDown={handleKeyDown}
                disabled={isOptimizing}
                className={cn(
                "flex min-h-[140px] w-full rounded-[11px] border border-white/10 bg-black/20 px-4 py-3 text-[15px] text-text-main placeholder:text-text-disabled/40 focus:border-primary/50 focus:bg-black/40 focus:outline-none focus:shadow-glow transition-all resize-y tracking-tight leading-relaxed font-sans",
                !isOptimizing && !isWarning && "hover:border-white/20",
                isOptimizing && "border-transparent bg-surface text-text-disabled cursor-not-allowed",
                isTyping && "typewriter-cursor pointer-events-none", // Add cursor style when typing
                isWarning && "border-error focus:border-error bg-error/5 placeholder:text-error/70",
                error && "border-error/50",
                className
                )}
                {...restProps}
            />
            {isWarning && (
                <motion.div 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 flex items-center justify-center pointer-events-none"
                >
                    <span className="text-error text-sm font-medium bg-[#0F1123]/90 px-3 py-1 rounded-full border border-error/20">Please enter content first</span>
                </motion.div>
            )}

            {/* Ghost Text Suggestion Banner */}
            <AnimatePresence>
                {focused && ghostText && !isTyping && !isOptimizing && !isWarning && (
                    <motion.div 
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -5 }}
                        className="absolute bottom-3 right-3 z-10"
                    >
                        <button
                            type="button"
                            onClick={onAcceptSuggestion}
                            className="flex items-center gap-2 bg-primary/10 border border-primary/20 backdrop-blur-md px-3 py-1.5 rounded-lg text-xs font-medium text-primary hover:bg-primary/20 transition-colors group"
                        >
                            <Sparkles className="w-3 h-3" />
                            <span>Tab to complete: <span className="opacity-70 italic">"{ghostText.substring(0, 20)}..."</span></span>
                            <Keyboard className="w-3 h-3 ml-1 opacity-50" />
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
      </motion.div>

      {error && <p className="text-xs text-error mt-1 ml-1 font-medium">{error}</p>}
    </div>
  );
});

// --- Card (Alias for SpotlightCard to maintain backward compatibility) ---
export const Card: React.FC<React.HTMLAttributes<HTMLDivElement> & { noPadding?: boolean } & HTMLMotionProps<"div">> = (props) => {
    return <SpotlightCard {...props} />;
};

// --- Badge ---
export const Badge: React.FC<{ children: React.ReactNode; variant?: 'default' | 'outline' | 'success' | 'warning', className?: string }> = ({ children, variant = 'default', className }) => {
  const styles = {
    default: "bg-primary/20 text-primary-glow border-transparent",
    outline: "bg-white/5 border-white/10 text-text-secondary",
    success: "bg-emerald-400/10 text-emerald-400 border-emerald-400/20",
    warning: "bg-amber-400/10 text-amber-400 border-amber-400/20"
  };

  return (
    <span className={cn("inline-flex items-center rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider transition-colors", styles[variant], className)}>
      {children}
    </span>
  );
};

// --- ProjectStatusBadge (Smart Logic) ---
export const ProjectStatusBadge: React.FC<{ 
    isPublished: boolean; 
    lastModified: Date; 
    lastPublished?: Date; 
    className?: string 
}> = ({ isPublished, lastModified, lastPublished, className }) => {
    let status: 'draft' | 'live' | 'unsynced' = 'draft';

    if (isPublished) {
        // If lastPublished is undefined but isPublished is true, we assume it was just published or data migration missing
        if (!lastPublished) {
            status = 'live'; 
        } else if (new Date(lastModified).getTime() > new Date(lastPublished).getTime() + 1000) { 
            // Add slight buffer (1s) to avoid race conditions where modified is ms after published
            status = 'unsynced';
        } else {
            status = 'live';
        }
    }

    const config = {
        draft: { 
            icon: File, 
            label: 'Draft', 
            style: 'bg-white/5 text-text-secondary border-white/10' 
        },
        live: { 
            icon: Globe, 
            label: 'Live', 
            style: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' 
        },
        unsynced: { 
            icon: RefreshCw, 
            label: 'Unsynced Changes', 
            style: 'bg-amber-500/10 text-amber-500 border-amber-500/20' 
        }
    };

    const { icon: Icon, label, style } = config[status];

    return (
        <span className={cn(
            "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider transition-colors", 
            style, 
            className
        )}>
            <Icon className="w-3 h-3" />
            {label}
        </span>
    );
};

// --- Skeleton ---
export const Skeleton: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <div className={cn("animate-pulse rounded bg-white/5", className)} />
  );
};

// --- Confetti ---
export const Confetti: React.FC = () => {
    const particles = Array.from({ length: 150 }).map((_, i) => ({
        id: i,
        x: Math.random() * 100, 
        y: Math.random() * 100,
        rotation: Math.random() * 360,
        color: ['#818CF8', '#34D399', '#F472B6', '#60A5FA'][Math.floor(Math.random() * 4)]
    }));

    return (
        <div className="fixed inset-0 pointer-events-none z-[100] overflow-hidden">
             {particles.map((p) => (
                <motion.div
                    key={p.id}
                    initial={{ opacity: 1, scale: 0, x: "50vw", y: "50vh" }}
                    animate={{ 
                        opacity: 0, 
                        scale: Math.random() * 1.5 + 0.5, 
                        x: `${(Math.random() * 150) - 25}vw`, 
                        y: `${(Math.random() * 150) - 25}vh`,
                        rotate: p.rotation
                    }}
                    transition={{ duration: Math.random() * 2 + 1.5, ease: "easeOut", delay: Math.random() * 0.1 }}
                    style={{ backgroundColor: p.color }}
                    className="w-2 h-2 rounded-full absolute"
                />
            ))}
        </div>
    );
};

// --- Modal ---
interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
    maxWidth?: string;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children, maxWidth = "max-w-lg" }) => {
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [onClose]);

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0, y: 10 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.95, opacity: 0, y: 10 }}
                            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }} 
                            onClick={(e) => e.stopPropagation()}
                            className={cn(
                                "bg-[#0F1123]/90 backdrop-blur-2xl border border-white/10 rounded-[24px] shadow-2xl w-full overflow-hidden flex flex-col max-h-[90vh]",
                                maxWidth
                            )}
                        >
                            <div className="flex items-center justify-between p-6 border-b border-white/5">
                                <h2 className="text-xl font-bold font-display text-text-main tracking-tight">{title}</h2>
                                <button onClick={onClose} className="text-text-secondary hover:text-white transition-colors p-2 hover:bg-white/10 rounded-full">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                            <div className="p-8 overflow-y-auto custom-scrollbar">
                                {children}
                            </div>
                        </motion.div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

// --- Diff Modal ---
interface DiffModalProps {
    isOpen: boolean;
    onClose: () => void;
    original: string;
    modified: string;
    onAccept: (finalText: string) => void;
}

export const DiffModal: React.FC<DiffModalProps> = ({ isOpen, onClose, original, modified, onAccept }) => {
    const [editableText, setEditableText] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);
    
    // Typewriter effect logic
    useEffect(() => {
        if (isOpen && modified) {
            setEditableText('');
            setIsTyping(true);
            
            // Clear any existing interval
            if (intervalRef.current) clearInterval(intervalRef.current);
            
            let i = 0;
            intervalRef.current = setInterval(() => {
                if (i < modified.length) {
                    setEditableText(prev => prev + modified.charAt(i));
                    i++;
                } else {
                    if (intervalRef.current) clearInterval(intervalRef.current);
                    setIsTyping(false);
                }
            }, 10); // Slightly adjusted typing speed

            return () => {
                if (intervalRef.current) clearInterval(intervalRef.current);
            };
        }
    }, [isOpen, modified]);

    const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        // If user interacts, stop any ongoing typewriter effect
        if (intervalRef.current) clearInterval(intervalRef.current);
        setIsTyping(false);
        setEditableText(e.target.value);
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Review AI Optimization" maxWidth="max-w-4xl">
            <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Original */}
                    <div className="space-y-2">
                        <div className="flex items-center gap-2 text-error text-xs font-bold uppercase tracking-wider">
                            <span className="w-2 h-2 rounded-full bg-error" />
                            Original
                        </div>
                        <div className="p-4 rounded-xl bg-error/5 border border-error/10 text-text-secondary text-sm leading-relaxed min-h-[240px] whitespace-pre-wrap font-mono select-text">
                            {original}
                        </div>
                    </div>

                    {/* Modified (Editable) */}
                    <div className="space-y-2">
                         <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 text-success text-xs font-bold uppercase tracking-wider">
                                <span className={cn("w-2 h-2 rounded-full bg-success", isTyping && "animate-pulse")} />
                                AI Optimized (Editable)
                            </div>
                            <span className="text-[10px] text-text-disabled flex items-center gap-1">
                                <Edit3 className="w-3 h-3" /> Click to edit
                            </span>
                         </div>
                         <div className="relative group">
                            <div className={cn("absolute inset-0 rounded-xl bg-gradient-to-r from-success/20 to-emerald-500/20 blur opacity-0 transition-opacity", isTyping && "opacity-100")} />
                            <textarea
                                value={editableText}
                                onChange={handleTextChange}
                                className={cn(
                                    "relative w-full h-full p-4 rounded-xl bg-success/5 border border-success/10 text-white text-sm leading-relaxed min-h-[240px] font-mono resize-none focus:outline-none focus:ring-1 focus:ring-success/30 transition-all custom-scrollbar",
                                    isTyping && "typewriter-cursor"
                                )}
                            />
                            {/* Decorative Sparkle */}
                            <div className="absolute top-2 right-2 p-2 opacity-10 pointer-events-none">
                                <Sparkles className="w-10 h-10" />
                            </div>
                         </div>
                    </div>
                </div>

                <div className="bg-white/5 rounded-xl p-4 flex items-center gap-4 text-sm text-text-secondary">
                    <GitCompare className="w-5 h-5 text-primary" />
                    <p>The AI has polished your text. You can edit the result on the right before applying.</p>
                </div>

                <div className="flex gap-3 justify-end pt-2">
                    <Button variant="ghost" onClick={onClose}>Discard</Button>
                    <Button onClick={() => onAccept(editableText)} icon={<Check className="w-4 h-4" />}>Confirm & Apply</Button>
                </div>
            </div>
        </Modal>
    );
};

// --- Select Control ---
interface SelectControlProps {
  label?: string;
  labelAction?: React.ReactNode;
  options: Array<{ label: string; value: string }>;
  value?: string;
  onChange: (value: string) => void;
  isOptimizing?: boolean;
  isWarning?: boolean;
}

export const SelectControl: React.FC<SelectControlProps> = ({ label, labelAction, options, value, onChange, isOptimizing, isWarning }) => {
  const selected = value ?? (options[0]?.value ?? "");
  return (
    <div className="w-full space-y-1.5">
      <div className="flex justify-between items-center ml-1">
        {label && <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-300">{label}</label>}
        {labelAction && <div>{labelAction}</div>}
      </div>
      <div className={cn("relative rounded-[12px] transition-all duration-300", isOptimizing && "opacity-70")}> 
        <select
          value={selected}
          onChange={(e) => onChange(e.target.value)}
          disabled={isOptimizing}
          className={cn(
            "h-[48px] w-full bg-[#0F1123] rounded-[11px] border px-4 text-[15px] text-white focus:border-primary/50 focus:outline-none",
            isWarning ? "border-error/50" : "border-white/10"
          )}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

// --- Color Picker ---
interface ColorPickerProps {
  label?: string;
  labelAction?: React.ReactNode;
  value?: string;
  onChange: (value: string) => void;
  presets?: Array<{ name: string; color: string }>;
}

export const ColorPicker: React.FC<ColorPickerProps> = ({ label, labelAction, value = '#6366f1', onChange, presets = [
  { color: '#6366f1', name: 'Indigo' },
  { color: '#ec4899', name: 'Pink' },
  { color: '#10b981', name: 'Emerald' },
  { color: '#f59e0b', name: 'Amber' },
  { color: '#3b82f6', name: 'Blue' },
  { color: '#8b5cf6', name: 'Violet' },
  { color: '#ef4444', name: 'Red' },
  { color: '#18181b', name: 'Zinc' },
] }) => {
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center ml-1">
        {label && <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-300">{label}</label>}
        {labelAction}
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3">
        {presets.map(({ color, name }) => {
          const isActive = value === color;
          return (
            <button
              key={color}
              onClick={() => onChange(color)}
              className={cn("group relative w-full h-12 flex items-center gap-3 px-3 rounded-xl border transition-all duration-300", isActive ? "bg-white/5 border-white/20" : "border-transparent hover:bg-white/5")}
            >
              <div 
                className={cn("w-8 h-8 rounded-full shadow-lg transition-transform flex-shrink-0", isActive && "scale-105")}
                style={{ backgroundColor: color }}
              />
            </button>
          );
        })}
      </div>
      <div className="flex items-center gap-3">
        <input type="color" value={value} onChange={(e) => onChange(e.target.value)} />
        <input 
          type="text" 
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="h-10 w-28 rounded-md bg-black/20 border border-white/10 px-3 text-sm text-white focus:border-primary/50 focus:outline-none"
        />
      </div>
    </div>
  );
};

// --- Image Upload ---
interface ImageUploadProps {
  label?: string;
  labelAction?: React.ReactNode;
  value?: string;
  onChange: (value: string) => void;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({ label, labelAction, value, onChange }) => {
  const [preview, setPreview] = useState<string | null>(value || null);
  const handleFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => { const url = String(e.target?.result || ''); setPreview(url); onChange(url); };
    reader.readAsDataURL(file);
  };
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center ml-1">
        {label && <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-300">{label}</label>}
        {labelAction}
      </div>
      <div className="rounded-xl overflow-hidden border border-white/10 bg-white/5">
        <div className="aspect-video bg-black/20 flex items-center justify-center">
          {preview ? (
            <img src={preview} className="w-full h-full object-cover" />
          ) : (
            <span className="text-text-secondary text-sm">No image</span>
          )}
        </div>
        <div className="p-3 flex items-center gap-3">
          <input 
            type="text" 
            placeholder="Paste image URL" 
            value={value || ''}
            onChange={(e) => { onChange(e.target.value); setPreview(e.target.value || null); }}
            className="flex-1 h-10 rounded-md bg-black/20 border border-white/10 px-3 text-sm text-white focus:border-primary/50 focus:outline-none"
          />
          <label className="inline-flex items-center h-10 px-3 rounded-md bg-surface border border-white/10 text-sm cursor-pointer hover:bg-surface-light">
            Upload
            <input type="file" accept="image/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }} />
          </label>
        </div>
      </div>
    </div>
  );
};
