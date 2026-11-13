import React, { useState } from 'react';
import {
  Sliders,
  Type,
  Sun,
  Moon,
  Sparkles,
  Volume2,
  VolumeX,
  Clock,
  RotateCcw,
  Tag,
  CheckCircle2,
  MousePointerClick,
  Maximize2,
} from 'lucide-react';
import { useI18n } from '../locales';
import { useAccessibility } from '../context/AccessibilityContext';
import { FontSize, ButtonSize, ButtonGap } from '../types';

export const AccessibilityPage: React.FC = () => {
  const { t } = useI18n();
  const { settings, updateSetting, resetDefaults, playActionSound } = useAccessibility();
  const [resetAlert, setResetAlert] = useState(false);

  const fontOptions: { id: FontSize; label: string; desc: string }[] = [
    { id: 'normal', label: t.accessibility.sizeNormal, desc: '16px' },
    { id: 'large', label: t.accessibility.sizeLarge, desc: '18px (Khuyên dùng)' },
    { id: 'xlarge', label: t.accessibility.sizeXLarge, desc: '20px' },
    { id: 'huge', label: t.accessibility.sizeHuge, desc: '22px (Dành cho mắt yếu)' },
  ];

  const buttonSizeOptions: { id: ButtonSize; label: string }[] = [
    { id: 'normal', label: t.accessibility.btnNormal },
    { id: 'large', label: t.accessibility.btnLarge },
    { id: 'huge', label: t.accessibility.btnHuge },
  ];

  const buttonGapOptions: { id: ButtonGap; label: string }[] = [
    { id: 'normal', label: t.accessibility.gapNormal },
    { id: 'relaxed', label: t.accessibility.gapRelaxed },
    { id: 'wide', label: t.accessibility.gapWide },
  ];

  const handleReset = () => {
    resetDefaults();
    setResetAlert(true);
    setTimeout(() => setResetAlert(false), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-300">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white flex items-center gap-3">
          <Sliders className="w-8 h-8 text-blue-600 dark:text-blue-400" />
          <span>{t.accessibility.title}</span>
        </h1>
        <p className="mt-2 text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
          {t.accessibility.subtitle}
        </p>
      </div>

      {resetAlert && (
        <div className="flex items-center gap-2 p-4 rounded-2xl bg-emerald-100 border border-emerald-300 text-emerald-900 font-bold text-sm">
          <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          <span>{t.accessibility.resetNotice}</span>
        </div>
      )}

      {/* 1. Kích thước chữ */}
      <section className="rounded-3xl border-2 border-slate-200 bg-white p-6 md:p-8 shadow-sm dark:bg-slate-900 dark:border-slate-800 space-y-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-blue-100 text-blue-700 rounded-2xl dark:bg-blue-950 dark:text-blue-300">
            <Type className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg md:text-xl font-bold text-slate-900 dark:text-white">
              {t.accessibility.fontSizeTitle}
            </h2>
            <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400">
              {t.accessibility.fontSizeDesc}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          {fontOptions.map((opt) => {
            const isSelected = settings.fontSize === opt.id;
            return (
              <button
                key={opt.id}
                onClick={() => updateSetting('fontSize', opt.id)}
                className={`p-4 rounded-2xl text-left border-2 font-bold transition flex items-center justify-between ${
                  isSelected
                    ? 'border-blue-600 bg-blue-50 text-blue-900 dark:bg-blue-950 dark:border-blue-400 dark:text-blue-100 shadow-xs'
                    : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-200'
                }`}
              >
                <div>
                  <div className="text-base">{opt.label}</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 font-normal mt-0.5">
                    {opt.desc}
                  </div>
                </div>
                {isSelected && <CheckCircle2 className="w-6 h-6 text-blue-600 dark:text-blue-400 shrink-0" />}
              </button>
            );
          })}
        </div>
      </section>

      {/* 2. Độ tương phản cao & Chế độ nền */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Contrast */}
        <div className="rounded-3xl border-2 border-slate-200 bg-white p-6 shadow-sm dark:bg-slate-900 dark:border-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="p-3 bg-amber-100 text-amber-800 rounded-2xl dark:bg-amber-950 dark:text-amber-300">
                <Sliders className="w-6 h-6" />
              </div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                {t.accessibility.contrastTitle}
              </h2>
            </div>
            <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              {t.accessibility.contrastDesc}
            </p>
          </div>

          <button
            onClick={() => updateSetting('highContrast', !settings.highContrast)}
            className={`mt-6 w-full min-h-[52px] rounded-2xl font-extrabold text-sm md:text-base border-2 transition ${
              settings.highContrast
                ? 'bg-amber-400 text-black border-black shadow-md'
                : 'bg-slate-100 text-slate-800 border-slate-300 hover:bg-slate-200 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-200'
            }`}
          >
            {settings.highContrast
              ? t.accessibility.disableContrast
              : t.accessibility.enableContrast}
          </button>
        </div>

        {/* Theme Light / Dark */}
        <div className="rounded-3xl border-2 border-slate-200 bg-white p-6 shadow-sm dark:bg-slate-900 dark:border-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="p-3 bg-indigo-100 text-indigo-700 rounded-2xl dark:bg-indigo-950 dark:text-indigo-300">
                {settings.darkMode ? <Moon className="w-6 h-6" /> : <Sun className="w-6 h-6" />}
              </div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                {t.accessibility.themeTitle}
              </h2>
            </div>
            <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              Chuyển đổi giao diện nền sáng dịu ban ngày hoặc nền tối chống mỏi mắt.
            </p>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3">
            <button
              onClick={() => updateSetting('darkMode', false)}
              className={`min-h-[52px] rounded-2xl font-bold text-sm border-2 transition flex items-center justify-center gap-2 ${
                !settings.darkMode
                  ? 'border-blue-600 bg-blue-50 text-blue-900 dark:bg-blue-950 dark:text-white shadow-xs'
                  : 'border-slate-200 bg-white text-slate-700 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-200'
              }`}
            >
              <Sun className="w-4 h-4 text-amber-500" />
              <span>Nền sáng</span>
            </button>

            <button
              onClick={() => updateSetting('darkMode', true)}
              className={`min-h-[52px] rounded-2xl font-bold text-sm border-2 transition flex items-center justify-center gap-2 ${
                settings.darkMode
                  ? 'border-blue-500 bg-blue-900 text-white shadow-xs'
                  : 'border-slate-200 bg-white text-slate-700 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-200'
              }`}
            >
              <Moon className="w-4 h-4 text-blue-400" />
              <span>Nền tối</span>
            </button>
          </div>
        </div>
      </section>

      {/* 3. Kích thước nút bấm & Giãn khoảng cách */}
      <section className="rounded-3xl border-2 border-slate-200 bg-white p-6 md:p-8 shadow-sm dark:bg-slate-900 dark:border-slate-800 space-y-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 bg-emerald-100 text-emerald-700 rounded-2xl dark:bg-emerald-950 dark:text-emerald-300">
              <MousePointerClick className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg md:text-xl font-bold text-slate-900 dark:text-white">
                {t.accessibility.buttonSizeTitle}
              </h2>
              <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400">
                {t.accessibility.buttonSizeDesc}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3">
            {buttonSizeOptions.map((opt) => (
              <button
                key={opt.id}
                onClick={() => updateSetting('buttonSize', opt.id)}
                className={`p-4 rounded-2xl border-2 font-bold text-sm md:text-base transition text-center ${
                  settings.buttonSize === opt.id
                    ? 'border-emerald-600 bg-emerald-50 text-emerald-900 dark:bg-emerald-950 dark:border-emerald-400 dark:text-white shadow-xs'
                    : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-200'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
          <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">
            {t.accessibility.buttonGapTitle}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">
            {t.accessibility.buttonGapDesc}
          </p>

          <div className="grid grid-cols-3 gap-3">
            {buttonGapOptions.map((opt) => (
              <button
                key={opt.id}
                onClick={() => updateSetting('buttonGap', opt.id)}
                className={`py-3 px-2 rounded-xl border-2 font-bold text-xs md:text-sm text-center transition ${
                  settings.buttonGap === opt.id
                    ? 'border-blue-600 bg-blue-50 text-blue-900 dark:bg-blue-950 dark:border-blue-400 dark:text-white'
                    : 'border-slate-200 bg-white text-slate-700 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-200'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Chuyển động, Âm thanh & Nhãn biểu tượng */}
      <section className="rounded-3xl border-2 border-slate-200 bg-white p-6 md:p-8 shadow-sm dark:bg-slate-900 dark:border-slate-800 space-y-4">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
          Các tùy biến hỗ trợ nâng cao (WCAG 2.2)
        </h2>

        {/* Giảm chuyển động */}
        <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-200 dark:bg-slate-800 dark:border-slate-700">
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-sm md:text-base">
              {t.accessibility.motionTitle}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {t.accessibility.motionDesc}
            </p>
          </div>
          <button
            onClick={() => updateSetting('reduceMotion', !settings.reduceMotion)}
            className={`w-14 h-8 rounded-full transition relative shrink-0 ${
              settings.reduceMotion ? 'bg-blue-600' : 'bg-slate-300 dark:bg-slate-700'
            }`}
          >
            <span
              className={`absolute top-1 left-1 bg-white w-6 h-6 rounded-full transition-transform ${
                settings.reduceMotion ? 'translate-x-6' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        {/* Âm thanh phản hồi */}
        <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-200 dark:bg-slate-800 dark:border-slate-700">
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-sm md:text-base">
              {t.accessibility.soundTitle}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {t.accessibility.soundDesc}
            </p>
          </div>
          <button
            onClick={() => updateSetting('soundFeedback', !settings.soundFeedback)}
            className={`w-14 h-8 rounded-full transition relative shrink-0 ${
              settings.soundFeedback ? 'bg-emerald-600' : 'bg-slate-300 dark:bg-slate-700'
            }`}
          >
            <span
              className={`absolute top-1 left-1 bg-white w-6 h-6 rounded-full transition-transform ${
                settings.soundFeedback ? 'translate-x-6' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        {/* Đọc nội dung tự động */}
        <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-200 dark:bg-slate-800 dark:border-slate-700">
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-sm md:text-base">
              {t.accessibility.ttsTitle}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {t.accessibility.ttsDesc}
            </p>
          </div>
          <button
            onClick={() => updateSetting('readOutLoud', !settings.readOutLoud)}
            className={`w-14 h-8 rounded-full transition relative shrink-0 ${
              settings.readOutLoud ? 'bg-indigo-600' : 'bg-slate-300 dark:bg-slate-700'
            }`}
          >
            <span
              className={`absolute top-1 left-1 bg-white w-6 h-6 rounded-full transition-transform ${
                settings.readOutLoud ? 'translate-x-6' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        {/* Nhãn biểu tượng */}
        <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-200 dark:bg-slate-800 dark:border-slate-700">
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-sm md:text-base">
              {t.accessibility.iconLabelsTitle}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {t.accessibility.iconLabelsDesc}
            </p>
          </div>
          <button
            onClick={() => updateSetting('showIconLabels', !settings.showIconLabels)}
            className={`w-14 h-8 rounded-full transition relative shrink-0 ${
              settings.showIconLabels ? 'bg-blue-600' : 'bg-slate-300 dark:bg-slate-700'
            }`}
          >
            <span
              className={`absolute top-1 left-1 bg-white w-6 h-6 rounded-full transition-transform ${
                settings.showIconLabels ? 'translate-x-6' : 'translate-x-0'
              }`}
            />
          </button>
        </div>
      </section>

      {/* 5. Đặt lại cấu hình mặc định */}
      <div className="pt-2 flex justify-end">
        <button
          onClick={handleReset}
          className="flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-sm md:text-base border border-slate-300 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-200 active:scale-95 transition"
        >
          <RotateCcw className="w-5 h-5 text-rose-600" />
          <span>{t.accessibility.resetDefaults}</span>
        </button>
      </div>
    </div>
  );
};
