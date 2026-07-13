import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageCircle, Copy, Check, ArrowRight, Clock, Lock, 
  HelpCircle, CheckCircle, ChevronDown, ChevronUp, AlertCircle, TrendingUp, Info, User, Briefcase, MapPin, Calendar, BookOpen
} from 'lucide-react';
import { getSessionAndLead } from '../services/supabase';
import { universalQuestions } from '../data/universalQuestions';
import { sectorQuestions } from '../data/sectorQuestions';
import { deltaQuestions } from '../data/deltaQuestions';

const SessionView: React.FC = () => {
  const { sessionId } = useParams<{ sessionId: string }>();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [session, setSession] = useState<any>(null);
  const [lead, setLead] = useState<any>(null);

  const [copied, setCopied] = useState(false);
  const [showRawDetails, setShowRawDetails] = useState(false);

  useEffect(() => {
    const loadSessionData = async () => {
      if (!sessionId) {
        setError('رابط الجلسة غير صالح');
        setIsLoading(false);
        return;
      }
      try {
        const data = await getSessionAndLead(sessionId);
        if (!data.session) {
          setError('لم يتم العثور على تقرير تشخيصي لهذه الجلسة. يرجى إتمام التشخيص أولاً.');
        } else {
          setSession(data.session);
          if (data.lead) {
            setLead(data.lead);
          }
        }
      } catch (err: any) {
        console.error('Error loading session:', err);
        setError('حدث خطأ أثناء تحميل بيانات التشخيص');
      } finally {
        setIsLoading(false);
      }
    };
    loadSessionData();
    window.scrollTo(0, 0);
  }, [sessionId]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center p-4 rtl font-arabic">
        <div className="text-center p-8 bg-white rounded-2xl shadow-sm border border-slate-200 max-w-sm w-full">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-[#EF4444] border-r-2 border-r-transparent mx-auto mb-4"></div>
          <p className="text-[#0F172A] font-bold text-lg mb-2">جاري تحميل تشخيصك الدائم...</p>
          <p className="text-slate-500 text-sm">نسترجع التوصيات والبيانات الاستراتيجية</p>
        </div>
      </div>
    );
  }

  if (error || !session) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center p-4 rtl font-arabic">
        <div className="text-center p-8 bg-white rounded-2xl shadow-sm border border-slate-200 max-w-md w-full">
          <div className="bg-red-50 text-[#EF4444] p-3 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <AlertCircle size={32} />
          </div>
          <h2 className="text-[#0F172A] font-bold text-xl mb-3">عذراً، لم نتمكن من الوصول للتقرير</h2>
          <p className="text-slate-600 mb-6 text-sm leading-relaxed">{error || 'التقرير غير متوفر أو لم يتم إتمامه بعد.'}</p>
          <Link 
            to="/" 
            className="inline-flex items-center justify-center gap-2 bg-[#EF4444] text-white px-6 py-3 rounded-xl font-bold hover:bg-red-600 transition-colors w-full shadow-sm"
          >
            <span>ابدأ تشخيصاً جديداً</span>
            <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    );
  }

  // Extract variables
  const report = session.report;
  const proposalText = session.proposal || '';
  const userName = lead?.user_name || session.userName || session.firstName || 'صاحب القرار';
  const firstName = userName.split(' ')[0] || 'العميل';
  const companyName = lead?.company_name || session.companyName || 'شركتكم';
  const sectorL1 = session.sectorL1 || 'نشاط تجاري';
  const sectorL2 = lead?.sector_l2 || session.sectorL2 || 'عام';
  const score = report?.health_score ?? session.health_score ?? 50;
  const healthLabel = report?.health_label || session.health_label || 'متوسط';

  const getHealthColor = (s: number) => {
    if (s < 40) return 'text-[#EF4444]'; 
    if (s < 70) return 'text-[#F59E0B]'; 
    return 'text-[#10B981]'; 
  };
  
  const getHealthBg = (s: number) => {
    if (s < 40) return 'bg-[#EF4444]'; 
    if (s < 70) return 'bg-[#F59E0B]'; 
    return 'bg-[#10B981]'; 
  };

  const getImpactBadge = (level: string) => {
    switch(level) {
      case 'critical': return <span className="bg-red-50 text-red-600 px-3 py-1 rounded-full text-xs font-bold border border-red-200">حرجة</span>;
      case 'high': return <span className="bg-amber-50 text-amber-600 px-3 py-1 rounded-full text-xs font-bold border border-amber-200">عالية</span>;
      case 'medium': return <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-xs font-bold border border-blue-200">متوسطة</span>;
      default: return null;
    }
  };

  const ahmedWhatsapp = import.meta.env.VITE_AHMED_WHATSAPP || '201066966515';
  const referralWaMessage = `أهلاً أستاذ أحمد رمضان، قمت بمراجعة تقرير التشخيص المحفوظ لشركتي (${companyName}) وأرغب في حجز الجلسة الاستشارية المجانية لمناقشة النتائج وتطبيق الحلول العملية.`;
  const waLink = `https://wa.me/${ahmedWhatsapp}?text=${encodeURIComponent(referralWaMessage)}`;

  // Function to map a question ID to its exact paired human answer
  const getQuestionAnswerText = (qId: string, type: string, options?: any[]) => {
    let rawVal: any = undefined;
    
    // Check universalAnswers
    if (session.universalAnswers && session.universalAnswers[qId] !== undefined) {
      rawVal = session.universalAnswers[qId];
    }
    // Check sectorAnswers
    else if (session.sectorAnswers && session.sectorAnswers[qId] !== undefined) {
      rawVal = session.sectorAnswers[qId];
    }

    if (rawVal === undefined || rawVal === null || rawVal === '') {
      return <span className="text-red-500 font-medium">السيد/ة {userName} لم يقم/تقم بالإجابة على هذا السؤال</span>;
    }

    if (type === 'single_choice' && options) {
      const matched = options.find((o: any) => o.value === rawVal);
      return <span className="text-[#0F172A] font-semibold bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100 inline-block">{matched ? matched.label : String(rawVal)}</span>;
    }

    if (type === 'multi_choice' && options) {
      const arr = Array.isArray(rawVal) ? rawVal : [rawVal];
      const labels = arr.map((val: any) => {
        const matched = options.find((o: any) => o.value === val);
        return matched ? matched.label : String(val);
      });
      return (
        <div className="flex flex-wrap gap-1.5 mt-1">
          {labels.map((lbl: string, idx: number) => (
            <span key={idx} className="text-[#0F172A] font-semibold bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100 text-sm">
              {lbl}
            </span>
          ))}
        </div>
      );
    }

    if (type === 'slider') {
      return <span className="text-[#EF4444] font-bold text-lg bg-red-50/50 px-4 py-1.5 rounded-lg border border-red-100 inline-block">{rawVal}</span>;
    }

    return <p className="text-[#0F172A] font-medium bg-slate-50 p-4 rounded-xl border border-slate-100 whitespace-pre-wrap mt-1 leading-relaxed">{String(rawVal)}</p>;
  };

  const intakeData = session.intakeAnswers || {};

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-20 rtl font-arabic text-slate-800">
      {/* Upper persistent banner */}
      <div className="bg-[#0F172A] text-white py-3.5 px-4 shadow-sm border-b border-slate-800">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3 text-center md:text-right">
          <div className="flex items-center gap-2">
            <span className="bg-emerald-500/20 text-emerald-400 p-1 rounded-full flex items-center justify-center animate-pulse">
              <Check size={14} />
            </span>
            <p className="text-sm font-medium">رابط تشخيصي دائم ومحفوظ لشركة <strong className="text-emerald-400 font-bold">{companyName}</strong></p>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={handleCopyLink}
              className="bg-slate-800 hover:bg-slate-700 text-slate-200 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
            >
              {copied ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
              <span>{copied ? 'تم نسخ الرابط!' : 'نسخ رابط التقرير'}</span>
            </button>
            <a 
              href={waLink}
              target="_blank"
              rel="noreferrer"
              className="bg-[#10B981] hover:bg-emerald-600 text-white px-4 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm"
            >
              <MessageCircle size={13} />
              <span>تواصل لتطبيق الحلول</span>
            </a>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 mt-8">
        {/* Welcome Board */}
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-white to-[#F1F5F9] border border-slate-200 rounded-2xl p-6 md:p-8 shadow-sm mb-8 text-center md:text-right"
        >
          <span className="bg-[#EF4444]/10 text-[#EF4444] px-3 py-1 rounded-full text-xs font-bold border border-red-100 inline-block mb-3">التشخيص الرقمي المعتمد</span>
          <h1 className="text-3xl font-extrabold text-[#0F172A] mb-3 leading-relaxed">تقرير تشخيص الأعمال وحماية الأرباح</h1>
          <p className="text-slate-600 text-base leading-relaxed max-w-3xl">
            مرحباً بك يا سيد/ة <strong className="text-[#0F172A] font-bold">{userName}</strong>. هذا الرابط الدائم هو مرجعك وحافظة تقريرك التشخيصي المخصص لشركة <strong className="text-[#0F172A] font-bold">{companyName}</strong>. قمنا برصد نقاط القوة، نقاط الضعف، وأخطر النقاط العمياء التي تستنزف أرباحك حالياً، مع خطة عمل استراتيجية فورية.
          </p>
        </motion.div>

        {/* SECTION 1: AI Generated Report (Headline, Score, SWOT, Blind Spots, priority actions) */}
        <div className="space-y-8">
          
          {/* Main Headline & Score card */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-8 flex flex-col md:flex-row items-center gap-8">
            <div className="flex-1 text-center md:text-right w-full">
              <span className="text-slate-400 text-xs font-bold uppercase tracking-wider block mb-1">الخلاصة التشخيصية الفورية</span>
              <h2 className="text-2xl md:text-3xl font-extrabold text-[#0F172A] leading-relaxed mb-4">
                {report?.headline_diagnosis}
              </h2>
              <div className="h-1 w-20 bg-[#EF4444] rounded-full mx-auto md:mr-0 mb-4"></div>
              <p className="text-slate-600 text-sm leading-relaxed">
                تم احتساب مؤشر الصحة الكلي لشركتكم برمجياً بناءً على توازن الملاءة المالية، التوثيق التشغيلي، النضج التنافسي، والمتابعة التسويقية.
              </p>
            </div>
            
            <div className="flex flex-col items-center justify-center bg-slate-50 border border-slate-100 rounded-2xl p-6 md:px-12 text-center shrink-0 w-full md:w-auto">
              <span className="text-slate-500 text-xs font-bold block mb-2">مؤشر الصحة الكلي (Health Score)</span>
              <div className="relative flex items-center justify-center mb-2">
                <span className={`text-6xl font-extrabold ${getHealthColor(score)}`}>
                  {score}
                </span>
                <span className="text-slate-300 text-xl font-bold mr-1">/100</span>
              </div>
              <span className={`px-4 py-1.5 rounded-full text-sm font-bold text-white shadow-sm ${getHealthBg(score)}`}>
                {healthLabel}
              </span>
            </div>
          </div>

          {/* SWOT Grid */}
          {report?.swot && (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-8">
              <div className="flex items-center gap-2 mb-6">
                <span className="text-2xl">📊</span>
                <h3 className="text-xl font-extrabold text-[#0F172A]">مصفوفة تحليل الوضع الداخلي والخارجي</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Strengths */}
                <div className="bg-emerald-50/40 border border-emerald-100 rounded-xl p-5">
                  <h4 className="font-bold text-emerald-800 flex items-center gap-2 mb-3">
                    <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full"></span>
                    <span>نقاط القوة المتميزة</span>
                  </h4>
                  <ul className="space-y-2 text-slate-700 text-sm list-inside list-disc pl-2">
                    {report.swot.strengths?.map((s: string, i: number) => <li key={i} className="leading-relaxed">{s}</li>)}
                    {(!report.swot.strengths || report.swot.strengths.length === 0) && <li className="text-slate-400">لا يوجد نقاط مسجلة</li>}
                  </ul>
                </div>

                {/* Weaknesses */}
                <div className="bg-rose-50/40 border border-rose-100 rounded-xl p-5">
                  <h4 className="font-bold text-rose-800 flex items-center gap-2 mb-3">
                    <span className="w-2.5 h-2.5 bg-[#EF4444] rounded-full"></span>
                    <span>نقاط الضعف والقصور</span>
                  </h4>
                  <ul className="space-y-2 text-slate-700 text-sm list-inside list-disc pl-2">
                    {report.swot.weaknesses?.map((w: string, i: number) => <li key={i} className="leading-relaxed">{w}</li>)}
                    {(!report.swot.weaknesses || report.swot.weaknesses.length === 0) && <li className="text-slate-400">لا يوجد نقاط مسجلة</li>}
                  </ul>
                </div>

                {/* Opportunities */}
                <div className="bg-blue-50/40 border border-blue-100 rounded-xl p-5">
                  <h4 className="font-bold text-blue-800 flex items-center gap-2 mb-3">
                    <span className="w-2.5 h-2.5 bg-blue-500 rounded-full"></span>
                    <span>الفرص المتاحة للنمو</span>
                  </h4>
                  <ul className="space-y-2 text-slate-700 text-sm list-inside list-disc pl-2">
                    {report.swot.opportunities?.map((o: string, i: number) => <li key={i} className="leading-relaxed">{o}</li>)}
                    {(!report.swot.opportunities || report.swot.opportunities.length === 0) && <li className="text-slate-400">لا يوجد نقاط مسجلة</li>}
                  </ul>
                </div>

                {/* Threats */}
                <div className="bg-amber-50/40 border border-amber-100 rounded-xl p-5">
                  <h4 className="font-bold text-amber-800 flex items-center gap-2 mb-3">
                    <span className="w-2.5 h-2.5 bg-amber-500 rounded-full"></span>
                    <span>التهديدات والمخاطر الخارجية</span>
                  </h4>
                  <ul className="space-y-2 text-slate-700 text-sm list-inside list-disc pl-2">
                    {report.swot.threats?.map((t: string, i: number) => <li key={i} className="leading-relaxed">{t}</li>)}
                    {(!report.swot.threats || report.swot.threats.length === 0) && <li className="text-slate-400">لا يوجد نقاط مسجلة</li>}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Blind Spots Section */}
          {report?.blind_spots && report.blind_spots.length > 0 && (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-8">
              <div className="flex items-center gap-2 mb-6">
                <span className="text-2xl text-[#EF4444]">🚨</span>
                <h3 className="text-xl font-extrabold text-[#0F172A]">النقاط العمياء المرصودة في عملياتكم (Blind Spots)</h3>
              </div>
              
              <div className="space-y-5">
                {report.blind_spots.map((bs: any, idx: number) => (
                  <div key={idx} className="border-2 border-slate-100 hover:border-slate-200 rounded-xl p-5 transition-all">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                      <div className="flex items-center gap-2">
                        <span className="bg-red-50 text-[#EF4444] font-bold text-sm w-7 h-7 rounded-full flex items-center justify-center border border-red-100 shrink-0">
                          {idx + 1}
                        </span>
                        <h4 className="font-bold text-slate-900 text-base leading-relaxed">{bs.name}</h4>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        {getImpactBadge(bs.impact_level)}
                        <span className="bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full text-xs font-semibold">
                          خسارة مقدرة: {bs.estimated_cost}
                        </span>
                      </div>
                    </div>
                    <p className="text-slate-600 text-sm leading-relaxed mb-3.5 pr-9">
                      {bs.description}
                    </p>
                    <div className="bg-slate-50 border border-slate-100 rounded-lg p-3 text-xs text-slate-500 leading-relaxed mr-9 flex items-start gap-2">
                      <HelpCircle size={14} className="text-slate-400 shrink-0 mt-0.5" />
                      <span><strong>سبب الاكتشاف:</strong> رصدناه بناءً على إجابتك الصريحة على سؤال: "<em>{bs.source_question}</em>"</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Priority Actions Section */}
          {report?.priority_actions && report.priority_actions.length > 0 && (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-8">
              <div className="flex items-center gap-2 mb-6">
                <span className="text-2xl text-emerald-500">🎯</span>
                <h3 className="text-xl font-extrabold text-[#0F172A]">خطة العمل الخمسية العاجلة لمعالجة الخلل (Priority Actions)</h3>
              </div>
              
              <div className="space-y-5">
                {report.priority_actions.map((act: any, idx: number) => (
                  <div key={idx} className="border-2 border-slate-100 hover:border-slate-200 rounded-xl p-5 transition-all bg-emerald-50/10">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                      <div className="flex items-center gap-2">
                        <span className="bg-emerald-50 text-emerald-600 font-bold text-sm w-7 h-7 rounded-full flex items-center justify-center border border-emerald-100 shrink-0">
                          {idx + 1}
                        </span>
                        <h4 className="font-bold text-slate-900 text-base leading-relaxed">{act.action}</h4>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="bg-emerald-100/50 text-emerald-700 px-2.5 py-1 rounded-full text-xs font-bold border border-emerald-200">الأولوية {idx + 1}</span>
                        <span className="bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full text-xs font-semibold">
                          المدى: {act.timeframe}
                        </span>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pr-9 mt-3">
                      <div>
                        <span className="text-slate-400 text-xs block mb-1 font-bold">لماذا يجب البدء الآن؟</span>
                        <p className="text-slate-600 text-xs leading-relaxed">{act.why_now}</p>
                      </div>
                      <div>
                        <span className="text-slate-400 text-xs block mb-1 font-bold">العائد والأثر المتوقع</span>
                        <p className="text-slate-600 text-xs leading-relaxed">{act.expected_impact}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Proposal Card (if generated/present) */}
          {proposalText && (
            <div className="bg-gradient-to-br from-[#0F172A] to-[#1E293B] text-white rounded-2xl shadow-xl border border-slate-800 p-6 md:p-8 relative overflow-hidden">
              <div className="absolute top-0 left-0 bg-[#EF4444] text-white px-4 py-1 rounded-br-xl text-xs font-bold">عرض خاص</div>
              
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <span>🛡️</span>
                <span>عرض التعاقد الآمن وحماية الشراكة</span>
              </h3>
              
              <p className="text-slate-300 text-base leading-relaxed whitespace-pre-wrap mb-6">
                {proposalText}
              </p>
              
              <div className="flex flex-wrap gap-3">
                <a 
                  href={waLink}
                  target="_blank"
                  rel="noreferrer"
                  className="bg-[#10B981] hover:bg-emerald-600 text-white px-6 py-3.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2 shadow-md cursor-pointer shrink-0"
                >
                  <MessageCircle size={18} />
                  <span>احجز جلستك المجانية فوراً</span>
                </a>
                <button 
                  onClick={handleCopyLink}
                  className="bg-slate-800 hover:bg-slate-700 text-slate-200 px-5 py-3.5 rounded-xl text-sm font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  {copied ? <Check size={18} className="text-emerald-400" /> : <Copy size={18} />}
                  <span>{copied ? 'تم النسخ!' : 'انسخ هذا العرض التشخيصي'}</span>
                </button>
              </div>
            </div>
          )}

          {/* COLLAPSIBLE SECTION FOR RAW Q&A DETAILS */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <button 
              onClick={() => setShowRawDetails(!showRawDetails)}
              className="w-full p-6 flex items-center justify-between hover:bg-slate-50 transition-colors text-right"
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">📋</span>
                <div>
                  <h3 className="text-lg font-extrabold text-[#0F172A]">التفاصيل الكاملة لتشخيصك والردود الخام</h3>
                  <p className="text-slate-500 text-xs mt-0.5">تحليل لجميع الإجابات والمدخلات المسجلة للشركة</p>
                </div>
              </div>
              <div className="text-[#EF4444]">
                {showRawDetails ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
              </div>
            </button>

            <AnimatePresence>
              {showRawDetails && (
                <motion.div 
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="border-t border-slate-200 bg-slate-50/50 p-6 space-y-8"
                >
                  {/* Category 1: Company Intake Fields */}
                  <div className="space-y-4">
                    <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider border-b pb-2 flex items-center gap-2">
                      <Briefcase size={16} />
                      <span>القسم الأول: بيانات الشركة وهوية التأسيس</span>
                    </h4>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Name */}
                      <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
                        <span className="text-xs text-slate-500 block mb-1">الاسم الأول لمقدم الاستبيان</span>
                        <span className="text-[#0F172A] font-bold">{userName}</span>
                      </div>
                      
                      {/* Company Name */}
                      <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
                        <span className="text-xs text-slate-500 block mb-1">اسم الشركة أو النشاط</span>
                        <span className="text-[#0F172A] font-bold">{companyName}</span>
                      </div>

                      {/* Sector */}
                      <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
                        <span className="text-xs text-slate-500 block mb-1">قطاع العمل</span>
                        <span className="text-[#0F172A] font-bold">{sectorL1} - {sectorL2}</span>
                      </div>

                      {/* Location */}
                      <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
                        <span className="text-xs text-slate-500 block mb-1">الموقع الجغرافي</span>
                        <span className="text-[#0F172A] font-bold">{lead?.country || session.country || 'غير محدد'} - {lead?.city || session.city || 'غير محدد'}</span>
                      </div>

                      {/* Company Age */}
                      <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
                        <span className="text-xs text-slate-500 block mb-1">عمر الشركة</span>
                        <span className="text-[#0F172A] font-bold">{intakeData.companyAge || 'لم يحدد'}</span>
                      </div>

                      {/* Experience */}
                      <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
                        <span className="text-xs text-slate-500 block mb-1">خبرة المؤسس في المجال</span>
                        <span className="text-[#0F172A] font-bold">{intakeData.founderExperience || 'لم يحدد'}</span>
                      </div>

                      {/* Motivation */}
                      <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
                        <span className="text-xs text-slate-500 block mb-1">الدافع وراء التأسيس</span>
                        <span className="text-[#0F172A] font-bold">
                          {Array.isArray(intakeData.businessMotivation) 
                            ? intakeData.businessMotivation.join('، ') 
                            : intakeData.businessMotivation || 'لم يحدد'}
                        </span>
                      </div>

                      {/* Models Applied */}
                      <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
                        <span className="text-xs text-slate-500 block mb-1">ما تم تطبيقه من نماذج تخطيط قبل البدء</span>
                        <span className="text-[#0F172A] font-bold">
                          {Array.isArray(intakeData.modelsApplied) 
                            ? intakeData.modelsApplied.join('، ') 
                            : intakeData.modelsApplied || 'لم يحدد'}
                        </span>
                      </div>

                      {/* Break Even */}
                      <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
                        <span className="text-xs text-slate-500 block mb-1">الوصول لنقطة التعادل (Break Even)</span>
                        <span className="text-[#0F172A] font-bold">
                          {intakeData.breakEven || 'لم يحدد'} {intakeData.breakEvenTime ? `(${intakeData.breakEvenTime})` : ''}
                        </span>
                      </div>

                      {/* ROI */}
                      <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
                        <span className="text-xs text-slate-500 block mb-1">معدل العائد على الاستثمار ROI</span>
                        <span className="text-[#0F172A] font-bold">{intakeData.roi || 'لم يحدد'}</span>
                      </div>

                      {/* Fixed Costs Pct */}
                      <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
                        <span className="text-xs text-slate-500 block mb-1">التكاليف الثابتة كنسبة من الإيراد</span>
                        <span className="text-[#EF4444] font-bold">{intakeData.fixedCostsPct !== undefined ? `${intakeData.fixedCostsPct}%` : 'لم يحدد'}</span>
                      </div>

                      {/* Debt */}
                      <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
                        <span className="text-xs text-slate-500 block mb-1">قروض أو التزامات مالية خارجية</span>
                        <span className="text-[#0F172A] font-bold">
                          {intakeData.hasDebt === 'نعم' 
                            ? `نعم (الأقساط: ${intakeData.debtMonthlyPct}%, المدة: ${intakeData.debtDuration} أشهر من الإيراد)` 
                            : intakeData.hasDebt || 'لم يحدد'}
                        </span>
                      </div>

                      {/* Competitors */}
                      <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm md:col-span-2">
                        <span className="text-xs text-slate-500 block mb-1">المنافسون المسجلون</span>
                        <span className="text-[#0F172A] font-bold">
                          {[intakeData.comp1, intakeData.comp2, intakeData.comp3].filter(Boolean).join(' ، ') || 'لم يتم تسجيل منافسين بعينهم'}
                        </span>
                      </div>

                      {/* Differentiators */}
                      <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm md:col-span-2">
                        <span className="text-xs text-slate-500 block mb-1">نقاط التميز التنافسية للشركة</span>
                        <span className="text-[#0F172A] font-bold">
                          {Array.isArray(intakeData.differentiators) 
                            ? intakeData.differentiators.join('، ') 
                            : intakeData.differentiators || 'لم يحدد'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Category 2: Universal Questions */}
                  <div className="space-y-4 pt-4 border-t border-slate-200">
                    <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider border-b pb-2 flex items-center gap-2">
                      <BookOpen size={16} />
                      <span>القسم الثاني: محاور التقييم العامة والعالمية (Universal Questions)</span>
                    </h4>
                    
                    <div className="space-y-4">
                      {universalQuestions.map((q: any) => (
                        <div key={q.id} className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm">
                          <p className="text-slate-500 text-xs font-bold mb-1">البعد: {q.dimension}</p>
                          <h5 className="font-bold text-[#0F172A] text-sm leading-relaxed mb-2.5">{q.question}</h5>
                          <div className="mt-2">
                            {getQuestionAnswerText(q.id, q.type, q.options)}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Category 3: Sector Specific Questions */}
                  {sectorQuestions[sectorL1] && sectorQuestions[sectorL1].length > 0 && (
                    <div className="space-y-4 pt-4 border-t border-slate-200">
                      <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider border-b pb-2 flex items-center gap-2">
                        <TrendingUp size={16} />
                        <span>القسم الثالث: أسئلة المحور القطاعي المخصص ({sectorL1})</span>
                      </h4>
                      
                      <div className="space-y-4">
                        {sectorQuestions[sectorL1].map((q: any) => (
                          <div key={q.id} className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm">
                            <p className="text-slate-500 text-xs font-bold mb-1">المحور: {q.dimension}</p>
                            <h5 className="font-bold text-[#0F172A] text-sm leading-relaxed mb-2.5">{q.question}</h5>
                            <div className="mt-2">
                              {getQuestionAnswerText(q.id, q.type, q.options)}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Category 4: Delta Specific Questions */}
                  {deltaQuestions[sectorL2] && deltaQuestions[sectorL2].length > 0 && (
                    <div className="space-y-4 pt-4 border-t border-slate-200">
                      <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider border-b pb-2 flex items-center gap-2">
                        <HelpCircle size={16} />
                        <span>القسم الرابع: تفاصيل أسئلة الدلتا التخصصية الدقيقة ({sectorL2})</span>
                      </h4>
                      
                      <div className="space-y-4">
                        {deltaQuestions[sectorL2].map((q: any) => (
                          <div key={q.id} className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm">
                            <p className="text-slate-500 text-xs font-bold mb-1">الفئة: {q.dimension}</p>
                            <h5 className="font-bold text-[#0F172A] text-sm leading-relaxed mb-2.5">{q.question}</h5>
                            <div className="mt-2">
                              {getQuestionAnswerText(q.id, q.type, q.options)}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Bottom call to action */}
          <div className="bg-[#EF4444]/5 border-2 border-dashed border-[#EF4444]/30 rounded-2xl p-6 md:p-8 text-center">
            <h3 className="font-extrabold text-xl text-slate-900 mb-2">ترغب في تنفيذ التوصيات وإيقاف النزيف المالي؟</h3>
            <p className="text-slate-600 text-sm max-w-xl mx-auto mb-6 leading-relaxed">
              تواصل مع الاستشاري أحمد رمضان شخصياً لمراجعة تقرير تشخيصك الحقيقي وصياغة آليات عمل مخصصة لواقع شركتك لزيادة الأرباح بنسبة ملموسة.
            </p>
            <div className="flex flex-col sm:flex-row justify-center items-center gap-3">
              <a 
                href={waLink}
                target="_blank"
                rel="noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#10B981] hover:bg-emerald-600 text-white px-8 py-4 rounded-xl font-bold text-base transition-all shadow-md hover:shadow-lg cursor-pointer"
              >
                <MessageCircle size={20} />
                <span>تواصل مع أستاذ أحمد رمضان عبر WhatsApp</span>
              </a>
              <Link 
                to="/consultant"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 px-8 py-4 rounded-xl font-bold text-base transition-all cursor-pointer"
              >
                <span>الاطلاع على سجل الإنجازات والخبرات</span>
              </Link>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default SessionView;
