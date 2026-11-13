import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { IoTDevice, CommandLog, IoTConfig } from '../types';
import { useAccessibility } from './AccessibilityContext';
import { useI18n } from '../locales';

interface IoTContextType {
  devices: IoTDevice[];
  config: IoTConfig;
  logs: CommandLog[];
  isLoading: boolean;
  error: string | null;
  pendingCommand: { device: IoTDevice; action: 'turn_on' | 'turn_off' } | null;
  requestCommand: (device: IoTDevice, action: 'turn_on' | 'turn_off') => void;
  confirmAndExecute: () => Promise<void>;
  cancelCommand: () => void;
  refreshDevices: () => Promise<void>;
  updateIoTConfig: (newConfig: Partial<IoTConfig>) => Promise<void>;
  isExecuting: boolean;
  networkOfflineSimulation: boolean;
  toggleNetworkSimulation: () => void;
}

const IoTContext = createContext<IoTContextType | undefined>(undefined);

export const IoTProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [devices, setDevices] = useState<IoTDevice[]>([]);
  const [logs, setLogs] = useState<CommandLog[]>([]);
  const [config, setConfig] = useState<IoTConfig>({
    mode: 'simulation',
    brokerUrl: '',
    cloudDeviceId: '',
    cloudApiToken: '',
    hasConnectedHardware: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isExecuting, setIsExecuting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pendingCommand, setPendingCommand] = useState<{ device: IoTDevice; action: 'turn_on' | 'turn_off' } | null>(null);
  const [networkOfflineSimulation, setNetworkOfflineSimulation] = useState(false);

  const { playActionSound, speakText, settings } = useAccessibility();
  const { language } = useI18n();

  const refreshDevices = useCallback(async () => {
    if (networkOfflineSimulation) {
      setError('Mô phỏng mất kết nối mạng. Không thể tải danh sách thiết bị.');
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/iot/devices');
      if (res.ok) {
        const data = await res.json();
        setDevices(data.devices || []);
        setConfig(data.config || config);
        setLogs(data.logs || []);
      } else {
        throw new Error('Không thể tải dữ liệu thiết bị.');
      }
    } catch (err: any) {
      setError(err.message || 'Lỗi kết nối IoT');
    } finally {
      setIsLoading(false);
    }
  }, [networkOfflineSimulation]);

  useEffect(() => {
    refreshDevices();
  }, [refreshDevices]);

  // Request command triggers the 2-step confirmation modal
  const requestCommand = (device: IoTDevice, action: 'turn_on' | 'turn_off') => {
    playActionSound('click');
    setPendingCommand({ device, action });

    const deviceName = language === 'vi' ? device.nameVi : language === 'zh' ? device.nameZh : device.name;
    const actionText = action === 'turn_on' 
      ? (language === 'vi' ? 'Bật' : language === 'zh' ? '开启' : 'Turn on')
      : (language === 'vi' ? 'Tắt' : language === 'zh' ? '关闭' : 'Turn off');

    if (settings.readOutLoud) {
      speakText(`${language === 'vi' ? 'Yêu cầu xác nhận:' : 'Confirm:'} ${actionText} ${deviceName}`);
    }
  };

  const cancelCommand = () => {
    playActionSound('warning');
    setPendingCommand(null);
  };

  const confirmAndExecute = async () => {
    if (!pendingCommand) return;
    const { device, action } = pendingCommand;
    setIsExecuting(true);
    setError(null);

    if (networkOfflineSimulation) {
      playActionSound('warning');
      setError('Lỗi: Mạng ngoại tuyến! Không thể gửi lệnh đến thiết bị.');
      setIsExecuting(false);
      setPendingCommand(null);
      return;
    }

    try {
      const res = await fetch('/api/iot/command', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          deviceId: device.id,
          action,
          confirmedByUser: true,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        playActionSound('success');
        setDevices((prev) =>
          prev.map((d) => (d.id === device.id ? data.device : d))
        );
        if (data.log) {
          setLogs((prev) => [...prev, data.log]);
        }
        setPendingCommand(null);

        if (settings.readOutLoud) {
          const deviceName = language === 'vi' ? device.nameVi : language === 'zh' ? device.nameZh : device.name;
          const statusText = action === 'turn_on'
            ? (language === 'vi' ? 'Đã bật' : language === 'zh' ? '已开启' : 'Turned on')
            : (language === 'vi' ? 'Đã tắt' : language === 'zh' ? '已关闭' : 'Turned off');
          speakText(`${statusText} ${deviceName}`);
        }
      } else {
        throw new Error(data.error || 'Lệnh bị từ chối');
      }
    } catch (err: any) {
      playActionSound('warning');
      setError(err.message || 'Không thể thực thi lệnh');
    } finally {
      setIsExecuting(false);
    }
  };

  const updateIoTConfig = async (newConfig: Partial<IoTConfig>) => {
    playActionSound('click');
    try {
      const res = await fetch('/api/iot/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newConfig),
      });
      if (res.ok) {
        const data = await res.json();
        setConfig(data.config);
        playActionSound('success');
        await refreshDevices();
      }
    } catch (err: any) {
      setError(err.message || 'Lỗi cập nhật cấu hình IoT');
    }
  };

  const toggleNetworkSimulation = () => {
    setNetworkOfflineSimulation((prev) => !prev);
    playActionSound('warning');
  };

  return (
    <IoTContext.Provider
      value={{
        devices,
        config,
        logs,
        isLoading,
        error,
        pendingCommand,
        requestCommand,
        confirmAndExecute,
        cancelCommand,
        refreshDevices,
        updateIoTConfig,
        isExecuting,
        networkOfflineSimulation,
        toggleNetworkSimulation,
      }}
    >
      {children}
    </IoTContext.Provider>
  );
};

export function useIoT() {
  const context = useContext(IoTContext);
  if (!context) {
    throw new Error('useIoT must be used within an IoTProvider');
  }
  return context;
}
