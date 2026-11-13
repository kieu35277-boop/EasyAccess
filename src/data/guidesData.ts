import { GuideItem } from '../types';

export const guidesData: GuideItem[] = [
  {
    id: 'guide_voice_access_android',
    category: 'phone',
    title: {
      vi: 'Cách sử dụng Voice Access trên điện thoại Android cho người run tay',
      en: 'How to use Voice Access on Android for motor-impaired users',
      zh: '肢体障碍人士如何在安卓手机上使用语音控制（Voice Access）',
    },
    summary: {
      vi: 'Điều khiển toàn bộ điện thoại bằng giọng nói mà không cần chạm tay vào màn hình cảm ứng.',
      en: 'Control your entire Android smartphone via voice commands without touching the capacitive screen.',
      zh: '无需手动触摸屏幕，完全通过语音指令操作整部安卓手机。',
    },
    deviceType: 'Android 10+ (Google Pixel, Samsung Galaxy, Xiaomi)',
    updatedAt: '2026-03-15',
    source: 'Google Accessibility Documentation (https://support.google.com/accessibility/android/)',
    tags: ['Android', 'Voice Access', 'Giọng nói', 'Khuyết tật tay'],
    steps: {
      vi: [
        {
          stepNumber: 1,
          title: 'Cài đặt và kích hoạt Voice Access',
          description: 'Mở ứng dụng "Cài đặt" (Settings) > chọn "Hỗ trợ tiếp cận" (Accessibility) > chọn "Voice Access". Gạt công tắc sang trạng thái BẬT.',
          note: 'Nếu chưa có, bạn có thể tải ứng dụng "Voice Access" miễn phí từ kho ứng dụng Google Play.',
        },
        {
          stepNumber: 2,
          title: 'Chọn chế độ gắn số nhãn (Number Labels)',
          description: 'Chọn chế độ "Show numbers for all clickable items". Trên màn hình, mỗi nút hoặc biểu tượng sẽ hiển thị một con số nhỏ.',
          note: 'Chế độ này rất hữu ích vì bạn chỉ cần đọc số thay vì phải đọc tên dài của nút.',
        },
        {
          stepNumber: 3,
          title: 'Bắt đầu ra lệnh bằng giọng nói',
          description: 'Nói "Hey Google, turn on Voice Access" hoặc chạm vào nút kích hoạt nổi. Đọc to số hiển thị trên nút bạn muốn bấm (ví dụ: nói "Một", "Bảy").',
        },
        {
          stepNumber: 4,
          title: 'Các khẩu lệnh thường dùng',
          description: 'Nói "Scroll down" (Cuộn xuống), "Go home" (Về màn hình chính), "Back" (Quay lại), "Open Chrome" (Mở trình duyệt).',
          note: 'Bạn có thể nói "Stop Voice Access" khi muốn tạm dừng nghe.',
        },
      ],
      en: [
        {
          stepNumber: 1,
          title: 'Install and enable Voice Access',
          description: 'Open Settings > Tap "Accessibility" > Tap "Voice Access". Toggle the switch to ON.',
          note: 'You can download Voice Access directly from Google Play if not pre-installed.',
        },
        {
          stepNumber: 2,
          title: 'Select Number Labels mode',
          description: 'Enable "Show numbers for all clickable items". A discrete number badge will appear on every button.',
          note: 'This allows you to simply say the number instead of pronouncing complex button names.',
        },
        {
          stepNumber: 3,
          title: 'Start issuing voice commands',
          description: 'Say "Hey Google, turn on Voice Access" or tap the activation bubble. Speak the number on the target button (e.g., "Tap 4").',
        },
        {
          stepNumber: 4,
          title: 'Essential Navigation Commands',
          description: 'Say "Scroll down", "Go home", "Back", or "Open YouTube". Say "Stop listening" when done.',
        },
      ],
      zh: [
        {
          stepNumber: 1,
          title: '安装并启用语音控制（Voice Access）',
          description: '打开手机“设置” > 选择“无障碍” > 点击“Voice Access”，将开关滑动至开启状态。',
          note: '如未预装，可在 Google Play 商店免费下载。',
        },
        {
          stepNumber: 2,
          title: '选择标签数字模式 (Number Labels)',
          description: '选择“为所有可点击项目显示数字编号”。此时界面上的每个按钮都会附带一个编号。',
          note: '此功能方便您直接呼唤数字即可点击，无需朗读冗长的按钮名称。',
        },
        {
          stepNumber: 3,
          title: '开始发出语音指令',
          description: '对手机说“Hey Google, 启动 Voice Access”，然后读出想要按下的按钮数字（例如说“1”或“5”）。',
        },
        {
          stepNumber: 4,
          title: '常用导航口令',
          description: '说“向下滚动”、“返回主屏幕”、“返回上一页”。操作完毕后说“停止聆听”即可退出。',
        },
      ],
    },
  },
  {
    id: 'guide_assistivetouch_ios',
    category: 'phone',
    title: {
      vi: 'Bật AssistiveTouch và Chạm mặt lưng (Back Tap) trên iPhone/iPad',
      en: 'Enable AssistiveTouch and Back Tap on iPhone/iPad',
      zh: '在 iPhone 和 iPad 上开启辅助触控（AssistiveTouch）与轻点背面',
    },
    summary: {
      vi: 'Tạo nút ảo trên màn hình và gõ nhẹ 2 lần vào lưng máy để chụp ảnh, về màn hình chính mà không cần bấm phím cứng.',
      en: 'Create a customizable virtual button and tap the back of iPhone to perform home/lock actions without hard presses.',
      zh: '在屏幕生成万能虚拟按键，并通过轻叩手机后盖2次实现锁屏与主屏返回。',
    },
    deviceType: 'iOS / iPadOS 14+',
    updatedAt: '2026-03-10',
    source: 'Apple Accessibility Support (https://support.apple.com/accessibility)',
    tags: ['iPhone', 'iPad', 'AssistiveTouch', 'Back Tap'],
    steps: {
      vi: [
        {
          stepNumber: 1,
          title: 'Bật nút ảo AssistiveTouch',
          description: 'Vào "Cài đặt" (Settings) > chọn "Trợ năng" (Accessibility) > chọn "Cảm ứng" (Touch) > chọn "AssistiveTouch" và gạt BẬT.',
        },
        {
          stepNumber: 2,
          title: 'Tùy chỉnh menu cấp cao nhất',
          description: 'Chọn "Tùy chỉnh menu cấp cao nhất". Bạn có thể giảm bớt các biểu tượng xuống chỉ còn 2-4 nút lớn: Màn hình chính, Khóa màn hình, Trung tâm thông báo.',
          note: 'Giảm số lượng nút giúp kích thước mỗi nút to hơn, dễ bấm hơn cho người run tay.',
        },
        {
          stepNumber: 3,
          title: 'Kích hoạt Chạm vào mặt sau (Back Tap)',
          description: 'Trong mục Cảm ứng (Touch), cuộn xuống dưới cùng và chọn "Chạm vào mặt sau" (Back Tap). Chọn "Chạm hai lần" (Double Tap) gắn với "Màn hình chính".',
          note: 'Khi tay yếu không bấm được nút cứng, bạn chỉ cần gõ nhẹ mu bàn tay vào mặt lưng điện thoại.',
        },
      ],
      en: [
        {
          stepNumber: 1,
          title: 'Turn on AssistiveTouch',
          description: 'Open Settings > Accessibility > Touch > AssistiveTouch. Turn the toggle ON.',
        },
        {
          stepNumber: 2,
          title: 'Customize Top Level Menu',
          description: 'Select "Customize Top Level Menu". Reduce icons to 2-4 essential items (Home, Lock, Notification Center) to maximize touch button size.',
        },
        {
          stepNumber: 3,
          title: 'Enable Back Tap feature',
          description: 'Under Accessibility > Touch, scroll to "Back Tap". Assign "Double Tap" to "Home" or "Siri". Simply tap the phone back with knuckles or palm.',
        },
      ],
      zh: [
        {
          stepNumber: 1,
          title: '开启辅助触控（小圆点）',
          description: '进入“设置” > “辅助功能” > “触控” > “辅助触控”，开启开关。',
        },
        {
          stepNumber: 2,
          title: '自定义顶层菜单',
          description: '点击“自定顶层菜单”，建议将图标缩减为2至4个核心按键（主屏幕、锁定屏幕、通知中心），使每个按钮面积更大。',
        },
        {
          stepNumber: 3,
          title: '启用轻点背面 (Back Tap)',
          description: '在触控页面滑到底部，点击“轻点背面”，将“轻点两下”设为“主屏幕”。手指力量受限时，用手背或手关节轻敲手机后背即可。',
        },
      ],
    },
  },
  {
    id: 'guide_switch_access',
    category: 'switch_access',
    title: {
      vi: 'Hướng dẫn kết nối và cài đặt công tắc điều khiển (Switch Access)',
      en: 'Guide to Connecting and Configuring Switch Access',
      zh: '外接微动开关控制（Switch Access）连接与设置指南',
    },
    summary: {
      vi: 'Sử dụng 1 hoặc 2 nút bấm ngoài lớn (hoặc công tắc bằng cằm/chân/thổi hơi) để điều khiển máy tính và điện thoại.',
      en: 'Use one or two external adaptive buttons, foot pedals, or sip-and-puff switches to navigate computers and phones.',
      zh: '使用外接单键或双键大按钮（或脚踏、吹气开关）全功能操作电脑与手机。',
    },
    deviceType: 'Windows 11, Android Switch Access, macOS Switch Control',
    updatedAt: '2026-02-28',
    source: 'W3C Web Accessibility Initiative & Assistive Technology Standards',
    tags: ['Switch Access', 'Công tắc ngoài', 'Trợ năng vận động'],
    steps: {
      vi: [
        {
          stepNumber: 1,
          title: 'Kết nối thiết bị công tắc với máy',
          description: 'Cắm bộ chuyển đổi công tắc qua cổng USB hoặc ghép đôi công tắc trợ năng qua Bluetooth.',
          note: 'Đảm bảo công tắc đã được sạc pin hoặc cấp nguồn đầy đủ.',
        },
        {
          stepNumber: 2,
          title: 'Cài đặt chế độ quét (Scanning Method)',
          description: 'Vào cài đặt Trợ năng > Điều khiển bằng công tắc. Chọn chế độ "Quét tự động" (Auto-scan) hoặc "Quét theo bước với 2 công tắc" (Step scan).',
          note: 'Chế độ quét tự động sẽ di chuyển khung chọn lần lượt qua các mục, bạn chỉ cần nhấn nút khi khung chạm tới mục mong muốn.',
        },
        {
          stepNumber: 3,
          title: 'Điều chỉnh thời gian quét (Scanning Speed)',
          description: 'Đặt thời gian quét ở mức 1.5 giây hoặc 2.0 giây cho mỗi mục để người dùng có phản xạ chậm không bị lỡ nhịp.',
        },
      ],
      en: [
        {
          stepNumber: 1,
          title: 'Connect the Switch Interface',
          description: 'Plug your switch interface into the USB port or pair the wireless assistive switch via Bluetooth.',
        },
        {
          stepNumber: 2,
          title: 'Configure the Scanning Method',
          description: 'Navigate to Accessibility > Switch Access / Switch Control. Select "Auto-scan" for single-switch use or "Step scan" for two switches.',
        },
        {
          stepNumber: 3,
          title: 'Tune Scanning Speed',
          description: 'Set scanning speed to 1.5 or 2.0 seconds per item to allow comfortable cognitive and motor reaction time.',
        },
      ],
      zh: [
        {
          stepNumber: 1,
          title: '连接外接开关适配器',
          description: '将微动开关接口箱通过 USB 插入电脑/手机，或通过蓝牙与无障碍开关配对。',
        },
        {
          stepNumber: 2,
          title: '配置项目扫描方式 (Scanning Method)',
          description: '进入无障碍设置中的“切换控制/开关控制”，单开关用户推荐选择“自动扫描”，双开关用户选择“步进扫描”。',
        },
        {
          stepNumber: 3,
          title: '调整扫描间隔速度',
          description: '将扫描停顿时间设为 1.5 秒或 2.0 秒，确保在肢体反应延迟时不会错过目标控件。',
        },
      ],
    },
  },
  {
    id: 'guide_smart_light_automation',
    category: 'smarthome',
    title: {
      vi: 'Thiết lập điều khiển đèn thông minh qua giọng nói và lịch trình tự động',
      en: 'Setting up Smart Lights via Voice and Autonomous Schedules',
      zh: '通过语音与自动日程控制智能灯泡',
    },
    summary: {
      vi: 'Giúp người khó với tay bật công tắc tường có thể điều khiển ánh sáng bằng giọng nói hoặc theo giờ sinh hoạt.',
      en: 'Enables individuals unable to reach physical wall switches to illuminate rooms via voice or daylight scheduling.',
      zh: '帮助难以触及墙壁实体开关的人士通过语音或生活日程掌控室内灯光。',
    },
    deviceType: 'Đèn Wi-Fi / Zigbee (Tuya, Philips Hue, Yeelight, Arduino Relay)',
    updatedAt: '2026-03-01',
    source: 'Arduino Cloud & Matter Smart Home Protocols',
    tags: ['Đèn thông minh', 'Smart Light', 'IoT', 'Nhà thông minh'],
    steps: {
      vi: [
        {
          stepNumber: 1,
          title: 'Lắp đặt đèn thông minh an toàn',
          description: 'Nhờ người hỗ trợ vặn bóng đèn thông minh vào đui đèn chuẩn E27. Bật công tắc tường một lần duy nhất và giữ nguyên trạng thái bật nguồn.',
          note: 'Cảnh báo an toàn: Người có hạn chế chi trên không nên tự ý trèo ghế cao để thay bóng đèn.',
        },
        {
          stepNumber: 2,
          title: 'Kết nối đèn với mạng Wi-Fi 2.4GHz',
          description: 'Mở ứng dụng điều khiển trên điện thoại và chọn kết nối thiết bị với Wi-Fi gia đình.',
        },
        {
          stepNumber: 3,
          title: 'Tạo lịch bật tắt tự động theo giờ',
          description: 'Cài đặt tự động bật đèn lúc 18:30 tối và tự động giảm sáng lúc 22:30 để không phải nhớ bật tắt hàng ngày.',
        },
        {
          stepNumber: 4,
          title: 'Liên kết với EasyAccess hoặc trợ lý giọng nói',
          description: 'Bạn có thể mở mục "Điều khiển IoT" trong EasyAccess để điều khiển đèn chỉ với 2 lần chạm xác nhận.',
        },
      ],
      en: [
        {
          stepNumber: 1,
          title: 'Safely Install the Smart Bulb',
          description: 'Have a caregiver screw the E27 bulb into the fixture. Keep the physical wall switch turned on at all times.',
          note: 'Safety precaution: Users with upper-limb impairments should not climb ladders to install ceiling fixtures.',
        },
        {
          stepNumber: 2,
          title: 'Pair bulb with 2.4GHz Wi-Fi',
          description: 'Follow the app instructions to connect the fixture to your home wireless network.',
        },
        {
          stepNumber: 3,
          title: 'Configure automated schedules',
          description: 'Set daily automations (e.g. 6:30 PM turn on, 10:30 PM dim warm light) to eliminate repetitive physical overhead.',
        },
        {
          stepNumber: 4,
          title: 'Link with EasyAccess IoT Dashboard',
          description: 'Access the EasyAccess IoT tab to trigger state changes safely with our verified 2-step modal.',
        },
      ],
      zh: [
        {
          stepNumber: 1,
          title: '安全安装智能灯泡',
          description: '请看护人员协助将 E27 接口智能灯泡拧入灯座，将墙壁实体开关保持在通电开启状态。',
          note: '安全警告：肢体不便人士切勿自行登高安装吊顶灯具。',
        },
        {
          stepNumber: 2,
          title: '连接至 2.4GHz Wi-Fi 网络',
          description: '根据提示将智能灯具添加至本地局域网中。',
        },
        {
          stepNumber: 3,
          title: '创建日落自动开灯日程',
          description: '设置在傍晚 18:30 自动开启，夜间 22:30 调暗为柔和睡眠色温，免去手动开关的繁复负担。',
        },
        {
          stepNumber: 4,
          title: '联动 EasyAccess IoT 控制台',
          description: '在 EasyAccess 中通过双重防误触按钮，轻松下达开灯与关灯指令。',
        },
      ],
    },
  },
  {
    id: 'guide_windows_voice_access',
    category: 'computer',
    title: {
      vi: 'Sử dụng Voice Access và Bàn phím ảo trên máy tính Windows 11',
      en: 'Using Voice Access and On-Screen Keyboard in Windows 11',
      zh: '在 Windows 11 上使用语音访问（Voice Access）与屏幕软键盘',
    },
    summary: {
      vi: 'Điều khiển con trỏ chuột, gõ văn bản và mở phần mềm hoàn toàn bằng giọng nói trên máy tính để bàn và laptop.',
      en: 'Control cursor movements, dictate text, and launch desktop apps entirely with voice on Windows 11 PCs.',
      zh: '在电脑上通过语音控制鼠标光标、口述输入文本以及打开各类应用软件。',
    },
    deviceType: 'Windows 11 (Version 22H2 hoặc mới hơn)',
    updatedAt: '2026-03-05',
    source: 'Microsoft Accessibility Support (https://support.microsoft.com/accessibility)',
    tags: ['Windows 11', 'Voice Access', 'Máy tính', 'Bàn phím ảo'],
    steps: {
      vi: [
        {
          stepNumber: 1,
          title: 'Bật Voice Access trên Windows 11',
          description: 'Nhấn phím tắt Windows + Ctrl + S hoặc vào Cài đặt (Settings) > Trợ năng (Accessibility) > Giọng nói (Speech) > gạt BẬT "Voice access".',
        },
        {
          stepNumber: 2,
          title: 'Tải gói ngôn ngữ giọng nói',
          description: 'Hệ thống sẽ tải gói nhận diện giọng nói offline trên máy để đảm bảo tốc độ phản hồi nhanh và bảo mật riêng tư.',
        },
        {
          stepNumber: 3,
          title: 'Điều khiển chuột bằng lưới tọa độ (Mouse Grid)',
          description: 'Nói "Show grid" (Hiện lưới). Màn hình sẽ chia thành 9 ô số. Đọc số ô bạn muốn di chuyển tới (ví dụ: "Five"), sau đó nói "Click" để nhấp chuột.',
          note: 'Tính năng này giúp bạn nhấp chuột chính xác vào bất kỳ điểm nào trên màn hình mà không cần cầm chuột vật lý.',
        },
      ],
      en: [
        {
          stepNumber: 1,
          title: 'Launch Voice Access in Windows 11',
          description: 'Press Windows + Ctrl + S or open Settings > Accessibility > Speech > Toggle "Voice access" to ON.',
        },
        {
          stepNumber: 2,
          title: 'Download Speech Model',
          description: 'Allow Windows to download the on-device acoustic model for rapid and secure offline recognition.',
        },
        {
          stepNumber: 3,
          title: 'Operate the Cursor with Mouse Grid',
          description: 'Say "Show grid" to divide the screen into 9 quadrants. Say the quadrant number (e.g., "5") and say "Click" to select precisely.',
        },
      ],
      zh: [
        {
          stepNumber: 1,
          title: '在 Windows 11 中启动语音访问',
          description: '按下快捷键 Win + Ctrl + S，或进入“设置” > “辅助功能” > “语音”，将“语音访问”切换为开。',
        },
        {
          stepNumber: 2,
          title: '下载端侧离线语音模型',
          description: '系统将自动下载本地语音处理模型，确保无延迟且隐私不离机。',
        },
        {
          stepNumber: 3,
          title: '使用鼠标网格（Mouse Grid）精确定位',
          description: '说出口令“Show grid”（显示网格），屏幕会划分成九宫格编号。呼唤数字（如“5”）并说“Click”即可完成鼠标点击。',
        },
      ],
    },
  },
  {
    id: 'guide_smart_socket_safety',
    category: 'troubleshooting',
    title: {
      vi: 'Nguyên tắc an toàn và chống ngắt kết nối cho ổ cắm thông minh',
      en: 'Safety Guidelines and Connection Resilience for Smart Sockets',
      zh: '智能插座安全用电与抗网络波动防断连指南',
    },
    summary: {
      vi: 'Cách bố trí ổ cắm điều khiển quạt, ấm nước đúng cách, chống sốc điện và tự động xử lý khi mất mạng Wi-Fi.',
      en: 'Best practices for controlling fans and heaters via smart plugs with power surge protection and offline fail-safes.',
      zh: '正确使用智能插座控制风扇与电器的安全准则，以及Wi-Fi中断时的安全保障。',
    },
    deviceType: 'Ổ cắm thông minh Wi-Fi 10A/16A có cầu chì bảo vệ',
    updatedAt: '2026-02-20',
    source: 'National Electrical Safety Code & NIST AI/IoT Safety Guidelines',
    tags: ['Ổ cắm thông minh', 'An toàn điện', 'Khắc phục sự cố'],
    steps: {
      vi: [
        {
          stepNumber: 1,
          title: 'Giới hạn công suất thiết bị cắm vào',
          description: 'Chỉ cắm các thiết bị tiêu thụ công suất dưới 1000W (như quạt bàn, đèn học, máy xông tinh dầu). Tuyệt đối không cắm máy hàn hoặc bếp từ công suất lớn.',
        },
        {
          stepNumber: 2,
          title: 'Cài đặt chế độ khi có điện trở lại (Power-on State)',
          description: 'Trong phần mềm ổ cắm, luôn chọn trạng thái "OFF" (Mặc định TẮT) sau khi bị cúp điện rồi có điện trở lại để tránh thiết bị tự bật nguy hiểm.',
        },
        {
          stepNumber: 3,
          title: 'Xử lý khi thiết bị báo Ngoại tuyến (Offline)',
          description: 'Nếu EasyAccess báo thiết bị ngoại tuyến, kiểm tra cục phát Wi-Fi. Hệ thống sẽ KHÔNG tự động gửi dồn lệnh khi kết nối lại.',
        },
      ],
      en: [
        {
          stepNumber: 1,
          title: 'Strict Wattage Limits',
          description: 'Only connect appliances rated below 1000W (desk fans, lamps, chargers). Never attach heavy heating elements without physical circuit breakers.',
        },
        {
          stepNumber: 2,
          title: 'Configure Power-On State to OFF',
          description: 'Ensure the smart plug firmware defaults to OFF after a utility blackout to prevent unmonitored re-energization.',
        },
        {
          stepNumber: 3,
          title: 'Handling Offline Warnings',
          description: 'When EasyAccess indicates an appliance is Offline, verify your router. No pending commands will silently burst upon reconnection.',
        },
      ],
      zh: [
        {
          stepNumber: 1,
          title: '严控负载功率上限',
          description: '仅接入额定功率低于 1000W 的安全电器（桌面风扇、阅读台灯等），严禁接入无防倾倒保护的电暖炉或大功率电炉。',
        },
        {
          stepNumber: 2,
          title: '将“断电后恢复状态”设为“关闭”',
          description: '在设置中务必将掉电恢复初始状态配置为“OFF”，防止小区突发停电又来电后设备在无看护下私自通电。',
        },
        {
          stepNumber: 3,
          title: '离线状态安全机制',
          description: '当 EasyAccess 提示设备离线时，系统会自动丢弃堆积指令，绝不会在网络恢复瞬间突发执行历史陈旧指令。',
        },
      ],
    },
  },
];
