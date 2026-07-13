import React, { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, MessageCircle, ArrowLeft } from 'lucide-react';
import { useDiagnosticStore } from '../store/diagnosticStore';
import { saveProgress } from '../services/supabase';

const ConsultantChat: React.FC = () => {
  const {
    sessionId,
    userName,
    companyName,
    sectorL1,
    sectorL2,
    intakeAnswers,
    universalAnswers,
    sectorAnswers,
    report,
    conversationHistory,
    setField
  } = useDiagnosticStore();

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversationHistory, loading]);

  if (!report) return null;

  const handleSend = async (messageText: string) => {
    if (!messageText.trim() || loading) return;

    setError(null);
    const userMessage = { role: 'user' as const, text: messageText };
    const updatedHistory = [...conversationHistory, userMessage];
    
    // Update local Zustand state
    setField('conversationHistory', updatedHistory);
    setInput('');
    setLoading(true);

    // Track user message count and keywords for referral trigger (PROMPT_29)
    const userMsgCount = updatedHistory.filter(m => m.role === 'user').length;
    const referralKeywords = ['حجز', 'جلس', 'أحمد', 'احمد', 'رمضان', 'اتصال', 'تواصل', 'موعد', 'تطبيق', 'مجاني', 'مجانه', 'مكالمه', 'مكالمة'];
    const hasKeyword = referralKeywords.some(kw => messageText.toLowerCase().includes(kw));
    const shouldForceReferral = userMsgCount >= 4 || hasKeyword;

    try {
      // Persist to Supabase if browser has internet
      try {
        await saveProgress(sessionId, { chat_history: updatedHistory });
      } catch (e) {
        console.error("Supabase sync failed (offline or column missing)", e);
      }

      const response = await fetch('/api/consult', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sessionId,
          conversationHistory: updatedHistory.slice(0, -1), // pass previous history
          newMessage: messageText,
          forceReferral: shouldForceReferral,
          fullContext: {
            companyData: intakeAnswers,
            universalAnswers,
            sectorAnswers,
            generatedReport: report,
            sectorL1,
            sectorL2
          }
        })
      });

      if (!response.ok) {
        throw new Error('حدث خطأ في الاتصال بالمستشار الاستراتيجي.');
      }

      const data = await response.json();
      if (data.text) {
        const modelMessage = { role: 'model' as const, text: data.text };
        const finalHistory = [...updatedHistory, modelMessage];
        
        // Update Zustand state
        setField('conversationHistory', finalHistory);
        
        // Sync with Supabase
        try {
          await saveProgress(sessionId, { chat_history: finalHistory });
        } catch (e) {
          console.error("Supabase sync failed (offline or column missing)", e);
        }
      } else {
        throw new Error('لم يتم استلام رد صالح من المستشار.');
      }
    } catch (err: any) {
      console.error("Consultation Chat Error:", err);
      setError(err.message || 'حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى.');
      // Revert user message if failed to make it clean, or keep it. Let's keep it but show error.
    } finally {
      setLoading(false);
    }
  };

  const prefilledQuestions = [
    "كيف يمكنني البدء في معالجة النقاط العمياء التي ظهرت؟",
    "ما هو الإجراء ذو الأولوية القصوى الذي تنصحني بالبدء به غداً؟",
    "كيف أتعامل مع حرب الأسعار والمنافسة الشديدة في قطاع التجزئة؟"
  ];

  // Helper to detect and render Ahmed Ramadan (BIK) referral offer card
  const renderMessageContent = (msg: { role: 'user' | 'model'; text: string }) => {
    const isReferral = msg.text.includes('[REFERRAL_POINT]');
    const cleanText = msg.text.replace('[REFERRAL_POINT]', '').trim();

    const ahmedWhatsapp = import.meta.env.VITE_AHMED_WHATSAPP || '201066966515';
    const referralWaMessage = `أهلاً أستاذ أحمد رمضان، قمت بعمل تشخيص لشركتي (${companyName}) وأرغب في حجز الجلسة الاستشارية المجانية لمناقشة التقرير التشخيصي وتطبيق التوصيات.`;
    const referralWaLink = `https://wa.me/${ahmedWhatsapp}?text=${encodeURIComponent(referralWaMessage)}`;

    return (
      <div className="space-y-4">
        <p className="whitespace-pre-wrap leading-relaxed">{cleanText}</p>
        
        {isReferral && (
          <div className="mt-4 bg-gradient-to-r from-[#10B981]/10 to-emerald-500/10 border-2 border-[#10B981] rounded-2xl p-5 shadow-sm text-slate-800 animate-fade-in">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-2xl">🎁</span>
              <h4 className="font-bold text-lg text-emerald-800 font-arabic">عرض خاص وجلسة استشارية مجانية</h4>
            </div>
            
            <p className="text-sm text-slate-700 leading-relaxed mb-4">
              بناءً على التحديات والنقاط العمياء التي كشفها التشخيص الاستراتيجي لشركتك <strong>{companyName}</strong>، يسعدنا دعوتك لجلسة استشارية مجانية مدتها <strong>30 دقيقة</strong> مباشرة مع المستشار <strong>أحمد رمضان (BIK Business Solutions)</strong> لتصميم خطة عمل مخصصة وتطبيق التوصيات على أرض الواقع.
            </p>

            <ul className="space-y-1 text-xs text-slate-600 mb-4 list-disc list-inside">
              <li>مناقشة تفصيلية للنقاط العمياء وحلولها المباشرة</li>
              <li>تحديد الأولويات التشغيلية للـ 90 يوماً القادمة</li>
              <li>تقييم جاهزية الشركة للتحول الرقمي والأتمتة</li>
            </ul>

            <a
              href={referralWaLink}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-[#10B981] hover:bg-emerald-600 text-white p-3 rounded-xl font-bold flex justify-center items-center gap-2 shadow-md transition-colors text-center"
            >
              <MessageCircle size={18} />
              <span>احجز جلستك المجانية الآن عبر واتساب</span>
            </a>
          </div>
        )}
      </div>
    );
  };

  return (
    <section id="strategic-chat-section" className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-10 mb-8">
      <div className="flex items-center gap-3 mb-4">
        <div className="bg-[#EF4444]/10 p-2 rounded-xl text-[#EF4444]">
          <Sparkles size={24} />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-[#0F172A]">المستشار الاستراتيجي الحواري</h2>
          <p className="text-slate-500 text-sm mt-1">تحدث مباشرة مع مستشارك الاستراتيجي لمناقشة تفاصيل التقرير والحلول المقترحة.</p>
        </div>
      </div>

      {/* Chat Area */}
      <div className="border border-slate-200 rounded-2xl bg-slate-50 overflow-hidden flex flex-col h-[500px]">
        
        {/* Messages list */}
        <div className="flex-1 p-4 overflow-y-auto space-y-4 flex flex-col">
          {/* Welcome Message */}
          <div className="bg-[#0F172A] text-white self-start ml-auto rounded-2xl rounded-tl-none px-4 py-3 max-w-[85%] font-arabic shadow-sm">
            <p className="leading-relaxed">
              مرحباً بك {userName || 'شريكنا العزيز'}. أنا مستشارك الاستراتيجي الرقمي. لقد قمت بتحليل دقيق لشركة <strong>{companyName}</strong>. 
            </p>
            <p className="leading-relaxed mt-2 text-sm text-slate-300">
              يمكنك سؤالي عن أي بند من بنود التقرير، أو التكلفة التقديرية للنقاط العمياء، أو كيفية تطبيق التوصيات. كيف يمكنني مساعدتك الآن؟
            </p>
          </div>

          {conversationHistory.map((msg, idx) => (
            <div
              key={idx}
              className={`max-w-[85%] p-4 rounded-2xl shadow-sm font-arabic ${
                msg.role === 'user'
                  ? 'bg-red-500 text-white self-end mr-auto rounded-tr-none'
                  : 'bg-[#0F172A] text-white self-start ml-auto rounded-tl-none'
              }`}
            >
              {renderMessageContent(msg)}
            </div>
          ))}

          {loading && (
            <div className="bg-[#0F172A]/90 text-white self-start ml-auto rounded-2xl rounded-tl-none px-4 py-3 max-w-[85%] font-arabic flex items-center gap-3 shadow-sm animate-pulse">
              <span className="text-xs text-slate-300 font-medium">جاري التفكير وتحليل الإجابة...</span>
              <div className="flex gap-1">
                <div className="w-1.5 h-1.5 bg-white rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-1.5 h-1.5 bg-white rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-1.5 h-1.5 bg-white rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
            </div>
          )}

          {error && (
            <div className="bg-red-50 text-red-600 border border-red-200 rounded-xl p-3 text-sm font-medium self-center text-center max-w-[90%]">
              {error}
            </div>
          )}

          <div ref={chatEndRef} />
        </div>

        {/* Quick Suggestion Chips (only when history is short/empty) */}
        {conversationHistory.length === 0 && (
          <div className="p-3 bg-white border-t border-slate-100 flex flex-wrap gap-2 justify-center">
            {prefilledQuestions.map((q, i) => (
              <button
                key={i}
                onClick={() => handleSend(q)}
                className="text-xs font-semibold text-[#0F172A] hover:bg-[#EF4444]/5 hover:text-[#EF4444] border border-slate-200 hover:border-[#EF4444]/30 px-3 py-2 rounded-full transition-all cursor-pointer bg-slate-50"
              >
                {q}
              </button>
            ))}
          </div>
        )}

        {/* Input Bar */}
        <div className="p-3 bg-white border-t border-slate-200">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend(input);
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={loading}
              placeholder="اكتب سؤالك هنا للاستفسار عن التشخيص والتوصيات..."
              className="flex-1 border border-slate-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#EF4444] focus:ring-1 focus:ring-[#EF4444] disabled:bg-slate-50"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="bg-[#EF4444] hover:bg-[#D32F2F] text-white p-3 rounded-xl transition-all shadow-md disabled:bg-slate-300 disabled:shadow-none flex items-center justify-center cursor-pointer"
            >
              <Send size={18} className="transform rotate-180" />
            </button>
          </form>
        </div>

      </div>
    </section>
  );
};

export default ConsultantChat;
