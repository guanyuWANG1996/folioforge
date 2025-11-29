
import React, { useState, useEffect, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { LayoutWrapper } from './components/Layout';
import { Modal, Button } from './components/ui';
import { Dashboard } from './pages/Dashboard';
import { TemplateGallery } from './pages/TemplateGallery';
import { Editor } from './pages/Editor';
import { Preview } from './pages/Preview';
import { AppRoute, Template, Portfolio, PortfolioVersion, Deployment } from './types';
 


const App: React.FC = () => {
  const [route, setRoute] = useState<AppRoute>('dashboard');
  
  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
  const [versions, setVersions] = useState<PortfolioVersion[]>([]);
  const [deployments, setDeployments] = useState<Deployment[]>([]);
  const [loaded, setLoaded] = useState<boolean>(false);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [deleteModalOpen, setDeleteModalOpen] = useState<boolean>(false);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([
      fetch('/api/portfolios', { method: 'GET' }),
      fetch('/api/versions', { method: 'GET' }),
      fetch('/api/deployments', { method: 'GET' }),
      fetch('/api/templates', { method: 'GET' })
    ])
    .then(async ([pr, vr, dr, tr]) => {
      const [pList, vList, dList, tList] = await Promise.all([pr.json(), vr.json(), dr.json(), tr.json()]);
      setPortfolios((pList || []).map((p: any) => ({
        ...p,
        createdAt: new Date(p.createdAt),
        updatedAt: new Date(p.updatedAt)
      })));
      setVersions((vList || []).map((v: any) => ({
        ...v,
        createdAt: new Date(v.createdAt),
        lastModified: new Date(v.lastModified)
      })));
      setDeployments((dList || []).map((d: any) => ({
        ...d,
        createdAt: new Date(d.createdAt),
        updatedAt: new Date(d.updatedAt)
      })));
      setTemplates((tList || []).map((t: any) => ({ ...t })));
      setLoaded(true);
    })
    .catch((e) => { console.error(e); setLoaded(true); });
  }, []);
  
  // State for the flow
  const [currentPortfolio, setCurrentPortfolio] = useState<Portfolio | null>(null);
  const [currentVersion, setCurrentVersion] = useState<PortfolioVersion | null>(null);

  useEffect(() => {
    if (!loaded) return;
    const headers = { 'Content-Type': 'application/json' } as const;
    Promise.all([
      fetch('/api/portfolios', { method: 'POST', headers, body: JSON.stringify(portfolios) }),
      fetch('/api/versions', { method: 'POST', headers, body: JSON.stringify(versions) }),
      fetch('/api/deployments', { method: 'POST', headers, body: JSON.stringify(deployments) })
    ]).catch((e) => console.error(e));
  }, [portfolios, versions, deployments, loaded]);

  useEffect(() => {
    if (route === 'editor' && currentPortfolio && !currentVersion) {
      const vs = versions
        .filter(v => v.portfolioId === currentPortfolio.id)
        .sort((a,b) => new Date(b.lastModified).getTime() - new Date(a.lastModified).getTime());
      if (vs[0]) setCurrentVersion(vs[0]);
    }
  }, [route, currentPortfolio, currentVersion, versions]);

  // Navigation handlers
  const handleNavigate = (newRoute: AppRoute) => {
    // CRITICAL FIX: Clear the active session when navigating to top-level pages.
    // This prevents "dirty data pollution" where an old project's data 
    // is accidentally inherited when selecting a new template.
    if (newRoute === 'dashboard' || newRoute === 'templates') {
        setCurrentPortfolio(null);
        setCurrentVersion(null);
    }
    setRoute(newRoute);
  };

  const startCreateFlow = () => {
    setCurrentPortfolio(null);
    setCurrentVersion(null);
    setRoute('templates');
  };

  const handleEditPortfolio = (id: string) => {
    const p = portfolios.find(item => item.id === id);
    if (p) {
        const vs = versions.filter(v => v.portfolioId === p.id).sort((a,b) => new Date(b.lastModified).getTime() - new Date(a.lastModified).getTime());
        if (!vs[0]) {
          setCurrentPortfolio(p);
          setCurrentVersion(null);
          setRoute('templates');
          return;
        }
        setCurrentPortfolio(p);
        setCurrentVersion(vs[0]);
        setRoute('editor');
    }
  };

  // Delete Handler
  const handleDeletePortfolio = (id: string) => {
    setDeleteTargetId(id);
    setDeleteModalOpen(true);
  };

  const confirmDeletePortfolio = async () => {
    if (!deleteTargetId) return;
    const id = deleteTargetId;
    try {
      await Promise.all([
        fetch(`/api/versions/by-portfolio/${id}`, { method: 'DELETE' }),
        fetch(`/api/portfolios/${id}`, { method: 'DELETE' })
      ]);
    } catch (e) {
      console.error(e);
    }
    setPortfolios(prev => prev.filter(p => p.id !== id));
    setVersions(prev => prev.filter(v => v.portfolioId !== id));
    setDeployments(prev => prev.filter(d => {
      const v = versions.find(vv => vv.id === d.portfolioVersionId);
      return v ? v.portfolioId !== id : true;
    }));
    if (currentPortfolio && currentPortfolio.id === id) {
      setCurrentPortfolio(null);
      setCurrentVersion(null);
    }
    setDeleteModalOpen(false);
    setDeleteTargetId(null);
  };

  const cancelDeletePortfolio = () => {
    setDeleteModalOpen(false);
    setDeleteTargetId(null);
  };

  const handleTemplateSelect = (template: Template) => {
    // If currentPortfolio exists (via startCreateFlow), use it. 
    // If it's null (via handleNavigate to 'templates'), create a brand new one.
    // This ensures we don't accidentally merge data from a previous session.
    const now = new Date();
    let p = currentPortfolio;
    if (!p) {
      const id = Date.now().toString();
      p = { id, name: 'Untitled Portfolio', createdAt: now, updatedAt: now };
      setPortfolios(prev => [...prev, p]);
    }
    setCurrentPortfolio(p);
    const initialData: any = {
      fullName: '',
      title: '',
      bio: '',
      email: '',
      projects: [],
      themeColor: '#6366f1',
      typography: 'sans',
      cornerRadius: 'smooth'
    };
    const v: PortfolioVersion = {
      id: `v_${p.id}_${Date.now()}`,
      portfolioId: p.id,
      templateId: template.id,
      data: initialData,
      status: 'draft',
      createdAt: now,
      lastModified: now
    };
    setVersions(prev => [...prev, v]);
    setCurrentVersion(v);
    setRoute('editor');
  };

  // Optimistic Save Handler
  const handleSaveVersion = useCallback((data: Record<string, any>) => {
    if (!currentVersion || !currentPortfolio) return;
    const now = new Date();
    const updatedVersion: PortfolioVersion = { ...currentVersion, data, lastModified: now };
    setVersions(prev => prev.map(v => v.id === updatedVersion.id ? updatedVersion : v));
    setCurrentVersion(updatedVersion);
    setPortfolios(prev => prev.map(p => p.id === currentPortfolio.id ? { ...p, updatedAt: now } : p));
  }, [currentVersion, currentPortfolio]);

  // Add handleUpdateName
  const handleUpdateName = (id: string, newName: string) => {
      setPortfolios(prev => prev.map(p => p.id === id ? { ...p, name: newName } : p));
      if (currentPortfolio && currentPortfolio.id === id) {
          setCurrentPortfolio(prev => prev ? { ...prev, name: newName } : null);
      }
  };

  const handlePublishSuccess = () => {
    if (!currentVersion || !currentPortfolio) return;
    const now = new Date();
    setVersions(prev => prev.map(v => v.id === currentVersion.id ? { ...v, status: 'online', lastModified: now } : v));
    const dep: Deployment = {
      id: `d_${currentPortfolio.id}_${Date.now()}`,
      portfolioVersionId: currentVersion.id,
      triggeredBy: 'user',
      createdAt: now,
      updatedAt: now,
      status: 'ready',
      url: `https://folioforge.vercel.app/${currentPortfolio.id}`
    };
    setDeployments(prev => [...prev, dep]);
  };

  const renderContent = () => {
    switch (route) {
      case 'dashboard':
        return (
            <Dashboard 
                items={portfolios.map(p => {
                  const vs = versions.filter(v => v.portfolioId === p.id);
                  const latest = vs.sort((a,b) => new Date(b.lastModified).getTime() - new Date(a.lastModified).getTime())[0];
                  const online = vs.find(v => v.status === 'online');
                  const lastPub = deployments.filter(d => d.portfolioVersionId === (online?.id || '')).sort((a,b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())[0]?.updatedAt;
                  return {
                    id: p.id,
                    name: p.name,
                    title: latest?.data?.title || '',
                    isPublished: !!online,
                    lastModified: latest ? latest.lastModified : p.updatedAt,
                    lastPublished: lastPub
                  };
                })}
                onNavigate={handleNavigate}
                onCreate={startCreateFlow}
                onEdit={handleEditPortfolio}
                onDelete={handleDeletePortfolio}
                onUpdateName={handleUpdateName}
                trendingTemplates={templates}
                onUseTemplate={handleTemplateSelect}
            />
        );
      case 'templates':
        return (
            <TemplateGallery 
                templates={templates} 
                onSelect={handleTemplateSelect} 
            />
        );
      case 'editor':
        return currentPortfolio && currentVersion ? (
            <Editor 
                portfolio={currentPortfolio}
                version={currentVersion}
                template={templates.find(t => t.id === currentVersion.templateId) || null}
                onSave={handleSaveVersion}
                onPreview={() => setRoute('preview')}
                onBack={() => handleNavigate('dashboard')} 
                status={{
                  isPublished: versions.some(v => v.portfolioId === currentPortfolio.id && v.status === 'online'),
                  lastModified: currentVersion.lastModified,
                  lastPublished: deployments.filter(d => d.portfolioVersionId === currentVersion.id).sort((a,b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())[0]?.updatedAt
                }}
                onPublish={handlePublishSuccess}
                onRename={(name) => handleUpdateName(currentPortfolio.id, name)}
            />
        ) : <div>Error: No portfolio selected</div>;
      case 'preview':
        return currentVersion ? (
            <Preview 
                data={currentVersion.data}
                onBack={() => setRoute('editor')}
                onPublish={handlePublishSuccess}
            />
        ) : <div>Error</div>;
      default:
        return <Dashboard items={portfolios.map(p => ({ id: p.id, name: p.name, title: versions.filter(v => v.portfolioId === p.id).sort((a,b) => new Date(b.lastModified).getTime() - new Date(a.lastModified).getTime())[0]?.data?.title || '', isPublished: versions.some(v => v.portfolioId === p.id && v.status === 'online'), lastModified: versions.filter(v => v.portfolioId === p.id).sort((a,b) => new Date(b.lastModified).getTime() - new Date(a.lastModified).getTime())[0]?.lastModified || p.updatedAt }))} onNavigate={handleNavigate} onCreate={startCreateFlow} onEdit={handleEditPortfolio} onDelete={handleDeletePortfolio} />;
    }
  };

  return (
    <LayoutWrapper currentRoute={route} onNavigate={handleNavigate}>
        <AnimatePresence mode="wait">
            <motion.div 
                key={route} 
                className="w-full"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
            >
                {renderContent()}
            </motion.div>
        </AnimatePresence>
        <Modal isOpen={deleteModalOpen} onClose={cancelDeletePortfolio} title="Delete Portfolio">
          <div className="space-y-4">
            <p className="text-text-secondary text-sm">This action will permanently delete the portfolio and all its versions.</p>
            <div className="flex justify-end gap-3 pt-2">
              <Button variant="ghost" onClick={cancelDeletePortfolio}>Cancel</Button>
              <Button variant="danger" onClick={confirmDeletePortfolio}>Delete</Button>
            </div>
          </div>
        </Modal>
    </LayoutWrapper>
  );
};

export default App;
