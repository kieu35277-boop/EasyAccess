import React, { useState, useEffect } from 'react';
import {
  Settings,
  Globe,
  Smartphone,
  Server,
  Volume2,
  CheckCircle2,
  RefreshCw,
  Info,
} from 'lucide-react';
import { useI18n } from '../locales';
import { useAccessibility } from '../context/AccessibilityContext';
import { PWAInstallButton } from '../components/PWAInstallButton';
import { Language } from '../types';

export const SettingsPage: React.FC = () => {
  const { t, language, setLanguage } = useI18n();
  const { settings, updateSetting, playActionSound, speakText } = useAccessibility();

  const [serverHealth, setServerHealth] = useState<any>(null);
  const [checkingServer, setCheckingServer] = useState(false);

  const checkHealth = async () => {
    setCheckingServer(true);
    try {
      const res = await fetch('/api/health');
      if (res.ok) {
        const data = await res.json();
        setServerHealth(data);
      }
    } catch (e) {
      setServerHealth({ status: 'offline', error: 'Không thể kết nối máy chủ' });
    } finally {
      setCheckingServer(false);
    }
  };

  useEffect(() => {
    checkHealth();
  }, []);

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-300">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white flex items-center gap-3">
          <Settings className="w-8 h-8 text-blue-600 dark:text-blue-400" />
          <span>{t.nav.settings}</span>
        </h1>
        <p className="mt-1 text-sm sm:text-base text-slate-600 dark:text-slate-300">
          Cấu hình hệ thống, ngôn ngữ và trạng thái kết nối ứng dụng
        </p>
      </div>

      {/* Language */}
      <section className="rounded-3xl border-2 border-slate-200 bg-white p-6 md:p-8 shadow-xs dark:bg-slate-900 dark:border-slate-800 space-y-4">
        <div className="flex items-center gap-3">
          <Globe className="w-6 h-6 text-blue-600" />
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            {t.common.language}
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { code: 'vi', label: 'Tiếng Việt', note: 'Mặc định đề tài' },
            { code: 'en', label: 'English', note: 'International' },
            { code: 'zh', label: '简体中文', note: 'Simplified Chinese' },
          ].map((lang) => {
            const isSelected = language === lang.code;
            return (
              <button
                key={lang.code}
                onClick={() => {
                  playActionSound('click');
                  setLanguage(lang.code as Language);
                }}
                className={`p-4 rounded-2xl border-2 text-left font-bold transition flex items-center justify-between ${
                  isSelected
                    ? 'border-blue-600 bg-blue-50 text-blue-900 dark:bg-blue-950 dark:border-blue-400 dark:text-white shadow-xs'
                    : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-200'
                }`}
              >
                <div>
                  <div className="text-base">{lang.label}</div>
                  <div className="text-xs font-normal text-slate-500 dark:text-slate-400 mt-0.5">
                    {lang.note}
                  </div>
                </div>
                {isSelected && <CheckCircle2 className="w-5 h-5 text-blue-600 shrink-0" />}
              </button>
            );
          })}
        </div>
      </section>

      {/* PWA Application status */}
      <section className="rounded-3xl border-2 border-slate-200 bg-white p-6 md:p-8 shadow-xs dark:bg-slate-900 dark:border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Smartphone className="w-6 h-6 text-emerald-600" />
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Ứng dụng PWA (Progressive Web App)
            </h2>
          </div>
          <PWAInstallButton />
        </div>
        <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          EasyAccess được xây dựng chuẩn PWA có manifest và service worker tự động. Ứng dụng có thể cài đặt độc lập lên màn hình chính của điện thoại hoặc máy tính để bàn để mở nhanh và hỗ trợ bộ nhớ đệm khi ngoại tuyến.
        </p>
      </section>

      {/* Backend & AI status */}
      <section className="rounded-3xl border-2 border-slate-200 bg-white p-6 md:p-8 shadow-xs dark:bg-slate-900 dark:border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Server className="w-6 h-6 text-indigo-600" />
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Kiểm tra dịch vụ Backend & AI
            </h2>
          </div>
          <button
            onClick={() => {
              playActionSound('click');
              checkHealth();
            }}
            disabled={checkingServer}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 text-xs font-bold text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${checkingServer ? 'animate-spin' : ''}`} />
            <span>Kiểm tra lại</span>
          </button>
        </div>

        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs md:text-sm font-mono dark:bg-slate-800 dark:border-slate-700 space-y-1.5">
          <p>Trạng thái máy chủ: <span className="font-bold text-emerald-600">{serverHealth?.status || 'Đang kiểm tra...'}</span></p>
          <p>Khóa Gemini API (process.env): <span className="font-bold text-blue-600">{serverHealth?.hasApiKey ? 'Đã kích hoạt' : 'Chế độ dự phòng thông minh (Fallback Mode)'}</span></p>
          <p>Chế độ IoT: <span className="font-bold text-amber-600">{serverHealth?.iotMode || 'simulation'}</span></p>
        </div>
      </section>

      {/* Audio Test */}
      <section className="rounded-3xl border-2 border-slate-200 bg-white p-6 md:p-8 shadow-xs dark:bg-slate-900 dark:border-slate-800 space-y-4">
        <div className="flex items-center gap-3">
          <Volume2 className="w-6 h-6 text-blue-600" />
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            Thử nghiệm âm thanh giọng nói (TTS)
          </h2>
        </div>
        <p className="text-sm text-slate-600 dark:text-slate-300">
          Nhấn nút bên dưới để kiểm tra bộ đọc giọng nói trên thiết bị của bạn:
        </p>
        <button
          onClick={() => {
            playActionSound('click');
            speakText('Xin chào! Đây là âm thanh kiểm tra bộ đọc giọng nói của EasyAccess.');
          }}
          className="px-5 py-3 rounded-xl bg-blue-600 text-white font-bold text-sm hover:bg-blue-700 active:scale-95 transition"
        >
          Phát giọng đọc thử nghiệm
        </button>
      </section>
    </div>
  );
};
