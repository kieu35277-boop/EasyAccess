import React, { useState } from 'react';
import {
  Sparkles,
  Sliders,
  Sun,
  Moon,
  Volume2,
  VolumeX,
  Globe,
  HelpCircle,
  Menu,
} from 'lucide-react';
import { useI18n } from '../locales';
import { useAccessibility } from '../context/AccessibilityContext';
import { PWAInstallButton } from './PWAInstallButton';
import { Language, PageId } from '../types';

interface HeaderProps {
  currentPage: PageId;
  onNavigate: (page: PageId) => void;
  onOpenAssistant: () => void;
  onToggleSidebar?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentPage: _currentPage,
  onNavigate,
  onOpenAssistant,
  onToggleSidebar,
}) => {
  const { t, language, setLanguage } = useI18n();
  const { settings, updateSetting, playActionSound } = useAccessibility();
  const [langMenuOpen, setLangMenuOpen] = useState(false);

  const toggleHighContrast = () => {
    updateSetting('highContrast', !settings.highContrast);
  };

  const toggleSound = () => {
    updateSetting('soundFeedback', !settings.soundFeedback);
  };

  const toggleDarkMode = () => {
    updateSetting('darkMode', !settings.darkMode);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 dark:bg-slate-900/95 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-2">
        {/* Left: Mobile hamburger & Brand */}
        <div className="flex items-center gap-3">
          {onToggleSidebar && (
            <button
              onClick={() => {
                playActionSound('click');
                onToggleSidebar();
              }}
              className="lg:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
              aria-label="Toggle Menu"
            >
              <Menu className="w-6 h-6" />
            </button>
          )}

          <button
            onClick={() => {
              playActionSound('click');
              onNavigate('home');
            }}
            className="flex items-center gap-2.5 text-left focus:outline-hidden"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-emerald-500 flex items-center justify-center text-white font-extrabold shadow-sm">
              <span className="text-xl">EA</span>
            </div>
            <div>
              <span className="text-lg md:text-xl font-extrabold tracking-tight text-slate-900 dark:text-white block leading-none">
                {t.appName}
              </span>
              <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 block leading-tight mt-0.5">
                AI & IoT Assistive
              </span>
            </div>
          </button>
        </div>

        {/* Right: Quick Accessibility & AI controls */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Quick AI Trigger */}
          <button
            onClick={() => {
              playActionSound('click');
              onOpenAssistant();
            }}
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-3.5 py-2 text-sm font-bold text-white shadow-sm hover:from-blue-700 hover:to-indigo-700 active:scale-95 transition"
            aria-label={t.home.chatWithAI}
          >
            <Sparkles className="w-4 h-4 text-amber-300 animate-spin-slow" />
            <span className="hidden md:inline">{t.nav.assistant}</span>
          </button>

          {/* High Contrast Toggle */}
          <button
            onClick={toggleHighContrast}
            title={settings.highContrast ? t.accessibility.disableContrast : t.accessibility.enableContrast}
            className={`p-2.5 rounded-xl border transition ${
              settings.highContrast
                ? 'bg-amber-400 text-black border-black font-extrabold shadow-md'
                : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:border-slate-700'
            }`}
            aria-label="High Contrast"
          >
            <Sliders className="w-5 h-5" />
          </button>

          {/* Dark / Light Toggle */}
          <button
            onClick={toggleDarkMode}
            title="Theme Toggle"
            className="p-2.5 rounded-xl bg-slate-100 text-slate-700 border border-slate-200 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:border-slate-700 transition"
            aria-label="Toggle Theme"
          >
            {settings.darkMode ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5" />}
          </button>

          {/* Sound Toggle */}
          <button
            onClick={toggleSound}
            title={settings.soundFeedback ? 'Tắt âm thanh phản hồi' : 'Bật âm thanh phản hồi'}
            className="hidden sm:flex p-2.5 rounded-xl bg-slate-100 text-slate-700 border border-slate-200 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:border-slate-700 transition"
            aria-label="Audio Feedback"
          >
            {settings.soundFeedback ? <Volume2 className="w-5 h-5 text-emerald-600" /> : <VolumeX className="w-5 h-5 text-slate-400" />}
          </button>

          {/* Language Selector Dropdown */}
          <div className="relative">
            <button
              onClick={() => {
                playActionSound('click');
                setLangMenuOpen(!langMenuOpen);
              }}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 border border-slate-200 text-xs font-bold text-slate-800 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:border-slate-700 transition"
              aria-expanded={langMenuOpen}
              aria-label="Language selection"
            >
              <Globe className="w-4 h-4 text-blue-600" />
              <span>{language === 'vi' ? 'VI' : language === 'zh' ? '中文' : 'EN'}</span>
            </button>

            {langMenuOpen && (
              <div
                role="menu"
                className="absolute right-0 mt-2 w-40 rounded-xl bg-white shadow-xl border border-slate-200 py-1 z-50 dark:bg-slate-900 dark:border-slate-700"
              >
                {(
                  [
                    { code: 'vi', label: 'Tiếng Việt' },
                    { code: 'en', label: 'English' },
                    { code: 'zh', label: '简体中文' },
                  ] as { code: Language; label: string }[]
                ).map((lang) => (
                  <button
                    key={lang.code}
                    role="menuitem"
                    onClick={() => {
                      playActionSound('click');
                      setLanguage(lang.code);
                      setLangMenuOpen(false);
                    }}
                    className={`w-full text-left px-4 py-2.5 text-sm font-semibold transition ${
                      language === lang.code
                        ? 'bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300'
                        : 'text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800'
                    }`}
                  >
                    {lang.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* PWA Install Button */}
          <PWAInstallButton />

          {/* App manual / Help shortcut */}
          <button
            onClick={() => {
              playActionSound('click');
              onNavigate('manual');
            }}
            title={t.nav.manual}
            className="hidden sm:flex p-2.5 rounded-xl text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
            aria-label="User manual"
          >
            <HelpCircle className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  );
};
