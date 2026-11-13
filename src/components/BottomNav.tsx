import React from 'react';
import { Home, BookOpen, Sparkles, Cpu, Sliders, Menu } from 'lucide-react';
import { useI18n } from '../locales';
import { useAccessibility } from '../context/AccessibilityContext';
import { PageId } from '../types';

interface BottomNavProps {
  currentPage: PageId;
  onNavigate: (page: PageId) => void;
  onOpenAssistant: () => void;
  onOpenMobileMenu: () => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  currentPage,
  onNavigate,
  onOpenAssistant,
  onOpenMobileMenu,
}) => {
  const { t } = useI18n();
  const { playActionSound } = useAccessibility();

  const handleNav = (page: PageId) => {
    playActionSound('click');
    onNavigate(page);
  };

  return (
    <nav
      className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 dark:bg-slate-900/95 dark:border-slate-800 pb-safe"
      aria-label="Mobile Navigation"
    >
      <div className="grid grid-cols-5 h-16 max-w-lg mx-auto">
        {/* 1. Home */}
        <button
          onClick={() => handleNav('home')}
          className={`flex flex-col items-center justify-center gap-1 min-h-[48px] transition ${
            currentPage === 'home'
              ? 'text-blue-600 font-bold dark:text-blue-400'
              : 'text-slate-600 dark:text-slate-400'
          }`}
        >
          <Home className="w-5 h-5" />
          <span className="text-[11px] leading-none truncate">{t.nav.home}</span>
        </button>

        {/* 2. Guides */}
        <button
          onClick={() => handleNav('guides')}
          className={`flex flex-col items-center justify-center gap-1 min-h-[48px] transition ${
            currentPage === 'guides'
              ? 'text-blue-600 font-bold dark:text-blue-400'
              : 'text-slate-600 dark:text-slate-400'
          }`}
        >
          <BookOpen className="w-5 h-5" />
          <span className="text-[11px] leading-none truncate">{t.nav.guides}</span>
        </button>

        {/* 3. AI Assistant (Special Center Button) */}
        <button
          onClick={() => {
            playActionSound('click');
            onOpenAssistant();
          }}
          className="flex flex-col items-center justify-center gap-1 -mt-4"
          aria-label={t.nav.assistant}
        >
          <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-lg active:scale-95 transition ring-4 ring-white dark:ring-slate-900">
            <Sparkles className="w-6 h-6 text-amber-300" />
          </div>
          <span className="text-[11px] font-bold text-blue-600 dark:text-blue-400 leading-none">AI</span>
        </button>

        {/* 4. IoT */}
        <button
          onClick={() => handleNav('iot')}
          className={`flex flex-col items-center justify-center gap-1 min-h-[48px] transition ${
            currentPage === 'iot'
              ? 'text-blue-600 font-bold dark:text-blue-400'
              : 'text-slate-600 dark:text-slate-400'
          }`}
        >
          <Cpu className="w-5 h-5" />
          <span className="text-[11px] leading-none truncate">{t.nav.iot}</span>
        </button>

        {/* 5. Accessibility / More */}
        <button
          onClick={() => handleNav('accessibility')}
          className={`flex flex-col items-center justify-center gap-1 min-h-[48px] transition ${
            currentPage === 'accessibility'
              ? 'text-blue-600 font-bold dark:text-blue-400'
              : 'text-slate-600 dark:text-slate-400'
          }`}
        >
          <Sliders className="w-5 h-5" />
          <span className="text-[11px] leading-none truncate">{t.nav.accessibility}</span>
        </button>
      </div>
    </nav>
  );
};
