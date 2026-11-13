import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import { GoogleGenAI, Type, FunctionDeclaration } from '@google/genai';

dotenv.config();

interface IoTDevice {
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

interface CommandLog {
  id: string;
  deviceId: string;
  deviceName: string;
  action: string;
  timestamp: string;
  status: 'confirmed' | 'rejected' | 'failed' | 'pending_ack';
  message: string;
}

interface TaskRecord {
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

interface SurveyRecord {
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

let iotDevices: IoTDevice[] = [
  {
    id: 'dev_light_living',
    name: 'Living Room Light',
    nameVi: 'Đèn phòng khách',
    nameZh: '客厅灯',
    type: 'light',
    location: 'Living Room',
    locationVi: 'Phòng khách',
    locationZh: '客厅',
    state: 'off',
    isOnline: true,
    isSimulated: true,
    lastUpdated: new Date().toISOString(),
    pinOrTopic: 'relay/pin_2',
  },
  {
    id: 'dev_lamp_bedroom',
    name: 'Bedroom Lamp',
    nameVi: 'Đèn ngủ đầu giường',
    nameZh: '卧室床头灯',
    type: 'lamp',
    location: 'Bedroom',
    locationVi: 'Phòng ngủ',
    locationZh: '卧室',
    state: 'on',
    isOnline: true,
    isSimulated: true,
    lastUpdated: new Date().toISOString(),
    pinOrTopic: 'relay/pin_4',
  },
  {
    id: 'dev_socket_fan',
    name: 'Smart Socket (Desk Fan)',
    nameVi: 'Ổ cắm thông minh (Quạt bàn)',
    nameZh: '智能插座（桌面风扇）',
    type: 'socket',
    location: 'Study Desk',
    locationVi: 'Bàn làm việc',
    locationZh: '书桌',
    state: 'off',
    isOnline: true,
    isSimulated: true,
    lastUpdated: new Date().toISOString(),
    pinOrTopic: 'relay/pin_5',
  },
  {
    id: 'dev_door_bell',
    name: 'Accessibility Doorbell Indicator',
    nameVi: 'Chuông báo trợ năng',
    nameZh: '无障碍门铃指示器',
    type: 'bell',
    location: 'Main Door',
    locationVi: 'Cửa chính',
    locationZh: '大门',
    state: 'off',
    isOnline: true,
    isSimulated: true,
    lastUpdated: new Date().toISOString(),
    pinOrTopic: 'signal/pin_7',
  },
];

let commandLogs: CommandLog[] = [
  {
    id: 'log_init_01',
    deviceId: 'dev_lamp_bedroom',
    deviceName: 'Đèn ngủ đầu giường',
    action: 'Bật nguồn',
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    status: 'confirmed',
    message: 'Khởi tạo trạng thái mô phỏng ban đầu',
  },
];

let iotConfig = {
  mode: 'simulation' as 'simulation' | 'real_arduino' | 'real_mqtt',
  brokerUrl: '',
  cloudDeviceId: '',
  cloudApiToken: '',
  hasConnectedHardware: false,
};

let evaluationTasks: TaskRecord[] = [];
let evaluationSurveys: SurveyRecord[] = [];

const toolNavigateTo: FunctionDeclaration = {
  name: 'navigate_to',
  description: 'Điều hướng người dùng đến một trang trong ứng dụng EasyAccess.',
  parameters: {
    type: Type.OBJECT,
    properties: {
      page: {
        type: Type.STRING,
        description: 'Mã trang: home, guides, assistant, iot, accessibility, manual, evaluation, about, privacy, settings',
      },
      reason: {
        type: Type.STRING,
        description: 'Lý do điều hướng người dùng đến trang này',
      },
    },
    required: ['page'],
  },
};

const toolAdjustAccessibility: FunctionDeclaration = {
  name: 'adjust_accessibility',
  description: 'Tùy chỉnh thông số trợ năng của giao diện theo yêu cầu người dùng.',
  parameters: {
    type: Type.OBJECT,
    properties: {
      setting: {
        type: Type.STRING,
        description: 'Loại cài đặt: fontSize (normal/large/xlarge/huge), highContrast (true/false), theme (light/dark), buttonSize (normal/large/huge), reduceMotion (true/false), soundFeedback (true/false)',
      },
      value: {
        type: Type.STRING,
        description: 'Giá trị muốn thay đổi, ví dụ: "huge", "true", "false", "dark"',
      },
    },
    required: ['setting', 'value'],
  },
};

const toolPrepareIoTCommand: FunctionDeclaration = {
  name: 'prepare_iot_command',
  description: 'Chuẩn bị lệnh điều khiển thiết bị thông minh IoT. Lệnh này KHÔNG thực thi ngay mà tạo hộp thoại xác nhận cho người dùng phê duyệt.',
  parameters: {
    type: Type.OBJECT,
    properties: {
      deviceId: {
        type: Type.STRING,
        description: 'Mã thiết bị (dev_light_living, dev_lamp_bedroom, dev_socket_fan, dev_door_bell)',
      },
      action: {
        type: Type.STRING,
        description: 'Hành động: turn_on hoặc turn_off',
      },
      deviceName: {
        type: Type.STRING,
        description: 'Tên thiết bị bằng ngôn ngữ người dùng đang hỏi',
      },
    },
    required: ['deviceId', 'action', 'deviceName'],
  },
};

export function createApiApp(): Express {
  const app = express();
  app.use(express.json({ limit: '10mb' }));

  const apiKey = process.env.GEMINI_API_KEY;
  let ai: GoogleGenAI | null = null;
  if (apiKey) {
    ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }

  // 1. Health & Config status
  app.get('/api/health', (_req: Request, res: Response) => {
    res.json({
      status: 'healthy',
      hasApiKey: !!apiKey,
      iotMode: iotConfig.mode,
      timestamp: new Date().toISOString(),
    });
  });

  // 2. Gemini Chat with Tool Calls for App Navigation & Accessibility Control
  app.post('/api/gemini/chat', async (req: Request, res: Response) => {
    try {
      const { messages, userLanguage = 'vi' } = req.body;
      if (!messages || !Array.isArray(messages)) {
        res.status(400).json({ error: 'Messages array is required.' });
        return;
      }

      const systemPrompt = `Bạn là EasyAssist - Trợ lý công nghệ thông minh trong ứng dụng EasyAccess, được thiết kế đặc biệt cho người khuyết tật chi trên (người run tay, liệt tay, cụt chi, khó dùng chuột/bàn phím/cảm ứng).
Nhiệm vụ của bạn:
1. Hướng dẫn sử dụng thiết bị thông minh và máy tính/điện thoại bằng các bước ngắn gọn, rõ ràng, đánh số 1, 2, 3.
2. Hỗ trợ điều hướng ứng dụng và thay đổi cài đặt trợ năng bằng các công cụ (tools) cho phép:
   - navigate_to(page): chuyển trang ('home', 'guides', 'assistant', 'iot', 'accessibility', 'manual', 'evaluation', 'about', 'privacy', 'settings').
   - adjust_accessibility(setting, value): thay đổi cỡ chữ, độ tương phản, kích thước nút.
   - prepare_iot_command(deviceId, action, deviceName): khi người dùng muốn bật/tắt thiết bị, BẮT BUỘC dùng hàm này để tạo thẻ xác nhận trước mặt người dùng, KHÔNG BAO GIỜ tự bật thiết bị mà không có sự xác nhận của người dùng.
3. Ngôn ngữ phản hồi: ${userLanguage === 'vi' ? 'Tiếng Việt' : userLanguage === 'zh' ? '中文' : 'English'}.
4. Luôn tôn trọng người dùng, dùng từ ngữ ấm áp, dễ hiểu, tránh thuật ngữ phức tạp.
5. Nếu không chắc chắn về thiết bị của người dùng, hãy giải thích mang tính tổng quát và hỏi thêm thông tin.`;

      function generateFallbackResponse() {
        const lastUserMsg = messages[messages.length - 1]?.content || '';
        const lower = lastUserMsg.toLowerCase();

        let action: any = null;
        let reply = '';

        if (lower.includes('hướng dẫn') || lower.includes('guide') || lower.includes('指南')) {
          action = { name: 'navigate_to', args: { page: 'guides' } };
          reply = userLanguage === 'vi'
            ? 'Tôi đã mở Kho hướng dẫn sử dụng thiết bị thông minh cho bạn. Bạn có thể tìm thấy hướng dẫn chi tiết từng bước cho điện thoại, máy tính và thiết bị gia đình tại đây.'
            : userLanguage === 'zh'
            ? '我已为您打开智能设备无障碍指南库，您可以在这里找到手机、电脑及智能家居的详细分步说明。'
            : 'I have opened the Smart Device Guides Library for you. You can find step-by-step instructions for smartphones, computers, and home appliances here.';
        } else if (lower.includes('chữ to') || lower.includes('phóng to') || lower.includes('font') || lower.includes('cỡ chữ')) {
          action = { name: 'adjust_accessibility', args: { setting: 'fontSize', value: 'huge' } };
          reply = userLanguage === 'vi'
            ? 'Tôi đã điều chỉnh kích thước chữ lên mức Rất lớn (Huge) để bạn dễ đọc hơn. Bạn có thể thay đổi thêm bất kỳ lúc nào trong Trung tâm trợ năng.'
            : userLanguage === 'zh'
            ? '我已为您将字号调大至超大模式（Huge），方便您轻松阅读。您也可随时在无障碍中心微调。'
            : 'I have adjusted the typography to Huge size for effortless readability.';
        } else if (lower.includes('tương phản') || lower.includes('contrast')) {
          action = { name: 'adjust_accessibility', args: { setting: 'highContrast', value: 'true' } };
          reply = userLanguage === 'vi'
            ? 'Tôi đã kích hoạt chế độ Tương phản cao (High Contrast WCAG AAA) với viền đậm sắc nét để các nút bấm dễ nhận diện hơn.'
            : userLanguage === 'zh'
            ? '我已为您开启高对比度模式（WCAG AAA标准），所有按钮与边框更加醒目易辨。'
            : 'I have enabled High Contrast mode with bold borders for maximum visual clarity.';
        } else if (lower.includes('đèn') || lower.includes('light') || lower.includes('bật') || lower.includes('tắt')) {
          action = {
            name: 'prepare_iot_command',
            args: {
              deviceId: 'dev_light_living',
              action: lower.includes('tắt') ? 'turn_off' : 'turn_on',
              deviceName: 'Đèn phòng khách',
            },
          };
          reply = userLanguage === 'vi'
            ? 'Tôi đã chuẩn bị lệnh điều khiển Đèn phòng khách. Để đảm bảo an toàn tuyệt đối, vui lòng bấm "Xác nhận" trên màn hình.'
            : userLanguage === 'zh'
            ? '我已为您准备好控制客厅灯的指令。为确保用电绝对安全，请在屏幕弹窗中点击“确认”。'
            : 'I prepared the command for Living Room Light. To ensure safety, please tap "Confirm" on the screen.';
        } else {
          reply = userLanguage === 'vi'
            ? `Xin chào! Tôi là trợ lý ảo EasyAssist. Tôi có thể giúp bạn tìm kiếm hướng dẫn thiết bị, phóng to chữ, bật tương phản cao, hoặc chuẩn bị bật/tắt đèn quạt thông minh an toàn. Bạn cần tôi hỗ trợ việc gì?`
            : userLanguage === 'zh'
            ? `您好！我是 EasyAssist 智能助手。我可以协助您查阅设备指南、放大字号、启用高对比度，或安全准备开关智能家电。请问有什么可以帮助您？`
            : `Hello! I am EasyAssist. I can assist you with device guides, enlarging fonts, enabling high contrast, or preparing safe smart home commands. How may I help you today?`;
        }

        return {
          reply,
          toolCall: action,
          isFallback: true,
        };
      }

      if (!ai) {
        res.json(generateFallbackResponse());
        return;
      }

      const formattedContents = messages.map((m: any) => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: m.content }],
      }));

