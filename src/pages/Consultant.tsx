import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  MessageCircle, ArrowLeft, Award, Users, TrendingUp, ShieldCheck, 
  MapPin, Globe, Star, FileText, CheckCircle2, ChevronRight, Activity, Zap
} from 'lucide-react';

const Consultant: React.FC = () => {
  const navigate = useNavigate();
  const [activeLocation, setActiveLocation] = useState<string | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const ahmedWhatsapp = import.meta.env.VITE_AHMED_WHATSAPP || '201066966515';
  const waLink = `https://wa.me/${ahmedWhatsapp}?text=${encodeURIComponent(
    "أهلاً أستاذ أحمد رمضان، قمت بالاطلاع على سجل إنجازاتكم وخبراتكم وأرغب في جدولة مكالمة التعارف الاستراتيجية المجانية لبحث فرص تطوير شركتي."
  )}`;

  const stats = [
    { 
      id: 'stat-1',
      icon: <Users className="text-[#EF4444]" size={24} />, 
      value: "+50", 
      label: "شركة تم تشخيصها وتطوير عملياتها", 
      sub: "في مصر والشرق الأوسط" 
    },
    { 
      id: 'stat-2',
      icon: <ShieldCheck className="text-emerald-500" size={24} />, 
      value: "100%", 
      label: "الالتزام بتحقيق مؤشرات الأداء", 
      sub: "نموذج تعاقد آمن تماماً" 
    },
    { 
      id: 'stat-3',
      icon: <TrendingUp className="text-[#EF4444]" size={24} />, 
      value: "+10M", 
      label: "جنيه مصري أرباحاً إضافية مستردة", 
      sub: "من سد وتأمين النقاط العمياء" 
    },
    { 
      id: 'stat-4',
      icon: <Activity className="text-blue-500" size={24} />, 
      value: "90 يوماً", 
      label: "متوسط وقت الأثر الفعلي الملموس", 
      sub: "لخطط التطوير والتحسين" 
    }
  ];

  const partnersLocations = [
    { id: 'cairo', name: 'القاهرة والجيزة', x: '50%', y: '65%', desc: '24 شركة تجارية، صناعية، وعيادات طبية تم أتمتة عملياتها وحماية أرباحها.' },
    { id: 'riyadh', name: 'الرياض', x: '68%', y: '58%', desc: '12 شركة تجزئة ومطاعم سحابية تم إعادة هيكلة سلاسل إمدادها وزيادة المبيعات.' },
    { id: 'jeddah', name: 'جدة', x: '62%', y: '68%', desc: '8 شركات خدمات لوجستية ومقاولات تم سد نقاط الفاقد المالي بها.' },
    { id: 'dubai', name: 'دبي والشارقة', x: '78%', y: '52%', desc: '6 شركات تجارة إلكترونية وسياحة ضاعفت معدل الشراء المتكرر.' },
    { id: 'alex', name: 'الإسكندرية', x: '47%', y: '54%', desc: '7 توكيلات تجارية ومحلات بيع بالتجزئة تم حماية هوامش أرباحها.' }
  ];

  const successStories = [
    {
      category: "عيادات ومراكز الأسنان",
      title: "أتمتة المتابعة وخطط العلاج",
      problem: "تسرب المرضى بعد الجلسة الأولى وعدم إتمام خطط العلاج الطويلة (نسبة إتمام 32% فقط).",
      solution: "أتمتة نظام المتابعة السلوكية للمرضى، وتدريب فريق الاستقبال على معالجة مخاوف المريض من التكلفة والألم.",
      result: "ارتفاع نسبة إتمام العلاج إلى 74% خلال 60 يوماً فقط، مع زيادة صافي الإيرادات المتكررة بمعدل 2.1 ضعف."
    },
    {
      category: "تجارة التجزئة والهايبر ماركت",
      title: "السيطرة على فاقد المخزون والتكاليف الثابتة",
      problem: "وجود تسرب غير مفسر في هوامش الأرباح وتجاوز التكاليف الثابتة لـ 25% من الإيراد الكلي.",
      solution: "تطبيق نظام الرقابة والربط التقني للجرد، مراجعة هيكل التسعير التنافسي والحد من السلع الراكدة.",
      result: "توفير متوسط 140,000 جنيه مصري شهرياً من الهدر، وتخفيض نسبة التكاليف الثابتة من الإيراد إلى 14%."
    },
    {
      category: "مواقع المتاجر الإلكترونية (E-commerce)",
      title: "مضاعفة الشراء المتكرر لدى العملاء الحاليين",
      problem: "الاعتماد الكلي على الإعلانات الممولة لجلب عملاء جدد بتكلفة متزايدة مع إهمال قاعدة البيانات الحالية.",
      solution: "بناء قنوات اتصال وتثقيف مؤتمتة عبر واتساب وإطلاق نظام ولاء ذكي يحفز الشراء المتكرر.",
      result: "رفع نسبة الشراء المتكرر بمعدل 2.4 ضعف خلال 90 يوماً، وتخفيض ميزانية الاستحواذ المباشر بنسبة 35%."
    }
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-24 rtl font-arabic text-slate-800">
      
      {/* Top Navbar */}
      <nav className="bg-white border-b border-slate-200 py-4 px-6 md:px-8 sticky top-0 z-50 shadow-sm flex items-center justify-between">
        <button 
          onClick={() => navigate(-1)} 
          className="text-slate-500 hover:text-slate-800 flex items-center gap-1 text-sm font-bold cursor-pointer"
        >
          <ChevronRight size={18} />
          <span>الرجوع للتقرير</span>
        </button>
        <div className="flex items-center gap-2">
          <span className="text-[#EF4444] font-bold text-lg">BIK Solutions</span>
        </div>
      </nav>

      {/* Hero Header */}
      <div className="bg-[#0F172A] text-white py-16 md:py-24 px-4 overflow-hidden relative">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(239,68,68,0.1),transparent_50%)]"></div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.span 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-4 py-1.5 rounded-full text-xs font-bold inline-block mb-6"
          >
            مستشار تطوير وحماية أرباح الأعمال
          </motion.span>
          <motion.h1 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-5xl font-extrabold leading-tight mb-6"
          >
            المهندس أحمد رمضان
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-slate-300 text-lg md:text-xl leading-relaxed max-w-2xl mx-auto mb-8 font-light"
          >
            نساعد الشركات المتوسطة والناشئة على سد فجوات الهدر المالي، أتمتة العمليات التشغيلية الصعبة، وإعادة بناء هيكلية التسعير لضمان تحقيق أقصى ربحية مستدامة.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <a 
              href={waLink}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2.5 bg-[#10B981] hover:bg-emerald-600 text-white px-8 py-4 rounded-xl font-bold text-base shadow-lg hover:shadow-xl transition-all cursor-pointer transform hover:-translate-y-0.5"
            >
              <MessageCircle size={20} />
              <span>جدولة مكالمة تعارف وحلول مجانية</span>
            </a>
          </motion.div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 mt-12 space-y-16">
        
        {/* Section 1: The Specific Core Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {stats.map((stat) => (
            <motion.div 
              key={stat.id}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex items-start gap-4 hover:border-slate-300 transition-all"
            >
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 shrink-0">
                {stat.icon}
              </div>
              <div className="text-right">
                <span className="text-3xl font-extrabold text-[#0F172A] block leading-none mb-1">{stat.value}</span>
                <span className="text-slate-800 font-bold text-sm block mb-1">{stat.label}</span>
                <span className="text-slate-500 text-xs">{stat.sub}</span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Section 2: Interactive World Map with Glowing Markers */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8 shadow-sm">
          <div className="text-center md:text-right mb-6">
            <h3 className="text-xl font-extrabold text-[#0F172A] flex items-center gap-2 justify-center md:justify-start">
              <Globe className="text-[#EF4444]" size={20} />
              <span>الامتداد الجغرافي وشركاء النجاح</span>
            </h3>
            <p className="text-slate-500 text-xs mt-1">اضغط على أي مؤشر مضيء بالخارطة لعرض تفاصيل النجاح في تلك المنطقة</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
            {/* Styled region representation mock-map with glowing locations */}
            <div className="md:col-span-2 bg-[#0F172A] h-[280px] rounded-2xl relative overflow-hidden shadow-inner border border-slate-800">
              <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:20px_20px]"></div>
              
              {/* Simple stylized outline representing Middle East markets */}
              <div className="absolute inset-x-8 inset-y-12 border border-slate-700/30 rounded-full bg-radial-gradient from-red-500/5 to-transparent"></div>
              
              {/* Glowing location points */}
              {partnersLocations.map((loc) => {
                const isActive = activeLocation === loc.id;
                return (
                  <button
                    key={loc.id}
                    onClick={() => setActiveLocation(loc.id)}
                    className="absolute group focus:outline-none transition-all cursor-pointer"
                    style={{ left: loc.x, top: loc.y }}
                  >
                    <span className="absolute inline-flex h-full w-full rounded-full bg-[#EF4444] opacity-75 animate-ping"></span>
                    <span className={`relative inline-block rounded-full ${isActive ? 'h-4.5 w-4.5 bg-[#EF4444]' : 'h-3 w-3 bg-[#EF4444]/80 hover:bg-[#EF4444]'} border border-white transition-all`}></span>
                    
                    {/* Tooltip on hover */}
                    <span className="absolute bottom-6 right-1/2 translate-x-1/2 bg-slate-900 text-white text-[10px] font-bold px-2 py-1 rounded border border-slate-700 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity z-20 pointer-events-none">
                      {loc.name}
                    </span>
                  </button>
                );
              })}
              
              <div className="absolute bottom-3 right-3 text-[10px] text-slate-500 font-mono">
                مواقع الشركاء الاستراتيجيين الفعليين
              </div>
            </div>

            {/* Region Details panel */}
            <div className="bg-slate-50 rounded-xl p-5 border border-slate-100 h-full flex flex-col justify-center text-right min-h-[160px]">
              {activeLocation ? (
                (() => {
                  const loc = partnersLocations.find(l => l.id === activeLocation);
                  return (
                    <motion.div 
                      key={loc?.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="space-y-2"
                    >
                      <div className="flex items-center gap-1.5 text-[#EF4444] font-bold text-sm">
                        <MapPin size={16} />
                        <span>منطقة {loc?.name}</span>
                      </div>
                      <p className="text-slate-700 text-xs leading-relaxed">
                        {loc?.desc}
                      </p>
                    </motion.div>
                  );
                })()
              ) : (
                <div className="text-center text-slate-400 text-xs py-4">
                  <p>تنتشر شراكاتنا في مصر، الرياض، دبي، وجدة.</p>
                  <p className="mt-2 font-medium text-[#EF4444] animate-pulse">اختر نقطة مضيئة بالخارطة لعرض السجل</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Section 3: Track Record (Success Cases) */}
        <div className="space-y-6">
          <div className="text-center md:text-right">
            <h3 className="text-xl font-extrabold text-[#0F172A] flex items-center gap-2 justify-center md:justify-start">
              <Award className="text-[#EF4444]" size={20} />
              <span>بطاقات سجل النجاحات العملية والأثر الفعلي</span>
            </h3>
            <p className="text-slate-500 text-xs mt-1">أمثلة واقعية لتحديات تم حلها وأرباح تم حمايتها داخل قطاعات مختلفة</p>
          </div>

          <div className="space-y-4">
            {successStories.map((story, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-all text-right space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-3 gap-2">
                  <span className="bg-[#EF4444]/10 text-[#EF4444] text-xs font-bold px-3 py-1 rounded-full border border-red-50/50">
                    قطاع {story.category}
                  </span>
                  <h4 className="font-extrabold text-[#0F172A] text-base">{story.title}</h4>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs leading-relaxed">
                  <div className="bg-red-50/20 border border-red-100/30 p-3.5 rounded-xl">
                    <span className="font-bold text-red-800 block mb-1">❌ المشكلة والتحدي الأصلي:</span>
                    <p className="text-slate-600">{story.problem}</p>
                  </div>
                  <div className="bg-emerald-50/20 border border-emerald-100/30 p-3.5 rounded-xl">
                    <span className="font-bold text-emerald-800 block mb-1">🛠️ آلية التدخل والحل العملي:</span>
                    <p className="text-slate-600">{story.solution}</p>
                  </div>
                </div>

                <div className="bg-[#0F172A] text-white p-4 rounded-xl flex items-center gap-3">
                  <span className="text-xl shrink-0">📈</span>
                  <div className="text-xs">
                    <span className="font-bold text-emerald-400 block mb-0.5">النتيجة المالية والأثر الملموس:</span>
                    <p className="text-slate-300">{story.result}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Section 4: Direct Secure Partnership Guarantee CTA */}
        <div className="bg-gradient-to-br from-[#0F172A] to-[#1E293B] text-white rounded-2xl p-6 md:p-10 shadow-xl border border-slate-800 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 bg-red-600 px-4 py-1 text-[10px] font-bold uppercase tracking-wider rounded-bl-xl text-white">التعاقد الآمن حقيقة</div>
          
          <h3 className="text-xl md:text-2xl font-bold mb-4">آلية ضمان التعاقد المبني على الأداء</h3>
          <p className="text-slate-300 text-sm leading-relaxed max-w-2xl mx-auto mb-8">
            في BIK Business Solutions، نلتزم بنموذج ثقة حصري: نتقاضى أجرنا بناءً على تحقيق مؤشرات أداء (KPIs) واضحة وملموسة لحماية أرباحك وعملياتك، بمتابعة حية لضمان سلامة القرار الاستثماري للشركة.
          </p>

          <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
            <a 
              href={waLink}
              target="_blank"
              rel="noreferrer"
              className="w-full sm:w-auto bg-[#10B981] hover:bg-emerald-600 text-white px-8 py-4 rounded-xl font-bold text-sm shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <MessageCircle size={18} />
              <span>احجز مكالمة التعارف الاستراتيجية مجاناً</span>
            </a>
            <button
              onClick={() => navigate(-1)}
              className="w-full sm:w-auto bg-slate-800 hover:bg-slate-700 text-slate-300 px-6 py-4 rounded-xl font-bold text-sm transition-all cursor-pointer"
            >
              عودة لمراجعة التقرير
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Consultant;
