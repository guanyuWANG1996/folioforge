

import { Template, PortfolioData } from './types';

export const MOCK_TEMPLATES: Template[] = [
    {
        id: 't1',
        name: 'Zenith Minimal',
        description: 'Clean lines, ample whitespace, and focus on typography.',
        thumbnail: 'https://picsum.photos/seed/zenith/800/600',
        tags: ['Minimal', 'Blog', 'Writer'],
        style: 'minimal'
    },
    {
        id: 't2',
        name: 'Neon Cyber',
        description: 'Dark mode centric with vibrant gradients and glassmorphism.',
        thumbnail: 'https://picsum.photos/seed/neon/800/600',
        tags: ['Creative', 'Developer', 'Dark'],
        style: 'creative'
    },
    {
        id: 't3',
        name: 'Executive Suite',
        description: 'Professional layout suitable for consultants and executives.',
        thumbnail: 'https://picsum.photos/seed/exec/800/600',
        tags: ['Corporate', 'Business', 'Formal'],
        style: 'corporate'
    },
    {
        id: 't4',
        name: 'Artisan Grid',
        description: 'Masonry grid layout perfect for visual artists and photographers.',
        thumbnail: 'https://picsum.photos/seed/art/800/600',
        tags: ['Creative', 'Photography', 'Visual'],
        style: 'creative'
    }
];

export const INITIAL_PORTFOLIO: PortfolioData = {
    id: 'p_new',
    templateId: '',
    name: 'Untitled Portfolio',
    fullName: '',
    title: '',
    bio: '',
    email: '',
    projects: [],
    themeColor: '#6366f1',
    typography: 'sans',
    cornerRadius: 'smooth',
    lastModified: new Date(),
    lastPublished: undefined,
    isPublished: false
};

// --- Helper to generate mock data for previews ---
export const getMockPortfolioForTemplate = (template: Template): PortfolioData => {
    const base: PortfolioData = {
        ...INITIAL_PORTFOLIO,
        id: `preview_${template.id}`,
        templateId: template.id,
        name: `${template.name} Preview`,
        lastModified: new Date(),
        lastPublished: undefined,
        isPublished: false,
        typography: 'sans',
        cornerRadius: 'smooth'
    };

    if (template.style === 'minimal') {
        return {
            ...base,
            fullName: "Sarah Jenkins",
            title: "Editorial Photographer",
            bio: "Capturing the essence of silence through minimalist photography. Based in Copenhagen, working globally.",
            themeColor: "#18181b", // Zinc-950
            typography: 'serif',
            cornerRadius: 'sharp',
            projects: [
                { id: 'm1', title: 'Nordic Light', description: 'A study of natural light in Scandinavian architecture.', technologies: 'Photography, Canon R5', imageUrl: 'https://picsum.photos/seed/nordic/800/600' },
                { id: 'm2', title: 'Silence', description: 'Visual storytelling in empty urban spaces.', technologies: 'Film, Leica', imageUrl: 'https://picsum.photos/seed/silence/800/600' }
            ]
        };
    } else if (template.style === 'creative') {
        return {
            ...base,
            fullName: "Alex 'Glitch' Rider",
            title: "Creative Technologist",
            bio: "Blending code and chaos to create immersive digital experiences. Specializing in WebGL and interactive installations.",
            themeColor: "#8b5cf6", // Violet
            typography: 'mono',
            cornerRadius: 'round',
            projects: [
                { id: 'c1', title: 'Neon Dreams', description: 'Interactive WebGL experience for a cyberpunk exhibition.', technologies: 'Three.js, React-Three-Fiber, GLSL', imageUrl: 'https://picsum.photos/seed/neon/800/600' },
                { id: 'c2', title: 'Audio Reactive', description: 'Real-time generative visuals powered by Spotify API.', technologies: 'WebAudio API, Canvas', imageUrl: 'https://picsum.photos/seed/audio/800/600' }
            ]
        };
    } else {
        // Corporate / Default
        return {
            ...base,
            fullName: "James Sterling",
            title: "Strategic Consultant",
            bio: "Helping Fortune 500 companies navigate digital transformation with data-driven strategies.",
            themeColor: "#1e3a8a", // Blue-900
            typography: 'sans',
            cornerRadius: 'smooth',
            projects: [
                { id: 'co1', title: 'FinTech Merger', description: 'Led the digital integration of two major banking platforms.', technologies: 'Strategy, Leadership', imageUrl: 'https://picsum.photos/seed/bank/800/600' },
                { id: 'co2', title: 'Global Supply Chain', description: 'Optimized logistics for a retail giant.', technologies: 'Data Analysis, SAP', imageUrl: 'https://picsum.photos/seed/chain/800/600' }
            ]
        };
    }
};