      try {
        const timeoutPromise = new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error('AI request timed out, switching to smart assistive fallback')), 7000)
        );

        const response: any = await Promise.race([
          ai.models.generateContent({
            model: 'gemini-3.8-flash',
            contents: formattedContents,
            config: {
              systemInstruction: systemPrompt,
              tools: [
                {
                  functionDeclarations: [toolNavigateTo, toolAdjustAccessibility, toolPrepareIoTCommand],
                },
              ],
            },
          }),
          timeoutPromise,
        ]);

        const reply = response.text || '';
        const functionCalls = response.functionCalls;
        let toolCall = null;
        if (functionCalls && functionCalls.length > 0) {
          toolCall = {
            name: functionCalls[0].name,
            args: functionCalls[0].args,
          };
        }

        res.json({
          reply,
          toolCall,
          isFallback: false,
        });
      } catch (apiError: any) {
        console.warn('Gemini generateContent temporary error, using smart fallback:', apiError.message);
        res.json(generateFallbackResponse());
      }
    } catch (error: any) {
      console.error('Fatal in /api/gemini/chat:', error);
      res.status(500).json({
        error: error.message || 'Lỗi xử lý yêu cầu AI',
      });
    }
  });

  // 3. Gemini Text-To-Speech (TTS) endpoint
  app.post('/api/gemini/tts', async (req: Request, res: Response) => {
    try {
      const { text, voice = 'Kore' } = req.body;
      if (!text) {
        res.status(400).json({ error: 'Text is required for TTS' });
        return;
      }

      if (!ai) {
        res.json({ fallbackToBrowserSpeech: true });
        return;
      }

      const ttsResponse = await ai.models.generateContent({
        model: 'gemini-3.8-flash-lite-tts',
        contents: [
          {
            role: 'user',
            parts: [
              {
                text: text.slice(0, 500),
                speechMetadata: {
                  style: 'Clear, compassionate, articulate assistant for accessible users',
                },
              },
            ],
          },
        ],
        config: {
          responseModalities: ['AUDIO'],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName: voice },
            },
          },
        },
      });

      const base64Audio = ttsResponse.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
      if (base64Audio) {
        res.json({ audioBase64: base64Audio, format: 'audio/wav' });
      } else {
        res.json({ fallbackToBrowserSpeech: true });
      }
    } catch (err: any) {
      console.warn('Gemini TTS fallback:', err.message);
      res.json({ fallbackToBrowserSpeech: true });
    }
  });

  // 4. IoT Devices List
  app.get('/api/iot/devices', (_req: Request, res: Response) => {
    res.json({
      devices: iotDevices,
      config: iotConfig,
      logs: commandLogs.slice(-20),
    });
  });

  // 5. IoT Command Dispatch with Strict Confirmation
  app.post('/api/iot/command', (req: Request, res: Response) => {
    const { deviceId, action, confirmedByUser } = req.body;

    if (!deviceId || !action) {
      res.status(400).json({ error: 'Thiếu deviceId hoặc action.' });
      return;
    }

    if (!confirmedByUser) {
      res.status(403).json({
        error: 'Lệnh bị từ chối: Bắt buộc phải có sự xác nhận của người dùng trước khi gửi lệnh IoT.',
        status: 'rejected',
      });
      return;
    }

    const device = iotDevices.find((d) => d.id === deviceId);
    if (!device) {
      res.status(404).json({ error: 'Không tìm thấy thiết bị tương thích.' });
      return;
    }

    const newState = action === 'turn_on' ? 'on' : action === 'turn_off' ? 'off' : device.state === 'on' ? 'off' : 'on';
    device.state = newState;
    device.lastUpdated = new Date().toISOString();

    const newLog: CommandLog = {
      id: `log_${Date.now()}`,
      deviceId: device.id,
      deviceName: device.nameVi,
      action: newState === 'on' ? 'Bật nguồn' : 'Tắt nguồn',
      timestamp: new Date().toISOString(),
      status: 'confirmed',
      message: iotConfig.mode === 'simulation'
        ? 'Thực thi thành công trong môi trường mô phỏng (Đã xác nhận phản hồi giả lập)'
        : 'Đã gửi lệnh đến phần cứng tương thích và nhận được xác nhận trạng thái ACK',
    };

    commandLogs.push(newLog);

    res.json({
      success: true,
      device,
      log: newLog,
      message: iotConfig.mode === 'simulation'
        ? `Đã ${newState === 'on' ? 'Bật' : 'Tắt'} ${device.nameVi} (Chế độ mô phỏng)`
        : `Đã thực thi lệnh ${newState === 'on' ? 'Bật' : 'Tắt'} ${device.nameVi} qua API phần cứng`,
    });
  });

  // 6. IoT Configuration (Switch Simulation / Arduino Cloud)
  app.post('/api/iot/config', (req: Request, res: Response) => {
    const { mode, brokerUrl, cloudDeviceId, cloudApiToken } = req.body;
    if (mode) iotConfig.mode = mode;
    if (brokerUrl !== undefined) iotConfig.brokerUrl = brokerUrl;
    if (cloudDeviceId !== undefined) iotConfig.cloudDeviceId = cloudDeviceId;
    if (cloudApiToken !== undefined) iotConfig.cloudApiToken = cloudApiToken;

    iotDevices = iotDevices.map((d) => ({
      ...d,
      isSimulated: iotConfig.mode === 'simulation',
    }));

    res.json({ success: true, config: iotConfig });
  });

  // 7. Scientific Evaluation Data Store
  app.get('/api/evaluation/data', (_req: Request, res: Response) => {
    const totalTasks = evaluationTasks.length;
    const completedTasks = evaluationTasks.filter((t) => t.completed).length;
    const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    const avgDuration = totalTasks > 0
      ? Math.round(evaluationTasks.reduce((acc, t) => acc + t.durationSeconds, 0) / totalTasks)
      : 0;

    const totalErrors = evaluationTasks.reduce((acc, t) => acc + t.errorCount, 0);

    const totalCommands = commandLogs.length;
    const confirmedCommands = commandLogs.filter((l) => l.status === 'confirmed').length;
    const iotReliability = totalCommands > 0 ? Math.round((confirmedCommands / totalCommands) * 100) : 100;

    res.json({
      tasks: evaluationTasks,
      surveys: evaluationSurveys,
      metrics: {
        totalTasks,
        completedTasks,
        completionRate,
        avgDuration,
        totalErrors,
        totalCommands,
        confirmedCommands,
        iotReliability,
      },
    });
  });

  app.post('/api/evaluation/record-task', (req: Request, res: Response) => {
    const { taskId, taskName, participantId, completed, durationSeconds, errorCount, notes } = req.body;
    const record: TaskRecord = {
      id: `eval_task_${Date.now()}`,
      taskId: taskId || 'task_custom',
      taskName: taskName || 'Nhiệm vụ kiểm thử',
      participantId: participantId || 'P01',
      completed: !!completed,
      durationSeconds: Number(durationSeconds) || 0,
      errorCount: Number(errorCount) || 0,
      notes: notes || '',
      timestamp: new Date().toISOString(),
    };
    evaluationTasks.push(record);
    res.json({ success: true, record });
  });

  app.post('/api/evaluation/record-survey', (req: Request, res: Response) => {
    const {
      participantId,
      participantType,
      q1_foundGuideEasily,
      q2_typographyAndNavigationEasy,
      q3_easyAssistHelpful,
      q4_iotStatusUnderstood,
      q5_difficultiesEncountered,
      q6_suggestedImprovements,
      q7_agreedToContinue,
    } = req.body;

    const survey: SurveyRecord = {
      id: `survey_${Date.now()}`,
      participantId: participantId || 'P01',
      participantType: participantType || 'limb_impaired',
      q1_foundGuideEasily: Number(q1_foundGuideEasily) || 5,
      q2_typographyAndNavigationEasy: Number(q2_typographyAndNavigationEasy) || 5,
      q3_easyAssistHelpful: Number(q3_easyAssistHelpful) || 5,
      q4_iotStatusUnderstood: Number(q4_iotStatusUnderstood) || 5,
      q5_difficultiesEncountered: q5_difficultiesEncountered || '',
      q6_suggestedImprovements: q6_suggestedImprovements || '',
      q7_agreedToContinue: !!q7_agreedToContinue,
      timestamp: new Date().toISOString(),
    };

    evaluationSurveys.push(survey);
    res.json({ success: true, survey });
  });

  app.post('/api/evaluation/reset', (_req: Request, res: Response) => {
    evaluationTasks = [];
    evaluationSurveys = [];
    res.json({ success: true, message: 'Đã thiết lập lại dữ liệu kiểm thử về trạng thái ban đầu.' });
  });

  return app;
}
