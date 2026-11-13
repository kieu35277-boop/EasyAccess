import React, { useState } from 'react';
import {
  ShieldCheck,
  Lock,
  Mic,
  Database,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  EyeOff,
  Server,
} from 'lucide-react';
import { useI18n } from '../locales';
import { useAccessibility } from '../context/AccessibilityContext';

export const PrivacyPage: React.FC = () => {
  const { t } = useI18n();
  const { playActionSound, resetDefaults } = useAccessibility();
  const [clearedNotice, setClearedNotice] = useState(false);

  const handleWipeData = () => {
    if (confirm(t.privacy.wipeDataConfirm)) {
      playActionSound('click');
      try {
        localStorage.clear();
        resetDefaults();
        setClearedNotice(true);
        setTimeout(() => setClearedNotice(false), 3000);
      } catch (e) {
        // ignore
      }
    }
  };

  const securityPolicies = [
    {
      title: t.privacy.rule1Title,
      desc: t.privacy.rule1Desc,
      icon: Database,
    },
    {
      title: t.privacy.rule2Title,
      desc: t.privacy.rule2Desc,
      icon: Mic,
    },
    {
      title: t.privacy.rule3Title,
      desc: t.privacy.rule3Desc,
      icon: Lock,
    },
    {
      title: t.privacy.rule4Title,
      desc: t.privacy.rule4Desc,
      icon: EyeOff,
    },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-300">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white flex items-center gap-3">
          <ShieldCheck className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
          <span>{t.privacy.title}</span>
        </h1>
        <p className="mt-1 text-sm sm:text-base text-slate-600 dark:text-slate-300">
          {t.privacy.subtitle}
        </p>
      </div>

      {clearedNotice && (
        <div className="flex items-center gap-2 p-4 rounded-2xl bg-emerald-100 border border-emerald-300 text-emerald-900 font-bold text-sm">
          <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          <span>Đã xóa toàn bộ dữ liệu lưu trữ trên trình duyệt của máy này.</span>
        </div>
      )}

      {/* Security Policies Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {securityPolicies.map((p, idx) => {
          const Icon = p.icon;
          return (
            <div
              key={idx}
              className="rounded-3xl border-2 border-slate-200 bg-white p-6 shadow-xs dark:bg-slate-900 dark:border-slate-800 flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 flex items-center justify-center mb-4">
                  <Icon className="w-6 h-6" />
                </div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                  {p.title}
                </h2>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  {p.desc}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Server-Side Credentials Shielding */}
      <section className="rounded-3xl border-2 border-blue-200 bg-blue-50/60 p-6 md:p-8 dark:bg-slate-900 dark:border-slate-800 space-y-3">
        <div className="flex items-center gap-3">
          <Server className="w-6 h-6 text-blue-600" />
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            Bảo mật thông tin xác thực & Không lộ khóa bí mật
          </h2>
        </div>
        <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          Hệ thống tuân thủ nghiêm ngặt kiến trúc bảo mật: Không bao giờ nhúng Gemini API Key hoặc mật khẩu thiết bị IoT vào mã nguồn frontend. Tất cả yêu cầu AI và gửi lệnh phần cứng đều được ủy quyền xử lý an toàn thông qua máy chủ Node.js backend.
        </p>
      </section>

      {/* Data Wipe Danger Zone */}
      <section className="rounded-3xl border-2 border-rose-200 bg-rose-50/60 p-6 md:p-8 dark:bg-slate-900 dark:border-rose-900 space-y-4">
        <div>
          <h2 className="text-lg font-bold text-rose-900 dark:text-rose-200 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-rose-600" />
            <span>Quyền kiểm soát dữ liệu cá nhân (GDPR & WCAG Compliant)</span>
          </h2>
          <p className="mt-1 text-sm text-rose-800/80 dark:text-rose-300 leading-relaxed">
            Bạn có quyền xóa toàn bộ cài đặt trợ năng, lịch sử câu hỏi và số liệu đánh giá đã lưu trên trình duyệt bất cứ lúc nào.
          </p>
        </div>

        <button
          onClick={handleWipeData}
          className="flex items-center gap-2.5 px-6 py-3.5 rounded-2xl bg-rose-600 text-white font-bold text-sm md:text-base hover:bg-rose-700 active:scale-95 transition shadow-sm"
        >
          <Trash2 className="w-5 h-5" />
          <span>{t.privacy.wipeDataBtn}</span>
        </button>
      </section>
    </div>
  );
};
