import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  X,
  Mic,
  MicOff,
  Send,
  Volume2,
  Square,
  Trash2,
  CheckCircle,
  ArrowRight,
  ShieldAlert,
  Loader2,
} from 'lucide-react';
import { useI18n } from '../locales';
import { useAccessibility } from '../context/AccessibilityContext';
import { useIoT } from '../context/IoTContext';
import { speechService } from '../services/speechService';
import { PageId } from '../types';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  toolCall?: {
    name: string;
    args: any;
  };
  isFallback?: boolean;
}

interface AIAssistantDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (page: PageId) => void;
}

export const AIAssistantDrawer: React.FC<AIAssistantDrawerProps> = ({ isOpen, onClose, onNavigate }) => {
  const { t, language } = useI18n();
  const { speakText, stopSpeech, isSpeaking, playActionSound, updateSetting } = useAccessibility();
  const { devices, requestCommand } = useIoT();

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'msg_welcome',
      role: 'assistant',
      content: language === 'vi'
        ? 'Xin chào! Tôi là trợ lý ảo EasyAssist. Tôi có thể giúp bạn giải thích cách dùng thiết bị, thay đổi cỡ chữ, bật tương phản cao, hoặc chuẩn bị bật/tắt đèn quạt an toàn. Bạn cần tôi giúp gì?'
        : language === 'zh'
        ? '您好！我是 EasyAssist 智能助手。我可以为您讲解设备操作步骤、调整字体大小与高对比度，或帮您安全准备开关电器。请问有什么可以协助您？'
        : 'Hello! I am EasyAssist. I can help you understand device guides, adjust font size or high contrast, or prepare safe smart device commands. How may I help you today?',
    },
  ]);

  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [voiceError, setVoiceError] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 150);
    }
  }, [isOpen]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  if (!isOpen) return null;

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || input).trim();
    if (!text || isLoading) return;

    playActionSound('click');
    const userMsg: Message = {
      id: `user_${Date.now()}`,
      role: 'user',
      content: text,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/gemini/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMsg].map((m) => ({
            role: m.role,
            content: m.content,
          })),
          userLanguage: language,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        const assistantMsg: Message = {
          id: `asst_${Date.now()}`,
          role: 'assistant',
          content: data.reply || 'Đã xử lý yêu cầu của bạn.',
          toolCall: data.toolCall,
          isFallback: data.isFallback,
        };

        setMessages((prev) => [...prev, assistantMsg]);
        playActionSound('success');

        // Automatically read aloud if preferred
        speakText(assistantMsg.content);

        // Process tool execution
        if (data.toolCall) {
          executeToolCall(data.toolCall);
        }
      } else {
        throw new Error(data.error || 'Lỗi giao tiếp máy chủ AI');
      }
    } catch (err: any) {
      playActionSound('warning');
      const errorMsg: Message = {
        id: `err_${Date.now()}`,
        role: 'assistant',
        content: `Rất tiếc: ${err.message || 'Không thể liên lạc với máy chủ AI'}. Bạn vẫn có thể thao tác trực tiếp qua các nút trên màn hình.`,
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const executeToolCall = (toolCall: { name: string; args: any }) => {
    const { name, args } = toolCall;
    if (name === 'navigate_to' && args?.page) {
      onNavigate(args.page as PageId);
    } else if (name === 'adjust_accessibility' && args?.setting) {
      const { setting, value } = args;
      if (setting === 'fontSize') {
        updateSetting('fontSize', value as any);
      } else if (setting === 'highContrast') {
        updateSetting('highContrast', value === 'true' || value === true);
      } else if (setting === 'buttonSize') {
        updateSetting('buttonSize', value as any);
      } else if (setting === 'reduceMotion') {
        updateSetting('reduceMotion', value === 'true' || value === true);
      }
    } else if (name === 'prepare_iot_command' && args?.deviceId) {
      const targetDevice = devices.find((d) => d.id === args.deviceId) || devices[0];
      if (targetDevice) {
        requestCommand(targetDevice, args.action === 'turn_off' ? 'turn_off' : 'turn_on');
      }
    }
  };

  const handleStartVoice = () => {
    playActionSound('click');
    setVoiceError(null);
    setIsListening(true);

    const speechLang = language === 'vi' ? 'vi-VN' : language === 'zh' ? 'zh-CN' : 'en-US';

    speechService.startListening({
      language: speechLang,
      onResult: (transcript, isFinal) => {
        setInput(transcript);
        if (isFinal) {
          setIsListening(false);
          handleSendMessage(transcript);
        }
      },
      onError: (errMsg) => {
        setIsListening(false);
        setVoiceError(errMsg);
        playActionSound('warning');
      },
      onEnd: () => {
        setIsListening(false);
      },
    });
  };

  const handleStopVoice = () => {
    speechService.stopListening();
    setIsListening(false);
  };

  const clearChat = () => {
    playActionSound('click');
    setMessages([
      {
        id: 'msg_welcome_reset',
        role: 'assistant',
        content: language === 'vi'
          ? 'Đã xóa hội thoại. Tôi luôn sẵn sàng hỗ trợ bạn bất cứ lúc nào!'
          : 'Conversation cleared. How can I assist you now?',
      },
    ]);
  };

  const suggestions = [
    t.assistant.suggestion1,
    t.assistant.suggestion2,
    t.assistant.suggestion3,
    t.assistant.suggestion4,
    t.assistant.suggestion5,
  ];

  return (
    <div
      role="dialog"
      aria-label="EasyAssist AI Drawer"
      aria-modal="true"
      className="fixed inset-y-0 right-0 z-50 flex w-full max-w-lg flex-col bg-white shadow-2xl border-l-2 border-slate-200 dark:bg-slate-900 dark:border-slate-800 animate-in slide-in-from-right duration-200"
    >
      {/* Top Header */}
      <div className="flex items-center justify-between border-b border-slate-200 p-4 dark:border-slate-800 bg-slate-50 dark:bg-slate-950">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-gradient-to-tr from-blue-500 to-emerald-400 text-white rounded-xl shadow-sm">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              {t.assistant.title}
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                AI + Assistive
              </span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {t.assistant.subtitle}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={clearChat}
            title={t.assistant.clearChat}
            className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800"
          >
            <Trash2 className="w-5 h-5" />
          </button>
          <button
            onClick={() => {
              playActionSound('click');
              stopSpeech();
              onClose();
            }}
            className="p-2 text-slate-600 hover:text-slate-900 rounded-xl hover:bg-slate-200 dark:text-slate-300 dark:hover:bg-slate-800"
            aria-label={t.common.close}
          >
            <X className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Safety Notice Banner */}
      <div className="bg-amber-50 px-4 py-2 border-b border-amber-200 flex items-start gap-2 text-xs text-amber-900 dark:bg-amber-950 dark:border-amber-900 dark:text-amber-200">
        <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5 text-amber-600" />
        <span>{t.assistant.safetyNotice}</span>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'}`}
          >
            <div
              className={`max-w-[90%] rounded-2xl p-4 text-sm md:text-base leading-relaxed ${
                m.role === 'user'
                  ? 'bg-blue-600 text-white font-medium rounded-br-xs'
                  : 'bg-slate-100 text-slate-900 border border-slate-200 dark:bg-slate-800 dark:text-slate-100 dark:border-slate-700 rounded-bl-xs'
              }`}
            >
              <div className="whitespace-pre-wrap">{m.content}</div>

              {/* Tool Execution Card if present */}
              {m.toolCall && (
                <div className="mt-3 pt-3 border-t border-slate-300 dark:border-slate-700">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                    <CheckCircle className="w-4 h-4" />
                    <span>Thao tác hệ thống kích hoạt: {m.toolCall.name}</span>
                  </div>
                  {m.toolCall.name === 'navigate_to' && (
                    <button
                      onClick={() => onNavigate(m.toolCall?.args?.page)}
                      className="mt-2 flex items-center gap-2 text-xs font-bold text-blue-700 bg-blue-100 px-3 py-1.5 rounded-lg hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-200"
                    >
                      <span>Mở trang ngay</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                  {m.toolCall.name === 'prepare_iot_command' && (
                    <button
                      onClick={() => executeToolCall(m.toolCall!)}
                      className="mt-2 flex items-center gap-2 text-xs font-bold text-amber-800 bg-amber-100 px-3 py-1.5 rounded-lg hover:bg-amber-200 dark:bg-amber-900 dark:text-amber-200"
                    >
                      <span>Mở hộp thoại xác nhận thiết bị</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Read Aloud Button for Assistant message */}
            {m.role === 'assistant' && (
              <div className="mt-1 flex items-center gap-2">
                <button
                  onClick={() => {
                    if (isSpeaking) stopSpeech();
                    else speakText(m.content);
                  }}
                  className="flex items-center gap-1 text-xs text-slate-500 hover:text-blue-600 px-2 py-1 rounded"
                >
                  {isSpeaking ? (
                    <>
                      <Square className="w-3.5 h-3.5 text-rose-500" />
                      <span>{t.assistant.stopSpeech}</span>
                    </>
                  ) : (
                    <>
                      <Volume2 className="w-3.5 h-3.5" />
                      <span>{t.assistant.readAloud}</span>
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        ))}

        {isLoading && (
          <div className="flex items-center gap-2 text-slate-500 text-sm p-2">
            <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
            <span>{t.assistant.aiWorking}</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested chips */}
      <div className="px-4 py-2 border-t border-slate-100 dark:border-slate-800">
        <p className="text-xs font-medium text-slate-500 mb-2">{t.assistant.suggestedQueries}</p>
        <div className="flex gap-2 overflow-x-auto pb-1">
          {suggestions.slice(0, 3).map((query, i) => (
            <button
              key={i}
              onClick={() => handleSendMessage(query)}
              className="shrink-0 rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-blue-50 hover:text-blue-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700"
            >
              {query}
            </button>
          ))}
        </div>
      </div>

      {/* Listening Status Indicator */}
      {isListening && (
        <div className="bg-rose-50 border-t border-rose-200 px-4 py-2.5 flex items-center justify-between dark:bg-rose-950 dark:border-rose-900">
          <div className="flex items-center gap-2 text-rose-700 dark:text-rose-300 text-sm font-semibold">
            <span className="w-3 h-3 rounded-full bg-rose-600 animate-ping" />
            <span>{t.assistant.listening}</span>
          </div>
          <button
            onClick={handleStopVoice}
            className="text-xs bg-rose-600 text-white font-bold px-3 py-1 rounded-md"
          >
            {t.assistant.stopListening}
          </button>
        </div>
      )}

      {/* Voice Error notice */}
      {voiceError && (
        <div className="bg-amber-100 px-4 py-2 text-xs text-amber-800 border-t border-amber-300 dark:bg-amber-950 dark:text-amber-200">
          {voiceError}
        </div>
      )}

      {/* Input Form with large 56px touch target */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage();
        }}
        className="border-t border-slate-200 p-3 bg-slate-50 dark:bg-slate-950 dark:border-slate-800 flex items-center gap-2"
      >
        <button
          type="button"
          onClick={isListening ? handleStopVoice : handleStartVoice}
          title={isListening ? t.assistant.stopListening : t.assistant.voiceInput}
          className={`h-12 w-12 rounded-xl flex items-center justify-center transition shrink-0 ${
            isListening
              ? 'bg-rose-600 text-white animate-pulse'
              : 'bg-slate-200 text-slate-700 hover:bg-slate-300 dark:bg-slate-800 dark:text-slate-200'
          }`}
          aria-label={t.assistant.voiceInput}
        >
          {isListening ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
        </button>

        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={t.assistant.placeholder}
          className="flex-1 h-12 rounded-xl border border-slate-300 bg-white px-4 text-sm md:text-base text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:outline-hidden dark:bg-slate-900 dark:border-slate-700 dark:text-white"
        />

        <button
          type="submit"
          disabled={!input.trim() || isLoading}
          className="h-12 w-12 rounded-xl bg-blue-600 text-white flex items-center justify-center hover:bg-blue-700 active:scale-95 transition disabled:opacity-50 shrink-0"
          aria-label={t.assistant.send}
        >
          <Send className="w-5 h-5" />
        </button>
      </form>
    </div>
  );
};
