import React, { useState, useMemo } from 'react';
import {
  Search,
  BookOpen,
  Volume2,
  Square,
  Copy,
  Check,
  Sparkles,
  ChevronRight,
  ChevronLeft,
  X,
  ExternalLink,
  Smartphone,
  Tablet,
  Laptop,
  Home,
  Sliders,
  HelpCircle,
} from 'lucide-react';
import { useI18n } from '../locales';
import { useAccessibility } from '../context/AccessibilityContext';
import { guidesData } from '../data/guidesData';
import { GuideItem } from '../types';

interface GuidesPageProps {
  onOpenAssistantWithPrompt?: (prompt: string) => void;
}

export const GuidesPage: React.FC<GuidesPageProps> = ({ onOpenAssistantWithPrompt }) => {
  const { t, language } = useI18n();
  const { playActionSound, speakText, stopSpeech, isSpeaking } = useAccessibility();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeGuide, setActiveGuide] = useState<GuideItem | null>(null);
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const categories = [
    { id: 'all', label: t.guides.allCategories, icon: BookOpen },
    { id: 'phone', label: t.guides.catPhone, icon: Smartphone },
    { id: 'tablet', label: t.guides.catTablet, icon: Tablet },
    { id: 'computer', label: t.guides.catComputer, icon: Laptop },
    { id: 'smarthome', label: t.guides.catSmartHome, icon: Home },
    { id: 'switch_access', label: t.guides.catSwitch, icon: Sliders },
    { id: 'troubleshooting', label: t.guides.catTrouble, icon: HelpCircle },
  ];

  const filteredGuides = useMemo(() => {
    return guidesData.filter((guide) => {
      const matchCategory = selectedCategory === 'all' || guide.category === selectedCategory;
      const query = searchQuery.toLowerCase().trim();
      if (!query) return matchCategory;

      const title = (guide.title[language] || guide.title.vi).toLowerCase();
      const summary = (guide.summary[language] || guide.summary.vi).toLowerCase();
      const tags = guide.tags.join(' ').toLowerCase();

      return matchCategory && (title.includes(query) || summary.includes(query) || tags.includes(query));
    });
  }, [searchQuery, selectedCategory, language]);

  const handleOpenGuide = (guide: GuideItem) => {
    playActionSound('click');
    setActiveGuide(guide);
    setActiveStepIndex(0);
  };

  const handleCloseGuide = () => {
    playActionSound('click');
    stopSpeech();
    setActiveGuide(null);
  };

  const handleCopyGuide = (guide: GuideItem) => {
    playActionSound('click');
    const title = guide.title[language] || guide.title.vi;
    const steps = (guide.steps[language] || guide.steps.vi)
      .map((s) => `Bước ${s.stepNumber}: ${s.title}\n${s.description}`)
      .join('\n\n');
    const fullText = `${title}\n\n${steps}\n\nNguồn: ${guide.source}`;

    navigator.clipboard.writeText(fullText);
    setCopiedId(guide.id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const handleReadStep = (text: string) => {
    if (isSpeaking) {
      stopSpeech();
    } else {
      speakText(text);
    }
  };

  const currentSteps = activeGuide ? activeGuide.steps[language] || activeGuide.steps.vi : [];
  const currentStep = currentSteps[activeStepIndex];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Title & Search Bar */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white flex items-center gap-3">
          <BookOpen className="w-8 h-8 text-blue-600 dark:text-blue-400" />
          <span>{t.guides.title}</span>
        </h1>
        <p className="mt-1 text-sm sm:text-base text-slate-600 dark:text-slate-300">
          {t.guides.subtitle}
        </p>

        {/* Large Search Box with 56px touch target */}
        <div className="mt-4 relative max-w-2xl">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
            <Search className="w-6 h-6" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t.guides.searchPlaceholder}
            className="w-full h-14 pl-12 pr-10 rounded-2xl border-2 border-slate-200 bg-white text-base text-slate-900 shadow-sm focus:border-blue-500 focus:outline-hidden dark:bg-slate-900 dark:border-slate-700 dark:text-white"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Category Pills with large touch zones */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none" role="tablist">
        {categories.map((cat) => {
          const Icon = cat.icon;
          const isSelected = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              role="tab"
              aria-selected={isSelected}
              onClick={() => {
                playActionSound('click');
                setSelectedCategory(cat.id);
              }}
              className={`flex items-center gap-2 px-4 py-3 rounded-xl font-bold text-sm shrink-0 transition ${
                isSelected
                  ? 'bg-blue-600 text-white shadow-sm ring-2 ring-blue-300'
                  : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-200'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>

      {/* Guide Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredGuides.map((guide) => {
          const title = guide.title[language] || guide.title.vi;
          const summary = guide.summary[language] || guide.summary.vi;
          const stepsCount = (guide.steps[language] || guide.steps.vi).length;

          return (
            <article
              key={guide.id}
              className="rounded-2xl border-2 border-slate-200 bg-white p-6 shadow-sm hover:border-blue-400 hover:shadow-md transition dark:bg-slate-900 dark:border-slate-800 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between text-xs font-bold text-slate-400 mb-2">
                  <span className="uppercase tracking-wider px-2 py-0.5 rounded bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                    {guide.deviceType}
                  </span>
                  <span>{stepsCount} {t.guides.stepsCount}</span>
                </div>

                <h2 className="text-lg font-bold text-slate-900 dark:text-white leading-snug">
                  {title}
                </h2>

                <p className="mt-2 text-sm text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-3">
                  {summary}
                </p>

                <div className="mt-3 flex flex-wrap gap-1.5">
                  {guide.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                <button
                  onClick={() => handleOpenGuide(guide)}
                  className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-bold text-white shadow-sm hover:bg-blue-700 active:scale-95 transition"
                >
                  <span>{t.guides.openGuide}</span>
                  <ChevronRight className="w-4 h-4" />
                </button>

                <button
                  onClick={() => handleCopyGuide(guide)}
                  title={t.guides.copyContent}
                  className="p-3 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800 transition"
                >
                  {copiedId === guide.id ? (
                    <Check className="w-5 h-5 text-emerald-600" />
                  ) : (
                    <Copy className="w-5 h-5" />
                  )}
                </button>
              </div>
            </article>
          );
        })}

        {filteredGuides.length === 0 && (
          <div className="col-span-full py-12 text-center text-slate-500">
            <BookOpen className="w-12 h-12 mx-auto text-slate-300 mb-3" />
            <p className="text-base font-bold">{t.guides.noResults}</p>
          </div>
        )}
      </div>

      {/* Step-by-Step Reader Modal */}
      {activeGuide && currentStep && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="active-guide-title"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4 animate-in fade-in duration-200"
        >
          <div className="w-full max-w-2xl max-h-[90vh] flex flex-col rounded-3xl bg-white p-6 md:p-8 shadow-2xl dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800">
            {/* Header */}
            <div className="flex items-start justify-between border-b border-slate-200 pb-4 dark:border-slate-800">
              <div>
                <span className="text-xs font-extrabold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                  {activeGuide.deviceType}
                </span>
                <h2 id="active-guide-title" className="text-xl md:text-2xl font-black text-slate-900 dark:text-white mt-1">
                  {activeGuide.title[language] || activeGuide.title.vi}
                </h2>
              </div>
              <button
                onClick={handleCloseGuide}
                className="p-2 text-slate-400 hover:text-slate-700 dark:hover:text-white rounded-xl"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Step Content */}
            <div className="flex-1 overflow-y-auto py-6 space-y-4">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-800 font-extrabold text-sm dark:bg-blue-950 dark:text-blue-200">
                  Bước {activeStepIndex + 1} / {currentSteps.length}
                </span>

                <button
                  onClick={() =>
                    handleReadStep(
                      `Bước ${activeStepIndex + 1}: ${currentStep.title}. ${currentStep.description}. ${
                        currentStep.note || ''
                      }`
                    )
                  }
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200"
                >
                  {isSpeaking ? (
                    <>
                      <Square className="w-4 h-4 text-rose-500" />
                      <span>{t.assistant.stopSpeech}</span>
                    </>
                  ) : (
                    <>
                      <Volume2 className="w-4 h-4 text-blue-600" />
                      <span>{t.guides.readAloud}</span>
                    </>
                  )}
                </button>
              </div>

              <h3 className="text-lg md:text-xl font-extrabold text-slate-900 dark:text-white">
                {currentStep.title}
              </h3>

              <p className="text-base md:text-lg leading-relaxed text-slate-700 dark:text-slate-200">
                {currentStep.description}
              </p>

              {currentStep.note && (
                <div className="rounded-xl bg-amber-50 p-4 border border-amber-200 text-amber-900 text-sm leading-relaxed dark:bg-amber-950 dark:border-amber-900 dark:text-amber-200">
                  <strong className="font-bold">Lưu ý: </strong>
                  {currentStep.note}
                </div>
              )}

              <div className="text-xs text-slate-400 pt-2 flex items-center gap-1">
                <ExternalLink className="w-3.5 h-3.5" />
                <span>{t.guides.sourceLabel} {activeGuide.source}</span>
              </div>
            </div>

            {/* Step Navigation & AI Deep Link */}
            <div className="border-t border-slate-200 pt-4 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
              <div className="flex gap-2">
                <button
                  disabled={activeStepIndex === 0}
                  onClick={() => {
                    playActionSound('click');
                    setActiveStepIndex((prev) => Math.max(0, prev - 1));
                  }}
                  className="flex items-center gap-2 rounded-xl bg-slate-100 px-4 py-3 text-sm font-bold text-slate-700 hover:bg-slate-200 disabled:opacity-40 dark:bg-slate-800 dark:text-slate-200"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>{t.guides.stepPrev}</span>
                </button>

                <button
                  disabled={activeStepIndex === currentSteps.length - 1}
                  onClick={() => {
                    playActionSound('click');
                    setActiveStepIndex((prev) => Math.min(currentSteps.length - 1, prev + 1));
                  }}
                  className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-bold text-white hover:bg-blue-700 disabled:opacity-40"
                >
                  <span>{t.guides.stepNext}</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              {onOpenAssistantWithPrompt && (
                <button
                  onClick={() => {
                    handleCloseGuide();
                    onOpenAssistantWithPrompt(
                      `Hãy giải thích rõ hơn về bước: "${currentStep.title}" trong bài hướng dẫn "${activeGuide.title.vi}"`
                    );
                  }}
                  className="flex items-center gap-2 rounded-xl bg-indigo-50 border border-indigo-200 px-4 py-3 text-sm font-bold text-indigo-700 hover:bg-indigo-100 dark:bg-indigo-950 dark:border-indigo-800 dark:text-indigo-300"
                >
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  <span>{t.guides.askAIBtn}</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
