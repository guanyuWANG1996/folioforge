export type ViewMode = 'desktop' | 'tablet' | 'mobile';
export type AppRoute = 'dashboard' | 'templates' | 'editor' | 'preview';

// Portfolio 个人作品集原信息
export interface Portfolio {
  id: string;
  name: string;
  description?: string;
  coverUrl?: string;
  ownerId?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Template 模板原信息
export interface Template {
  id: string;
  name: string;
  description: string;
  thumbnail: string;
  tags?: string[];
  style?: string;
  repoUrl?: string;
  distPath?: string;
  engine?: string; // 'handlebars'
  schema?: TemplateSchema;
  demoData?: Record<string, any>;
  isActive?: boolean;
  visibility?: string; // 'public', 'hidden', 'deprecated'
}

export interface TemplateSchema {
  sections: TemplateSection[];
}

export interface TemplateSection {
  id: string;
  label: string;
  fields: TemplateField[];
}

export type TemplateFieldType = 'text' | 'textarea' | 'select' | 'color' | 'image' | 'repeatable';

export interface TemplateField {
  id: string;
  label: string;
  type: TemplateFieldType;
  required?: boolean;
  aiOptimizable?: boolean;
  default?: any;
  validation?: Record<string, any>;
  items?: TemplateField[];
  options?: Array<{ label: string; value: string }>; 
}

export type PortfolioVersionStatus = 'draft' | 'online';

export interface PortfolioVersion {
  id: string;
  portfolioId: string;
  templateId: string;
  data: Record<string, any>;
  status: PortfolioVersionStatus;
  createdAt: Date;
  lastModified: Date;
}

export type DeploymentStatus = 'queued' | 'building' | 'ready' | 'error';

export interface Deployment {
  id: string;
  portfolioVersionId: string;
  triggeredBy?: string;
  createdAt: Date;
  updatedAt: Date;
  status: DeploymentStatus;
  vercelProjectId?: string;
  vercelDeploymentId?: string;
  url?: string;
}
