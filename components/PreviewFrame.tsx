

import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { PortfolioData, ViewMode } from '../types';

interface PreviewFrameProps {
    portfolio: PortfolioData;
    viewMode?: ViewMode;
    className?: string;
    scale?: number;
}

const PreviewFrameComponent: React.FC<PreviewFrameProps> = ({ portfolio, viewMode = 'desktop', className, scale = 1 }) => {
    // Scroll container ref for parallax calculation
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollY } = useScroll({ container: containerRef });
    
    // Parallax transforms
    const heroY = useTransform(scrollY, [0, 500], [0, 200]);
    const heroOpacity = useTransform(scrollY, [0, 300], [1, 0]);

    const getWidth = () => {
        switch (viewMode) {
          case 'mobile': return 'max-w-[375px]';
          case 'tablet': return 'max-w-[768px]';
          default: return 'max-w-full';
        }
    };

    // Design System Mappings
    const fontClass = {
        sans: 'font-sans',
        serif: 'font-serif',
        mono: 'font-mono tracking-tight',
    }[portfolio.typography || 'sans'];

    const radiusClass = {
        sharp: 'rounded-none',
        smooth: 'rounded-xl',
        round: 'rounded-[32px]',
    }[portfolio.cornerRadius || 'smooth'];
    
    // For smaller elements like buttons or chips, we might want slightly less radius for 'round' to avoid pill shape unless intended
    const elementRadiusClass = {
        sharp: 'rounded-none',
        smooth: 'rounded-lg',
        round: 'rounded-full',
    }[portfolio.cornerRadius || 'smooth'];

    return (
        <div className={`w-full h-full bg-secondary/20 flex justify-center items-start overflow-hidden ${className}`}>
             <motion.div 
                initial={{ opacity: 0, scale: scale }} 
                animate={{ opacity: 1, scale: scale }}
                transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
                className={`${getWidth()} w-full h-full bg-white shadow-2xl overflow-hidden transition-[max-width,border-radius] duration-500 ease-in-out relative border border-border origin-top ${fontClass}`}
                style={{ borderRadius: viewMode === 'desktop' ? 0 : 20 }}
            >
                {/* Mock Portfolio Rendering */}
                <div ref={containerRef} className="w-full h-full overflow-y-auto bg-white custom-scrollbar scroll-smooth">
                    
                    {/* Hero Section with Parallax */}
                    <div className="relative overflow-hidden min-h-[400px] flex items-center justify-center">
                        <motion.div 
                            style={{ backgroundColor: portfolio.themeColor, y: heroY }} 
                            className="absolute inset-0 z-0"
                        />
                        <motion.div 
                            style={{ opacity: heroOpacity, y: heroY }}
                            className="relative z-10 flex flex-col items-center justify-center text-white p-8 text-center"
                        >
                            <h1 className="text-6xl font-bold mb-4 tracking-tight drop-shadow-md leading-tight">{portfolio.fullName || "Your Name"}</h1>
                            <p className="text-xl opacity-90 font-light tracking-wide uppercase">{portfolio.title || "Job Title"}</p>
                        </motion.div>
                    </div>

                    {/* Bio Section with Reveal Animation */}
                    <div className="max-w-3xl mx-auto py-24 px-8">
                        <motion.div 
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-10%" }}
                            transition={{ duration: 0.6 }}
                        >
                            <div className="flex items-center gap-4 mb-8">
                                <div className="h-px bg-gray-200 flex-1"></div>
                                <h2 className="text-sm font-bold text-gray-400 uppercase tracking-widest">About</h2>
                                <div className="h-px bg-gray-200 flex-1"></div>
                            </div>
                            <p className="text-gray-900 leading-loose text-lg font-light text-center">{portfolio.bio || "Bio content goes here..."}</p>
                        </motion.div>
                    </div>

                    {/* Projects Section */}
                    <div className="bg-gray-50 py-24 px-8 border-t border-gray-100">
                        <div className="max-w-5xl mx-auto">
                            <motion.h2 
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                className="text-3xl font-bold text-gray-900 mb-16 text-center tracking-tight"
                            >
                                Selected Works
                            </motion.h2>

                            <div className="grid grid-cols-1 gap-16">
                                {(portfolio.projects || []).map((p, index) => (
                                    <motion.div 
                                        key={p.id} 
                                        initial={{ opacity: 0, y: 50 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true, margin: "-100px" }}
                                        transition={{ duration: 0.6, delay: index * 0.1 }}
                                        className={`group bg-white shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden border border-gray-100 ${radiusClass}`}
                                    >
                                        <div className="aspect-video bg-gray-100 relative overflow-hidden">
                                            <img 
                                                src={p.imageUrl || `https://picsum.photos/seed/${p.id}/800/400`} 
                                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-90 group-hover:opacity-100"
                                                alt={p.title}
                                                loading="lazy"
                                            />
                                        </div>
                                        <div className="p-10">
                                            <div className="flex justify-between items-start mb-4">
                                                <h3 className="font-bold text-2xl text-gray-900">{p.title}</h3>
                                            </div>
                                            <p className="text-gray-500 text-base leading-relaxed mb-6 font-light">{p.description}</p>
                                            <div className="flex flex-wrap gap-2">
                                                {p.technologies && p.technologies.split(',').map((t, i) => (
                                                    <span key={i} className={`px-3 py-1 bg-white border border-gray-200 text-gray-500 text-xs font-medium uppercase tracking-wide shadow-sm ${elementRadiusClass}`}>{t.trim()}</span>
                                                ))}
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                                {(!portfolio.projects || portfolio.projects.length === 0) && (
                                    <div className="text-center py-10">
                                        <p className="text-gray-400 italic">No projects visible.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                    
                    {/* Footer */}
                    <div className="bg-white py-16 text-center border-t border-gray-100">
                        <motion.p 
                             initial={{ opacity: 0 }}
                             whileInView={{ opacity: 1 }}
                             className="text-gray-400 text-sm"
                        >
                            © {new Date().getFullYear()} {portfolio.fullName}. Powered by FolioForge.
                        </motion.p>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export const PreviewFrame = React.memo(PreviewFrameComponent);
