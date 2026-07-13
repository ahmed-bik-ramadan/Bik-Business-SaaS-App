export interface QuestionOption {
  value: string;
  label: string;
}

export interface UniversalQuestion {
  id: string;
  dimension: string;
  question: string;
  type: 'single_choice' | 'multi_choice' | 'slider' | 'text';
  options?: QuestionOption[];
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
  placeholder?: string;
  toastKey: string;
}

export const universalQuestions: UniversalQuestion[] = [
  {
    id: "u01",
    dimension: "بنية الشركة وهويتها",
    question: "لو طلبت من أي موظف في شركتك أن يشرح لعميل جديد لماذا يشتري منكم وليس من المنافس — هل سيقول نفس الإجابة؟",
    type: "single_choice",
    options: [
      { value: "always", label: "نعم دائماً — رسالتنا واضحة للجميع" },
      { value: "sometimes", label: "أحياناً — يعتمد على الموظف" },
      { value: "never", label: "لا — كل واحد يقول شيئاً مختلفاً" }
    ],
    toastKey: "value_prop_clarity"
  },
  {
    id: "u02",
    dimension: "بنية الشركة وهويتها",
    question: "إذا رحل أهم موظف لديك غداً — كم يوماً تحتاج لتعويض أثره على العملاء؟",
    type: "single_choice",
    options: [
      { value: "week", label: "أقل من أسبوع — العمليات موثقة" },
      { value: "month", label: "أسبوع إلى شهر — صعب لكن ممكن" },
      { value: "gt_month", label: "أكثر من شهر — هو الركيزة الأساسية" },
      { value: "cant", label: "لا أستطيع التعويض أصلاً" }
    ],
    toastKey: "key_person_risk"
  },
  {
    id: "u03",
    dimension: "بنية الشركة وهويتها",
    question: "هل يمكنك الغياب عن شركتك أسبوعاً كاملاً دون أن يتأثر أداؤها؟",
    type: "single_choice",
    options: [
      { value: "yes_comfortable", label: "نعم براحة تامة" },
      { value: "yes_worried", label: "نعم لكن بقلق مستمر" },
      { value: "no", label: "لا — الشركة تتوقف بغيابي" }
    ],
    toastKey: "operational_independence"
  },
  {
    id: "u04",
    dimension: "الصحة المالية",
    question: "في نهاية كل شهر — هل أنت متفاجئ من الأرقام أم متوقع لها؟",
    type: "single_choice",
    options: [
      { value: "expected", label: "متوقع دائماً — لدي نظام تنبؤ مالي" },
      { value: "positive_surprise", label: "أحياناً مفاجأة إيجابية" },
      { value: "negative_surprise", label: "أحياناً مفاجأة سلبية" },
      { value: "unknown", label: "لا أعرف الأرقام الفعلية مسبقاً" }
    ],
    toastKey: "financial_foresight"
  },
  {
    id: "u05",
    dimension: "الصحة المالية",
    question: "إيراداتك تنمو — لكن هل أرباحك تنمو بنفس السرعة؟",
    type: "single_choice",
    options: [
      { value: "faster", label: "الأرباح تنمو أسرع من الإيرادات" },
      { value: "same", label: "بنفس السرعة تقريباً" },
      { value: "slower", label: "أبطأ بكثير — الهامش يتضيق" },
      { value: "declined", label: "الأرباح تراجعت رغم نمو الإيرادات" }
    ],
    toastKey: "profit_revenue_gap"
  },
  {
    id: "u06",
    dimension: "الصحة المالية",
    question: "ما النسبة التقريبية لصافي ربحك من إيراداتك الشهرية؟",
    type: "single_choice",
    options: [
      { value: "lt5", label: "أقل من 5%" },
      { value: "5_10", label: "5 إلى 10%" },
      { value: "10_20", label: "10 إلى 20%" },
      { value: "gt20", label: "أكثر من 20%" },
      { value: "unknown", label: "لا أحسبها بدقة" }
    ],
    toastKey: "net_margin"
  },
  {
    id: "u07",
    dimension: "الصحة المالية",
    question: "ما أكبر بند تكلفة في شركتك بعد تكلفة المنتج أو الخدمة مباشرة؟",
    type: "single_choice",
    options: [
      { value: "salaries", label: "الرواتب والعمالة" },
      { value: "rent", label: "الإيجار والمرافق" },
      { value: "marketing", label: "التسويق والإعلان" },
      { value: "inventory", label: "المخزون ورأس المال العامل" },
      { value: "debt", label: "خدمة الديون والفوائد" },
      { value: "other", label: "أخرى" }
    ],
    toastKey: "cost_structure"
  },
  {
    id: "u08",
    dimension: "الصحة المالية",
    question: "هل تحتاج إلى تمويل خارجي لتشغيل شركتك بشكل طبيعي؟",
    type: "single_choice",
    options: [
      { value: "no", label: "لا — نعتمد على التدفق الداخلي" },
      { value: "sometimes", label: "أحياناً لتسريع النمو فقط" },
      { value: "yes", label: "نعم بشكل منتظم — التدفق لا يكفي" }
    ],
    toastKey: "cash_dependency"
  },
  {
    id: "u09",
    dimension: "العملاء والمبيعات",
    question: "من كل 10 أشخاص يتواصلون معك أو يزورون شركتك — كم منهم يشتري فعلاً؟",
    type: "slider",
    min: 0,
    max: 10,
    step: 1,
    unit: "يشترون من كل 10",
    toastKey: "conversion_rate"
  },
  {
    id: "u10",
    dimension: "العملاء والمبيعات",
    question: "العملاء الذين يشترون منك — كم منهم يعود للشراء مرة ثانية؟",
    type: "single_choice",
    options: [
      { value: "lt20", label: "أقل من 20%" },
      { value: "20_40", label: "20 إلى 40%" },
      { value: "40_60", label: "40 إلى 60%" },
      { value: "gt60", label: "أكثر من 60%" },
      { value: "unknown", label: "لا أتابع هذا الرقم" }
    ],
    toastKey: "retention_rate"
  },
  {
    id: "u11",
    dimension: "العملاء والمبيعات",
    question: "هل تعرف من هو عميلك الأكثر ربحاً — ليس الأكثر شراءً بل الأكثر ربحاً لك؟",
    type: "single_choice",
    options: [
      { value: "yes_clear", label: "نعم بوضوح تام ولدي بيانات" },
      { value: "guess", label: "تخميناً فقط بدون بيانات" },
      { value: "no", label: "لا — لا أميز بين العملاء بهذا الشكل" }
    ],
    toastKey: "customer_profitability"
  },
  {
    id: "u12",
    dimension: "العملاء والمبيعات",
    question: "ما الوقت الذي يمر بين أول تواصل عميل معك وبين إغلاق الصفقة؟",
    type: "single_choice",
    options: [
      { value: "same_day", label: "نفس اليوم غالباً" },
      { value: "week", label: "يوم إلى أسبوع" },
      { value: "month", label: "أسبوع إلى شهر" },
      { value: "gt_month", label: "أكثر من شهر" }
    ],
    toastKey: "sales_cycle"
  },
  {
    id: "u13",
    dimension: "العملاء والمبيعات",
    question: "متى آخر مرة فقدت عميلاً كنت تعتقد أنه سيبقى؟ وهل عرفت السبب الحقيقي؟",
    type: "single_choice",
    options: [
      { value: "recent_known", label: "قريباً وأعرف السبب تحديداً" },
      { value: "recent_unknown", label: "قريباً ولكن لا أعرف السبب الحقيقي" },
      { value: "old", label: "منذ وقت طويل" },
      { value: "never", label: "لم يحدث هذا حتى الآن" }
    ],
    toastKey: "churn_awareness"
  },
  {
    id: "u14",
    dimension: "العملاء والمبيعات",
    question: "كيف يعرف عملاؤك الجدد شركتك؟ (اختر كل ما ينطبق)",
    type: "multi_choice",
    options: [
      { value: "referral", label: "توصية من عميل حالي" },
      { value: "social", label: "وسائل التواصل الاجتماعي" },
      { value: "google", label: "بحث جوجل أو الخرائط" },
      { value: "ads", label: "إعلانات مدفوعة" },
      { value: "location", label: "الموقع الجغرافي والمرور" },
      { value: "exhibitions", label: "معارض وفعاليات" },
      { value: "cold", label: "مبيعات ميدانية مباشرة" }
    ],
    toastKey: "acquisition_channels"
  },
  {
    id: "u15",
    dimension: "الفريق والعمليات",
    question: "إذا أردت إضافة خدمة جديدة غداً — كم يستغرق تطبيقها على أرض الواقع؟",
    type: "single_choice",
    options: [
      { value: "week", label: "أسبوع أو أقل — العمليات مرنة" },
      { value: "month", label: "شهر واحد" },
      { value: "gt_month", label: "أكثر من شهر" },
      { value: "unknown", label: "لا أعرف — لم نجرب ذلك" }
    ],
    toastKey: "operational_agility"
  },
  {
    id: "u16",
    dimension: "الفريق والعمليات",
    question: "هل فريقك يعرف ما النتيجة المتوقعة منهم كل يوم — بأرقام، لا بمهام؟",
    type: "single_choice",
    options: [
      { value: "yes_metrics", label: "نعم — لدينا مؤشرات أداء موثقة وواضحة" },
      { value: "yes_verbal", label: "نعم لكن شفهياً وغير موثقة" },
      { value: "no", label: "لا — كل واحد يعمل على حسب اجتهاده" }
    ],
    toastKey: "performance_clarity"
  },
  {
    id: "u17",
    dimension: "الفريق والعمليات",
    question: "ما نسبة وقتك الأسبوعي التي تقضيها في حل مشاكل كان يجب ألا تصل إليك أصلاً؟",
    type: "single_choice",
    options: [
      { value: "lt20", label: "أقل من 20% — أتفرغ للاستراتيجية" },
      { value: "20_40", label: "20 إلى 40%" },
      { value: "gt40", label: "أكثر من 40% — أنا مطفئ حرائق يومياً" }
    ],
    toastKey: "delegation_efficiency"
  },
  {
    id: "u18",
    dimension: "الفريق والعمليات",
    question: "هل لديك عمليات موثقة مكتوبة يمكن لموظف جديد العمل منها بدون شرح منك؟",
    type: "single_choice",
    options: [
      { value: "most", label: "نعم لمعظم العمليات الأساسية" },
      { value: "some", label: "لبعضها فقط" },
      { value: "none", label: "لا — كل شيء في رأس الفريق" }
    ],
    toastKey: "process_documentation"
  },
  {
    id: "u19",
    dimension: "الفريق والعمليات",
    question: "ما معدل دوران موظفيك السنوي تقريباً؟",
    type: "single_choice",
    options: [
      { value: "lt10", label: "أقل من 10% — الفريق مستقر جداً" },
      { value: "10_25", label: "10 إلى 25%" },
      { value: "gt25", label: "أكثر من 25% — دوران مرتفع" },
      { value: "unknown", label: "لا أحسبه أصلاً" }
    ],
    toastKey: "staff_turnover"
  },
  {
    id: "u20",
    dimension: "الموقع التنافسي",
    question: "لو نام كل منافسيك أسبوعاً — هل ستلاحظ فرقاً في مبيعاتك؟",
    type: "single_choice",
    options: [
      { value: "big_yes", label: "نعم كبير — العملاء يختاروننا لأسباب واضحة" },
      { value: "small_yes", label: "ربما قليل" },
      { value: "no", label: "لا فرق — الناس تختار على السعر فقط" }
    ],
    toastKey: "brand_pull"
  },
  {
    id: "u21",
    dimension: "الموقع التنافسي",
    question: "ما الشيء الذي يجعل عميلك يختارك رغم وجود منافس بسعر أقل منك؟",
    type: "text",
    placeholder: "اكتب بكلماتك أنت — لا إجابة صح أو غلط...",
    toastKey: "competitive_advantage"
  },
  {
    id: "u22",
    dimension: "الموقع التنافسي",
    question: "هل تتابع ما يفعله منافسوك بشكل منتظم؟",
    type: "single_choice",
    options: [
      { value: "systematic", label: "نعم بشكل منهجي ومنتظم" },
      { value: "random", label: "أحياناً وبشكل عشوائي" },
      { value: "no", label: "لا — لا وقت لذلك" }
    ],
    toastKey: "competitive_intelligence"
  },
  {
    id: "u23",
    dimension: "الموقع التنافسي",
    question: "إذا دخل منافس جديد بسعر أقل بـ 20% — ما ردة فعلك الأولى؟",
    type: "single_choice",
    options: [
      { value: "lower_price", label: "أنزل السعر للحفاظ على العملاء" },
      { value: "raise_value", label: "أرفع القيمة المدركة وأبقى على سعري" },
      { value: "different_segment", label: "أستهدف شريحة مختلفة غير متأثرة" },
      { value: "dont_know", label: "لا أعرف ما سأفعله" }
    ],
    toastKey: "competitive_response"
  },
  {
    id: "u24",
    dimension: "الموقع التنافسي",
    question: "هل شركتك معروفة خارج دائرة عملائها الحاليين؟",
    type: "single_choice",
    options: [
      { value: "strong", label: "نعم — حضور واضح يعرفنا من لم يتعامل معنا" },
      { value: "weak", label: "قليلاً — يعرفنا من جربنا فقط" },
      { value: "none", label: "لا — نعمل بالتوصيات الشخصية فقط" }
    ],
    toastKey: "market_presence"
  },
  {
    id: "u25",
    dimension: "الرؤية والنمو",
    question: "ما الهدف الذي تريد تحقيقه في شركتك خلال 12 شهراً — بأرقام؟",
    type: "single_choice",
    options: [
      { value: "specific_number", label: "لدي رقم محدد أسعى إليه وأتابعه" },
      { value: "percentage", label: "نمو نسبي مثل 30 أو 50 بالمئة" },
      { value: "non_financial", label: "هدف غير مالي توسع أو جودة أو فريق" },
      { value: "no_goal", label: "لا يوجد هدف واضح ومحدد" }
    ],
    toastKey: "strategic_vision"
  },
  {
    id: "u26",
    dimension: "الرؤية والنمو",
    question: "ما أكبر قرار أعاقك الخوف من اتخاذه في الـ 12 شهراً الماضية؟",
    type: "single_choice",
    options: [
      { value: "hiring", label: "توظيف — خوف من تحمل راتب إضافي" },
      { value: "expansion", label: "توسع جغرافي أو فتح فرع جديد" },
      { value: "technology", label: "استثمار في تقنية أو نظام جديد" },
      { value: "pricing", label: "رفع الأسعار" },
      { value: "new_market", label: "دخول سوق أو قطاع جديد" },
      { value: "none", label: "لا يوجد — أتخذ قراراتي بجرأة" }
    ],
    toastKey: "decision_paralysis"
  },
  {
    id: "u27",
    dimension: "الرؤية والنمو",
    question: "ما النسبة التي يمكنك استثمارها من إيراداتك الشهرية في تطوير شركتك الآن؟",
    type: "single_choice",
    options: [
      { value: "lt5", label: "أقل من 5% — السيولة ضيقة جداً" },
      { value: "5_10", label: "5 إلى 10%" },
      { value: "gt10", label: "أكثر من 10%" },
      { value: "zero", label: "لا توجد سيولة متاحة للاستثمار الآن" }
    ],
    toastKey: "investment_capacity"
  },
  {
    id: "u28",
    dimension: "الرؤية والنمو",
    question: "هل قيّمت حجم ما خسرته بسبب مشاكل تعرفها ولم تحلها بعد؟",
    type: "single_choice",
    options: [
      { value: "yes", label: "نعم — أعرف الرقم التقريبي" },
      { value: "guess", label: "خمّنت لكن لم أحسبه بدقة" },
      { value: "no", label: "لا — لم أفكر في الأمر بهذا الشكل" }
    ],
    toastKey: "cost_of_inaction"
  },
  {
    id: "u29",
    dimension: "الرؤية والنمو",
    question: "ما الذي جربته سابقاً لحل مشاكل شركتك ولم ينجح؟ (اختر كل ما ينطبق)",
    type: "multi_choice",
    options: [
      { value: "consultant", label: "استشاري خارجي" },
      { value: "training", label: "تدريب الموظفين" },
      { value: "technology", label: "نظام تقنية أو برنامج جديد" },
      { value: "specialist", label: "توظيف متخصص" },
      { value: "marketing", label: "حملات تسويقية" },
      { value: "nothing", label: "لم أجرب شيئاً بعد" }
    ],
    toastKey: "previous_attempts"
  },
  {
    id: "u30",
    dimension: "الرؤية والنمو",
    question: "لو التقيت بمستشار أعمال قبل عام — ما حجم الأرباح التي تعتقد أنك تركتها على الطاولة؟",
    type: "single_choice",
    options: [
      { value: "lt10", label: "أقل من 10% من إيراداتي السنوية" },
      { value: "10_30", label: "10 إلى 30% من إيراداتي" },
      { value: "gt30", label: "أكثر من 30% — خسرت كثيراً" },
      { value: "unknown", label: "لا أستطيع تقدير ذلك" }
    ],
    toastKey: "opportunity_cost"
  }
];
