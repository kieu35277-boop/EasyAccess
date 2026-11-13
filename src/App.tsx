import React, { useState } from 'react';
import { I18nProvider } from './locales';
import { AccessibilityProvider } from './context/AccessibilityContext';
import { IoTProvider } from './context/IoTContext';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { BottomNav } from './components/BottomNav';
import { OfflineBanner } from './components/OfflineBanner';
import { ConfirmationModal } from './components/ConfirmationModal';
import { AIAssistantDrawer } from './components/AIAssistantDrawer';

import { HomePage } from './pages/HomePage';
import { GuidesPage } from './pages/GuidesPage';
import { AssistantPage } from './pages/AssistantPage';
import { IoTControlPage } from './pages/IoTControlPage';
import { AccessibilityPage } from './pages/AccessibilityPage';
import { AppManualPage } from './pages/AppManualPage';
import { EvaluationPage } from './pages/EvaluationPage';
import { AboutProjectPage } from './pages/AboutProjectPage';
import { PrivacyPage } from './pages/PrivacyPage';
import { SettingsPage } from './pages/SettingsPage';

import { PageId } from './types';

function AppContent() {
  const [currentPage, setCurrentPage] = useState<PageId>('home');
  const [isAssistantOpen, setIsAssistantOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [assistantPrompt, setAssistantPrompt] = useState<string | undefined>(undefined);

  const handleNavigate = (page: PageId) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenAssistantWithPrompt = (prompt: string) => {
    setAssistantPrompt(prompt);
    setIsAssistantOpen(true);
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return (
          <HomePage
            onNavigate={handleNavigate}
            onOpenAssistant={() => setIsAssistantOpen(true)}
          />
        );
      case 'guides':
        return (
          <GuidesPage
            onOpenAssistantWithPrompt={handleOpenAssistantWithPrompt}
          />
        );
      case 'assistant':
        return (
          <AssistantPage
            onNavigate={handleNavigate}
            initialPrompt={assistantPrompt}
          />
        );
      case 'iot':
        return <IoTControlPage />;
      case 'accessibility':
        return <AccessibilityPage />;
      case 'manual':
        return <AppManualPage />;
      case 'evaluation':
        return <EvaluationPage />;
      case 'about':
        return <AboutProjectPage />;
      case 'privacy':
        return <PrivacyPage />;
      case 'settings':
        return <SettingsPage />;
      default:
        return (
          <HomePage
            onNavigate={handleNavigate}
            onOpenAssistant={() => setIsAssistantOpen(true)}
          />
        );
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100 transition-colors">
      <OfflineBanner />

      <Header
        currentPage={currentPage}
        onNavigate={handleNavigate}
        onOpenAssistant={() => setIsAssistantOpen(true)}
        onToggleSidebar={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      />

      <div className="flex-1 max-w-7xl w-full mx-auto flex">
        {/* Persistent Desktop Sidebar and Mobile Drawer */}
        <Sidebar
          currentPage={currentPage}
          onNavigate={handleNavigate}
          isOpenMobile={isMobileMenuOpen}
          onCloseMobile={() => setIsMobileMenuOpen(false)}
        />

        {/* Main Content Area */}
        <main
          id="main-content"
          tabIndex={-1}
          className="flex-1 p-4 sm:p-6 lg:p-8 pb-24 lg:pb-12 max-w-full overflow-x-hidden focus:outline-hidden"
        >
          {renderPage()}
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <BottomNav
        currentPage={currentPage}
        onNavigate={handleNavigate}
        onOpenAssistant={() => setIsAssistantOpen(true)}
        onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
      />

      {/* Omni-present EasyAssist Drawer */}
      <AIAssistantDrawer
        isOpen={isAssistantOpen}
        onClose={() => setIsAssistantOpen(false)}
        onNavigate={handleNavigate}
      />

      {/* Strict 2-Step Confirmation Modal for IoT */}
      <ConfirmationModal />
    </div>
  );
}

export default function App() {
  return (
    <I18nProvider>
      <AccessibilityProvider>
        <IoTProvider>
          <AppContent />
        </IoTProvider>
      </AccessibilityProvider>
    </I18nProvider>
  );
}
