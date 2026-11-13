import React, { useState } from 'react';
import {
  Info,
  BookOpen,
  Target,
  FileText,
  Layers,
  Users,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  Cpu,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { useI18n } from '../locales';
import { useAccessibility } from '../context/AccessibilityContext';

export const AboutProjectPage: React.FC = () => {
  const { t } = useI18n();
  const { playActionSound } = useAccessibility();

  // Research Team & Advisor configurator
  const [authorName, setAuthorName] = useState(
    () => localStorage.getItem('easyaccess_authors') || t.about.authorDefault
  );
  const [advisorName, setAdvisorName] = useState(
    () => localStorage.getItem('easyaccess_advisor') || t.about.advisorDefault
  );
  const [isEditingTeam, setIsEditingTeam] = useState(false);
  const [teamSaved, setTeamSaved] = useState(false);

  const handleSaveTeam = (e: React.FormEvent) => {
    e.preventDefault();
    playActionSound('click');
    localStorage.setItem('easyaccess_authors', authorName);
    localStorage.setItem('easyaccess_advisor', advisorName);
    setIsEditingTeam(false);
    setTeamSaved(true);
    setTimeout(() => setTeamSaved(false), 2500);
  };

  const references = [
    {
      title: 'World Health Organization & UNICEF (2022)',
      name: 'Global report on assistive technology',
      url: 'https://www.who.int/publications/i/item/9789240049451',
    },
    {
      title: 'World Wide Web Consortium (W3C)',
      name: 'Web Content Accessibility Guidelines (WCAG) 2.2',
      url: 'https://www.w3.org/TR/WCAG22/',
    },
    {
      title: 'Arduino',
      name: 'Arduino Cloud Documentation',
      url: 'https://docs.arduino.cc/arduino-cloud/',
    },
    {
      title: 'National Institute of Standards and Technology (NIST, 2023)',
      name: 'Artificial Intelligence Risk Management Framework (AI RMF 1.0)',
      url: 'https://doi.org/10.6028/NIST.AI.100-1',
    },
    {
      title: 'World Wide Web Consortium (W3C)',
      name: 'Making the Web Accessible',
      url: 'https://www.w3.org/WAI/fundamentals/accessibility-intro/',
    },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-300">
      {/* Title */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-bold uppercase mb-2 dark:bg-blue-950 dark:text-blue-300">
          Đề tài nghiên cứu khoa học
        </div>
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 dark:text-white leading-tight">
          {t.about.title}
        </h1>
        <p className="mt-2 text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
          {t.about.subtitle}
        </p>
      </div>

      {/* 1. Lý do chọn đề tài */}
      <section className="rounded-3xl border-2 border-slate-200 bg-white p-6 md:p-8 shadow-sm dark:bg-slate-900 dark:border-slate-800 space-y-4">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <BookOpen className="w-6 h-6 text-blue-600" />
          <span>{t.about.sectionRationale}</span>
        </h2>
        <p className="text-sm md:text-base leading-relaxed text-slate-700 dark:text-slate-300">
          {t.about.rationaleContent}
        </p>
      </section>

      {/* 2. Mục tiêu nghiên cứu */}
      <section className="rounded-3xl border-2 border-slate-200 bg-white p-6 md:p-8 shadow-sm dark:bg-slate-900 dark:border-slate-800 space-y-4">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Target className="w-6 h-6 text-emerald-600" />
          <span>{t.about.sectionObjectives}</span>
        </h2>
        <ul className="space-y-3 text-sm md:text-base text-slate-700 dark:text-slate-300">
          <li className="flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <span>{t.about.obj1}</span>
          </li>
          <li className="flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <span>{t.about.obj2}</span>
          </li>
          <li className="flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <span>{t.about.obj3}</span>
          </li>
          <li className="flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <span>{t.about.obj4}</span>
          </li>
        </ul>
      </section>

      {/* 3. Cơ sở lý luận */}
      <section className="rounded-3xl border-2 border-slate-200 bg-white p-6 md:p-8 shadow-sm dark:bg-slate-900 dark:border-slate-800 space-y-4">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <FileText className="w-6 h-6 text-indigo-600" />
          <span>Cơ sở lý luận & Khung công nghệ</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs md:text-sm">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 dark:bg-slate-800 dark:border-slate-700">
            <h3 className="font-bold text-slate-900 dark:text-white">Công nghệ hỗ trợ (Assistive Tech)</h3>
            <p className="mt-1 text-slate-600 dark:text-slate-300">
              Công cụ giúp người khuyết tật duy trì hoặc cải thiện khả năng hoạt động độc lập trong đời sống.
            </p>
          </div>
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 dark:bg-slate-800 dark:border-slate-700">
            <h3 className="font-bold text-slate-900 dark:text-white">Khả năng tiếp cận Web (WCAG 2.2 AA)</h3>
            <p className="mt-1 text-slate-600 dark:text-slate-300">
              4 nguyên tắc then chốt: Có thể nhận biết, có thể vận hành, dễ hiểu và có tính vững chắc.
            </p>
          </div>
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 dark:bg-slate-800 dark:border-slate-700">
            <h3 className="font-bold text-slate-900 dark:text-white">Trí tuệ nhân tạo (Gemini AI)</h3>
            <p className="mt-1 text-slate-600 dark:text-slate-300">
              Thấu hiểu ngôn ngữ tự nhiên, chia nhỏ hướng dẫn thành các bước dễ thực hiện và gọi hàm nội bộ có kiểm soát.
            </p>
          </div>
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 dark:bg-slate-800 dark:border-slate-700">
            <h3 className="font-bold text-slate-900 dark:text-white">Internet vạn vật (IoT & MQTT)</h3>
            <p className="mt-1 text-slate-600 dark:text-slate-300">
              Kết nối và điều khiển rơ-le thiết bị điện qua mạng Wi-Fi/MQTT với cơ chế xác nhận an toàn tuyệt đối.
            </p>
          </div>
        </div>
      </section>

      {/* 4. Sơ đồ kiến trúc trực quan */}
      <section className="rounded-3xl border-2 border-slate-200 bg-white p-6 md:p-8 shadow-sm dark:bg-slate-900 dark:border-slate-800 space-y-4">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Layers className="w-6 h-6 text-blue-600" />
          <span>{t.about.sectionArchitecture}</span>
        </h2>
        <p className="text-xs text-slate-500">
          Sơ đồ luồng dữ liệu 7 giai đoạn khép kín được triển khai trong mã nguồn ứng dụng:
        </p>

        {/* Visual Architecture Flowchart */}
        <div className="py-4 overflow-x-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-3 min-w-[700px] text-center">
            {/* Step 1 */}
            <div className="flex-1 p-3.5 rounded-2xl bg-blue-50 border-2 border-blue-300 dark:bg-blue-950 dark:border-blue-800 shadow-xs">
              <span className="text-[11px] font-black text-blue-700 dark:text-blue-300 block mb-1">GIAI ĐOẠN 1</span>
              <p className="font-bold text-sm text-slate-900 dark:text-white">{t.about.archUser}</p>
            </div>

            <ArrowRight className="w-5 h-5 text-slate-400 shrink-0 hidden md:block" />

            {/* Step 2 */}
            <div className="flex-1 p-3.5 rounded-2xl bg-indigo-50 border-2 border-indigo-300 dark:bg-indigo-950 dark:border-indigo-800 shadow-xs">
              <span className="text-[11px] font-black text-indigo-700 dark:text-indigo-300 block mb-1">GIAI ĐOẠN 2</span>
              <p className="font-bold text-sm text-slate-900 dark:text-white">{t.about.archUI}</p>
            </div>

            <ArrowRight className="w-5 h-5 text-slate-400 shrink-0 hidden md:block" />

            {/* Step 3 */}
            <div className="flex-1 p-3.5 rounded-2xl bg-purple-50 border-2 border-purple-300 dark:bg-purple-950 dark:border-purple-800 shadow-xs">
              <span className="text-[11px] font-black text-purple-700 dark:text-purple-300 block mb-1">GIAI ĐOẠN 3</span>
              <p className="font-bold text-sm text-slate-900 dark:text-white">{t.about.archAI}</p>
            </div>

            <ArrowRight className="w-5 h-5 text-slate-400 shrink-0 hidden md:block" />

            {/* Step 4 */}
            <div className="flex-1 p-3.5 rounded-2xl bg-amber-50 border-2 border-amber-300 dark:bg-amber-950 dark:border-amber-800 shadow-xs">
              <span className="text-[11px] font-black text-amber-700 dark:text-amber-300 block mb-1">GIAI ĐOẠN 4</span>
              <p className="font-bold text-sm text-slate-900 dark:text-white">{t.about.archGate}</p>
            </div>

            <ArrowRight className="w-5 h-5 text-slate-400 shrink-0 hidden md:block" />

            {/* Step 5 */}
            <div className="flex-1 p-3.5 rounded-2xl bg-emerald-50 border-2 border-emerald-300 dark:bg-emerald-950 dark:border-emerald-800 shadow-xs">
              <span className="text-[11px] font-black text-emerald-700 dark:text-emerald-300 block mb-1">GIAI ĐOẠN 5</span>
              <p className="font-bold text-sm text-slate-900 dark:text-white">{t.about.archHardware}</p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Nhóm phát triển & Giảng viên hướng dẫn */}
      <section className="rounded-3xl border-2 border-slate-200 bg-white p-6 md:p-8 shadow-sm dark:bg-slate-900 dark:border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Users className="w-6 h-6 text-blue-600" />
            <span>{t.about.sectionTeam}</span>
          </h2>
          <button
            onClick={() => setIsEditingTeam(!isEditingTeam)}
            className="text-xs font-bold text-blue-600 hover:underline"
          >
            {isEditingTeam ? 'Đóng chỉnh sửa' : 'Cập nhật thông tin'}
          </button>
        </div>

        <p className="text-xs text-slate-500">
          {t.about.teamNote}
        </p>

        {isEditingTeam ? (
          <form onSubmit={handleSaveTeam} className="space-y-4 pt-2">
            <div>
              <label className="block text-sm font-bold text-slate-800 dark:text-slate-200 mb-1">
                {t.about.authorLabel}
              </label>
              <input
                type="text"
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                className="w-full h-12 rounded-xl border border-slate-300 px-4 text-sm dark:bg-slate-800 dark:border-slate-700 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-800 dark:text-slate-200 mb-1">
                {t.about.advisorLabel}
              </label>
              <input
                type="text"
                value={advisorName}
                onChange={(e) => setAdvisorName(e.target.value)}
                className="w-full h-12 rounded-xl border border-slate-300 px-4 text-sm dark:bg-slate-800 dark:border-slate-700 dark:text-white"
              />
            </div>

            <button
              type="submit"
              className="px-6 py-3 rounded-xl bg-blue-600 text-white font-bold text-sm hover:bg-blue-700"
            >
              Lưu thông tin báo cáo
            </button>
          </form>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 dark:bg-slate-800 dark:border-slate-700">
              <span className="text-xs font-bold text-slate-400 uppercase">
                {t.about.authorLabel}
              </span>
              <p className="text-base font-extrabold text-slate-900 dark:text-white mt-1">
                {authorName}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 dark:bg-slate-800 dark:border-slate-700">
              <span className="text-xs font-bold text-slate-400 uppercase">
                {t.about.advisorLabel}
              </span>
              <p className="text-base font-extrabold text-slate-900 dark:text-white mt-1">
                {advisorName}
              </p>
            </div>
          </div>
        )}

        {teamSaved && (
          <div className="text-xs text-emerald-600 font-bold">
            Đã lưu thông tin tác giả và giáo viên hướng dẫn thành công.
          </div>
        )}
      </section>

      {/* 6. Tài liệu tham khảo khoa học */}
      <section className="rounded-3xl border-2 border-slate-200 bg-white p-6 md:p-8 shadow-sm dark:bg-slate-900 dark:border-slate-800 space-y-4">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <BookOpen className="w-6 h-6 text-blue-600" />
          <span>{t.about.sectionReferences}</span>
        </h2>

        <div className="space-y-3">
          {references.map((ref, idx) => (
            <div
              key={idx}
              className="p-4 rounded-2xl bg-slate-50 border border-slate-200 dark:bg-slate-800 dark:border-slate-700 flex items-start justify-between gap-4"
            >
              <div>
                <p className="text-xs font-bold text-slate-500 uppercase">{ref.title}</p>
                <p className="text-sm font-extrabold text-slate-900 dark:text-white mt-0.5">
                  {ref.name}
                </p>
              </div>

              <a
                href={ref.url}
                target="_blank"
                rel="noopener noreferrer"
                className="shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white border border-slate-300 text-xs font-bold text-blue-600 hover:bg-blue-50 dark:bg-slate-700 dark:border-slate-600 dark:text-blue-300"
              >
                <span>Xem tài liệu</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
