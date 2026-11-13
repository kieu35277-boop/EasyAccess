import React, { useState, useEffect } from 'react';
import {
  BarChart3,
  Clock,
  CheckCircle,
  AlertTriangle,
  Play,
  RotateCcw,
  Download,
  FileSpreadsheet,
  PlusCircle,
  Star,
  Users,
  ShieldAlert,
} from 'lucide-react';
import { useI18n } from '../locales';
import { useAccessibility } from '../context/AccessibilityContext';
import { EvaluationTask, EvaluationSurvey, EvaluationMetrics } from '../types';

export const EvaluationPage: React.FC = () => {
  const { t } = useI18n();
  const { playActionSound } = useAccessibility();

  const [tasks, setTasks] = useState<EvaluationTask[]>([]);
  const [surveys, setSurveys] = useState<EvaluationSurvey[]>([]);
  const [metrics, setMetrics] = useState<EvaluationMetrics>({
    totalTasks: 0,
    completedTasks: 0,
    completionRate: 0,
    avgDuration: 0,
    totalErrors: 0,
    totalCommands: 0,
    confirmedCommands: 0,
    iotReliability: 100,
  });

  const [activeTab, setActiveTab] = useState<'metrics' | 'record_task' | 'record_survey'>('metrics');

  // Form for recording task
  const [participantId, setParticipantId] = useState('P01');
  const [selectedTaskNumber, setSelectedTaskNumber] = useState('1');
  const [taskDuration, setTaskDuration] = useState('45');
  const [errorCount, setErrorCount] = useState('0');
  const [taskCompleted, setTaskCompleted] = useState(true);
  const [taskNotes, setTaskNotes] = useState('');
  const [recordSuccess, setRecordSuccess] = useState(false);

  // Form for survey
  const [surveyParticipantId, setSurveyParticipantId] = useState('P01');
  const [participantType, setParticipantType] = useState<EvaluationSurvey['participantType']>('limb_impaired');
  const [q1, setQ1] = useState(5);
  const [q2, setQ2] = useState(5);
  const [q3, setQ3] = useState(5);
  const [q4, setQ4] = useState(5);
  const [q5Difficulties, setQ5Difficulties] = useState('');
  const [q6Suggestions, setQ6Suggestions] = useState('');
  const [q7Consent, setQ7Consent] = useState(true);
  const [surveySuccess, setSurveySuccess] = useState(false);

  const standardTaskNames: Record<string, string> = {
    '1': 'Tìm một hướng dẫn trong thư viện',
    '2': 'Phóng to chữ hoặc đổi tương phản cao trong Trung tâm trợ năng',
    '3': 'Yêu cầu EasyAssist giải thích một bước bằng giọng nói',
    '4': 'Nghe đọc nội dung bằng giọng nói (TTS)',
    '5': 'Gửi lệnh Bật/Tắt thiết bị IoT qua bước xác nhận 2 bước',
    '6': 'Nhận biết và xử lý thông báo khi mất kết nối mạng',
  };

  const loadData = async () => {
    try {
      const res = await fetch('/api/evaluation/data');
      if (res.ok) {
        const data = await res.json();
        setTasks(data.tasks || []);
        setSurveys(data.surveys || []);
        if (data.metrics) setMetrics(data.metrics);
      }
    } catch (e) {
      // ignore
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSaveTask = async (e: React.FormEvent) => {
    e.preventDefault();
    playActionSound('click');

    const res = await fetch('/api/evaluation/record-task', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        taskId: `task_${selectedTaskNumber}`,
        taskName: standardTaskNames[selectedTaskNumber],
        participantId,
        completed: taskCompleted,
        durationSeconds: parseInt(taskDuration, 10) || 0,
        errorCount: parseInt(errorCount, 10) || 0,
        notes: taskNotes,
      }),
    });

    if (res.ok) {
      playActionSound('success');
      setRecordSuccess(true);
      await loadData();
      setTimeout(() => setRecordSuccess(false), 2500);
      setTaskNotes('');
    }
  };

  const handleSaveSurvey = async (e: React.FormEvent) => {
    e.preventDefault();
    playActionSound('click');

    const res = await fetch('/api/evaluation/record-survey', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        participantId: surveyParticipantId,
        participantType,
        q1_foundGuideEasily: q1,
        q2_typographyAndNavigationEasy: q2,
        q3_easyAssistHelpful: q3,
        q4_iotStatusUnderstood: q4,
        q5_difficultiesEncountered: q5Difficulties,
        q6_suggestedImprovements: q6Suggestions,
        q7_agreedToContinue: q7Consent,
      }),
    });

    if (res.ok) {
      playActionSound('success');
      setSurveySuccess(true);
      await loadData();
      setTimeout(() => setSurveySuccess(false), 2500);
      setQ5Difficulties('');
      setQ6Suggestions('');
    }
  };

  const handleResetData = async () => {
    if (confirm('Bạn có chắc chắn muốn thiết lập lại toàn bộ dữ liệu kiểm thử?')) {
      playActionSound('click');
      await fetch('/api/evaluation/reset', { method: 'POST' });
      await loadData();
    }
  };

  const exportJSON = () => {
    playActionSound('click');
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify({ tasks, surveys, metrics }, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `easyaccess_evaluation_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-in fade-in duration-300">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white flex items-center gap-3">
          <BarChart3 className="w-8 h-8 text-blue-600 dark:text-blue-400" />
          <span>{t.evaluation.title}</span>
        </h1>
        <p className="mt-1 text-sm sm:text-base text-slate-600 dark:text-slate-300">
          {t.evaluation.subtitle}
        </p>
      </div>

      {/* Scientific Integrity Disclaimer */}
      <div className="rounded-2xl bg-amber-50 border-2 border-amber-300 p-4 md:p-5 text-amber-950 dark:bg-amber-950/40 dark:border-amber-700 dark:text-amber-100 flex items-start gap-3 text-xs md:text-sm leading-relaxed">
        <ShieldAlert className="w-6 h-6 text-amber-600 shrink-0 mt-0.5" />
        <div>
          <strong className="font-extrabold block text-sm">
            Nguyên tắc trung thực trong báo cáo khoa học (Scientific Honesty):
          </strong>
          <span>
            {t.evaluation.disclaimerBanner}
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
        <button
          onClick={() => {
            playActionSound('click');
            setActiveTab('metrics');
          }}
          className={`px-5 py-3 rounded-2xl font-bold text-sm md:text-base transition ${
            activeTab === 'metrics'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
          }`}
        >
          Số liệu & Chỉ số ({tasks.length} nhiệm vụ)
        </button>

        <button
          onClick={() => {
            playActionSound('click');
            setActiveTab('record_task');
          }}
          className={`px-5 py-3 rounded-2xl font-bold text-sm md:text-base transition ${
            activeTab === 'record_task'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
          }`}
        >
          Nhập kết quả nhiệm vụ
        </button>

        <button
          onClick={() => {
            playActionSound('click');
            setActiveTab('record_survey');
          }}
          className={`px-5 py-3 rounded-2xl font-bold text-sm md:text-base transition ${
            activeTab === 'record_survey'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
          }`}
        >
          Phiếu khảo sát SUS ({surveys.length})
        </button>
      </div>

      {/* TAB 1: METRICS & TABLES */}
      {activeTab === 'metrics' && (
        <div className="space-y-6">
          {/* 4 KPIs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="rounded-2xl border-2 border-slate-200 bg-white p-5 shadow-xs dark:bg-slate-900 dark:border-slate-800">
              <span className="text-xs font-bold text-slate-500 uppercase">
                {t.evaluation.kpiCompletionRate}
              </span>
              <div className="text-3xl font-black text-blue-600 mt-2">
                {tasks.length > 0 ? `${metrics.completionRate}%` : 'Chưa có'}
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Công thức: Số hoàn thành / Tổng số × 100%
              </p>
            </div>

            <div className="rounded-2xl border-2 border-slate-200 bg-white p-5 shadow-xs dark:bg-slate-900 dark:border-slate-800">
              <span className="text-xs font-bold text-slate-500 uppercase">
                {t.evaluation.kpiAvgTime}
              </span>
              <div className="text-3xl font-black text-indigo-600 mt-2">
                {tasks.length > 0 ? `${metrics.avgDuration}s` : 'Chưa có'}
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Thời gian trung bình mỗi tác vụ
              </p>
            </div>

            <div className="rounded-2xl border-2 border-slate-200 bg-white p-5 shadow-xs dark:bg-slate-900 dark:border-slate-800">
              <span className="text-xs font-bold text-slate-500 uppercase">
                {t.evaluation.kpiErrorCount}
              </span>
              <div className="text-3xl font-black text-rose-600 mt-2">
                {tasks.length > 0 ? `${metrics.totalErrors}` : '0'}
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Lỗi thao tác nhầm hoặc bấm trượt
              </p>
            </div>

            <div className="rounded-2xl border-2 border-slate-200 bg-white p-5 shadow-xs dark:bg-slate-900 dark:border-slate-800">
              <span className="text-xs font-bold text-slate-500 uppercase">
                {t.evaluation.kpiIoTReliability}
              </span>
              <div className="text-3xl font-black text-emerald-600 mt-2">
                {`${metrics.iotReliability}%`}
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Tỷ lệ lệnh IoT nhận xác nhận ACK
              </p>
            </div>
          </div>

          {/* Export & Reset Actions */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl bg-slate-100 dark:bg-slate-800">
            <div className="flex gap-2">
              <button
                onClick={exportJSON}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-slate-300 font-bold text-xs md:text-sm text-slate-800 hover:bg-slate-50 shadow-xs dark:bg-slate-700 dark:border-slate-600 dark:text-white"
              >
                <Download className="w-4 h-4 text-blue-600" />
                <span>{t.evaluation.exportData}</span>
              </button>
            </div>

            <button
              onClick={handleResetData}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-rose-50 border border-rose-200 font-bold text-xs md:text-sm text-rose-700 hover:bg-rose-100 dark:bg-rose-950 dark:border-rose-800 dark:text-rose-200"
            >
              <RotateCcw className="w-4 h-4" />
              <span>{t.evaluation.resetData}</span>
            </button>
          </div>

          {/* Tasks Table */}
          <div className="rounded-2xl border-2 border-slate-200 bg-white overflow-hidden shadow-xs dark:bg-slate-900 dark:border-slate-800">
            <div className="p-4 bg-slate-50 border-b border-slate-200 dark:bg-slate-800 dark:border-slate-700">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Bảng kết quả thử nghiệm tác vụ người dùng
              </h3>
            </div>

            {tasks.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs md:text-sm">
                  <thead className="bg-slate-100 text-slate-700 uppercase dark:bg-slate-800 dark:text-slate-300">
                    <tr>
                      <th className="p-3">Mã NTG</th>
                      <th className="p-3">Tác vụ</th>
                      <th className="p-3">Kết quả</th>
                      <th className="p-3">Thời gian</th>
                      <th className="p-3">Lỗi thao tác</th>
                      <th className="p-3">Ghi chú</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                    {tasks.map((task) => (
                      <tr key={task.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                        <td className="p-3 font-bold text-slate-900 dark:text-white">
                          {task.participantId}
                        </td>
                        <td className="p-3">{task.taskName}</td>
                        <td className="p-3">
                          {task.completed ? (
                            <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold">
                              Thành công
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded bg-rose-100 text-rose-800 font-bold">
                              Chưa đạt
                            </span>
                          )}
                        </td>
                        <td className="p-3 font-mono">{task.durationSeconds}s</td>
                        <td className="p-3 font-mono text-rose-600 font-bold">{task.errorCount}</td>
                        <td className="p-3 text-slate-500 max-w-xs truncate">{task.notes || '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="p-8 text-center text-slate-400">
                <p className="font-semibold text-base">{t.evaluation.noDataYet}</p>
                <p className="text-xs text-slate-500 mt-1">
                  Chọn tab "Nhập kết quả nhiệm vụ" để ghi nhận dữ liệu thực nghiệm.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: RECORD TASK FORM */}
      {activeTab === 'record_task' && (
        <div className="rounded-3xl border-2 border-slate-200 bg-white p-6 md:p-8 shadow-sm dark:bg-slate-900 dark:border-slate-800 max-w-2xl space-y-5">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            {t.evaluation.recordTaskBtn}
          </h2>

          <form onSubmit={handleSaveTask} className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-slate-800 dark:text-slate-200 mb-1">
                {t.evaluation.participantId}
              </label>
              <input
                type="text"
                value={participantId}
                onChange={(e) => setParticipantId(e.target.value)}
                placeholder="P01, P02..."
                className="w-full h-12 rounded-xl border border-slate-300 px-4 text-sm dark:bg-slate-800 dark:border-slate-700 dark:text-white"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-800 dark:text-slate-200 mb-1">
                Chọn nhiệm vụ kiểm thử:
              </label>
              <select
                value={selectedTaskNumber}
                onChange={(e) => setSelectedTaskNumber(e.target.value)}
                className="w-full h-12 rounded-xl border border-slate-300 px-4 text-sm dark:bg-slate-800 dark:border-slate-700 dark:text-white"
              >
                {Object.entries(standardTaskNames).map(([key, name]) => (
                  <option key={key} value={key}>
                    Nhiệm vụ {key}: {name}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-slate-800 dark:text-slate-200 mb-1">
                  {t.evaluation.taskDuration}
                </label>
                <input
                  type="number"
                  value={taskDuration}
                  onChange={(e) => setTaskDuration(e.target.value)}
                  className="w-full h-12 rounded-xl border border-slate-300 px-4 text-sm dark:bg-slate-800 dark:border-slate-700 dark:text-white"
                  min="1"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-800 dark:text-slate-200 mb-1">
                  {t.evaluation.errorsRecorded}
                </label>
                <input
                  type="number"
                  value={errorCount}
                  onChange={(e) => setErrorCount(e.target.value)}
                  className="w-full h-12 rounded-xl border border-slate-300 px-4 text-sm dark:bg-slate-800 dark:border-slate-700 dark:text-white"
                  min="0"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-800 dark:text-slate-200 mb-2">
                {t.evaluation.taskCompletedQuestion}
              </label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer font-semibold text-sm">
                  <input
                    type="radio"
                    name="completed"
                    checked={taskCompleted}
                    onChange={() => setTaskCompleted(true)}
                    className="w-4 h-4 text-blue-600"
                  />
                  <span>Hoàn thành độc lập</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer font-semibold text-sm">
                  <input
                    type="radio"
                    name="completed"
                    checked={!taskCompleted}
                    onChange={() => setTaskCompleted(false)}
                    className="w-4 h-4 text-blue-600"
                  />
                  <span>Chưa hoàn thành</span>
                </label>
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-800 dark:text-slate-200 mb-1">
                {t.evaluation.taskNotes}
              </label>
              <textarea
                value={taskNotes}
                onChange={(e) => setTaskNotes(e.target.value)}
                placeholder="Ghi nhận phản xạ, khó khăn khi bấm nút hoặc tương tác giọng nói..."
                className="w-full h-24 rounded-xl border border-slate-300 p-3 text-sm dark:bg-slate-800 dark:border-slate-700 dark:text-white"
              />
            </div>

            <button
              type="submit"
              className="w-full py-4 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700 active:scale-95 transition"
            >
              {t.evaluation.saveTaskResult}
            </button>

            {recordSuccess && (
              <div className="p-3 bg-emerald-100 text-emerald-800 rounded-xl text-center font-bold text-sm">
                Đã ghi nhận kết quả nhiệm vụ vào cơ sở dữ liệu nghiên cứu!
              </div>
            )}
          </form>
        </div>
      )}

      {/* TAB 3: SUS SURVEY FORM */}
      {activeTab === 'record_survey' && (
        <div className="rounded-3xl border-2 border-slate-200 bg-white p-6 md:p-8 shadow-sm dark:bg-slate-900 dark:border-slate-800 max-w-3xl space-y-6">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            {t.evaluation.surveyTitle}
          </h2>

          <form onSubmit={handleSaveSurvey} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-slate-800 dark:text-slate-200 mb-1">
                  Mã số người tham gia:
                </label>
                <input
                  type="text"
                  value={surveyParticipantId}
                  onChange={(e) => setSurveyParticipantId(e.target.value)}
                  className="w-full h-12 rounded-xl border border-slate-300 px-4 text-sm dark:bg-slate-800 dark:border-slate-700 dark:text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-800 dark:text-slate-200 mb-1">
                  Đối tượng tham gia:
                </label>
                <select
                  value={participantType}
                  onChange={(e) => setParticipantType(e.target.value as any)}
                  className="w-full h-12 rounded-xl border border-slate-300 px-4 text-sm dark:bg-slate-800 dark:border-slate-700 dark:text-white"
                >
                  <option value="limb_impaired">Người khuyết tật chi trên / run tay</option>
                  <option value="caregiver">Người chăm sóc / Thân nhân</option>
                  <option value="researcher">Nghiên cứu viên / Chuyên gia Trợ năng</option>
                  <option value="student">Sinh viên tham gia thử nghiệm nội bộ</option>
                </select>
              </div>
            </div>

            {/* Q1 */}
            <div>
              <label className="block text-sm font-bold text-slate-800 dark:text-slate-200 mb-2">
                {t.evaluation.surveyQ1}
              </label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    type="button"
                    key={star}
                    onClick={() => setQ1(star)}
                    className={`w-12 h-12 rounded-xl font-bold text-sm border-2 ${
                      q1 >= star
                        ? 'bg-amber-400 text-black border-amber-500'
                        : 'bg-slate-100 text-slate-400 border-slate-200 dark:bg-slate-800'
                    }`}
                  >
                    {star} ★
                  </button>
                ))}
              </div>
            </div>

            {/* Q2 */}
            <div>
              <label className="block text-sm font-bold text-slate-800 dark:text-slate-200 mb-2">
                {t.evaluation.surveyQ2}
              </label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    type="button"
                    key={star}
                    onClick={() => setQ2(star)}
                    className={`w-12 h-12 rounded-xl font-bold text-sm border-2 ${
                      q2 >= star
                        ? 'bg-amber-400 text-black border-amber-500'
                        : 'bg-slate-100 text-slate-400 border-slate-200 dark:bg-slate-800'
                    }`}
                  >
                    {star} ★
                  </button>
                ))}
              </div>
            </div>

            {/* Q3 */}
            <div>
              <label className="block text-sm font-bold text-slate-800 dark:text-slate-200 mb-2">
                {t.evaluation.surveyQ3}
              </label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    type="button"
                    key={star}
                    onClick={() => setQ3(star)}
                    className={`w-12 h-12 rounded-xl font-bold text-sm border-2 ${
                      q3 >= star
                        ? 'bg-amber-400 text-black border-amber-500'
                        : 'bg-slate-100 text-slate-400 border-slate-200 dark:bg-slate-800'
                    }`}
                  >
                    {star} ★
                  </button>
                ))}
              </div>
            </div>

            {/* Q4 */}
            <div>
              <label className="block text-sm font-bold text-slate-800 dark:text-slate-200 mb-2">
                {t.evaluation.surveyQ4}
              </label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    type="button"
                    key={star}
                    onClick={() => setQ4(star)}
                    className={`w-12 h-12 rounded-xl font-bold text-sm border-2 ${
                      q4 >= star
                        ? 'bg-amber-400 text-black border-amber-500'
                        : 'bg-slate-100 text-slate-400 border-slate-200 dark:bg-slate-800'
                    }`}
                  >
                    {star} ★
                  </button>
                ))}
              </div>
            </div>

            {/* Q5 */}
            <div>
              <label className="block text-sm font-bold text-slate-800 dark:text-slate-200 mb-1">
                {t.evaluation.surveyQ5}
              </label>
              <input
                type="text"
                value={q5Difficulties}
                onChange={(e) => setQ5Difficulties(e.target.value)}
                placeholder="Nhập khó khăn gặp phải..."
                className="w-full h-12 rounded-xl border border-slate-300 px-4 text-sm dark:bg-slate-800 dark:border-slate-700 dark:text-white"
              />
            </div>

            {/* Q6 */}
            <div>
              <label className="block text-sm font-bold text-slate-800 dark:text-slate-200 mb-1">
                {t.evaluation.surveyQ6}
              </label>
              <input
                type="text"
                value={q6Suggestions}
                onChange={(e) => setQ6Suggestions(e.target.value)}
                placeholder="Đề xuất cải tiến thêm..."
                className="w-full h-12 rounded-xl border border-slate-300 px-4 text-sm dark:bg-slate-800 dark:border-slate-700 dark:text-white"
              />
            </div>

            {/* Q7 */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 dark:bg-slate-800 dark:border-slate-700">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={q7Consent}
                  onChange={(e) => setQ7Consent(e.target.checked)}
                  className="w-5 h-5 mt-0.5 rounded text-blue-600"
                />
                <span className="text-sm font-bold text-slate-800 dark:text-slate-200">
                  {t.evaluation.surveyQ7}
                </span>
              </label>
            </div>

            <button
              type="submit"
              className="w-full py-4 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700 active:scale-95 transition"
            >
              {t.evaluation.saveSurveyBtn}
            </button>

            {surveySuccess && (
              <div className="p-3 bg-emerald-100 text-emerald-800 rounded-xl text-center font-bold text-sm">
                Đã ghi nhận phản hồi khảo sát! Cảm ơn sự đóng góp cho đề tài.
              </div>
            )}
          </form>
        </div>
      )}
    </div>
  );
};
