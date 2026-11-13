import React, { useState, useEffect } from 'react';
import { WifiOff } from 'lucide-react';
import { useI18n } from '../locales';

export const OfflineBanner: React.FC = () => {
  const { t } = useI18n();
  const [isOnline, setIsOnline] = useState(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (isOnline) return null;

  return (
    <div
      role="alert"
      className="bg-amber-600 text-white px-4 py-2.5 text-center text-xs md:text-sm font-bold flex items-center justify-center gap-2 shadow-sm animate-pulse"
    >
      <WifiOff className="w-4 h-4 shrink-0" />
      <span>{t.common.offlineAlert}</span>
    </div>
  );
};
