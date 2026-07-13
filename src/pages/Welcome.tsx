import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useDiagnosticStore } from '../store/diagnosticStore';
import { trackEvent } from '../services/supabase';

const Welcome: React.FC = () => {
  const navigate = useNavigate();
  const { setField } = useDiagnosticStore();

  useEffect(() => {
    let currentSessionId = localStorage.getItem('bik_session_id');
    if (!currentSessionId) {
      currentSessionId = crypto.randomUUID();
      localStorage.setItem('bik_session_id', currentSessionId);
    }
    setField('sessionId', currentSessionId);
    
    // Attempt tracking
    trackEvent(currentSessionId, 'page_view', { page: 'welcome' }).catch(console.error);
  }, [setField]);

  return (
    <div className="min-h-screen bg-[#0F172A] text-white flex flex-col relative overflow-hidden rtl">
      {/* Top Bar */}
      <div className="w-full fixed top-0 left-0 right-0 p-6 flex justify-between items-center z-50">
        <div className="flex items-center gap-2">
          <span className="text-[#EF4444] font-bold text-xl">BIK</span>
          <span className="text-white text-xs opacity-80 mt-1">منصة التشخيص الاستراتيجي</span>
        </div>
        <div></div>
      </div>

      {/* Hero Section */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 z-10 w-full max-w-5xl mx-auto">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-4xl md:text-6xl font-bold text-center mb-6 leading-tight"
        >
          هل شركتك تعمل بكامل طاقتها؟
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-[#94A3B8] text-lg text-center max-w-[500px] mb-12 leading-relaxed"
        >
          معظم الشركات التي تبدو بخير تفقد 40 إلى 60 بالمئة من إمكانياتها في نقاط عمياء لا تراها
        </motion.p>

        {/* Stats Row */}
        <div className="flex flex-col md:flex-row gap-4 mb-14 w-full justify-center">
          {[
            { value: '209', label: 'مصدر علمي' },
            { value: '22', label: 'قطاع مُغطى' },
            { value: '8', label: 'دقائق فقط' }
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 + (i * 0.2) }}
              className="bg-[#1E293B] rounded-xl p-6 flex flex-col items-center justify-center min-w-[140px] shadow-lg border border-slate-800"
            >
              <span className="text-[#EF4444] text-4xl font-bold mb-2">{stat.value}</span>
              <span className="text-white text-sm">{stat.label}</span>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 1.1 }}
          className="flex flex-col items-center w-full max-w-[400px]"
        >
          <motion.button
            animate={{ scale: [1, 1.02, 1] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            onClick={() => navigate('/sector-select')}
            className="w-full bg-[#EF4444] hover:bg-red-600 text-white font-bold text-lg py-4 px-8 rounded-xl shadow-[0_0_20px_rgba(239,68,68,0.3)] transition-colors"
          >
            اكتشف وضع شركتك الآن
          </motion.button>
          <span className="text-[#64748B] text-xs mt-4">
            لا بيانات مالية حساسة — لا تسجيل دخول مطلوب
          </span>
        </motion.div>
      </div>

      {/* Trust Line */}
      <div className="absolute bottom-6 left-0 right-0 text-center text-[#475569] text-[11px] px-4">
        مستوحى من منهجيات: Drucker · Porter · Kotler · Hormozi · إيهاب مسلم
      </div>
    </div>
  );
};

export default Welcome;
