import { UniversalQuestion } from './universalQuestions';

export const deltaQuestions: Record<string, UniversalQuestion[]> = {
  "عيادة أسنان": [
    {
      id: "d_dent_01",
      dimension: "عيادة أسنان",
      question: "ما نسبة المرضى الذين يحتاجون خطة علاج متعددة الجلسات ولا يكملونها؟",
      type: "single_choice",
      options: [
        { value: "low", label: "نسبة منخفضة أقل من 20%" },
        { value: "medium", label: "متوسطة 20-50%" },
        { value: "high", label: "مرتفعة أكثر من 50%" }
      ],
      toastKey: "dental_followup"
    },
    {
      id: "d_dent_02",
      dimension: "عيادة أسنان",
      question: "هل تقدم خيارات تجميلية (تبييض، تقويم شفاف) كمصدر دخل إضافي؟",
      type: "single_choice",
      options: [
        { value: "active", label: "نعم ومُسوَّق بشكل فعال" },
        { value: "passive", label: "نعم لكن نادراً ما يُذكر" },
        { value: "no", label: "لا" }
      ],
      toastKey: "dental_cosmetics"
    },
    {
      id: "d_dent_03",
      dimension: "عيادة أسنان",
      question: "ما أكبر مصدر لخوف المريض الجديد من الحجز أصلاً؟",
      type: "single_choice",
      options: [
        { value: "pain", label: "الألم المتوقع" },
        { value: "cost", label: "التكلفة" },
        { value: "bad_exp", label: "تجربة سابقة سيئة" },
        { value: "unknown_doc", label: "عدم معرفة الطبيب" }
      ],
      toastKey: "dental_fear"
    }
  ],
  "مركز غسيل كلى": [
    {
      id: "d_dial_01",
      dimension: "مركز غسيل كلى",
      question: "هل لديك نظام مواعيد ثابت يقلل وقت انتظار المريض بين الجلسات؟",
      type: "single_choice",
      options: [
        { value: "yes", label: "نعم ومطبق بصرامة" },
        { value: "partial", label: "نعم ولكن يحدث تأخير أحياناً" },
        { value: "no", label: "لا — الحضور حسب الأسبقية" }
      ],
      toastKey: "dialysis_schedule"
    },
    {
      id: "d_dial_02",
      dimension: "مركز غسيل كلى",
      question: "ما نسبة المرضى المُحوَّلين من مستشفيات أو أطباء إحالة بشكل منتظم؟",
      type: "single_choice",
      options: [
        { value: "high", label: "أكثر من 50% من المرضى" },
        { value: "medium", label: "20% إلى 50% من المرضى" },
        { value: "low", label: "أقل من 20% (نعتمد على جهودنا الخاصة)" }
      ],
      toastKey: "dialysis_referrals"
    },
    {
      id: "d_dial_03",
      dimension: "مركز غسيل كلى",
      question: "كيف تدير نقص أو تذبذب توفر مستلزمات الغسيل الكلوي؟",
      type: "single_choice",
      options: [
        { value: "proactive", label: "لدينا مخزون أمان وموردين بدلاء دائماً" },
        { value: "reactive", label: "ندير الأمور عند حدوث النقص فقط" },
        { value: "frequent_crisis", label: "نواجه أزمات متكررة تؤثر على الجلسات" }
      ],
      toastKey: "dialysis_supply"
    }
  ],
  "صيدلية": [
    {
      id: "d_ph_01",
      dimension: "صيدلية",
      question: "ما نسبة مبيعاتك من أدوية بوصفة طبية مقابل بدون وصفة؟",
      type: "single_choice",
      options: [
        { value: "rx_dominant", label: "أكثر من 75% أدوية بوصفة" },
        { value: "balanced", label: "توازن بين الأدوية ومنتجات العناية" },
        { value: "otc_dominant", label: "أكثر من 75% مبيعات بدون وصفة (عناية، تجميل، مكملات)" }
      ],
      toastKey: "pharmacy_mix"
    },
    {
      id: "d_ph_02",
      dimension: "صيدلية",
      question: "هل تقدم خدمة توصيل، وما نسبة الطلبات التي تعتمد عليها؟",
      type: "single_choice",
      options: [
        { value: "high_del", label: "نعم، والتوصيل يمثل أكثر من 30% من المبيعات" },
        { value: "low_del", label: "نعم، ولكن يمثل أقل من 30% من المبيعات" },
        { value: "no_del", label: "لا نقدم خدمة توصيل" }
      ],
      toastKey: "pharmacy_delivery"
    },
    {
      id: "d_ph_03",
      dimension: "صيدلية",
      question: "كيف تدير نفاد أصناف معينة بشكل متكرر — هل يوجد نظام تنبؤ بالطلب؟",
      type: "single_choice",
      options: [
        { value: "automated", label: "نعم — نظام ذكي يتنبأ بالطلب تلقائياً" },
        { value: "manual", label: "نراقب الرفوف ونسجل النقص يدوياً" },
        { value: "no_system", label: "لا يوجد نظام ونعاني من نفاد الأصناف باستمرار" }
      ],
      toastKey: "pharmacy_stock"
    }
  ]
};
