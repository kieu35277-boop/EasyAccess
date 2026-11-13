import React, { useState } from 'react';
import {
  HelpCircle,
  Volume2,
  Square,
  Globe,
  Sliders,
  Keyboard,
  Sparkles,
  Cpu,
  WifiOff,
  Download,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { useI18n } from '../locales';
import { useAccessibility } from '../context/AccessibilityContext';

export const AppManualPage: React.FC = () => {
  const { t } = useI18n();
  const { speakText, stopSpeech, isSpeaking, playActionSound } = useAccessibility();
  const [openSections, setOpenSections] = useState<Record<number, boolean>>({
    0: true,
    1: true,
  });

  const toggleSection = (idx: number) => {
    playActionSound('click');
    setOpenSections((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  const manualChapters = [
    {
      title: '1. Giới thiệu tổng quan về EasyAccess',
      icon: Sparkles,
      content:
        'EasyAccess là sản phẩm nghiên cứu khoa học được thiết kế đặc thù cho người khuyết tật chi trên, người có bàn tay run yếu, hoặc người gặp khó khăn khi cầm chuột và chạm màn hình cảm ứng nhỏ. Ứng dụng tích hợp trí tuệ nhân tạo (AI Gemini) và công nghệ điều khiển thiết bị (IoT) với giao diện tuân thủ tiêu chuẩn trợ năng quốc tế WCAG 2.2 AA.',
    },
    {
      title: '2. Cách thay đổi ngôn ngữ hiển thị',
      icon: Globe,
      content:
        'Ở góc trên bên phải thanh tiêu đề (Header), hãy bấm vào nút "VI" (hoặc "EN", "中文"). Một menu danh sách sẽ thả xuống cho phép bạn chọn giữa 3 ngôn ngữ: Tiếng Việt, English, hoặc 简体中文. Lựa chọn của bạn sẽ được tự động lưu lại cho các lần truy cập tiếp theo.',
    },
    {
      title: '3. Cách phóng to chữ, đổi tương phản và màu nền',
      icon: Sliders,
      content:
        'Truy cập mục "Trung tâm trợ năng" từ menu. Tại đây bạn có thể chọn 4 mức cỡ chữ (Bình thường, Lớn, Rất lớn, Cực đại 22px), bật chế độ Tương phản cao (High Contrast WCAG AAA) với viền đậm và nền tối ưu hóa, phóng to vùng chạm nút bấm lên tới 64px, và giãn khoảng cách giữa các nút để tránh bấm nhầm khi run tay.',
    },
    {
      title: '4. Điều hướng ứng dụng bằng bàn phím & công tắc ngoài',
      icon: Keyboard,
      content:
        'Bạn có thể điều khiển toàn bộ trang web mà không cần dùng chuột: Nhấn phím TAB để di chuyển lần lượt qua các nút bấm (mỗi nút khi được chọn sẽ có viền xanh đậm 3px rất rõ nét). Nhấn tổ hợp phím SHIFT + TAB để lùi lại mục trước. Nhấn phím ENTER hoặc SPACEBAR để kích hoạt nút được chọn.',
    },
    {
      title: '5. Cách sử dụng trợ lý ảo EasyAssist bằng giọng nói và văn bản',
      icon: Sparkles,
      content:
        'Nhấn vào nút "Trợ lý AI" ở thanh tiêu đề hoặc mở từ menu bên cạnh. Bạn có thể nhấn vào biểu tượng Micro để đọc khẩu lệnh (ví dụ: "Phóng to chữ", "Bật tương phản cao", "Hướng dẫn tôi bật đèn phòng khách"). EasyAssist sẽ thấu hiểu và tự động thực hiện thao tác hoặc đưa ra các bước hướng dẫn cụ thể.',
    },
    {
      title: '6. Cách bật chức năng đọc nội dung thành tiếng (TTS)',
      icon: Volume2,
      content:
        'Bên cạnh mỗi câu trả lời của trợ lý AI và từng bước hướng dẫn trong thư viện đều có biểu tượng loa "Đọc nội dung". Khi nhấn vào, hệ thống sẽ sử dụng giọng đọc tiếng Việt rõ ràng để đọc nội dung cho bạn. Bạn có thể nhấn lại nút hình vuông màu đỏ để dừng đọc bất cứ lúc nào.',
    },
    {
      title: '7. Cách tra cứu và tìm kiếm hướng dẫn thiết bị',
      icon: HelpCircle,
      content:
        'Mở mục "Kho hướng dẫn". Nhập từ khóa bạn quan tâm vào ô tìm kiếm lớn hoặc chọn các thẻ danh mục như Điện thoại, Máy tính, Nhà thông minh, Công tắc ngoài. Nhấn "Xem hướng dẫn chi tiết" để mở chế độ đọc từng bước với các nút chuyển bước lớn.',
    },
    {
      title: '8. Cách kết nối và điều khiển thiết bị IoT an toàn',
      icon: Cpu,
      content:
        'Mở mục "Điều khiển IoT". Mặc định hệ thống chạy chế độ "Mô phỏng an toàn". Bạn có thể nhấn vào nút "BẬT/TẮT THIẾT BỊ". Hệ thống LUÔN hiển thị một hộp thoại xác nhận 2 bước ghi rõ tên thiết bị và vị trí. Chỉ khi bạn bấm "Xác nhận", lệnh mới được gửi đi. Để kết nối thiết bị thật, chọn tab "Cấu hình phần cứng" và nhập API Token của Arduino Cloud hoặc MQTT.',
    },
    {
      title: '9. Cách xử lý khi mất kết nối mạng Internet',
      icon: WifiOff,
      content:
        'Khi mất mạng, thanh thông báo màu vàng sẽ xuất hiện. Toàn bộ kho hướng dẫn và các thiết lập trợ năng đã được lưu trữ ngoại tuyến (Offline Caching) nên bạn vẫn có thể đọc bình thường. Hệ thống sẽ tạm dừng gửi lệnh IoT và TUYỆT ĐỐI không dồn lệnh gửi liên tiếp khi có mạng trở lại để đảm bảo an toàn điện.',
    },
    {
      title: '10. Cách cài đặt EasyAccess thành ứng dụng (PWA) trên mọi thiết bị',
      icon: Download,
      content:
        'Trên máy tính và Android: Nhấn nút "Cài đặt ứng dụng" màu xanh lá cây ở thanh tiêu đề, sau đó chọn "Install" trên thông báo trình duyệt. Trên iPhone / iPad (Safari): Nhấn biểu tượng "Chia sẻ" (Share - mũi tên chỉ lên) ở thanh dưới cùng Safari, cuộn xuống và chọn "Thêm vào màn hình chính" (Add to Home Screen). Sau khi cài, ứng dụng sẽ xuất hiện như một app độc lập trên máy của bạn.',
    },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-300">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white flex items-center gap-3">
          <HelpCircle className="w-8 h-8 text-blue-600 dark:text-blue-400" />
          <span>{t.manual.title}</span>
        </h1>
        <p className="mt-1 text-sm sm:text-base text-slate-600 dark:text-slate-300">
          {t.manual.subtitle}
        </p>
      </div>

      <div className="space-y-4">
        {manualChapters.map((ch, idx) => {
          const Icon = ch.icon;
          const isOpen = !!openSections[idx];

          return (
            <div
              key={idx}
              className="rounded-2xl border-2 border-slate-200 bg-white overflow-hidden shadow-xs dark:bg-slate-900 dark:border-slate-800 transition"
            >
              <button
                onClick={() => toggleSection(idx)}
                aria-expanded={isOpen}
                className="w-full flex items-center justify-between p-5 text-left font-bold text-base md:text-lg text-slate-900 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-800 transition"
              >
                <div className="flex items-center gap-3.5">
                  <div className="p-2.5 rounded-xl bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300 shrink-0">
                    <Icon className="w-5 h-5" />
                  </div>
                  <span>{ch.title}</span>
                </div>
                {isOpen ? (
                  <ChevronUp className="w-5 h-5 text-slate-400 shrink-0" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-slate-400 shrink-0" />
                )}
              </button>

              {isOpen && (
                <div className="px-5 pb-5 pt-1 text-sm md:text-base leading-relaxed text-slate-600 dark:text-slate-300 border-t border-slate-100 dark:border-slate-800">
                  <p>{ch.content}</p>

                  <div className="mt-4 pt-3 flex items-center justify-between border-t border-slate-100 dark:border-slate-800">
                    <button
                      onClick={() => {
                        if (isSpeaking) stopSpeech();
                        else speakText(`${ch.title}. ${ch.content}`);
                      }}
                      className="flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-800 dark:text-blue-400"
                    >
                      {isSpeaking ? (
                        <>
                          <Square className="w-4 h-4 text-rose-500" />
                          <span>Dừng đọc</span>
                        </>
                      ) : (
                        <>
                          <Volume2 className="w-4 h-4" />
                          <span>Đọc chương này thành tiếng</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
