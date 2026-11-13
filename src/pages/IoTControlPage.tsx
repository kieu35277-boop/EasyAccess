import React, { useState } from 'react';
import {
  Cpu,
  Lightbulb,
  Power,
  Fan,
  Bell,
  RefreshCw,
  ShieldCheck,
  Radio,
  SlidersHorizontal,
  Wifi,
  WifiOff,
  Clock,
  History,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';
import { useI18n } from '../locales';
import { useAccessibility } from '../context/AccessibilityContext';
import { useIoT } from '../context/IoTContext';
import { IoTDevice } from '../types';

export const IoTControlPage: React.FC = () => {
  const { t, language } = useI18n();
  const { playActionSound } = useAccessibility();
  const {
    devices,
    config,
    logs,
    isLoading,
    refreshDevices,
    requestCommand,
    updateIoTConfig,
    networkOfflineSimulation,
    toggleNetworkSimulation,
  } = useIoT();

  const [activeTab, setActiveTab] = useState<'devices' | 'hardware' | 'logs'>('devices');

  // Form states for Arduino / MQTT
  const [brokerUrl, setBrokerUrl] = useState(config.brokerUrl || 'mqtt://broker.hivemq.com:1883');
  const [cloudDeviceId, setCloudDeviceId] = useState(config.cloudDeviceId || 'ARDUINO_MKR_1010_RELAY');
  const [cloudApiToken, setCloudApiToken] = useState(config.cloudApiToken || '');
  const [saveSuccess, setSaveSuccess] = useState(false);

  const getDeviceIcon = (type: IoTDevice['type']) => {
    switch (type) {
      case 'light':
      case 'lamp':
        return Lightbulb;
      case 'socket':
      case 'fan':
        return Fan;
      case 'bell':
        return Bell;
      default:
        return Power;
    }
  };

  const handleSaveHardware = async (e: React.FormEvent) => {
    e.preventDefault();
    playActionSound('click');
    await updateIoTConfig({
      mode: 'real_arduino',
      brokerUrl,
      cloudDeviceId,
      cloudApiToken,
      hasConnectedHardware: true,
    });
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleSwitchToSim = async () => {
    playActionSound('click');
    await updateIoTConfig({ mode: 'simulation' });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Banner: Honest Simulation vs Hardware status */}
      <div
        className={`rounded-3xl p-6 border-2 transition ${
          config.mode === 'simulation'
            ? 'bg-amber-50 border-amber-300 text-amber-950 dark:bg-amber-950/40 dark:border-amber-700 dark:text-amber-100'
            : 'bg-emerald-50 border-emerald-300 text-emerald-950 dark:bg-emerald-950/40 dark:border-emerald-700 dark:text-emerald-100'
        }`}
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div
              className={`p-3 rounded-2xl shrink-0 ${
                config.mode === 'simulation'
                  ? 'bg-amber-200 text-amber-800 dark:bg-amber-900 dark:text-amber-200'
                  : 'bg-emerald-200 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200'
              }`}
            >
              {config.mode === 'simulation' ? (
                <Radio className="w-7 h-7" />
              ) : (
                <ShieldCheck className="w-7 h-7" />
              )}
            </div>
            <div>
              <span className="text-xs font-black uppercase tracking-wider px-2 py-0.5 rounded bg-black/10 dark:bg-white/10">
                {config.mode === 'simulation' ? 'SIMULATION MODE' : 'HARDWARE CONNECTED'}
              </span>
              <h2 className="text-lg md:text-xl font-black mt-1">
                {config.mode === 'simulation'
                  ? t.iot.simulationBanner
                  : t.iot.hardwareConnectedBanner}
              </h2>
              <p className="mt-1 text-xs md:text-sm leading-relaxed opacity-90 max-w-2xl">
                {t.iot.simulationNotice}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 shrink-0">
            <button
              onClick={() => {
                playActionSound('click');
                refreshDevices();
              }}
              disabled={isLoading}
              className="flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-xs md:text-sm font-bold text-slate-800 shadow-sm hover:bg-slate-50 border border-slate-200 dark:bg-slate-800 dark:border-slate-700 dark:text-white"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
              <span>{t.iot.refreshStatus}</span>
            </button>

            <button
              onClick={toggleNetworkSimulation}
              title="Thử nghiệm ngắt kết nối mạng để kiểm tra khả năng phục hồi"
              className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs md:text-sm font-bold border shadow-sm transition ${
                networkOfflineSimulation
                  ? 'bg-rose-600 text-white border-rose-700'
                  : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100 dark:bg-slate-800 dark:text-slate-200'
              }`}
            >
              {networkOfflineSimulation ? <WifiOff className="w-4 h-4" /> : <Wifi className="w-4 h-4" />}
              <span>
                {networkOfflineSimulation ? 'Đang ngắt mạng (Thử nghiệm)' : 'Mô phỏng mất mạng'}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
        <button
          onClick={() => {
            playActionSound('click');
            setActiveTab('devices');
          }}
          className={`flex items-center gap-2 px-5 py-3 rounded-2xl font-bold text-sm md:text-base transition ${
            activeTab === 'devices'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
          }`}
        >
          <Cpu className="w-5 h-5" />
          <span>Danh sách thiết bị ({devices.length})</span>
        </button>

        <button
          onClick={() => {
            playActionSound('click');
            setActiveTab('hardware');
          }}
          className={`flex items-center gap-2 px-5 py-3 rounded-2xl font-bold text-sm md:text-base transition ${
            activeTab === 'hardware'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
          }`}
        >
          <SlidersHorizontal className="w-5 h-5" />
          <span>Cấu hình phần cứng thật</span>
        </button>

        <button
          onClick={() => {
            playActionSound('click');
            setActiveTab('logs');
          }}
          className={`flex items-center gap-2 px-5 py-3 rounded-2xl font-bold text-sm md:text-base transition ${
            activeTab === 'logs'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
          }`}
        >
          <History className="w-5 h-5" />
          <span>Nhật ký lệnh ({logs.length})</span>
        </button>
      </div>

      {/* TAB 1: DEVICE CARDS */}
      {activeTab === 'devices' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {devices.map((device) => {
            const Icon = getDeviceIcon(device.type);
            const isStateOn = device.state === 'on';
            const deviceName = language === 'vi' ? device.nameVi : language === 'zh' ? device.nameZh : device.name;
            const location = language === 'vi' ? device.locationVi : language === 'zh' ? device.locationZh : device.location;

            return (
              <div
                key={device.id}
                className={`rounded-3xl border-3 p-6 md:p-7 shadow-sm transition flex flex-col justify-between ${
                  isStateOn
                    ? 'border-emerald-400 bg-white dark:bg-slate-900 shadow-emerald-500/10'
                    : 'border-slate-200 bg-white dark:bg-slate-900 dark:border-slate-800'
                }`}
              >
                <div>
                  {/* Top line: status indicators */}
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <div className="flex items-center gap-2">
                      <span
                        className={`w-3 h-3 rounded-full ${
                          device.isOnline ? 'bg-emerald-500' : 'bg-slate-400'
                        }`}
                      />
                      <span className="text-xs font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                        {device.isOnline ? t.iot.statusOnline : t.iot.statusOffline}
                      </span>
                    </div>

                    <span
                      className={`text-xs font-black uppercase px-2.5 py-1 rounded-full ${
                        device.isSimulated
                          ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                          : 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                      }`}
                    >
                      {device.isSimulated ? 'MÔ PHỎNG' : 'PHẦN CỨNG THẬT'}
                    </span>
                  </div>

                  {/* Device Identity */}
                  <div className="flex items-start gap-4">
                    <div
                      className={`w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 transition ${
                        isStateOn
                          ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 shadow-md ring-4 ring-emerald-100 dark:ring-emerald-900'
                          : 'bg-slate-100 text-slate-400 dark:bg-slate-800'
                      }`}
                    >
                      <Icon className="w-8 h-8" />
                    </div>

                    <div className="flex-1">
                      <h3 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white leading-tight">
                        {deviceName}
                      </h3>
                      <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 mt-0.5">
                        {location}
                      </p>
                      <p className="text-xs text-slate-400 font-mono mt-1">
                        {t.iot.pinLocation} {device.pinOrTopic}
                      </p>
                    </div>
                  </div>

                  {/* Visual State Pill */}
                  <div className="mt-5 p-3 rounded-2xl bg-slate-50 border border-slate-200 dark:bg-slate-800/80 dark:border-slate-700 flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
                      Trạng thái hiện tại:
                    </span>
                    <span
                      className={`text-sm font-black px-3 py-1 rounded-xl ${
                        isStateOn
                          ? 'bg-emerald-600 text-white shadow-xs'
                          : 'bg-slate-300 text-slate-800 dark:bg-slate-700 dark:text-slate-200'
                      }`}
                    >
                      {isStateOn ? t.iot.stateOn : t.iot.stateOff}
                    </span>
                  </div>
                </div>

                {/* Big Action Button (Minimum 56px height, high touch area) */}
                <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800">
                  <button
                    onClick={() =>
                      requestCommand(device, isStateOn ? 'turn_off' : 'turn_on')
                    }
                    className={`w-full min-h-[56px] rounded-2xl font-extrabold text-base md:text-lg flex items-center justify-center gap-3 shadow-md active:scale-98 transition ${
                      isStateOn
                        ? 'bg-rose-600 text-white hover:bg-rose-700 focus:ring-4 focus:ring-rose-300'
                        : 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-4 focus:ring-blue-300'
                    }`}
                  >
                    <Power className="w-6 h-6" />
                    <span>{isStateOn ? t.iot.btnTurnOff : t.iot.btnTurnOn}</span>
                  </button>

                  <p className="mt-2 text-center text-xs text-slate-400 flex items-center justify-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    <span>
                      {t.iot.lastUpdated} {new Date(device.lastUpdated).toLocaleTimeString()}
                    </span>
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* TAB 2: HARDWARE SETUP (Arduino Cloud / MQTT) */}
      {activeTab === 'hardware' && (
        <div className="rounded-3xl border-2 border-slate-200 bg-white p-6 md:p-8 shadow-sm dark:bg-slate-900 dark:border-slate-800 max-w-3xl space-y-6">
          <div>
            <h3 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
              <SlidersHorizontal className="w-6 h-6 text-blue-600" />
              <span>{t.iot.switchHardwareTab}</span>
            </h3>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              {t.iot.hardwareSetupInfo}
            </p>
          </div>

          <form onSubmit={handleSaveHardware} className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-slate-800 dark:text-slate-200 mb-1">
                {t.iot.brokerUrlLabel}
              </label>
              <input
                type="text"
                value={brokerUrl}
                onChange={(e) => setBrokerUrl(e.target.value)}
                placeholder="mqtt://broker.hivemq.com:1883 hoặc https://api2.arduino.cc/iot/v2"
                className="w-full h-12 rounded-xl border border-slate-300 bg-white px-4 text-sm dark:bg-slate-800 dark:border-slate-700 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-800 dark:text-slate-200 mb-1">
                {t.iot.deviceIdLabel}
              </label>
              <input
                type="text"
                value={cloudDeviceId}
                onChange={(e) => setCloudDeviceId(e.target.value)}
                placeholder="e.g. arduino_uno_r4_wifi_01"
                className="w-full h-12 rounded-xl border border-slate-300 bg-white px-4 text-sm dark:bg-slate-800 dark:border-slate-700 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-800 dark:text-slate-200 mb-1">
                {t.iot.apiTokenLabel}
              </label>
              <input
                type="password"
                value={cloudApiToken}
                onChange={(e) => setCloudApiToken(e.target.value)}
                placeholder="Nhập khóa bảo mật Arduino Cloud Client Secret..."
                className="w-full h-12 rounded-xl border border-slate-300 bg-white px-4 text-sm dark:bg-slate-800 dark:border-slate-700 dark:text-white"
              />
              <p className="text-xs text-slate-500 mt-1">
                * Khóa bảo mật được mã hóa và chỉ lưu trên máy chủ Node.js backend.
              </p>
            </div>

            <div className="pt-4 flex flex-wrap gap-3">
              <button
                type="submit"
                className="rounded-xl bg-blue-600 px-6 py-3.5 text-sm font-bold text-white shadow-sm hover:bg-blue-700 active:scale-95 transition"
              >
                {t.iot.saveConfig}
              </button>

              <button
                type="button"
                onClick={handleSwitchToSim}
                className="rounded-xl bg-slate-100 border border-slate-200 px-6 py-3.5 text-sm font-bold text-slate-800 hover:bg-slate-200 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-200"
              >
                {t.iot.switchSimMode}
              </button>
            </div>

            {saveSuccess && (
              <div className="flex items-center gap-2 p-3 rounded-xl bg-emerald-50 text-emerald-800 text-sm font-bold border border-emerald-200">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <span>Đã lưu cấu hình và kết nối máy chủ IoT thành công.</span>
              </div>
            )}
          </form>
        </div>
      )}

      {/* TAB 3: COMMAND LOGS */}
      {activeTab === 'logs' && (
        <div className="rounded-3xl border-2 border-slate-200 bg-white p-6 shadow-sm dark:bg-slate-900 dark:border-slate-800">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
              <History className="w-5 h-5 text-blue-600" />
              <span>{t.iot.commandHistory}</span>
            </h3>
            <span className="text-xs font-semibold text-slate-500">
              Ghi nhận {logs.length} bản ghi
            </span>
          </div>

          <div className="space-y-3">
            {logs.slice(-10).reverse().map((log) => (
              <div
                key={log.id}
                className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm dark:bg-slate-800 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-slate-900 dark:text-white">
                      {log.deviceName}
                    </span>
                    <span className="px-2 py-0.5 rounded text-xs font-bold bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-200">
                      {log.action}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    {log.message}
                  </p>
                </div>

                <div className="text-xs text-slate-400 sm:text-right shrink-0">
                  {new Date(log.timestamp).toLocaleString()}
                </div>
              </div>
            ))}

            {logs.length === 0 && (
              <p className="text-sm text-slate-500 text-center py-8">{t.iot.noHistory}</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
