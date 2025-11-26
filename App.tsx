
import React, { useState, useEffect, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { LayoutWrapper } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { TemplateGallery } from './pages/TemplateGallery';
import { Editor } from './pages/Editor';
import { Preview } from './pages/Preview';
import { PortfolioData, AppRoute, Template } from './types';
import { MOCK_TEMPLATES, INITIAL_PORTFOLIO } from './constants';

const App: React.FC = () => {
  const [route, setRoute] = useState<AppRoute>('dashboard');
  
  // Initialize portfolios from LocalStorage or use default mock data
  const [portfolios, setPortfolios] = useState<PortfolioData[]>(() => {
      // Changed key to v2 to force a fresh start for viewing the onboarding UI
      const saved = localStorage.getItem('folioforge_portfolios_v2');
      if (saved) {
          try {
              const parsed = JSON.parse(saved);
              // Re-hydrate Date objects since JSON converts them to strings
              return parsed.map((p: any) => ({
                  ...p,
                  lastModified: new Date(p.lastModified),
                  lastPublished: p.lastPublished ? new Date(p.lastPublished) : undefined
              }));
          } catch (e) {
              console.error("Failed to load portfolios from LocalStorage", e);
          }
      }
      return []; // Return empty array to trigger Onboarding UI
  });
  
  // State for the flow
  const [currentPortfolio, setCurrentPortfolio] = useState<PortfolioData | null>(null);

  // Persistence Effect: Save to LocalStorage whenever portfolios change
  useEffect(() => {
      localStorage.setItem('folioforge_portfolios_v2', JSON.stringify(portfolios));
  }, [portfolios]);

  // Navigation handlers
  const handleNavigate = (newRoute: AppRoute) => {
    // CRITICAL FIX: Clear the active session when navigating to top-level pages.
    // This prevents "dirty data pollution" where an old project's data 
    // is accidentally inherited when selecting a new template.
    if (newRoute === 'dashboard' || newRoute === 'templates') {
        setCurrentPortfolio(null);
    }
    setRoute(newRoute);
  };

  const startCreateFlow = () => {
    // Explicitly start a fresh session
    setCurrentPortfolio({ ...INITIAL_PORTFOLIO, id: Date.now().toString() });
    setRoute('templates');
  };

  const handleEditPortfolio = (id: string) => {
    const p = portfolios.find(item => item.id === id);
    if (p) {
        setCurrentPortfolio(p);
        setRoute('editor');
    }
  };

  // Delete Handler
  const handleDeletePortfolio = (id: string) => {
    if (window.confirm("Are you sure you want to delete this project? This action cannot be undone.")) {
        setPortfolios(prev => prev.filter(p => p.id !== id));
        // If the deleted one was selected/active, clear it
        if (currentPortfolio && currentPortfolio.id === id) {
            setCurrentPortfolio(null);
        }
    }
  };

  const handleTemplateSelect = (template: Template) => {
    // If currentPortfolio exists (via startCreateFlow), use it. 
    // If it's null (via handleNavigate to 'templates'), create a brand new one.
    // This ensures we don't accidentally merge data from a previous session.
    const basePortfolio = currentPortfolio || { ...INITIAL_PORTFOLIO, id: Date.now().toString() };
    
    setCurrentPortfolio({
        ...basePortfolio,
        templateId: template.id
    });
    setRoute('editor');
  };

  // Optimistic Save Handler
  const handleSavePortfolio = useCallback((data: PortfolioData) => {
    // Update local state list immediately
    setPortfolios(prevPortfolios => {
        const exists = prevPortfolios.find(p => p.id === data.id);
        if (exists) {
            return prevPortfolios.map(p => p.id === data.id ? data : p);
        } else {
            return [...prevPortfolios, data];
        }
    });
    // Update current portfolio reference
    setCurrentPortfolio(data);
  }, []);

  // Add handleUpdateName
  const handleUpdateName = (id: string, newName: string) => {
      setPortfolios(prev => prev.map(p => p.id === id ? { ...p, name: newName } : p));
      if (currentPortfolio && currentPortfolio.id === id) {
          setCurrentPortfolio(prev => prev ? { ...prev, name: newName } : null);
      }
  };

  const handlePublishSuccess = () => {
      if (currentPortfolio) {
          const now = new Date();
          const updated = { 
              ...currentPortfolio, 
              isPublished: true,
              lastModified: now,
              lastPublished: now 
          };
          handleSavePortfolio(updated);
      }
  };

  const renderContent = () => {
    switch (route) {
      case 'dashboard':
        return (
            <Dashboard 
                portfolios={portfolios} 
                onNavigate={handleNavigate}
                onCreate={startCreateFlow}
                onEdit={handleEditPortfolio}
                onDelete={handleDeletePortfolio}
                onUpdateName={handleUpdateName}
            />
        );
      case 'templates':
        return (
            <TemplateGallery 
                templates={MOCK_TEMPLATES} 
                onSelect={handleTemplateSelect} 
            />
        );
      case 'editor':
        return currentPortfolio ? (
            <Editor 
                portfolio={currentPortfolio}
                onSave={handleSavePortfolio}
                onPreview={() => setRoute('preview')}
                onBack={() => handleNavigate('dashboard')} 
            />
        ) : <div>Error: No portfolio selected</div>;
      case 'preview':
        return currentPortfolio ? (
            <Preview 
                portfolio={currentPortfolio}
                onBack={() => setRoute('editor')}
                onPublish={handlePublishSuccess}
            />
        ) : <div>Error</div>;
      default:
        return <Dashboard portfolios={portfolios} onNavigate={handleNavigate} onCreate={startCreateFlow} onEdit={handleEditPortfolio} onDelete={handleDeletePortfolio} />;
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
    </LayoutWrapper>
  );
};

export default App;
