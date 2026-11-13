import React, { createContext, useContext, useState, useEffect } from 'react';
import { AccessibilitySettings, FontSize, ButtonSize, ButtonGap } from '../types';
import { soundService } from '../services/soundService';
import { speechService } from '../services/speechService';
import { useI18n } from '../locales';

interface AccessibilityContextType {
  settings: AccessibilitySettings;
  updateSetting: <K extends keyof AccessibilitySettings>(key: K, value: AccessibilitySettings[K]) => void;
  resetDefaults: () => void;
  playActionSound: (type?: 'click' | 'success' | 'warning') => void;
  speakText: (text: string) => void;
  stopSpeech: () => void;
  isSpeaking: boolean;
  announcement: string;
}

const defaultSettings: AccessibilitySettings = {
  fontSize: 'large', // Friendly default for accessibility
  highContrast: false,
  darkMode: false,
  buttonSize: 'large', // Min 56px default for upper limb users
  buttonGap: 'relaxed',
  reduceMotion: false,
  soundFeedback: true,
  readOutLoud: false,
  showIconLabels: true,
  actionTimeoutMultiplier: 1.5,
};

const STORAGE_KEY = 'easyaccess_a11y_prefs';

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

export const AccessibilityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { language } = useI18n();
  const [settings, setSettings] = useState<AccessibilitySettings>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return { ...defaultSettings, ...JSON.parse(saved) };
      }
    } catch (e) {
      // Ignore
    }
    return defaultSettings;
  });

  const [isSpeaking, setIsSpeaking] = useState(false);
  const [announcement, setAnnouncement] = useState('');

  // Synchronize visual styles to HTML root element
  useEffect(() => {
    const root = document.documentElement;
    const body = document.body;

    // Font size classes
    root.classList.remove('font-normal', 'font-large', 'font-xlarge', 'font-huge');
    root.classList.add(`font-${settings.fontSize}`);

    // Contrast
    if (settings.highContrast) {
      root.classList.add('high-contrast');
    } else {
      root.classList.remove('high-contrast');
    }

    // Dark mode
    if (settings.darkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }

    // Button size
    root.classList.remove('btn-size-normal', 'btn-size-large', 'btn-size-huge');
    root.classList.add(`btn-size-${settings.buttonSize}`);

    // Motion
    if (settings.reduceMotion) {
      root.classList.add('reduced-motion');
    } else {
      root.classList.remove('reduced-motion');
    }

    // Spacing
    body.classList.remove('spacing-relaxed', 'spacing-wide');
    if (settings.buttonGap === 'relaxed') body.classList.add('spacing-relaxed');
    if (settings.buttonGap === 'wide') body.classList.add('spacing-wide');

    // Persist
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    } catch (e) {
      // Ignore
    }
  }, [settings]);

  const updateSetting = <K extends keyof AccessibilitySettings>(key: K, value: AccessibilitySettings[K]) => {
    setSettings((prev) => {
      const next = { ...prev, [key]: value };
      return next;
    });
    if (settings.soundFeedback) {
      soundService.playClick();
    }
  };

  const resetDefaults = () => {
    setSettings(defaultSettings);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {
      // Ignore
    }
    if (settings.soundFeedback) {
      soundService.playSuccess();
    }
  };

  const playActionSound = (type: 'click' | 'success' | 'warning' = 'click') => {
    if (!settings.soundFeedback) return;
    if (type === 'click') soundService.playClick();
    else if (type === 'success') soundService.playSuccess();
    else if (type === 'warning') soundService.playWarning();
  };

  const speakText = (text: string) => {
    setAnnouncement(text);
    setIsSpeaking(true);
    speechService.speak({
      text,
      language,
      onStart: () => setIsSpeaking(true),
      onEnd: () => setIsSpeaking(false),
    });
  };

  const stopSpeech = () => {
    speechService.stopSpeaking();
    setIsSpeaking(false);
  };

  return (
    <AccessibilityContext.Provider
      value={{
        settings,
        updateSetting,
        resetDefaults,
        playActionSound,
        speakText,
        stopSpeech,
        isSpeaking,
        announcement,
      }}
    >
      {/* Live region for screen reader announcements */}
      <div
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
      >
        {announcement}
      </div>
      {children}
    </AccessibilityContext.Provider>
  );
};

export function useAccessibility() {
  const context = useContext(AccessibilityContext);
  if (!context) {
    throw new Error('useAccessibility must be used within AccessibilityProvider');
  }
  return context;
}
