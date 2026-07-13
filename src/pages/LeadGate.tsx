import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, Lock } from 'lucide-react';
import { useDiagnosticStore } from '../store/diagnosticStore';
import { saveLead, saveReport, trackEvent } from '../services/supabase';
import { notifyAhmed } from '../services/webhooks'; 

const LeadGate: React.FC = () => {
  const navigate = useNavigate();
  const store = useDiagnosticStore();
  const { 
    sessionId, 
    report, 
    userName, 
    companyName, 
    setField,
    sectorL1,
    sectorL2,
    intakeAnswers
  } = store;

  const [name, setName] = useState(userName || '');
  const [whatsapp, setWhatsapp] = useState('');
  const [cName, setCName] = useState(companyName || '');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    trackEvent(sessionId, 'page_view', { page: 'lead_gate' }).catch(console.error);
    window.scrollTo(0, 0);

    if (!report) {
      navigate('/processing', { replace: true });
    }
  }, [sessionId, report, navigate]);

  if (!report) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center rtl font-arabic">
        <div className="text-center p-6">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-[#EF4444] mx-auto mb-4"></div>
          <p className="text-slate-500 text-sm">جاري التحويل لصفحة التحليل...</p>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !whatsapp || !cName) return;

    setIsSubmitting(true);
    try {
      setField('userName', name);
      setField('companyName', cName);
      setField('whatsapp', whatsapp);

      const leadData = {
        session_id: sessionId,
        user_name: name,
        company_name: cName,
        whatsapp: whatsapp,
        sector_l1: sectorL1,
        sector_l2: sectorL2,
        country: intakeAnswers.country as string || '',
        city: intakeAnswers.city as string || '',
        source_url: window.location.href
      };

      // Create lead, then save report, etc.
      let cloudSuccess = true;
      try {
        const leadId = await saveLead(leadData);
        if (!leadId || leadId.startsWith('local_')) {
          cloudSuccess = false;
        }
        await saveReport(sessionId, report, '', leadId); // empty proposal for now, generated later
        await notifyAhmed(leadData, report, sessionId);
      } catch (e) {
        console.error("Failed to save lead or notify webhook", e);
        cloudSuccess = false;
      }

      // Check if this was saved only locally or cloud has failed
      const cloudFailedBefore = localStorage.getItem(`cloud_save_failed_${sessionId}`) === 'true';
      if (!cloudSuccess || cloudFailedBefore) {
        const fallbackMsg = `⚠️ تشخيص جديد (حفظ محلي فقط بسبب عطل السحابة)
الاسم: ${leadData.user_name}
الشركة: ${leadData.company_name}
القطاع: ${leadData.sector_l2 || 'غير محدد'}
الدولة: ${leadData.country || 'غير محدد'} - ${leadData.city || 'غير محدد'}
واتساب: ${leadData.whatsapp}
نقاط الصحة: ${report.health_score}/100 (${report.health_label || ''})
التشخيص: ${report.headline_diagnosis}
أعلى نقطة عمياء: ${report.blind_spots[0]?.name || 'غير متوفر'} (${report.blind_spots[0]?.impact_level || ''})
الرابط الدائم للتشخيص: ${window.location.origin}/session/${sessionId}`;

        const ahmedWhatsapp = import.meta.env.VITE_AHMED_WHATSAPP || '201066966515';
        const fallbackWaUrl = `https://wa.me/${ahmedWhatsapp}?text=${encodeURIComponent(fallbackMsg)}`;
        window.open(fallbackWaUrl, '_blank');
      }

      trackEvent(sessionId, 'lead_gate_submit', {}).catch(console.error);
      
      // Delay navigation slightly for smoother UX
      setTimeout(() => {
        navigate('/report');
      }, 500);

    } catch (error) {
      console.error(error);
      setIsSubmitting(false);
    }
  };

  const getHealthColor = (score: number) => {
    if (score < 40) return 'text-[#EF4444]'; // Red
    if (score < 70) return 'text-[#F59E0B]'; // Amber
    return 'text-[#10B981]'; // Green
  };

  const getImpactBadge = (level: string) => {
    switch(level) {
      case 'critical': return <span className="bg-red-100 text-red-600 px-2 py-0.5 rounded text-xs font-bold border border-red-200">حرجة</span>;
      case 'high': return <span className="bg-amber-100 text-amber-600 px-2 py-0.5 rounded text-xs font-bold border border-amber-200">عالية</span>;
      case 'medium': return <span className="bg-blue-100 text-blue-600 px-2 py-0.5 rounded text-xs font-bold border border-blue-200">متوسطة</span>;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-white rtl font-arabic pb-20">
      
      {/* TOP SECTION */}
      <div className="bg-[#0F172A] text-white pt-12 pb-24 px-4 text-center">
        <motion.div 
          initial={{ scale: 0 }} 
          animate={{ scale: 1 }} 
          transition={{ type: "spring", bounce: 0.5 }}
          className="bg-[#10B981] w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-green-500/20"
        >
          <CheckCircle size={40} className="text-white" />
        </motion.div>
        <h1 className="text-3xl md:text-5xl font-bold mb-4">تحليلك مكتمل</h1>
      </div>

      <div className="max-w-2xl mx-auto px-4 -mt-16">
        
        {/* TEASER SECTION */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }} 
          animate={{ y: 0, opacity: 1 }} 
          transition={{ duration: 0.4, delay: 0.2 }}
          className="bg-white rounded-2xl shadow-xl border border-slate-100 p-6 md:p-8 mb-8"
        >
          <div className="text-center mb-8 pb-8 border-b border-slate-100">
            <h2 className="text-2xl font-bold text-[#0F172A] mb-4 leading-relaxed">
              {report.headline_diagnosis}
            </h2>
            
            <div className="flex flex-col items-center justify-center my-6">
              <span className="text-sm text-slate-500 mb-1">نقاط الصحة (Health Score)</span>
              <div className="flex items-baseline gap-2">
                <span className={`text-6xl font-bold ${getHealthColor(report.health_score)}`}>
                  {report.health_score}
                </span>
                <span className="text-slate-400 text-xl">/100</span>
              </div>
              <span className={`mt-1 font-bold text-lg ${getHealthColor(report.health_score)}`}>
                {report.health_label}
              </span>
            </div>
            
            <div className="bg-slate-50 rounded-xl p-4 inline-block">
              <span className="text-slate-600 font-medium">تم رصد <strong className="text-[#EF4444] text-lg mx-1">{report.blind_spots.length}</strong> نقاط عمياء في عملياتك</span>
            </div>
          </div>

          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-bold text-slate-400 uppercase">أعلى نقطة عمياء تم رصدها</span>
              {getImpactBadge(report.blind_spots[0]?.impact_level)}
            </div>
            <p className="text-lg font-bold text-[#0F172A]">
              {report.blind_spots[0]?.name}
            </p>
          </div>
          
          <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm font-medium border border-red-100 flex items-center gap-2">
            <Lock size={16} />
            <span>التفاصيل الكاملة لكل نقطة عمياء وخطة معالجتها في التقرير الكامل</span>
          </div>
        </motion.div>

        {/* BLURRED PREVIEW */}
        <div className="relative mb-8 rounded-2xl overflow-hidden border border-slate-200">
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-white/60 backdrop-blur-[4px]">
            <div className="bg-white p-4 rounded-full shadow-lg border border-slate-100 mb-3 text-[#0F172A]">
              <Lock size={32} />
            </div>
            <p className="font-bold text-[#0F172A] text-lg">مصفوفة SWOT الكاملة</p>
          </div>
          <div className="grid grid-cols-2 gap-px bg-slate-200 p-[1px] opacity-40">
            <div className="bg-white p-6 h-32"></div>
            <div className="bg-white p-6 h-32"></div>
            <div className="bg-white p-6 h-32"></div>
            <div className="bg-white p-6 h-32"></div>
          </div>
        </div>

        {/* FORM SECTION */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }} 
          animate={{ y: 0, opacity: 1 }} 
          transition={{ duration: 0.4, delay: 0.4 }}
          className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6 md:p-8"
        >
          <h2 className="text-2xl font-bold text-[#0F172A] mb-6 text-center">
            أدخل بياناتك لاستلام التقرير الكامل
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#0F172A] mb-1">اسمك <span className="text-red-500">*</span></label>
              <input 
                type="text" 
                required
                value={name} 
                onChange={(e) => setName(e.target.value)}
                className="w-full border-2 border-slate-200 rounded-xl p-3 focus:border-[#EF4444] focus:outline-none transition-colors bg-slate-50 text-[#0F172A]"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-[#0F172A] mb-1">رقم WhatsApp (للمتابعة) <span className="text-red-500">*</span></label>
              <input 
                type="tel" 
                required
                dir="ltr"
                placeholder="+20 1X XXX XXXXX"
                value={whatsapp} 
                onChange={(e) => setWhatsapp(e.target.value)}
                className="w-full border-2 border-slate-200 rounded-xl p-3 focus:border-[#EF4444] focus:outline-none transition-colors bg-slate-50 text-left text-[#0F172A]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#0F172A] mb-1">اسم شركتك <span className="text-red-500">*</span></label>
              <input 
                type="text" 
                required
                value={cName} 
                onChange={(e) => setCName(e.target.value)}
                className="w-full border-2 border-slate-200 rounded-xl p-3 focus:border-[#EF4444] focus:outline-none transition-colors bg-slate-50 text-[#0F172A]"
              />
            </div>

            <p className="text-xs text-slate-500 text-center py-2 leading-relaxed">
              بياناتك محمية ولن تُشارك مع أي طرف ثالث. هذا التقرير مُعدٌّ لشركتك وحدها.
            </p>

            <button 
              type="submit"
              disabled={isSubmitting}
              className={`w-full text-white font-bold text-lg py-4 px-8 rounded-xl shadow-md transition-all mt-4
                ${isSubmitting ? 'bg-slate-400 cursor-not-allowed' : 'bg-[#EF4444] hover:bg-red-600 hover:shadow-lg'}`}
            >
              {isSubmitting ? 'جاري التحضير...' : 'استلم تقريرك الكامل الآن'}
            </button>
          </form>
        </motion.div>

      </div>
    </div>
  );
};

export default LeadGate;
