

export interface Template {
  id: string;
  name: string;
  description: string;
  thumbnail: string;
  tags: string[];
  style: 'minimal' | 'creative' | 'corporate';
}

export interface Project {
  id: string;
  title: string;
  description: string;
  technologies: string;
  imageUrl: string;
}

export interface PortfolioData {
  id: string;
  templateId: string;
  name: string; // Project Name (e.g., "My 2024 Resume")
  fullName: string;
  title: string; // Job Title (e.g., "Product Designer")
  bio: string;
  email: string;
  projects: Project[];
  themeColor: string;
  typography: 'sans' | 'serif' | 'mono';
  cornerRadius: 'sharp' | 'smooth' | 'round';
  lastModified: Date;
  lastPublished?: Date; // Track when the site was last live
  isPublished: boolean;
  publishedUrl?: string;
}

export interface UserStats {
  totalPortfolios: number;
  totalViews: number;
  deploymentRate: number;
  activeTemplates: number;
}

export type ViewMode = 'desktop' | 'tablet' | 'mobile';
export type AppRoute = 'dashboard' | 'templates' | 'editor' | 'preview';
