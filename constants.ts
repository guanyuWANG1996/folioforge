

import { Template, TemplateSchema } from './types';
import Handlebars from 'handlebars';
import './hbsTemplates';

export const MOCK_TEMPLATES: Template[] = [
    {
        id: 't1',
        name: 'Zenith Minimal',
        description: 'Clean lines, ample whitespace, and focus on typography.',
        thumbnail: 'https://picsum.photos/seed/zenith/800/600',
        tags: ['Minimal', 'Blog', 'Writer'],
        style: 'minimal',
        engine: 'handlebars',
        repoUrl: 'https://example.com/zenith',
        distPath: 'dist/zenith',
        schema: {
            sections: [
                {
                    id: 'basics',
                    label: 'Basics',
                    fields: [
                        { id: 'fullName', label: 'Full Name', type: 'text', required: true, aiOptimizable: false },
                        { id: 'title', label: 'Job Title', type: 'text' },
                        { id: 'email', label: 'Email', type: 'text', validation: { pattern: 'email' } },
                        { id: 'bio', label: 'Bio', type: 'textarea', aiOptimizable: true }
                    ]
                },
                {
                    id: 'projects',
                    label: 'Projects',
                    fields: [
                        {
                            id: 'projects',
                            label: 'Project List',
                            type: 'repeatable',
                            items: [
                                { id: 'title', label: 'Title', type: 'text', required: true },
                                { id: 'description', label: 'Description', type: 'textarea', aiOptimizable: true },
                                { id: 'technologies', label: 'Technologies', type: 'text' }
                            ]
                        }
                    ]
                },
                {
                    id: 'design',
                    label: 'Design',
                    fields: [
                        { id: 'themeColor', label: 'Accent Color', type: 'color', default: '#6366f1' },
                        { id: 'typography', label: 'Typography', type: 'select', options: [
                            { label: 'Sans', value: 'sans' },
                            { label: 'Serif', value: 'serif' },
                            { label: 'Mono', value: 'mono' }
                        ], default: 'sans' },
                        { id: 'cornerRadius', label: 'Corner Radius', type: 'select', options: [
                            { label: 'Sharp', value: 'sharp' },
                            { label: 'Smooth', value: 'smooth' },
                            { label: 'Round', value: 'round' }
                        ], default: 'smooth' }
                    ]
                }
            ]
        } as TemplateSchema,
        demoData: {
            basics: {
                fullName: 'John Doe',
                title: 'Software Engineer',
                email: 'john.doe@example.com',
                bio: 'A passionate software engineer with a love for creating elegant solutions.'
            },
            projects: [
                {
                    title: 'Project Alpha',
                    description: 'A groundbreaking project that changed the industry.',
                    technologies: 'React, Node.js, MongoDB'
                },
                {
                    title: 'Project Beta',
                    description: 'A modern web application with a focus on user experience.',
                    technologies: 'Vue.js, Express, PostgreSQL'
                }
            ],
            design: {
                themeColor: '#6366f1',
                typography: 'sans',
                cornerRadius: 'smooth'
            }
        }
    },
    {
        id: 't2',
        name: 'Neon Cyber',
        description: 'Dark mode centric with vibrant gradients and glassmorphism.',
        thumbnail: 'https://picsum.photos/seed/neon/800/600',
        tags: ['Creative', 'Developer', 'Dark'],
        style: 'creative',
        engine: 'handlebars',
        schema: {
            sections: [
                {
                    id: 'identity',
                    label: 'Identity',
                    fields: [
                        { id: 'fullName', label: 'Full Name', type: 'text' },
                        { id: 'title', label: 'Role', type: 'text' },
                        { id: 'bio', label: 'Bio', type: 'textarea', aiOptimizable: true }
                    ]
                },
                {
                    id: 'skills',
                    label: 'Skills',
                    fields: [
                        {
                            id: 'skills',
                            label: 'Skill List',
                            type: 'repeatable',
                            items: [
                                { id: 'name', label: 'Name', type: 'text' },
                                { id: 'level', label: 'Level', type: 'select', options: [
                                    { label: 'Beginner', value: 'beginner' },
                                    { label: 'Intermediate', value: 'intermediate' },
                                    { label: 'Expert', value: 'expert' }
                                ] }
                            ]
                        }
                    ]
                },
                {
                    id: 'design',
                    label: 'Design',
                    fields: [
                        { id: 'themeColor', label: 'Accent Color', type: 'color', default: '#8b5cf6' },
                        { id: 'typography', label: 'Typography', type: 'select', options: [
                            { label: 'Sans', value: 'sans' },
                            { label: 'Serif', value: 'serif' },
                            { label: 'Mono', value: 'mono' }
                        ], default: 'mono' },
                        { id: 'cornerRadius', label: 'Corner Radius', type: 'select', options: [
                            { label: 'Sharp', value: 'sharp' },
                            { label: 'Smooth', value: 'smooth' },
                            { label: 'Round', value: 'round' }
                        ], default: 'round' }
                    ]
                },
                {
                    id: 'projects',
                    label: 'Projects',
                    fields: [
                        {
                            id: 'projects',
                            label: 'Project List',
                            type: 'repeatable',
                            items: [
                                { id: 'title', label: 'Title', type: 'text' },
                                { id: 'description', label: 'Description', type: 'textarea' },
                                { id: 'technologies', label: 'Technologies', type: 'text' }
                            ]
                        }
                    ]
                }
            ]
        } as TemplateSchema,
        demoData: {
            fullName: "Alex Rider",
            title: "Creative Technologist",
            bio: "WebGL and interactive installations.",
            themeColor: '#8b5cf6',
            typography: 'mono',
            cornerRadius: 'round',
            skills: [
                { name: 'WebGL', level: 'expert' },
                { name: 'Three.js', level: 'expert' },
                { name: 'GLSL', level: 'intermediate' }
            ],
            projects: [
                { id: 'p1', title: 'Neon Dreams', description: 'Interactive WebGL experience.', technologies: 'Three.js, R3F' }
            ]
        }
    },
    {
        id: 't3',
        name: 'Executive Suite',
        description: 'Professional layout suitable for consultants and executives.',
        thumbnail: 'https://picsum.photos/seed/exec/800/600',
        tags: ['Corporate', 'Business', 'Formal'],
        style: 'corporate',
        engine: 'handlebars',
        schema: {
            sections: [
                {
                    id: 'summary',
                    label: 'Summary',
                    fields: [
                        { id: 'fullName', label: 'Full Name', type: 'text' },
                        { id: 'title', label: 'Title', type: 'text' },
                        { id: 'bio', label: 'Executive Summary', type: 'textarea' }
                    ]
                },
                {
                    id: 'experience',
                    label: 'Experience',
                    fields: [
                        {
                            id: 'projects',
                            label: 'Engagements',
                            type: 'repeatable',
                            items: [
                                { id: 'title', label: 'Engagement', type: 'text' },
                                { id: 'description', label: 'Outcome', type: 'textarea' },
                                { id: 'technologies', label: 'Focus', type: 'text' }
                            ]
                        }
                    ]
                },
                {
                    id: 'branding',
                    label: 'Branding',
                    fields: [
                        { id: 'themeColor', label: 'Primary', type: 'color', default: '#1e3a8a' },
                        { id: 'typography', label: 'Typography', type: 'select', options: [
                            { label: 'Sans', value: 'sans' },
                            { label: 'Serif', value: 'serif' },
                            { label: 'Mono', value: 'mono' }
                        ], default: 'sans' },
                        { id: 'cornerRadius', label: 'Corner Radius', type: 'select', options: [
                            { label: 'Sharp', value: 'sharp' },
                            { label: 'Smooth', value: 'smooth' },
                            { label: 'Round', value: 'round' }
                        ], default: 'smooth' }
                    ]
                }
            ]
        } as TemplateSchema,
        demoData: {
            fullName: 'James Sterling',
            title: 'Strategic Consultant',
            bio: 'Data-driven strategies for Fortune 500.',
            themeColor: '#1e3a8a',
            typography: 'sans',
            cornerRadius: 'smooth',
            projects: [
                { id: 'e1', title: 'FinTech Merger', description: 'Digital integration of banking platforms.', technologies: 'Strategy' }
            ]
        }
    },
    {
        id: 't4',
        name: 'Artisan Grid',
        description: 'Masonry grid layout perfect for visual artists and photographers.',
        thumbnail: 'https://picsum.photos/seed/art/800/600',
        tags: ['Creative', 'Photography', 'Visual'],
        style: 'creative',
        engine: 'handlebars',
        schema: {
            sections: [
                {
                    id: 'about',
                    label: 'About',
                    fields: [
                        { id: 'fullName', label: 'Artist Name', type: 'text' },
                        { id: 'title', label: 'Discipline', type: 'text' },
                        { id: 'bio', label: 'Artist Bio', type: 'textarea' }
                    ]
                },
                {
                    id: 'portfolio',
                    label: 'Portfolio',
                    fields: [
                        {
                            id: 'projects',
                            label: 'Works',
                            type: 'repeatable',
                            items: [
                                { id: 'title', label: 'Title', type: 'text' },
                                { id: 'description', label: 'Notes', type: 'textarea' },
                                { id: 'technologies', label: 'Mediums', type: 'text' }
                            ]
                        }
                    ]
                },
                {
                    id: 'style',
                    label: 'Style',
                    fields: [
                        { id: 'themeColor', label: 'Accent', type: 'color', default: '#f59e0b' },
                        { id: 'typography', label: 'Typography', type: 'select', options: [
                            { label: 'Sans', value: 'sans' },
                            { label: 'Serif', value: 'serif' },
                            { label: 'Mono', value: 'mono' }
                        ], default: 'serif' },
                        { id: 'cornerRadius', label: 'Corner Radius', type: 'select', options: [
                            { label: 'Sharp', value: 'sharp' },
                            { label: 'Smooth', value: 'smooth' },
                            { label: 'Round', value: 'round' }
                        ], default: 'round' }
                    ]
                }
            ]
        } as TemplateSchema,
        demoData: {
            fullName: 'Anya K.',
            title: 'Visual Artist',
            bio: 'Exploring light and motion.',
            themeColor: '#f59e0b',
            typography: 'serif',
            cornerRadius: 'round',
            projects: [
                { id: 'a1', title: 'Motions', description: 'Long exposure abstracts.', technologies: 'Film' }
            ]
        }
    }
];

export const INITIAL_PORTFOLIO: any = {
    name: 'Untitled Portfolio'
};

// --- Helper to generate mock data for previews ---
export async function getRenderedDemoHtml(template: Template): Promise<string> {
    const res = await fetch(`/api/templates/${template.id}/source`);
    if (!res.ok) return '';
    const src = await res.text();
    const dd = template.demoData || {};
    const normalized: any = { ...dd };
    if ((dd as any).basics) Object.assign(normalized, (dd as any).basics);
    if ((dd as any).design) Object.assign(normalized, (dd as any).design);
    if ((dd as any).portfolio) normalized.projects = (dd as any).portfolio;
    if ((dd as any).projects) normalized.projects = (dd as any).projects;
    try {
        const tpl = Handlebars.compile(src);
        return tpl(normalized);
    } catch {
        return '';
    }
}
