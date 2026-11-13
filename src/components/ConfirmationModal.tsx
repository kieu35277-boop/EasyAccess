import React, { useEffect, useRef } from 'react';
import { AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import { useIoT } from '../context/IoTContext';
import { useI18n } from '../locales';

export const ConfirmationModal: React.FC = () => {
  const { pendingCommand, confirmAndExecute, cancelCommand, isExecuting } = useIoT();
  const { t, language } = useI18n();
  const confirmBtnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (pendingCommand) {
      confirmBtnRef.current?.focus();
    }
  }, [pendingCommand]);

  if (!pendingCommand) return null;

  const { device, action } = pendingCommand;
  const deviceName = language === 'vi' ? device.nameVi : language === 'zh' ? device.nameZh : device.name;
  const location = language === 'vi' ? device.locationVi : language === 'zh' ? device.locationZh : device.location;
  const actionText = action === 'turn_on'
    ? (language === 'vi' ? 'BẬT NGUỒN' : language === 'zh' ? '开启电源' : 'TURN ON')
    : (language === 'vi' ? 'TẮT NGUỒN' : language === 'zh' ? '关闭电源' : 'TURN OFF');

  return (
    <div
      role="alertdialog"
      aria-modal="true"
      aria-labelledby="confirm-modal-title"
      aria-describedby="confirm-modal-desc"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-xs p-4 animate-in fade-in duration-200"
    >
      <div className="w-full max-w-lg rounded-2xl bg-white p-6 md:p-8 shadow-2xl border-4 border-amber-400 dark:bg-slate-900 dark:border-amber-500">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-amber-100 text-amber-700 rounded-2xl shrink-0 dark:bg-amber-950 dark:text-amber-400">
            <AlertTriangle className="w-8 h-8" />
          </div>
          <div>
            <h2 id="confirm-modal-title" className="text-xl md:text-2xl font-extrabold text-slate-900 dark:text-white">
              {t.iot.modalTitle}
            </h2>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Cơ chế an toàn 2 bước chống chạm nhầm / Safety Confirmation Gate
            </p>
          </div>
        </div>

        <div className="my-6 rounded-xl bg-slate-50 p-4 border border-slate-200 dark:bg-slate-800 dark:border-slate-700">
          <p id="confirm-modal-desc" className="text-base md:text-lg leading-relaxed text-slate-800 dark:text-slate-100">
            {language === 'vi' && (
              <>
                Bạn muốn <strong className="text-blue-600 dark:text-blue-400 font-bold">{actionText}</strong> thiết bị{' '}
                <strong className="underline">{deviceName}</strong> tại vị trí <strong>{location}</strong>.
              </>
            )}
            {language === 'en' && (
              <>
                You are about to <strong className="text-blue-600 dark:text-blue-400 font-bold">{actionText}</strong>{' '}
                <strong className="underline">{deviceName}</strong> in <strong>{location}</strong>.
              </>
            )}
            {language === 'zh' && (
              <>
                您即将对位于【<strong>{location}</strong>】的【<strong className="underline">{deviceName}</strong>】执行【<strong className="text-blue-600 dark:text-blue-400 font-bold">{actionText}</strong>】操作。
              </>
            )}
          </p>
          <div className="mt-3 flex items-center gap-2 text-xs text-amber-700 dark:text-amber-300 font-medium">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
            Lệnh chỉ được gửi khi bạn bấm "Xác nhận" bên dưới.
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <button
            ref={confirmBtnRef}
            disabled={isExecuting}
            onClick={confirmAndExecute}
            className="flex items-center justify-center gap-3 rounded-xl bg-blue-600 px-6 py-4 text-base md:text-lg font-bold text-white shadow-md hover:bg-blue-700 active:scale-95 transition disabled:opacity-50"
          >
            <CheckCircle className="w-6 h-6" />
            <span>{isExecuting ? t.common.loading : t.iot.modalConfirm}</span>
          </button>

          <button
            disabled={isExecuting}
            onClick={cancelCommand}
            className="flex items-center justify-center gap-3 rounded-xl bg-rose-100 border-2 border-rose-300 px-6 py-4 text-base md:text-lg font-bold text-rose-800 hover:bg-rose-200 active:scale-95 transition dark:bg-rose-950 dark:border-rose-700 dark:text-rose-200"
          >
            <XCircle className="w-6 h-6" />
            <span>{t.iot.modalCancel}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
