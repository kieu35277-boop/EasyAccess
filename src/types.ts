export type Language = 'vi' | 'en' | 'zh';

export type PageId =
  | 'home'
  | 'guides'
  | 'assistant'
  | 'iot'
  | 'accessibility'
  | 'manual'
  | 'evaluation'
  | 'about'
  | 'privacy'
  | 'settings';

export type FontSize = 'normal' | 'large' | 'xlarge' | 'huge';
export type ButtonSize = 'normal' | 'large' | 'huge';
export type ButtonGap = 'normal' | 'relaxed' | 'wide';

export interface AccessibilitySettings {
  fontSize: FontSize;
  highContrast: boolean;
  darkMode: boolean;
  buttonSize: ButtonSize;
  buttonGap: ButtonGap;
  reduceMotion: boolean;
  soundFeedback: boolean;
  readOutLoud: boolean;
  showIconLabels: boolean;
  actionTimeoutMultiplier: number; // 1x, 1.5x, 2x
}

export interface GuideStep {
  stepNumber: number;
  title: string;
  description: string;
  note?: string;
}

export interface GuideItem {
  id: string;
  category: 'phone' | 'tablet' | 'computer' | 'smarthome' | 'os_accessibility' | 'voice_control' | 'switch_access' | 'troubleshooting';
  title: {
    vi: string;
    en: string;
    zh: string;
  };
  summary: {
    vi: string;
    en: string;
    zh: string;
  };
  deviceType: string;
  updatedAt: string;
  source: string;
  steps: {
    vi: GuideStep[];
    en: GuideStep[];
    zh: GuideStep[];
  };
  tags: string[];
}

export interface IoTDevice {
  id: string;
  name: string;
  nameVi: string;
  nameZh: string;
  type: 'light' | 'socket' | 'lamp' | 'fan' | 'bell';
  location: string;
  locationVi: string;
  locationZh: string;
  state: 'on' | 'off';
  isOnline: boolean;
  isSimulated: boolean;
  lastUpdated: string;
  pinOrTopic: string;
}

export interface CommandLog {
  id: string;
  deviceId: string;
  deviceName: string;
  action: string;
  timestamp: string;
  status: 'confirmed' | 'rejected' | 'failed' | 'pending_ack';
  message: string;
}

export interface IoTConfig {
  mode: 'simulation' | 'real_arduino' | 'real_mqtt';
  brokerUrl: string;
  cloudDeviceId: string;
  cloudApiToken: string;
  hasConnectedHardware: boolean;
}

export interface EvaluationTask {
  id: string;
  taskId: string;
  taskName: string;
  participantId: string;
  completed: boolean;
  durationSeconds: number;
  errorCount: number;
  notes: string;
  timestamp: string;
}

export interface EvaluationSurvey {
  id: string;
  participantId: string;
  participantType: 'limb_impaired' | 'caregiver' | 'researcher' | 'student';
  q1_foundGuideEasily: number;
  q2_typographyAndNavigationEasy: number;
  q3_easyAssistHelpful: number;
  q4_iotStatusUnderstood: number;
  q5_difficultiesEncountered: string;
  q6_suggestedImprovements: string;
  q7_agreedToContinue: boolean;
  timestamp: string;
}

export interface EvaluationMetrics {
  totalTasks: number;
  completedTasks: number;
  completionRate: number;
  avgDuration: number;
  totalErrors: number;
  totalCommands: number;
  confirmedCommands: number;
  iotReliability: number;
}
