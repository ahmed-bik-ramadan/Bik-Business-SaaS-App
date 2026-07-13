import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MessageCircle, Copy, Check, ArrowLeft } from 'lucide-react';
import { useDiagnosticStore } from '../store/diagnosticStore';
import { trackEvent, saveReport } from '../services/supabase';
import { generateProposal } from '../services/diagnose';
import ConsultantChat from '../components/ConsultantChat';

const Report: React.FC = () => {
  const navigate = useNavigate();
  const { sessionId, report, proposal, userName, companyName, sectorL2, diagnosticDepth, setField } = useDiagnosticStore();
  const [copied, setCopied] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [isGeneratingProposal, setIsGeneratingProposal] = useState(!proposal);

  useEffect(() => {
    if (!report) {
      navigate('/processing', { replace: true });
      return;
    }

    trackEvent(sessionId, 'report_viewed', {}).catch(console.error);

    const initProposal = async () => {
      if (!proposal) {
        try {
          const generated = await generateProposal(report, userName, companyName, sectorL2);
          setField('proposal', generated);
          // Try to update the supabase record if it wasn't already stored
          await saveReport(sessionId, report, generated);
        } catch (e) {
          console.error("Proposal generation failed", e);
        } finally {
          setIsGeneratingProposal(false);
        }
      }
    };
    initProposal();
    window.scrollTo(0, 0);
  }, [report, navigate, sessionId, proposal, userName, companyName, sectorL2, setField]);

  if (!report) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center rtl font-arabic">
        <div className="text-center p-6">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-[#EF4444] mx-auto mb-4"></div>
          <p className="text-slate-500 text-sm">جاري التحويل لصفحة التحليل...</p>
        </div>
      </div>
    );
  }

  const getHealthColor = (score: number) => {
    if (score < 40) return 'text-[#EF4444]'; 
    if (score < 70) return 'text-[#F59E0B]'; 
    return 'text-[#10B981]'; 
  };
  
  const getHealthBg = (score: number) => {
    if (score < 40) return 'bg-[#EF4444]'; 
    if (score < 70) return 'bg-[#F59E0B]'; 
    return 'bg-[#10B981]'; 
  };

  const getImpactBadge = (level: string) => {
    switch(level) {
      case 'critical': return <span className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-xs font-bold border border-red-200">حرجة</span>;
      case 'high': return <span className="bg-amber-100 text-amber-600 px-3 py-1 rounded-full text-xs font-bold border border-amber-200">عالية</span>;
      case 'medium': return <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-xs font-bold border border-blue-200">متوسطة</span>;
      default: return null;
    }
  };

  const ahmedWhatsapp = import.meta.env.VITE_AHMED_WHATSAPP || '201066966515';
  const waLink = `https://wa.me/${ahmedWhatsapp}?text=${encodeURIComponent(proposal || '')}`;

  const handleCopy = () => {
    if (proposal) {
      navigator.clipboard.writeText(proposal);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-28 rtl font-arabic">
      
      {/* Header */}
      <header className="bg-white border-b border-slate-200 py-4 px-6 md:px-8 mb-8 sticky top-0 z-50 shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-[#EF4444] font-bold text-xl">BIK</span>
          <div className="w-px h-5 bg-slate-300 mx-1"></div>
          <span className="text-[#0F172A] font-bold">{companyName}</span>
        </div>
      </header>

      <div className="max-w-[800px] mx-auto px-4 md:px-0 space-y-8">
        
        {/* Persistent share link banner */}
        <div className="bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border-2 border-emerald-500/30 rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🔗</span>
            <div className="text-right">
              <h4 className="font-bold text-slate-800 text-sm md:text-base">رابط دائم لتشخيصك — احتفظ به</h4>
              <p className="text-xs text-slate-500 mt-0.5">يمكنك العودة إلى تقريرك أو مشاركته في أي وقت</p>
            </div>
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto shrink-0 justify-end">
            <input 
              type="text" 
              readOnly 
              value={`${window.location.origin}/session/${sessionId}`} 
              className="bg-white border border-slate-200 text-xs px-3 py-2 rounded-lg text-slate-600 font-mono w-48 focus:outline-none text-left"
              dir="ltr"
            />
            <button 
              onClick={() => {
                navigator.clipboard.writeText(`${window.location.origin}/session/${sessionId}`);
                setCopiedLink(true);
                setTimeout(() => setCopiedLink(false), 2000);
              }}
              className="bg-[#10B981] hover:bg-emerald-600 text-white px-4 py-2 rounded-lg text-xs font-bold transition-all shrink-0 cursor-pointer"
            >
              {copiedLink ? 'تم النسخ!' : 'نسخ الرابط'}
            </button>
          </div>
        </div>

        {/* SECTION 1 — Executive Summary */}
        <section className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-10">
          <h1 className="text-3xl md:text-4xl font-bold text-[#0F172A] mb-8 leading-relaxed">
            {report.headline_diagnosis}
          </h1>
          
          <div className="flex flex-col items-center justify-center p-8 bg-slate-50 rounded-2xl border border-slate-100">
            <span className="text-sm font-bold text-slate-500 mb-2 uppercase tracking-wide">نقاط الصحة (Health Score)</span>
            <div className="relative mb-2">
              {/* Simple arc visualization substitute */}
              <div className="flex items-baseline gap-2">
                <span className={`text-7xl font-bold ${getHealthColor(report.health_score)}`}>
                  {report.health_score}
                </span>
                <span className="text-slate-400 text-2xl font-bold">/100</span>
              </div>
            </div>
            <span className={`font-bold text-xl px-4 py-1 rounded-full bg-white border border-slate-200 ${getHealthColor(report.health_score)}`}>
              {report.health_label}
            </span>
            <p className="text-slate-500 text-xs mt-4">يعكس وضع شركتك بناءً على 42 مؤشراً تشخيصياً</p>
          </div>
        </section>

        {/* SECTION 2 — SWOT Matrix */}
        <section className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-10">
          <h2 className="text-2xl font-bold text-[#0F172A] mb-6">التحليل الرباعي SWOT</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            <div className="bg-green-50 border border-green-100 rounded-xl p-5">
              <h3 className="font-bold text-green-800 mb-3 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500"></div> نقاط القوة
              </h3>
              <ul className="space-y-2 text-sm text-green-900 leading-relaxed">
                {report.swot.strengths.map((item, i) => <li key={i}>• {item}</li>)}
              </ul>
            </div>
            
            <div className="bg-red-50 border border-red-100 rounded-xl p-5">
              <h3 className="font-bold text-red-800 mb-3 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-red-500"></div> نقاط الضعف
              </h3>
              <ul className="space-y-2 text-sm text-red-900 leading-relaxed">
                {report.swot.weaknesses.map((item, i) => <li key={i}>• {item}</li>)}
              </ul>
            </div>
            
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-5">
              <h3 className="font-bold text-blue-800 mb-3 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-blue-500"></div> الفرص
              </h3>
              <ul className="space-y-2 text-sm text-blue-900 leading-relaxed">
                {report.swot.opportunities.map((item, i) => <li key={i}>• {item}</li>)}
              </ul>
            </div>
            
            <div className="bg-amber-50 border border-amber-100 rounded-xl p-5">
              <h3 className="font-bold text-amber-800 mb-3 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-amber-500"></div> التهديدات
              </h3>
              <ul className="space-y-2 text-sm text-amber-900 leading-relaxed">
                {report.swot.threats.map((item, i) => <li key={i}>• {item}</li>)}
              </ul>
            </div>
          </div>
        </section>

        {/* SECTION 3 — Blind Spots */}
        <section className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-10">
          <h2 className="text-2xl font-bold text-[#0F172A] mb-6">النقاط العمياء الحرجة</h2>
          <div className="space-y-4">
            {report.blind_spots.map((spot, i) => (
              <div key={i} className="border border-slate-200 rounded-xl p-5 hover:border-slate-300 transition-colors bg-slate-50/50">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="font-bold text-lg text-[#0F172A] max-w-[80%]">{spot.name}</h3>
                  {getImpactBadge(spot.impact_level)}
                </div>
                <p className="text-slate-600 mb-4 text-sm leading-relaxed">{spot.description}</p>
                <div className="bg-white border border-slate-200 px-3 py-2 rounded-lg text-xs italic text-slate-500 inline-block font-medium">
                  التكلفة التقديرية: <span className="text-[#0F172A] mr-1">{spot.estimated_cost}</span>
                </div>
              </div>
            ))}
          </div>
          {diagnosticDepth === 'deep' && (
            <p className="mt-6 text-xs text-[#64748B] text-center border-t border-slate-100 pt-4 font-medium italic">
              * الأرقام المالية في هذا القسم محسوبة من بيانات مُدخَلة وافتراضات تقديرية معلنة، وليست تدقيقاً محاسبياً.
            </p>
          )}
        </section>

        {/* SECTION 4 — Priority Actions */}
        <section className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-10">
          <h2 className="text-2xl font-bold text-[#0F172A] mb-6">خارطة الأولويات</h2>
          
          <div className="space-y-4">
            {report.priority_actions.map((action, i) => (
              <div key={i} className="border-l-4 border-[#EF4444] bg-white border border-y-slate-200 border-r-slate-200 rounded-r-xl rounded-l-sm p-5 shadow-sm">
                <h3 className="font-bold text-lg text-[#0F172A] mb-2">{action.action}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm mt-4">
                  <div>
                    <span className="block text-xs font-bold text-slate-400 mb-1">الأثر المتوقع</span>
                    <span className="text-slate-700">{action.expected_impact}</span>
                  </div>
                  <div>
                    <span className="block text-xs font-bold text-slate-400 mb-1">الإطار الزمني</span>
                    <span className="text-slate-700">{action.timeframe}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* SECTION 5 — Closing Question and Insight */}
        <section className="space-y-4">
          <div className="bg-[#0F172A] rounded-2xl shadow-lg border border-slate-800 p-8 text-center">
            <h2 className="text-sm font-bold text-slate-400 mb-6 uppercase tracking-wider">السؤال الذي يجب أن تسأله الآن:</h2>
            <p className="text-2xl md:text-3xl font-bold text-white leading-relaxed">
              "{report.closing_question}"
            </p>
          </div>
          
          <div className="bg-blue-50 border border-blue-100 rounded-2xl shadow-sm p-6 text-center">
            <span className="block text-xs font-bold text-blue-400 mb-2 uppercase">رؤية لقطاع {sectorL2}</span>
            <p className="text-blue-900 font-medium text-sm leading-relaxed">{report.sector_insight}</p>
          </div>
        </section>

        {/* Conversational Consultant Chat */}
        <ConsultantChat />

        {/* SECTION 6 — Proposal Card */}
        <section className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-10 mb-8 border-t-4 border-t-[#10B981]">
          <h2 className="text-2xl font-bold text-[#0F172A] mb-6">خطوة للحل العملي</h2>
          
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 mb-6">
            {isGeneratingProposal ? (
              <div className="animate-pulse space-y-3">
                <div className="h-4 bg-slate-200 rounded w-full"></div>
                <div className="h-4 bg-slate-200 rounded w-5/6"></div>
                <div className="h-4 bg-slate-200 rounded w-4/6"></div>
              </div>
            ) : (
              <div>
                <p className="text-slate-700 text-sm md:text-base leading-loose whitespace-pre-wrap mb-4">
                  {proposal}
                </p>
                <div className="border-t border-slate-200 pt-4 mt-4 flex flex-col sm:flex-row items-center justify-between gap-3">
                  <div className="text-right">
                    <h4 className="font-bold text-slate-800 text-sm">مستشارك الاستراتيجي: المهندس أحمد رمضان</h4>
                    <p className="text-xs text-slate-500 mt-0.5">شريك تطوير وحماية هوامش أرباح أكثر من 50 شركة بالشرق الأوسط</p>
                  </div>
                  <Link 
                    to="/consultant"
                    className="text-xs font-bold text-[#EF4444] hover:text-red-700 flex items-center gap-1.5 shrink-0 bg-red-50 hover:bg-red-100/70 px-3 py-2 rounded-lg transition-all"
                  >
                    <span>سجل النجاح والامتداد الجغرافي</span>
                    <ArrowLeft size={14} />
                  </Link>
                </div>
              </div>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-3 mt-4">
            <a 
              href={waLink}
              target="_blank"
              rel="noreferrer"
              className="flex-1 bg-[#10B981] hover:bg-emerald-600 text-white p-4 rounded-xl font-bold flex justify-center items-center gap-2 shadow-md transition-colors"
            >
              <MessageCircle size={20} />
              <span>تواصل عبر واتساب</span>
            </a>
            
            <button 
              onClick={handleCopy}
              disabled={isGeneratingProposal}
              className="sm:w-32 bg-white border-2 border-slate-200 hover:border-slate-300 text-slate-700 p-4 rounded-xl font-bold flex justify-center items-center gap-2 transition-colors disabled:opacity-50"
            >
              {copied ? <Check size={20} className="text-green-500" /> : <Copy size={20} />}
              <span>{copied ? 'منسوخ' : 'نسخ النص'}</span>
            </button>
          </div>
          
          <div className="text-center mt-6 text-xs text-slate-400 font-medium">
            أحمد رمضان — BIK Business Solutions — استشاري تطوير وحلول أعمال
          </div>
        </section>
      </div>

      {/* MOBILE FIXED BOTTOM BAR (Optional but recommended) */}
      <div className="md:hidden fixed bottom-0 left-0 w-full bg-white border-t border-slate-200 p-4 z-50 shadow-[0_-4px_6px_rgba(0,0,0,0.05)]">
        <a 
          href={waLink}
          target="_blank"
          rel="noreferrer"
          className="w-full bg-[#10B981] text-white p-4 rounded-xl font-bold flex justify-center items-center gap-2"
        >
          <MessageCircle size={20} />
          <span>تواصل مع أحمد رمضان</span>
        </a>
      </div>

    </div>
  );
};

export default Report;
