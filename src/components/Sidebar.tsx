import React from 'react';
import {
  Home,
  BookOpen,
  Sparkles,
  Cpu,
  Sliders,
  HelpCircle,
  BarChart3,
  Info,
  ShieldCheck,
  Settings,
  X,
} from 'lucide-react';
import { useI18n } from '../locales';
import { useAccessibility } from '../context/AccessibilityContext';
import { PageId } from '../types';

interface SidebarProps {
  currentPage: PageId;
  onNavigate: (page: PageId) => void;
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentPage,
  onNavigate,
  isOpenMobile = false,
  onCloseMobile,
}) => {
  const { t } = useI18n();
  const { playActionSound, settings } = useAccessibility();

  const navItems = [
    { id: 'home' as PageId, label: t.nav.home, icon: Home },
    { id: 'guides' as PageId, label: t.nav.guides, icon: BookOpen },
    { id: 'assistant' as PageId, label: t.nav.assistant, icon: Sparkles },
    { id: 'iot' as PageId, label: t.nav.iot, icon: Cpu },
    { id: 'accessibility' as PageId, label: t.nav.accessibility, icon: Sliders },
    { id: 'manual' as PageId, label: t.nav.manual, icon: HelpCircle },
    { id: 'evaluation' as PageId, label: t.nav.evaluation, icon: BarChart3 },
    { id: 'about' as PageId, label: t.nav.about, icon: Info },
    { id: 'privacy' as PageId, label: t.nav.privacy, icon: ShieldCheck },
    { id: 'settings' as PageId, label: t.nav.settings, icon: Settings },
  ];

  const handleItemClick = (id: PageId) => {
    playActionSound('click');
    onNavigate(id);
    onCloseMobile?.();
  };

  const content = (
    <div className="flex h-full flex-col justify-between py-4 px-3 bg-white border-r border-slate-200 dark:bg-slate-900 dark:border-slate-800">
      <div>
        <div className="flex items-center justify-between px-3 mb-4 lg:hidden">
          <span className="text-base font-extrabold text-slate-800 dark:text-white">
            Danh mục EasyAccess
          </span>
          <button
            onClick={onCloseMobile}
            className="p-2 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <nav className="space-y-1.5" aria-label="Main Navigation">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleItemClick(item.id)}
                className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-left font-bold transition ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-sm ring-2 ring-blue-300 dark:ring-blue-800'
                    : 'text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800'
                }`}
                aria-current={isActive ? 'page' : undefined}
              >
                <Icon className={`w-5 h-5 shrink-0 ${isActive ? 'text-white' : 'text-slate-500 dark:text-slate-400'}`} />
                {settings.showIconLabels && <span className="text-sm md:text-base truncate">{item.label}</span>}
              </button>
            );
          })}
        </nav>
      </div>

      <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 dark:bg-slate-800 dark:border-slate-700 mt-4">
        <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
          Đề tài NCKH 2026
        </p>
        <p className="text-xs font-bold text-slate-800 dark:text-slate-200 mt-0.5">
          AI & IoT Hỗ trợ Khuyết tật Chi
        </p>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside className="hidden lg:block w-64 xl:w-72 shrink-0 h-[calc(100vh-4.5rem)] sticky top-18 overflow-y-auto">
        {content}
      </aside>

      {/* Mobile Drawer Overlay */}
      {isOpenMobile && (
        <div
          role="dialog"
          aria-modal="true"
          className="lg:hidden fixed inset-0 z-50 flex bg-black/60"
        >
          <div className="w-72 max-w-xs h-full bg-white dark:bg-slate-900 shadow-2xl animate-in slide-in-from-left duration-200">
            {content}
          </div>
          <div className="flex-1" onClick={onCloseMobile} />
        </div>
      )}
    </>
  );
};
