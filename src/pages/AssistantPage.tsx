import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  Mic,
  MicOff,
  Send,
  Volume2,
  Square,
  Trash2,
  CheckCircle,
  ArrowRight,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import { useI18n } from '../locales';
import { useAccessibility } from '../context/AccessibilityContext';
import { useIoT } from '../context/IoTContext';
import { speechService } from '../services/speechService';
import { PageId } from '../types';

interface AssistantPageProps {
  onNavigate: (page: PageId) => void;
  initialPrompt?: string;
}

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  toolCall?: {
    name: string;
    args: any;
  };
}

export const AssistantPage: React.FC<AssistantPageProps> = ({ onNavigate, initialPrompt }) => {
  const { t, language } = useI18n();
  const { speakText, stopSpeech, isSpeaking, playActionSound, updateSetting } = useAccessibility();
  const { devices, requestCommand } = useIoT();

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'init_msg',
      role: 'assistant',
      content: language === 'vi'
        ? 'Xin chào! Tôi là trợ lý EasyAssist. Tôi có thể giúp bạn tìm hướng dẫn sử dụng, phóng to chữ, kích hoạt chế độ tương phản cao hoặc chuẩn bị lệnh bật/tắt thiết bị thông minh. Hãy nhập câu hỏi hoặc nhấn nút Micro để nói!'
        : 'Hello! I am EasyAssist. I can help you find guides, adjust font sizes, enable high contrast, or prepare commands to toggle smart devices. Speak or type your request below!',
    },
  ]);

  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [voiceError, setVoiceError] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (initialPrompt) {
      handleSendMessage(initialPrompt);
    }
  }, [initialPrompt]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSendMessage = async (customText?: string) => {
    const text = (customText || input).trim();
    if (!text || isLoading) return;

    playActionSound('click');
    const userMsg: Message = { id: `user_${Date.now()}`, role: 'user', content: text };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/gemini/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMsg].map((m) => ({ role: m.role, content: m.content })),
          userLanguage: language,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        const assistantMsg: Message = {
          id: `asst_${Date.now()}`,
          role: 'assistant',
          content: data.reply || 'Đã tiếp nhận yêu cầu.',
          toolCall: data.toolCall,
        };
        setMessages((prev) => [...prev, assistantMsg]);
        playActionSound('success');
        speakText(assistantMsg.content);

        if (data.toolCall) {
          executeTool(data.toolCall);
        }
      }
    } catch (err: any) {
      playActionSound('warning');
      setMessages((prev) => [
        ...prev,
        {
          id: `err_${Date.now()}`,
          role: 'assistant',
          content: `Lỗi kết nối AI: ${err.message}. Bạn vẫn có thể thao tác qua các nút trên màn hình.`,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const executeTool = (tool: { name: string; args: any }) => {
    if (tool.name === 'navigate_to' && tool.args?.page) {
      onNavigate(tool.args.page as PageId);
    } else if (tool.name === 'adjust_accessibility') {
      const { setting, value } = tool.args;
      if (setting === 'fontSize') updateSetting('fontSize', value as any);
      if (setting === 'highContrast') updateSetting('highContrast', value === 'true' || value === true);
    } else if (tool.name === 'prepare_iot_command' && tool.args?.deviceId) {
      const dev = devices.find((d) => d.id === tool.args.deviceId) || devices[0];
      if (dev) requestCommand(dev, tool.args.action === 'turn_off' ? 'turn_off' : 'turn_on');
    }
  };

  const startVoice = () => {
    playActionSound('click');
    setVoiceError(null);
    setIsListening(true);
    speechService.startListening({
      language: language === 'vi' ? 'vi-VN' : language === 'zh' ? 'zh-CN' : 'en-US',
      onResult: (transcript, isFinal) => {
        setInput(transcript);
        if (isFinal) {
          setIsListening(false);
          handleSendMessage(transcript);
        }
      },
      onError: (err) => {
        setIsListening(false);
        setVoiceError(err);
      },
      onEnd: () => setIsListening(false),
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-4 dark:border-slate-800">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white flex items-center gap-3">
            <Sparkles className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
            <span>{t.assistant.title}</span>
          </h1>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
            {t.assistant.subtitle}
          </p>
        </div>

        <button
          onClick={() => {
            playActionSound('click');
            setMessages([]);
          }}
          className="flex items-center gap-2 px-3 py-2 text-xs font-bold text-slate-600 hover:text-slate-900 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300"
        >
          <Trash2 className="w-4 h-4" />
          <span>{t.assistant.clearChat}</span>
        </button>
      </div>

      {/* Capabilities Pills */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
        <div className="flex items-center gap-2 p-3 rounded-xl bg-blue-50 border border-blue-200 text-blue-900 dark:bg-blue-950 dark:border-blue-900 dark:text-blue-200 font-semibold">
          <Zap className="w-4 h-4 text-blue-600" />
          <span>Điều hướng trang nội bộ theo khẩu lệnh</span>
        </div>
        <div className="flex items-center gap-2 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 dark:bg-emerald-950 dark:border-emerald-900 dark:text-emerald-200 font-semibold">
          <CheckCircle className="w-4 h-4 text-emerald-600" />
          <span>Phóng to chữ & tương phản qua giọng nói</span>
        </div>
        <div className="flex items-center gap-2 p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 dark:bg-amber-950 dark:border-amber-900 dark:text-amber-200 font-semibold">
          <ShieldCheck className="w-4 h-4 text-amber-600" />
          <span>Luôn yêu cầu xác nhận trước khi bật thiết bị</span>
        </div>
      </div>

      {/* Main Chat Box */}
      <div className="rounded-3xl border-2 border-slate-200 bg-white shadow-sm dark:bg-slate-900 dark:border-slate-800 flex flex-col h-[520px]">
        {/* Messages list */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl p-4 text-sm md:text-base leading-relaxed ${
                  m.role === 'user'
                    ? 'bg-blue-600 text-white font-medium rounded-br-xs'
                    : 'bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-700 rounded-bl-xs'
                }`}
              >
                <div className="whitespace-pre-wrap">{m.content}</div>

                {m.toolCall && (
                  <div className="mt-3 pt-3 border-t border-slate-300 dark:border-slate-700">
                    <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 block">
                      Thao tác: {m.toolCall.name}
                    </span>
                    {m.toolCall.name === 'navigate_to' && (
                      <button
                        onClick={() => onNavigate(m.toolCall?.args?.page)}
                        className="mt-2 flex items-center gap-1.5 text-xs font-bold bg-blue-100 text-blue-800 px-3 py-1.5 rounded-lg"
                      >
                        <span>Chuyển đến trang</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                )}
              </div>

              {m.role === 'assistant' && (
                <button
                  onClick={() => {
                    if (isSpeaking) stopSpeech();
                    else speakText(m.content);
                  }}
                  className="mt-1 flex items-center gap-1 text-xs text-slate-500 hover:text-blue-600 px-2 py-1"
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
              )}
            </div>
          ))}

          {isLoading && (
            <div className="flex items-center gap-2 text-slate-500 text-sm p-3">
              <span className="w-3 h-3 rounded-full bg-blue-600 animate-ping" />
              <span>{t.assistant.aiWorking}</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Suggested Queries */}
        <div className="p-3 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex gap-2 overflow-x-auto">
          {[
            t.assistant.suggestion1,
            t.assistant.suggestion2,
            t.assistant.suggestion3,
            t.assistant.suggestion4,
          ].map((s, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(s)}
              className="shrink-0 px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-blue-50 hover:text-blue-700 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300 transition"
            >
              {s}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="border-t border-slate-200 p-4 bg-slate-50 dark:bg-slate-950 dark:border-slate-800 flex items-center gap-3 rounded-b-3xl"
        >
          <button
            type="button"
            onClick={isListening ? () => speechService.stopListening() : startVoice}
            className={`h-14 w-14 rounded-2xl flex items-center justify-center transition shrink-0 ${
              isListening
                ? 'bg-rose-600 text-white animate-pulse'
                : 'bg-slate-200 text-slate-700 hover:bg-slate-300 dark:bg-slate-800 dark:text-slate-200'
            }`}
            aria-label={t.assistant.voiceInput}
          >
            {isListening ? <MicOff className="w-7 h-7" /> : <Mic className="w-7 h-7" />}
          </button>

          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={t.assistant.placeholder}
            className="flex-1 h-14 rounded-2xl border border-slate-300 bg-white px-5 text-base text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:outline-hidden dark:bg-slate-900 dark:border-slate-700 dark:text-white"
          />

          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="h-14 px-6 rounded-2xl bg-blue-600 text-white font-bold flex items-center gap-2 hover:bg-blue-700 active:scale-95 transition disabled:opacity-50 shrink-0"
          >
            <span>{t.assistant.send}</span>
            <Send className="w-5 h-5" />
          </button>
        </form>
      </div>

      {voiceError && (
        <div className="p-4 rounded-xl bg-amber-50 border border-amber-300 text-amber-800 text-sm">
          {voiceError}
        </div>
      )}
    </div>
  );
};
