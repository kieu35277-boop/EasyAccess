import React, { useMemo } from 'react';
import {
  Sparkles,
  BookOpen,
  Cpu,
  Sliders,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  HelpCircle,
  Activity,
  Layers,
} from 'lucide-react';
import { useI18n } from '../locales';
import { useAccessibility } from '../context/AccessibilityContext';
import { useIoT } from '../context/IoTContext';
import { PageId } from '../types';

interface HomePageProps {
  onNavigate: (page: PageId) => void;
  onOpenAssistant: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate, onOpenAssistant }) => {
  const { t, language } = useI18n();
  const { playActionSound, settings } = useAccessibility();
  const { config } = useIoT();

  // Dynamic daytime greeting
  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return t.home.greetingMorning;
    if (hour >= 12 && hour < 18) return t.home.greetingAfternoon;
    return t.home.greetingEvening;
  }, [t]);

  const handleNav = (page: PageId) => {
    playActionSound('click');
    onNavigate(page);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Daytime Greeting & Welcome Hero */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-500 via-indigo-600 to-emerald-500 p-6 md:p-10 text-white shadow-xl">
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/20 backdrop-blur-md px-3.5 py-1 text-xs md:text-sm font-semibold tracking-wide text-white border border-white/25">
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>{t.appTagline}</span>
          </div>

          <h1 className="text-2xl sm:text-4xl md:text-5xl font-black tracking-tight leading-tight">
            {t.appSlogan}
          </h1>

          <p className="text-base sm:text-lg text-blue-50 leading-relaxed font-medium">
            {greeting}
          </p>

          <p className="text-sm sm:text-base text-blue-100/90 leading-relaxed max-w-2xl">
            {t.appShortDesc}
          </p>

          {/* Primary Big Action Buttons */}
          <div className="pt-4 flex flex-wrap gap-3">
            <button
              onClick={() => {
                playActionSound('click');
                onOpenAssistant();
              }}
              className="flex items-center justify-center gap-2.5 rounded-2xl bg-amber-400 px-6 py-4 text-base md:text-lg font-extrabold text-slate-950 shadow-lg hover:bg-amber-300 active:scale-95 transition"
            >
              <Sparkles className="w-6 h-6 text-indigo-900" />
              <span>{t.home.chatWithAI}</span>
            </button>

            <button
              onClick={() => handleNav('iot')}
              className="flex items-center justify-center gap-2.5 rounded-2xl bg-white text-blue-900 px-6 py-4 text-base md:text-lg font-extrabold shadow-lg hover:bg-blue-50 active:scale-95 transition"
            >
              <Cpu className="w-6 h-6 text-blue-600" />
              <span>{t.home.controlDevices}</span>
            </button>

            <button
              onClick={() => handleNav('guides')}
              className="flex items-center justify-center gap-2.5 rounded-2xl bg-white/20 backdrop-blur-md border-2 border-white/40 px-5 py-4 text-base font-bold text-white hover:bg-white/30 active:scale-95 transition"
            >
              <BookOpen className="w-5 h-5" />
              <span>{t.home.findGuides}</span>
            </button>

            <button
              onClick={() => handleNav('accessibility')}
              className="flex items-center justify-center gap-2.5 rounded-2xl bg-white/20 backdrop-blur-md border-2 border-white/40 px-5 py-4 text-base font-bold text-white hover:bg-white/30 active:scale-95 transition"
            >
              <Sliders className="w-5 h-5" />
              <span>{t.home.tuneAccessibility}</span>
            </button>
          </div>
        </div>

        {/* Ambient watermark pattern */}
        <div className="absolute -right-16 -bottom-16 w-80 h-80 rounded-full bg-white/10 blur-2xl pointer-events-none" />
      </section>

      {/* Real-time System Status (Transparent & Honest) */}
      <section
        aria-label="System Connectivity Status"
        className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 shadow-sm dark:bg-slate-900 dark:border-slate-800"
      >
        <div className="flex items-center gap-2 mb-3">
          <Activity className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
            {t.home.systemStatus}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
          {/* AI Status */}
          <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-3 border border-slate-200 dark:bg-slate-800 dark:border-slate-700">
            <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse shrink-0" />
            <div>
              <p className="font-bold text-slate-800 dark:text-slate-100">
                {t.home.aiStatusReady}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Gemini 3.8 Flash Engine + Web Speech API
              </p>
            </div>
          </div>

          {/* IoT Status */}
          <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-3 border border-slate-200 dark:bg-slate-800 dark:border-slate-700">
            <span
              className={`w-3 h-3 rounded-full shrink-0 ${
                config.mode === 'simulation' ? 'bg-amber-500' : 'bg-emerald-500'
              }`}
            />
            <div>
              <p className="font-bold text-slate-800 dark:text-slate-100">
                {config.mode === 'simulation'
                  ? t.home.iotSimulationMode
                  : t.home.iotHardwareConnected}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {config.mode === 'simulation'
                  ? 'Giao thức mô phỏng an toàn (2-step check)'
                  : 'Arduino Cloud / MQTT Endpoint Active'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4 Feature Exploration Cards */}
      <section>
        <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mb-4 flex items-center gap-2">
          <Layers className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          <span>{t.home.exploreFeatures}</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Guides */}
          <div
            onClick={() => handleNav('guides')}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && handleNav('guides')}
            className="group cursor-pointer rounded-2xl border-2 border-slate-200 bg-white p-5 shadow-sm hover:border-blue-400 hover:shadow-md transition dark:bg-slate-900 dark:border-slate-800 flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center mb-4 group-hover:scale-105 transition dark:bg-blue-950 dark:text-blue-300">
                <BookOpen className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                {t.nav.guides}
              </h3>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                {t.home.actionCardGuidesDesc}
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center gap-1 text-sm font-bold text-blue-600 dark:text-blue-400">
              <span>{t.guides.openGuide}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
            </div>
          </div>

          {/* Card 2: AI */}
          <div
            onClick={() => {
              playActionSound('click');
              onOpenAssistant();
            }}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && onOpenAssistant()}
            className="group cursor-pointer rounded-2xl border-2 border-slate-200 bg-white p-5 shadow-sm hover:border-indigo-400 hover:shadow-md transition dark:bg-slate-900 dark:border-slate-800 flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center mb-4 group-hover:scale-105 transition dark:bg-indigo-950 dark:text-indigo-300">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                {t.nav.assistant}
              </h3>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                {t.home.actionCardAIDesc}
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center gap-1 text-sm font-bold text-indigo-600 dark:text-indigo-400">
              <span>{t.home.chatWithAI}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
            </div>
          </div>

          {/* Card 3: IoT */}
          <div
            onClick={() => handleNav('iot')}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && handleNav('iot')}
            className="group cursor-pointer rounded-2xl border-2 border-slate-200 bg-white p-5 shadow-sm hover:border-emerald-400 hover:shadow-md transition dark:bg-slate-900 dark:border-slate-800 flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-4 group-hover:scale-105 transition dark:bg-emerald-950 dark:text-emerald-300">
                <Cpu className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                {t.nav.iot}
              </h3>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                {t.home.actionCardIoTDesc}
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center gap-1 text-sm font-bold text-emerald-600 dark:text-emerald-400">
              <span>{t.home.controlDevices}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
            </div>
          </div>

          {/* Card 4: Accessibility */}
          <div
            onClick={() => handleNav('accessibility')}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && handleNav('accessibility')}
            className="group cursor-pointer rounded-2xl border-2 border-slate-200 bg-white p-5 shadow-sm hover:border-amber-400 hover:shadow-md transition dark:bg-slate-900 dark:border-slate-800 flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center mb-4 group-hover:scale-105 transition dark:bg-amber-950 dark:text-amber-300">
                <Sliders className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                {t.nav.accessibility}
              </h3>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                {t.home.actionCardAccessDesc}
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center gap-1 text-sm font-bold text-amber-600 dark:text-amber-400">
              <span>{t.home.tuneAccessibility}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
            </div>
          </div>
        </div>
      </section>

      {/* Quick Start for New Users */}
      <section className="rounded-3xl border border-blue-100 bg-blue-50/70 p-6 md:p-8 dark:bg-slate-800/80 dark:border-slate-700">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-4">
          <CheckCircle2 className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
          <span>{t.home.quickStartTitle}</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="rounded-2xl bg-white p-5 shadow-xs border border-slate-200 dark:bg-slate-900 dark:border-slate-700">
            <span className="inline-block px-2.5 py-1 rounded-md bg-blue-100 text-blue-800 font-extrabold text-xs mb-2">
              BƯỚC 1
            </span>
            <p className="text-sm md:text-base font-semibold text-slate-800 dark:text-slate-200 leading-relaxed">
              {t.home.quickStart1}
            </p>
          </div>

          <div className="rounded-2xl bg-white p-5 shadow-xs border border-slate-200 dark:bg-slate-900 dark:border-slate-700">
            <span className="inline-block px-2.5 py-1 rounded-md bg-indigo-100 text-indigo-800 font-extrabold text-xs mb-2">
              BƯỚC 2
            </span>
            <p className="text-sm md:text-base font-semibold text-slate-800 dark:text-slate-200 leading-relaxed">
              {t.home.quickStart2}
            </p>
          </div>

          <div className="rounded-2xl bg-white p-5 shadow-xs border border-slate-200 dark:bg-slate-900 dark:border-slate-700">
            <span className="inline-block px-2.5 py-1 rounded-md bg-emerald-100 text-emerald-800 font-extrabold text-xs mb-2">
              BƯỚC 3
            </span>
            <p className="text-sm md:text-base font-semibold text-slate-800 dark:text-slate-200 leading-relaxed">
              {t.home.quickStart3}
            </p>
          </div>
        </div>
      </section>

      {/* Scientific Research Project Footnote & Links */}
      <footer className="pt-6 border-t border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4 text-xs md:text-sm text-slate-500 dark:text-slate-400">
        <p>
          EasyAccess © 2026 – Đề tài NCKH hỗ trợ người khuyết tật chi trên.
        </p>
        <div className="flex items-center gap-4">
          <button
            onClick={() => handleNav('about')}
            className="hover:text-blue-600 font-semibold underline"
          >
            {t.nav.about}
          </button>
          <button
            onClick={() => handleNav('privacy')}
            className="hover:text-blue-600 font-semibold underline"
          >
            {t.nav.privacy}
          </button>
          <button
            onClick={() => handleNav('manual')}
            className="hover:text-blue-600 font-semibold underline"
          >
            {t.nav.manual}
          </button>
        </div>
      </footer>
    </div>
  );
};
