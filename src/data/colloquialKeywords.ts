export interface SearchItem {
  sectorL1: string;     // e.g., 'healthcare'
  sectorLabel: string;  // e.g., 'الرعاية الصحية والطبية'
  sectorIcon: string;   // e.g., '🏥'
  sectorL2: string;     // e.g., 'عيادة عامة'
  keywords: string[];   // colloquial/regional Arabic keywords
}

export function normalizeArabic(text: string): string {
  if (!text) return '';
  return text
    .toLowerCase()
    .replace(/[أإآٱ]/g, 'ا')
    .replace(/[ة]/g, 'ه')
    .replace(/[ى]/g, 'ي')
    .replace(/[\u064B-\u065F]/g, '') // strip diacritics
    .trim();
}

export const colloquialSearchItems: SearchItem[] = [
  // healthcare
  {
    sectorL1: "healthcare",
    sectorLabel: "الرعاية الصحية والطبية",
    sectorIcon: "🏥",
    sectorL2: "عيادة عامة",
    keywords: ["مستوصف", "عياده", "طبيب", "دكتور باطنة", "كشف عام"]
  },
  {
    sectorL1: "healthcare",
    sectorLabel: "الرعاية الصحية والطبية",
    sectorIcon: "🏥",
    sectorL2: "عيادة أسنان",
    keywords: ["سنان", "تقويم أسنان", "حشو عصب", "خلع ضرس", "تنظيف جير"]
  },
  {
    sectorL1: "healthcare",
    sectorLabel: "الرعاية الصحية والطبية",
    sectorIcon: "🏥",
    sectorL2: "عيادة عيون",
    keywords: ["رمد", "كشف نظارة", "بصريات", "مياه بيضاء", "ليزك"]
  },
  {
    sectorL1: "healthcare",
    sectorLabel: "الرعاية الصحية والطبية",
    sectorIcon: "🏥",
    sectorL2: "عيادة جلدية وتجميل",
    keywords: ["جلديه", "فيلر", "ليزر شعر", "تقشير بشرة", "حقن بلازما"]
  },
  {
    sectorL1: "healthcare",
    sectorLabel: "الرعاية الصحية والطبية",
    sectorIcon: "🏥",
    sectorL2: "عيادة عظام",
    keywords: ["غضروف", "كسر وعظام", "مفاصل", "رباط صليبي", "عمود فقري"]
  },
  {
    sectorL1: "healthcare",
    sectorLabel: "الرعاية الصحية والطبية",
    sectorIcon: "🏥",
    sectorL2: "عيادة أطفال",
    keywords: ["بيبي", "طبيب اطفال", "حديثي الولادة", "تطعيمات", "صفراء"]
  },
  {
    sectorL1: "healthcare",
    sectorLabel: "الرعاية الصحية والطبية",
    sectorIcon: "🏥",
    sectorL2: "عيادة نساء وتوليد",
    keywords: ["سيدات", "حمل ومتابعة", "ولاده قيصرية", "سونار ثلاثي", "عقم ونسا"]
  },
  {
    sectorL1: "healthcare",
    sectorLabel: "الرعاية الصحية والطبية",
    sectorIcon: "🏥",
    sectorL2: "مستشفى",
    keywords: ["مستشفي", "رعاية مركزة", "طوارئ ٢٤ ساعة", "عمليات جراحية", "غرف مرضى"]
  },
  {
    sectorL1: "healthcare",
    sectorLabel: "الرعاية الصحية والطبية",
    sectorIcon: "🏥",
    sectorL2: "مركز أشعة ومعامل",
    keywords: ["تحاليل طبية", "اشعه ورنين", "دم وبول", "تحليل سكر", "سونار"]
  },
  {
    sectorL1: "healthcare",
    sectorLabel: "الرعاية الصحية والطبية",
    sectorIcon: "🏥",
    sectorL2: "مركز غسيل كلى",
    keywords: ["كلى", "غسيل كلوى", "فشل كلوى", "جهاز غسيل", "كلية"]
  },
  {
    sectorL1: "healthcare",
    sectorLabel: "الرعاية الصحية والطبية",
    sectorIcon: "🏥",
    sectorL2: "مركز تجميل وليزر",
    keywords: ["تجميل حريمي", "ازالة شعر ليزر", "شد ترهلات", "تقشير كيميائي", "هيدرافيشيال"]
  },
  {
    sectorL1: "healthcare",
    sectorLabel: "الرعاية الصحية والطبية",
    sectorIcon: "🏥",
    sectorL2: "صيدلية",
    keywords: ["صيدليه", "دواء وعلاج", "مستحضرات صيدلية", "روشتة", "أجزخانة"]
  },
  {
    sectorL1: "healthcare",
    sectorLabel: "الرعاية الصحية والطبية",
    sectorIcon: "🏥",
    sectorL2: "توزيع مستلزمات طبية",
    keywords: ["ادوات طبية", "جوانتيات ومعقمات", "سرنجات واجهزة ضغط", "مورد عيادات"]
  },
  {
    sectorL1: "healthcare",
    sectorLabel: "الرعاية الصحية والطبية",
    sectorIcon: "🏥",
    sectorL2: "خدمات تمريض منزلي",
    keywords: ["تمريض بالبيت", "غيار جروح", "رعاية مسنين", "حقن بالمنزل", "ممرضة منزلية"]
  },
  {
    sectorL1: "healthcare",
    sectorLabel: "الرعاية الصحية والطبية",
    sectorIcon: "🏥",
    sectorL2: "مركز علاج طبيعي وتأهيل",
    keywords: ["طبيعى", "فيزيائي وتأهيل", "مساج علاجي", "فقرات ورطوبة", "إصابات ملاعب"]
  },

  // automotive
  {
    sectorL1: "automotive",
    sectorLabel: "السيارات والميكانيكا",
    sectorIcon: "🔧",
    sectorL2: "معرض سيارات جديدة",
    keywords: ["زيرو", "معارض عربيات", "توكيل سيارات", "شراء عربية جديدة", "تقسيط سيارات"]
  },
  {
    sectorL1: "automotive",
    sectorLabel: "السيارات والميكانيكا",
    sectorIcon: "🔧",
    sectorL2: "معرض سيارات مستعملة",
    keywords: ["كسر زيرو", "عربيات مستعمله", "حراج السيارات", "بيع واستبدال", "سوق عربيات"]
  },
  {
    sectorL1: "automotive",
    sectorLabel: "السيارات والميكانيكا",
    sectorIcon: "🔧",
    sectorL2: "مركز صيانة وإصلاح عام",
    keywords: ["ميكانيكي", "ورشة صيانة عربيات", "سمكري وميكانيكا", "سيرفيس سيارات", "تغيير زيت وفلاتر"]
  },
  {
    sectorL1: "automotive",
    sectorLabel: "السيارات والميكانيكا",
    sectorIcon: "🔧",
    sectorL2: "كهرباء سيارات",
    keywords: ["كهربائي عربيات", "بطاريات سيارات", "فيوزات وضفيرة", "كمبيوتر فحص سيارات"]
  },
  {
    sectorL1: "automotive",
    sectorLabel: "السيارات والميكانيكا",
    sectorIcon: "🔧",
    sectorL2: "تكييف سيارات",
    keywords: ["شحن فريون", "تكييفات عربيات", "كمبروسر تكييف", "تسريب فريون"]
  },
  {
    sectorL1: "automotive",
    sectorLabel: "السيارات والميكانيكا",
    sectorIcon: "🔧",
    sectorL2: "بدي وطلاء",
    keywords: ["دوكو سيارات", "رش عربيات", "سمكرة صاج", "تعديل على البارد", "دهان عربية"]
  },
  {
    sectorL1: "automotive",
    sectorLabel: "السيارات والميكانيكا",
    sectorIcon: "🔧",
    sectorL2: "توزيع قطع غيار",
    keywords: ["محل قطع غيار", "اكسسوارات سيارات", "تيل فرامل ومساعدين", "تجار قطع الغيار"]
  },
  {
    sectorL1: "automotive",
    sectorLabel: "السيارات والميكانيكا",
    sectorIcon: "🔧",
    sectorL2: "محل إطارات",
    keywords: ["كاوتش سيارات", "جنوط اسبور", "ضبط زوايا ورصيص", "إطارات وبطاريات"]
  },
  {
    sectorL1: "automotive",
    sectorLabel: "السيارات والميكانيكا",
    sectorIcon: "🔧",
    sectorL2: "تأجير سيارات",
    keywords: ["ايجار عربيات", "ليموزين زفاف", "رنت كار", "تأجير يومي"]
  },
  {
    sectorL1: "automotive",
    sectorLabel: "السيارات والميكانيكا",
    sectorIcon: "🔧",
    sectorL2: "مدرسة تعليم قيادة",
    keywords: ["مدرسة سواقة", "رخصة قيادة", "تعليم سواقة مانيوال", "كورس قيادة حريمي"]
  },
  {
    sectorL1: "automotive",
    sectorLabel: "السيارات والميكانيكا",
    sectorIcon: "🔧",
    sectorL2: "تفصيل وتنظيف داخلي",
    keywords: ["غسيل سيارات", "كار كير", "فرش كراسي سيارات", "تلميع وبولش", "كيماوي صالون"]
  },

  // realestate
  {
    sectorL1: "realestate",
    sectorLabel: "العقارات والإنشاءات",
    sectorIcon: "🏗️",
    sectorL2: "تطوير عقاري",
    keywords: ["مطور عقاري", "بناء كومباوند", "شقق تمليك", "مقاول مباني خرسانة"]
  },
  {
    sectorL1: "realestate",
    sectorLabel: "العقارات والإنشاءات",
    sectorIcon: "🏗️",
    sectorL2: "تسويق عقاري وسمسرة للأفراد",
    keywords: ["سمسار شقق", "شقة للبيع والايجار", "مكتب عقارات", "تسويق شقق سكنية"]
  },
  {
    sectorL1: "realestate",
    sectorLabel: "العقارات والإنشاءات",
    sectorIcon: "🏗️",
    sectorL2: "تسويق عقاري B2B للمطورين",
    keywords: ["بروكريج عقاري", "مبيعات ادارية", "تسويق تجاري ومكاتب", "شركة تسويق عقارات"]
  },
  {
    sectorL1: "realestate",
    sectorLabel: "العقارات والإنشاءات",
    sectorIcon: "🏗️",
    sectorL2: "إدارة أملاك وإيجارات",
    keywords: ["تحصيل ايجارات وعقود", "ادارة املاك سكنية", "مؤجر ومستأجر", "تأجير عمارات"]
  },
  {
    sectorL1: "realestate",
    sectorLabel: "العقارات والإنشاءات",
    sectorIcon: "🏗️",
    sectorL2: "مقاولات تشطيبات",
    keywords: ["مبيض محارة وجبس", "سباك ونقاش", "تشطيب شقق كاملة", "سيراميك وبلاط"]
  },
  {
    sectorL1: "realestate",
    sectorLabel: "العقارات والإنشاءات",
    sectorIcon: "🏗️",
    sectorL2: "ديكور وتصميم داخلي",
    keywords: ["مهندس ديكور", "انتيريور ديزاين", "تنسيق اثاث وفرش", "تصميم مطابخ وجدران"]
  },
  {
    sectorL1: "realestate",
    sectorLabel: "العقارات والإنشاءات",
    sectorIcon: "🏗️",
    sectorL2: "تقييم عقاري",
    keywords: ["مثمن معتمد", "تثمين عقارات", "قيمة شقة او ارض", "مكتب تثمين عقاري"]
  },
  {
    sectorL1: "realestate",
    sectorLabel: "العقارات والإنشاءات",
    sectorIcon: "🏗️",
    sectorL2: "استشارات عقارية",
    keywords: ["مستشار عقاري", "دراسة جدوى بناء", "فرص استثمار عقاري", "نصائح العقار"]
  },
  {
    sectorL1: "realestate",
    sectorLabel: "العقارات والإنشاءات",
    sectorIcon: "🏗️",
    sectorL2: "إدارة مرافق",
    keywords: ["صيانة كومباوند", "لاندسكيب وحدائق", "حراسة وأمن مباني", "تشغيل عمارات"]
  },

  // retail
  {
    sectorL1: "retail",
    sectorLabel: "تجزئة وبيع مباشر",
    sectorIcon: "🛍️",
    sectorL2: "إلكترونيات وأجهزة",
    keywords: ["محل موبايلات", "لابتوب وشواحن", "كميرات واكسسوارات", "تليفونات ذكية"]
  },
  {
    sectorL1: "retail",
    sectorLabel: "تجزئة وبيع مباشر",
    sectorIcon: "🛍️",
    sectorL2: "ملابس وأزياء",
    keywords: ["محل هدوم", "بوتيك فساتين", "ملابس حريمي ورجالي", "أزياء أطفال"]
  },
  {
    sectorL1: "retail",
    sectorLabel: "تجزئة وبيع مباشر",
    sectorIcon: "🛍️",
    sectorL2: "أجهزة منزلية",
    keywords: ["شاشات وتلفزيونات", "ثلاجة وغسالة", "بوتاجازات وميكروويف", "خلاط ومروحة"]
  },
  {
    sectorL1: "retail",
    sectorLabel: "تجزئة وبيع مباشر",
    sectorIcon: "🛍️",
    sectorL2: "أثاث وديكور",
    keywords: ["معرض موبيليا", "غرف نوم اطفال", "انتريهات وصالونات", "سجاد وستائر"]
  },
  {
    sectorL1: "retail",
    sectorLabel: "تجزئة وبيع مباشر",
    sectorIcon: "🛍️",
    sectorL2: "مستحضرات تجميل وعطور",
    keywords: ["محل مكياج وميك اب", "برفيوم حريمي", "عطور تركيب", "كريمات عناية بشرة"]
  },
  {
    sectorL1: "retail",
    sectorLabel: "تجزئة وبيع مباشر",
    sectorIcon: "🛍️",
    sectorL2: "رياضة ولياقة",
    keywords: ["ملابس رياضية وتيشرتات", "دامبلز ومعدات جيم", "محل سبورت", "أحذية جري"]
  },
  {
    sectorL1: "retail",
    sectorLabel: "تجزئة وبيع مباشر",
    sectorIcon: "🛍️",
    sectorL2: "منتجات أطفال",
    keywords: ["محل لعب اطفال", "بامبرز وحفاضات", "ملابس بيبي", "عربات اطفال"]
  },
  {
    sectorL1: "retail",
    sectorLabel: "تجزئة وبيع مباشر",
    sectorIcon: "🛍️",
    sectorL2: "كتب وقرطاسية",
    keywords: ["مكتبة كشاكيل", "اقلام وادوات مدرسية", "كتب وروايات", "طباعة ورق تصوير"]
  },
  {
    sectorL1: "retail",
    sectorLabel: "تجزئة وبيع مباشر",
    sectorIcon: "🛍️",
    sectorL2: "متجر متعدد التخصصات",
    keywords: ["سوبر ماركت", "هايبر ماركت", "محل بقالة", "ماركت بيع منتجات متنوعة"]
  },
  {
    sectorL1: "retail",
    sectorLabel: "تجزئة وبيع مباشر",
    sectorIcon: "🛍️",
    sectorL2: "متجر إلكتروني E-commerce",
    keywords: ["موقع بيع اونلاين", "صفحة انستجرام تجارية", "شحن منزلي", "دروبشيبينغ"]
  },

  // fnb
  {
    sectorL1: "fnb",
    sectorLabel: "الغذاء والمشروبات",
    sectorIcon: "🍽️",
    sectorL2: "مطعم فاخر",
    keywords: ["فاين داينينج", "مطعم سياحي", "حجز طاولة مسبق", "اكل انترناشونال"]
  },
  {
    sectorL1: "fnb",
    sectorLabel: "الغذاء والمشروبات",
    sectorIcon: "🍽️",
    sectorL2: "مطعم شعبي",
    keywords: ["عربة فول وطعمية", "محل كشري", "كبابجي ومسمط", "كبدة وسجق"]
  },
  {
    sectorL1: "fnb",
    sectorLabel: "الغذاء والمشروبات",
    sectorIcon: "🍽️",
    sectorL2: "فاست فود",
    keywords: ["برجر وبطاطس", "شاورما وفراخ تندوري", "بيتزا وكريب", "وجبات سريعة"]
  },
  {
    sectorL1: "fnb",
    sectorLabel: "الغذاء والمشروبات",
    sectorIcon: "🍽️",
    sectorL2: "كافيه ومشروبات",
    keywords: ["قهوة اسبريسو", "كوفي شوب مختص", "مقهى شباب", "لاتيه وماتشا"]
  },
  {
    sectorL1: "fnb",
    sectorLabel: "الغذاء والمشروبات",
    sectorIcon: "🍽️",
    sectorL2: "عصير وحلويات",
    keywords: ["محل عصير قصب", "ايس كريم وجيلاتو", "بسبوسة وكنافة", "وافل ونوتيلا"]
  },
  {
    sectorL1: "fnb",
    sectorLabel: "الغذاء والمشروبات",
    sectorIcon: "🍽️",
    sectorL2: "مطبخ سحابي Cloud Kitchen",
    keywords: ["مطبخ دليفري فقط", "اكل بيتي توصيل", "وجبات جاهزة للمنازل", "تجهيز وجبات طعام"]
  },
  {
    sectorL1: "fnb",
    sectorLabel: "الغذاء والمشروبات",
    sectorIcon: "🍽️",
    sectorL2: "كيترينج",
    keywords: ["تجهيز بوفيهات افراح", "شركة كيترينج حفلات", "بوفيه مفتوح ومأدبة", "طباخ مناسبات"]
  },
  {
    sectorL1: "fnb",
    sectorLabel: "الغذاء والمشروبات",
    sectorIcon: "🍽️",
    sectorL2: "مخبز ومعجنات",
    keywords: ["فرن عيش بلدي وفينو", "باتيهات وكرواسون", "مخبوزات وحلويات شرقية"]
  },
  {
    sectorL1: "fnb",
    sectorLabel: "الغذاء والمشروبات",
    sectorIcon: "🍽️",
    sectorL2: "توزيع مواد غذائية",
    keywords: ["تاجر جملة اغذية", "مورد سوبرماركت", "كرتونة زيت وسكر جملة", "توزيع البان"]
  },
  {
    sectorL1: "fnb",
    sectorLabel: "الغذاء والمشروبات",
    sectorIcon: "🍽️",
    sectorL2: "فرانشايز غذائي",
    keywords: ["امتياز تجاري مطاعم", "توكيل اكل عالمي", "شراء فرع علامة تجارية"]
  },

  // import
  {
    sectorL1: "import",
    sectorLabel: "استيراد وتوزيع",
    sectorIcon: "📦",
    sectorL2: "إلكترونيات ولاب توب",
    keywords: ["مستورد تليفونات", "استيراد اجهزة مستعملة", "حواسب واكسسوارات مستوردة"]
  },
  {
    sectorL1: "import",
    sectorLabel: "استيراد وتوزيع",
    sectorIcon: "📦",
    sectorL2: "مواد غذائية",
    keywords: ["مستورد لحوم مجمدة", "استيراد قمح وحبوب", "زيت طعام مستورد", "سكر وشاي استيراد"]
  },
  {
    sectorL1: "import",
    sectorLabel: "استيراد وتوزيع",
    sectorIcon: "📦",
    sectorL2: "معدات صناعية",
    keywords: ["مكابس هيدروليك", "خطوط انتاج صينية", "ماكينات مصانع مستوردة", "استيراد روافع"]
  },
  {
    sectorL1: "import",
    sectorLabel: "استيراد وتوزيع",
    sectorIcon: "📦",
    sectorL2: "مواد خام",
    keywords: ["حبيبات بلاستيك سابك", "بولي ايثيلين مستورد", "خام حديد والومنيوم", "غزل صوف مستورد"]
  },
  {
    sectorL1: "import",
    sectorLabel: "استيراد وتوزيع",
    sectorIcon: "📦",
    sectorL2: "مستلزمات طبية",
    keywords: ["اجهزة اشعة مستوردة", "كراسي متحركة جملة", "جوانتيات طبية معقمة استيراد"]
  },
  {
    sectorL1: "import",
    sectorLabel: "استيراد وتوزيع",
    sectorIcon: "📦",
    sectorL2: "قطع غيار سيارات",
    keywords: ["مساعدين ياباني وكوري", "استيراد محركات وعفشة", "موردين قطع غيار سيارات"]
  },
  {
    sectorL1: "import",
    sectorLabel: "استيراد وتوزيع",
    sectorIcon: "📦",
    sectorL2: "مواد بناء",
    keywords: ["حديد تسليح مستورد", "اسمنت جملة موزع", "اخشاب كونتر مصفح استيراد"]
  },
  {
    sectorL1: "import",
    sectorLabel: "استيراد وتوزيع",
    sectorIcon: "📦",
    sectorL2: "ملابس وأقمشة",
    keywords: ["قماش جينز مستورد", "صوف تركي مستورد", "بالات ملابس اوروبية"]
  },
  {
    sectorL1: "import",
    sectorLabel: "استيراد وتوزيع",
    sectorIcon: "📦",
    sectorL2: "أدوات منزلية",
    keywords: ["حلل ستانلس مستوردة", "صيني واكروبال مستورد", "ادوات مطبخ جملة استيراد"]
  },
  {
    sectorL1: "import",
    sectorLabel: "استيراد وتوزيع",
    sectorIcon: "📦",
    sectorL2: "منتجات تجميل ومستحضرات",
    keywords: ["مستحضرات تجميل كورية", "عطور فرنسية خام", "مكياج مستورد جملة"]
  },

  // logistics
  {
    sectorL1: "logistics",
    sectorLabel: "لوجستيات ونقل",
    sectorIcon: "🚛",
    sectorL2: "شحن دولي وتخليص جمركي",
    keywords: ["مستخلص جمركي بميناء", "حاويات شحن بحري وجوي", "تخليص جمارك بضائع"]
  },
  {
    sectorL1: "logistics",
    sectorLabel: "لوجستيات ونقل",
    sectorIcon: "🚛",
    sectorL2: "توصيل رسائل Last-mile",
    keywords: ["دليفري سريع شركات", "شحن محافظات متجر", "مندوب توصيل طرود"]
  },
  {
    sectorL1: "logistics",
    sectorLabel: "لوجستيات ونقل",
    sectorIcon: "🚛",
    sectorL2: "تخزين ومستودعات",
    keywords: ["تخزين بضائع تجار", "ثلاجة تجميد وحفظ", "هنجر ومخزن ايجار"]
  },
  {
    sectorL1: "logistics",
    sectorLabel: "لوجستيات ونقل",
    sectorIcon: "🚛",
    sectorL2: "نقل ثقيل وبضائع",
    keywords: ["عربيات تريلا نقل", "شاحنات بضائع كبيرة", "مكتب نقل نقل بري"]
  },
  {
    sectorL1: "logistics",
    sectorLabel: "لوجستيات ونقل",
    sectorIcon: "🚛",
    sectorL2: "نقل مبرد",
    keywords: ["عربيات نقل مجمدات", "ثلاجة نقل البان وشوكولاتة", "لوجستيات تبريد"]
  },
  {
    sectorL1: "logistics",
    sectorLabel: "لوجستيات ونقل",
    sectorIcon: "🚛",
    sectorL2: "نقل أثاث وانتقالات",
    keywords: ["نقل عفش منزل", "ونش رفع اثاث هيدروليكي", "شركة تغليف ونقل موبيليا"]
  },
  {
    sectorL1: "logistics",
    sectorLabel: "لوجستيات ونقل",
    sectorIcon: "🚛",
    sectorL2: "وكالة ملاحية",
    keywords: ["توكيل خط ملاحي", "شحن سفن وبواخر", "حجز مساحات حاويات ملاحية"]
  },
  {
    sectorL1: "logistics",
    sectorLabel: "لوجستيات ونقل",
    sectorIcon: "🚛",
    sectorL2: "خدمات courier",
    keywords: ["بريد سريع دولي ومحلي", "مكتب ارامكس ودي اتش ال", "شحن اوراق ومستندات"]
  },

  // professional
  {
    sectorL1: "professional",
    sectorLabel: "خدمات مهنية",
    sectorIcon: "💼",
    sectorL2: "مكتب محاسبة وتدقيق",
    keywords: ["حسابات وضرائب شركتي", "تدقيق مالي وميزانية", "محاسب قانوني معتمد"]
  },
  {
    sectorL1: "professional",
    sectorLabel: "خدمات مهنية",
    sectorIcon: "💼",
    sectorL2: "مكتب محاماة واستشارات قانونية",
    keywords: ["محامي شركات وتأسيس", "قضايا ومنازعات تجارية", "صياغة عقود وشراكة"]
  },
  {
    sectorL1: "professional",
    sectorLabel: "خدمات مهنية",
    sectorIcon: "💼",
    sectorL2: "استشارات إدارية وتطوير أعمال",
    keywords: ["مستشار بزنس وتطوير شركات", "دراسات جدوى وهيكلة", "استشارات ادارية ونمو"]
  },
  {
    sectorL1: "professional",
    sectorLabel: "خدمات مهنية",
    sectorIcon: "💼",
    sectorL2: "خدمات توظيف وموارد بشرية",
    keywords: ["شركة اتش ار", "توظيف كفاءات ومديرين", "سيستم رواتب وعقد عمل"]
  },
  {
    sectorL1: "professional",
    sectorLabel: "خدمات مهنية",
    sectorIcon: "💼",
    sectorL2: "أبحاث سوقية",
    keywords: ["استبيانات وجمع بيانات", "دراسة سلوك المستهلك", "تقرير فحص السوق المنافسين"]
  },
  {
    sectorL1: "professional",
    sectorLabel: "خدمات مهنية",
    sectorIcon: "💼",
    sectorL2: "خدمات ترجمة ومحتوى",
    keywords: ["مترجم معتمد سفارات", "ترجمة فورية مؤتمرات", "كتابة وتدقيق لغوي عربي انجليزي"]
  },

  // education
  {
    sectorL1: "education",
    sectorLabel: "تعليم وتدريب",
    sectorIcon: "📚",
    sectorL2: "مدرسة خاصة",
    keywords: ["مدرسة انترناشونال", "مدرسة تجريبي لغات", "تعليم اساسي وثانوي"]
  },
  {
    sectorL1: "education",
    sectorLabel: "تعليم وتدريب",
    sectorIcon: "📚",
    sectorL2: "مركز دروس خصوصية",
    keywords: ["سنتر دروس خصوصية", "مجموعات تقوية ثانوية عامة", "حصص مراجعة نهائية"]
  },
  {
    sectorL1: "education",
    sectorLabel: "تعليم وتدريب",
    sectorIcon: "📚",
    sectorL2: "مركز تدريب مهني وتقني",
    keywords: ["كورسات صيانة كمبيوتر موبايل", "ورش نجارة وتبريد وتكييف", "دبلومة فنية"]
  },
  {
    sectorL1: "education",
    sectorLabel: "تعليم وتدريب",
    sectorIcon: "📚",
    sectorL2: "مدرسة لغات",
    keywords: ["كورسات لغة انجليزية", "تعليم الماني وايطالي", "معهد لغات وادثاف"]
  },
  {
    sectorL1: "education",
    sectorLabel: "تعليم وتدريب",
    sectorIcon: "📚",
    sectorL2: "منصة تعليم إلكتروني",
    keywords: ["كورسات اونلاين للمبرمجين", "موقع تعليم وتدريب رقمي", "يوديمي عربي"]
  },
  {
    sectorL1: "education",
    sectorLabel: "تعليم وتدريب",
    sectorIcon: "📚",
    sectorL2: "حضانة أطفال ورياض",
    keywords: ["بيبي كلاس حضانه", "تمهيدي اطفال لغات", "كيدز اريا رعاية باليوم"]
  },
  {
    sectorL1: "education",
    sectorLabel: "تعليم وتدريب",
    sectorIcon: "📚",
    sectorL2: "معهد فني وتكنولوجي",
    keywords: ["معهد سنتين حواسب", "تعليم تكنولوجيا تطبيقية", "تدريب هندسي فني"]
  },
  {
    sectorL1: "education",
    sectorLabel: "تعليم وتدريب",
    sectorIcon: "📚",
    sectorL2: "تدريب الشركات Corporate Training",
    keywords: ["كورسات تدريب موظفين", "مهارات تواصل وقيادة فرق", "كوتشينج اداري للمديرين"]
  },
  {
    sectorL1: "education",
    sectorLabel: "تعليم وتدريب",
    sectorIcon: "📚",
    sectorL2: "أكاديمية رياضية تعليمية",
    keywords: ["اكاديمية كرة قدم اطفال", "تعليم سباحة جمباز", "تدريب العاب دفاع عن النفس"]
  },

  // tech
  {
    sectorL1: "tech",
    sectorLabel: "تكنولوجيا وبرمجيات",
    sectorIcon: "💻",
    sectorL2: "تطوير برمجيات مخصصة Custom Software",
    keywords: ["مبرمج ويب سايت", "شركة تطوير سوفت وير", "موقع الكتروني مخصص للشركات"]
  },
  {
    sectorL1: "tech",
    sectorLabel: "تكنولوجيا وبرمجيات",
    sectorIcon: "💻",
    sectorL2: "منتج SaaS",
    keywords: ["برنامج محاسبي سحابي", "سيستم مبيعات اشتراك شهري", "منصة كول سنتر وسحابية"]
  },
  {
    sectorL1: "tech",
    sectorLabel: "تكنولوجيا وبرمجيات",
    sectorIcon: "💻",
    sectorL2: "دعم فني وإدارة شبكات",
    keywords: ["مهندس اي تي IT صيانة", "صيانة شبكات وسيرفرات", "تجهيز كاميرات مراقبة وسنترال"]
  },
  {
    sectorL1: "tech",
    sectorLabel: "تكنولوجيا وبرمجيات",
    sectorIcon: "💻",
    sectorL2: "أمن معلومات وحماية بيانات",
    keywords: ["سايبر سكيورتي حماية", "فحص ثغرات وتامين سيرفر", "هكر اخلاقي لمنع الاختراق"]
  },
  {
    sectorL1: "tech",
    sectorLabel: "تكنولوجيا وبرمجيات",
    sectorIcon: "💻",
    sectorL2: "تطوير تطبيقات موبايل",
    keywords: ["ابلكيشن اندرويد وايفون", "مبرمج تطبيقات هاتف", "تطبيق توصيل او متجر موبايل"]
  },
  {
    sectorL1: "tech",
    sectorLabel: "تكنولوجيا وبرمجيات",
    sectorIcon: "💻",
    sectorL2: "تحليل بيانات وذكاء اصطناعي",
    keywords: ["شات بوت ذكاء اصطناعي", "داتا اناليتكس وتقارير داشبورد", "موديل ذكاء اصطناعي توليدي"]
  },
  {
    sectorL1: "tech",
    sectorLabel: "تكنولوجيا وبرمجيات",
    sectorIcon: "💻",
    sectorL2: "استضافة وخدمات سحابية",
    keywords: ["سيرفر سحابي استضافة", "حجز دومين وموقع", "موزع هوستنج مشترك"]
  },

  // manufacturing
  {
    sectorL1: "manufacturing",
    sectorLabel: "تصنيع وإنتاج",
    sectorIcon: "🏭",
    sectorL2: "تصنيع غذائي",
    keywords: ["مصنع بسكويت وشوكولاتة", "تعبئة زيت وسمن", "مصنع صلصة وعصائر"]
  },
  {
    sectorL1: "manufacturing",
    sectorLabel: "تصنيع وإنتاج",
    sectorIcon: "🏭",
    sectorL2: "نسيج وملابس",
    keywords: ["مصنع غزل نسيج", "تفصيل ملابس جاهزة جملة", "ورشة خياطة كنزات وجينز"]
  },
  {
    sectorL1: "manufacturing",
    sectorLabel: "تصنيع وإنتاج",
    sectorIcon: "🏭",
    sectorL2: "أثاث وخشب",
    keywords: ["مصنع غرف نوم وانتريه", "ورشة نجارة موبيليا كبيرة", "تصنيع مطابخ خشب ومودرن"]
  },
  {
    sectorL1: "manufacturing",
    sectorLabel: "تصنيع وإنتاج",
    sectorIcon: "🏭",
    sectorL2: "بلاستيك ومطاط",
    keywords: ["مصنع اكياس بلاستيك", "ماكينات حقن بلاستيك وتشكيل", "تصنيع عبوات ومطاط"]
  },
  {
    sectorL1: "manufacturing",
    sectorLabel: "تصنيع وإنتاج",
    sectorIcon: "🏭",
    sectorL2: "معادن وميكانيكا صناعية",
    keywords: ["تشغيل معادن خراطة", "مسبك حديد والومنيوم", "تصنيع كبائن وهياكل معدنية"]
  },
  {
    sectorL1: "manufacturing",
    sectorLabel: "تصنيع وإنتاج",
    sectorIcon: "🏭",
    sectorL2: "مستحضر تجميل وعناية",
    keywords: ["مصنع شامبو وصابون", "كريمات شعر ومستحضرات بشرة", "صناعة معقمات ومطهرات"]
  },
  {
    sectorL1: "manufacturing",
    sectorLabel: "تصنيع وإنتاج",
    sectorIcon: "🏭",
    sectorL2: "مواد بناء وتشييد",
    keywords: ["مصنع طوب اسمنتي واحمر", "خلاطة خرسانة جاهزة", "تصنيع سيراميك وجبس"]
  },
  {
    sectorL1: "manufacturing",
    sectorLabel: "تصنيع وإنتاج",
    sectorIcon: "🏭",
    sectorL2: "تعبئة وتغليف",
    keywords: ["مصنع كرتون مضلع", "اكياس ورقية مطبوعة", "تعبئة سكر وتوابل الي"]
  },
  {
    sectorL1: "manufacturing",
    sectorLabel: "تصنيع وإنتاج",
    sectorIcon: "🏭",
    sectorL2: "أجهزة إلكترونية وكهربائية",
    keywords: ["تجميع تكييفات وشاشات", "تصنيع لمبات ليد وكشافات", "مصنع كابلات واسلاك نحاس"]
  },

  // sports
  {
    sectorL1: "sports",
    sectorLabel: "الرياضة والتأهيل البدني",
    sectorIcon: "⚽",
    sectorL2: "نادٍ رياضي كبير كرة قدم وسلة",
    keywords: ["نادي كرة قدم", "ملاعب كورة ومسبح", "اشتراك عضوية نادي"]
  },
  {
    sectorL1: "sports",
    sectorLabel: "الرياضة والتأهيل البدني",
    sectorIcon: "⚽",
    sectorL2: "أكاديمية رياضية للناشئين",
    keywords: ["تمرين كورة سلة طائرة", "اكاديمية اطفال كاراتيه", "تجهيز ناشئين وبطولات"]
  },
  {
    sectorL1: "sports",
    sectorLabel: "الرياضة والتأهيل البدني",
    sectorIcon: "⚽",
    sectorL2: "مركز لياقة بدنية جيم",
    keywords: ["جيم تخسيس وحديد", "صالة فتنس ايروبكس", "مدرب جيم بناء اجسام"]
  },
  {
    sectorL1: "sports",
    sectorLabel: "الرياضة والتأهيل البدني",
    sectorIcon: "⚽",
    sectorL2: "مركز تأهيل رياضي",
    keywords: ["اصابات ملاعب علاج", "علاج فيزيو مائي", "تقويم عضلات واصابة"]
  },
  {
    sectorL1: "sports",
    sectorLabel: "الرياضة والتأهيل البدني",
    sectorIcon: "⚽",
    sectorL2: "ملعب خماسي أو صالة متعددة الألعاب",
    keywords: ["حجز ملعب خماسي كورة", "صالة بينج بونج وبلياردو", "تأجير ملاعب صابون"]
  },
  {
    sectorL1: "sports",
    sectorLabel: "الرياضة والتأهيل البدني",
    sectorIcon: "⚽",
    sectorL2: "وكالة رياضية وتسويق رياضي",
    keywords: ["رعاية لاعبين كرة قدم", "تنظيم بطولات ومباريات ودية", "تسويق اندية رعاية"]
  },
  {
    sectorL1: "sports",
    sectorLabel: "الرياضة والتأهيل البدني",
    sectorIcon: "⚽",
    sectorL2: "مدرب رياضي شخصي",
    keywords: ["بريسونال ترينر دايت", "كوتش تمرين منزلي", "متابع تغذية شخصي جيم"]
  },

  // tourism
  {
    sectorL1: "tourism",
    sectorLabel: "سياحة وضيافة",
    sectorIcon: "✈️",
    sectorL2: "فندق فاخر",
    keywords: ["ريزورت قرية سياحية", "فندق 5 نجوم حجز", "منتجع سياحي شرم الشيخ"]
  },
  {
    sectorL1: "tourism",
    sectorLabel: "سياحة وضيافة",
    sectorIcon: "✈️",
    sectorL2: "فندق اقتصادي أو بوتيك",
    keywords: ["هوستل شباب لوكاندة", "فندق نجمتين وسط البلد", "نزل سياحي بسيط"]
  },
  {
    sectorL1: "tourism",
    sectorLabel: "سياحة وضيافة",
    sectorIcon: "✈️",
    sectorL2: "وكالة سياحة خارجية Outbound",
    keywords: ["حجز تذاكر طيران", "فيزا شنجن وتأشيرات", "رحلات تركيا ودبي"]
  },
  {
    sectorL1: "tourism",
    sectorLabel: "سياحة وضيافة",
    sectorIcon: "✈️",
    sectorL2: "وكالة سياحة داخلية Inbound",
    keywords: ["رحلات الغردقة ودهب", "حجز معالم الاقصر واسوان", "مرشد سياحي روسي انجليزي"]
  },
  {
    sectorL1: "tourism",
    sectorLabel: "سياحة وضيافة",
    sectorIcon: "✈️",
    sectorL2: "إدارة فعاليات وإنتاج مؤتمرات",
    keywords: ["تنظيم ايفنتات حفلات", "شركة باني ايفنت تخرج", "معارض ومؤتمرات شركات"]
  },
  {
    sectorL1: "tourism",
    sectorLabel: "سياحة وضيافة",
    sectorIcon: "✈️",
    sectorL2: "إيجار قصير المدى Airbnb",
    keywords: ["شقق مصيف يومي", "شاليهات ايجار الساحل", "بيت ريفي للايجار"]
  },
  {
    sectorL1: "tourism",
    sectorLabel: "سياحة وضيافة",
    sectorIcon: "✈️",
    sectorL2: "منتجع صحي Wellness",
    keywords: ["سبا استشفائي ساونا", "تنظيف سموم تخسيس سياحي", "جلسات يوغا استشفاء"]
  },
  {
    sectorL1: "tourism",
    sectorLabel: "سياحة وضيافة",
    sectorIcon: "✈️",
    sectorL2: "خدمات نقل سياحي",
    keywords: ["اتوبيس رحلات ايجار", "ليموزين مطار القاهرة", "ميكروباص سياحي توصيل"]
  },

  // agriculture
  {
    sectorL1: "agriculture",
    sectorLabel: "زراعة وأغذية",
    sectorIcon: "🌾",
    sectorL2: "إنتاج زراعي ومزارع",
    keywords: ["مزرعة طماطم وخضار", "صوبة زراعية خيار", "تربية مواشي وخراف"]
  },
  {
    sectorL1: "agriculture",
    sectorLabel: "زراعة وأغذية",
    sectorIcon: "🌾",
    sectorL2: "تصنيع أغذية زراعية",
    keywords: ["تخليل زيتون وليمون", "تجفيف تين وفاكهة", "عصر زيت زيتون بكر"]
  },
  {
    sectorL1: "agriculture",
    sectorLabel: "زراعة وأغذية",
    sectorIcon: "🌾",
    sectorL2: "تصدير منتجات زراعية",
    keywords: ["تصدير برتقال روسيا", "حاصلات زراعية تصدير", "محطة فرز وتعبئة بصل"]
  },
  {
    sectorL1: "agriculture",
    sectorLabel: "زراعة وأغذية",
    sectorIcon: "🌾",
    sectorL2: "مستلزمات زراعية وأسمدة",
    keywords: ["مبيدات حشرية زراعية", "تقاوي بذور طماطم", "خراطيم ري بالتنقيط اسمدة"]
  },
  {
    sectorL1: "agriculture",
    sectorLabel: "زراعة وأغذية",
    sectorIcon: "🌾",
    sectorL2: "أغذية عضوية وصحية متخصصة",
    keywords: ["اكل اورجانيك مزارع", "بيض بلدي وسمن بقري", "عسل نحل جبلي طبيعي"]
  },
  {
    sectorL1: "agriculture",
    sectorLabel: "زراعة وأغذية",
    sectorIcon: "🌾",
    sectorL2: "مشاتل نباتات وزهور",
    keywords: ["مشتل ورد بلدي", "اشجار زينة حدائق", "بذور زهور ونباتات ظل"]
  },

  // construction
  {
    sectorL1: "construction",
    sectorLabel: "مقاولات وتشييد",
    sectorIcon: "🏗️",
    sectorL2: "مقاولات عامة وإنشاء مباني",
    keywords: ["مقاول بناء عمارات", "صب خرسانة مسلحة", "حفر وتثبيت اساسات تربة"]
  },
  {
    sectorL1: "construction",
    sectorLabel: "مقاولات وتشييد",
    sectorIcon: "🏗️",
    sectorL2: "أعمال كهرباء ولوحات",
    keywords: ["كهربائي سلسيون عمارات", "لوحة مفاتيح ضغط منخفض", "تمديد كابلات كهربائية"]
  },
  {
    sectorL1: "construction",
    sectorLabel: "مقاولات وتشييد",
    sectorIcon: "🏗️",
    sectorL2: "أعمال سباكة وميكانيكا",
    keywords: ["سباك صحي تركيب خلاط", "مواسير مياه وصرف صحي", "شبكة حريق ومضخات"]
  },
  {
    sectorL1: "construction",
    sectorLabel: "مقاولات وتشييد",
    sectorIcon: "🏗️",
    sectorL2: "ألومنيوم وزجاج وواجهات",
    keywords: ["ورشة الوميتال مطابخ شبابيك", "واجهات زجاج كلادينج", "شباك الومنيوم تانجو"]
  },
  {
    sectorL1: "construction",
    sectorLabel: "مقاولات وتشييد",
    sectorIcon: "🏗️",
    sectorL2: "حديد وخرسانة وهياكل",
    keywords: ["حداد مسلح كريتال", "كمر حديد واسقف معلقة", "هياكل معدنية هناجر"]
  },
  {
    sectorL1: "construction",
    sectorLabel: "مقاولات وتشييد",
    sectorIcon: "🏗️",
    sectorL2: "مشاريع بنية تحتية وطرق",
    keywords: ["سفلتة طرق رصف", "خطوط مياه رئيسية بلدي", "حفر انفاق ومجاري سيول"]
  },
  {
    sectorL1: "construction",
    sectorLabel: "مقاولات وتشييد",
    sectorIcon: "🏗️",
    sectorL2: "مقاولات متخصصة تكييف وعزل",
    keywords: ["عزل رطوبة وحرارة اسطح", "تكييف مركزي تكت", "عزل مائي حمامات سباحة"]
  },

  // personal_care
  {
    sectorL1: "personal_care",
    sectorLabel: "عناية شخصية ولياقة",
    sectorIcon: "💆",
    sectorL2: "صالون حلاقة رجالي",
    keywords: ["حلاق ذقن وشعر", "كوافير رجالي تصفيف", "حلاقة عريس سشوار"]
  },
  {
    sectorL1: "personal_care",
    sectorLabel: "عناية شخصية ولياقة",
    sectorIcon: "💆",
    sectorL2: "صالون تجميل نسائي",
    keywords: ["كوافير حريمي ميكاب", "ميك اب ارتست افراح", "صبغة وبروتين شعر"]
  },
  {
    sectorL1: "personal_care",
    sectorLabel: "عناية شخصية ولياقة",
    sectorIcon: "💆",
    sectorL2: "مركز سبا وتدليك",
    keywords: ["حمام مغربي بخار", "جاكوزي مساج", "مساج استرخائي زيوت عطرية"]
  },
  {
    sectorL1: "personal_care",
    sectorLabel: "عناية شخصية ولياقة",
    sectorIcon: "💆",
    sectorL2: "عيادة تغذية وتخسيس",
    keywords: ["دكتور ريجيم انقاص وزن", "تخسيس بطن وجوانب", "متابعة انبودي سعرات"]
  },
  {
    sectorL1: "personal_care",
    sectorLabel: "عناية شخصية ولياقة",
    sectorIcon: "💆",
    sectorL2: "مركز يوغا وتأمل",
    keywords: ["جلسة تامل استرخاء", "تدريب يوغا هادئة", "رياضة روحية تنفس"]
  },
  {
    sectorL1: "personal_care",
    sectorLabel: "عناية شخصية ولياقة",
    sectorIcon: "💆",
    sectorL2: "مركز رشاقة متخصص",
    keywords: ["نحت جسم كافيتيشن", "تمارين رشاقة ولياقة حريمي", "فتنس جيم نسائي"]
  },
  {
    sectorL1: "personal_care",
    sectorLabel: "عناية شخصية ولياقة",
    sectorIcon: "💆",
    sectorL2: "علاج طبيعي تجميلي",
    keywords: ["تفتيت دهون بارد", "تقويم قوام واصلاح عظام", "علاج ترهلات موضعي"]
  },

  // financial
  {
    sectorL1: "financial",
    sectorLabel: "خدمات مالية غير بنكية",
    sectorIcon: "💰",
    sectorL2: "وساطة تأمينية",
    keywords: ["تامين سيارات شامل", "تامين طبي شركات", "مكتب تامينات صحي وحياة"]
  },
  {
    sectorL1: "financial",
    sectorLabel: "خدمات مالية غير بنكية",
    sectorIcon: "💰",
    sectorL2: "استشارات استثمارية",
    keywords: ["مستشار مالي بورصة", "تحليل اسهم وسندات", "ادارة محافظ مالية اصول"]
  },
  {
    sectorL1: "financial",
    sectorLabel: "خدمات مالية غير بنكية",
    sectorIcon: "💰",
    sectorL2: "صرافة وحوالات مالية",
    keywords: ["تغيير عملة دولار يورو", "حوالات ويسترن يونيون", "فودافون كاش سحب وايداع"]
  },
  {
    sectorL1: "financial",
    sectorLabel: "خدمات مالية غير بنكية",
    sectorIcon: "💰",
    sectorL2: "تمويل شركات صغيرة ومتوسطة",
    keywords: ["قروض مشاريع صغيرة", "تمويل متناهي الصغر فوري", "جمعية مالية تسهيلات"]
  },
  {
    sectorL1: "financial",
    sectorLabel: "خدمات مالية غير بنكية",
    sectorIcon: "💰",
    sectorL2: "وساطة عقارية تمويلية",
    keywords: ["قرض عقاري شقق", "تمويل عقاري بنكي", "وساطة تمويل بناء عقارات"]
  },
  {
    sectorL1: "financial",
    sectorLabel: "خدمات مالية غير بنكية",
    sectorIcon: "💰",
    sectorL2: "إدارة ثروات",
    keywords: ["استثمار مبالغ كبيرة عائلات", "ادارة اصول عقارية مالية", "بورتفوليو مالي كبار عملاء"]
  },

  // media
  {
    sectorL1: "media",
    sectorLabel: "التسويق والإعلام والإنتاج الإبداعي",
    sectorIcon: "📱",
    sectorL2: "وكالة تسويق",
    keywords: ["دعاية واعلان بروشور", "ماركتنج اوفلاين", "حملات اعلانية شوارع بنرات"]
  },
  {
    sectorL1: "media",
    sectorLabel: "التسويق والإعلام والإنتاج الإبداعي",
    sectorIcon: "📱",
    sectorL2: "وكالة تسويق رقمي",
    keywords: ["اعلانات فيسبوك وانستجرام", "سيو جوجل محركات بحث", "ترويج ممول الكتروني تيكتوك"]
  },
  {
    sectorL1: "media",
    sectorLabel: "التسويق والإعلام والإنتاج الإبداعي",
    sectorIcon: "📱",
    sectorL2: "وكالة إنتاج إعلامي وإبداعي",
    keywords: ["تصوير اعلانات تلفزيون", "مونتاج فيديو احترافي", "فويس اوفر تعليق صوتي"]
  },
  {
    sectorL1: "media",
    sectorLabel: "التسويق والإعلام والإنتاج الإبداعي",
    sectorIcon: "📱",
    sectorL2: "تصميم وطباعة رقمية أو تقليدية",
    keywords: ["بنرات يافطات محلات", "طباعة بروشور وكروت شخصية", "مطبعة ديجيتال واوفست وكتب"]
  },
  {
    sectorL1: "media",
    sectorLabel: "التسويق والإعلام والإنتاج الإبداعي",
    sectorIcon: "📱",
    sectorL2: "قناة يوتيوب أو بودكاست",
    keywords: ["يوتيوبر انتاج محتوى", "تسجيل صوتي بودكاستر", "قناة سوشيال ميديا مشاهدات"]
  },
  {
    sectorL1: "media",
    sectorLabel: "التسويق والإعلام والإنتاج الإبداعي",
    sectorIcon: "📱",
    sectorL2: "موقع إخباري أو مدونة",
    keywords: ["صحافة الكترونية اخبار اليوم", "موقع مقالات بلوجر", "اخبار عاجلة مقالات"]
  },
  {
    sectorL1: "media",
    sectorLabel: "التسويق والإعلام والإنتاج الإبداعي",
    sectorIcon: "📱",
    sectorL2: "استوديو إنتاج فيديو وتصوير",
    keywords: ["جلسة تصوير فوتوغرافي", "سيشن صور افراح وموديلات", "مصور كاميرا احترافية"]
  },
  {
    sectorL1: "media",
    sectorLabel: "التسويق والإعلام والإنتاج الإبداعي",
    sectorIcon: "📱",
    sectorL2: "إدارة حسابات سوشيال ميديا",
    keywords: ["انستجرام ادمن موديراتور", "بوستات فيسبوك رد على تعليقات", "إدارة محتوى صفحات"]
  },
  {
    sectorL1: "media",
    sectorLabel: "التسويق والإعلام والإنتاج الإبداعي",
    sectorIcon: "📱",
    sectorL2: "تسويق بالمحتوى Content Marketing",
    keywords: ["كتابة محتوى بلوج", "كوبي رايتر اعلانات مبيعات", "سيناريو فيديو ترويجي"]
  },
  {
    sectorL1: "media",
    sectorLabel: "التسويق والإعلام والإنتاج الإبداعي",
    sectorIcon: "📱",
    sectorL2: "إنتاج برامج تلفزيونية",
    keywords: ["تصوير مسلسلات وافلام", "برامج راديو واذاعة", "اخراج تليفزيوني سينما"]
  },
  {
    sectorL1: "media",
    sectorLabel: "التسويق والإعلام والإنتاج الإبداعي",
    sectorIcon: "📱",
    sectorL2: "وكالة علاقات عامة وإعلام",
    keywords: ["بي ار مؤتمرات صحفية", "ترويج صحفي مقال راعي", "تغطية فعاليات ومهرجانات"]
  },

  // crafts
  {
    sectorL1: "crafts",
    sectorLabel: "حرف يدوية وإنتاج صغير",
    sectorIcon: "🎨",
    sectorL2: "مشغولات يدوية وتراثية",
    keywords: ["منتجات سيناء النحاس", "فخار قنا سجاد يدوي", "تطريز يدوي هاند ميد كروشيه"]
  },
  {
    sectorL1: "crafts",
    sectorLabel: "حرف يدوية وإنتاج صغير",
    sectorIcon: "🎨",
    sectorL2: "أعمال خشبية وأثاث مخصص",
    keywords: ["نجار باب وشباك ورشة", "غرف اطفال عمولة نجارة", "مطبخ خشب ورشة صغيرة"]
  },
  {
    sectorL1: "crafts",
    sectorLabel: "حرف يدوية وإنتاج صغير",
    sectorIcon: "🎨",
    sectorL2: "مجوهرات وإكسسوار يدوي",
    keywords: ["فضيات خواتم حريمي", "حلي واكسسوار خرز يدوي", "مجوهرات يدوية هاند ميد"]
  },
  {
    sectorL1: "crafts",
    sectorLabel: "حرف يدوية وإنتاج صغير",
    sectorIcon: "🎨",
    sectorL2: "خياطة وتفصيل ملابس",
    keywords: ["ترزي رجالي بدلة", "تفصيل فساتين سواريه كاجوال", "اتيليه خياطة وتصليح"]
  },
  {
    sectorL1: "crafts",
    sectorLabel: "حرف يدوية وإنتاج صغير",
    sectorIcon: "🎨",
    sectorL2: "صناعة شموع وأعمال ديكور",
    keywords: ["شموع عطرية هدايا", "اكسسوارات بيت هاند ميد", "صناعة شموع ديكور منزلي"]
  },

  // energy
  {
    sectorL1: "energy",
    sectorLabel: "طاقة وبيئة",
    sectorIcon: "☀️",
    sectorL2: "تركيب طاقة شمسية للأفراد",
    keywords: ["سخان شمسي فوق السطح", "طاقة شمسية للمنزل بطاريات", "الواح شمسية فيلا وسكن"]
  },
  {
    sectorL1: "energy",
    sectorLabel: "طاقة وبيئة",
    sectorIcon: "☀️",
    sectorL2: "طاقة شمسية للشركات والمصانع",
    keywords: ["الواح شمسية مصانع مزارع", "توفير كهرباء تجارية عملاقة", "محطة طاقة شمسية استثمار"]
  },
  {
    sectorL1: "energy",
    sectorLabel: "طاقة وبيئة",
    sectorIcon: "☀️",
    sectorL2: "استشارات ترشيد الطاقة",
    keywords: ["توفير استهلاك كهرباء شركات", "كفاءة طاقة تكييفات ومكابس", "تقليل فاتورة تيار مصانع"]
  },
  {
    sectorL1: "energy",
    sectorLabel: "طاقة وبيئة",
    sectorIcon: "☀️",
    sectorL2: "خدمات بيئية وإدارة نفايات",
    keywords: ["إعادة تدوير مخلفات بلاستيك", "خردة حديد ونحاس كبس", "كباسات كرتون تدوير نفايات"]
  },
  {
    sectorL1: "energy",
    sectorLabel: "طاقة وبيئة",
    sectorIcon: "☀️",
    sectorL2: "مشاريع مياه وصرف صحي",
    keywords: ["فلاتر مياه مركزية مصنع", "طلمبات ومضخات ابار مياه", "محطة تحلية مياه جوفية مزارع"]
  },
  {
    sectorL1: "energy",
    sectorLabel: "طاقة وبيئة",
    sectorIcon: "☀️",
    sectorL2: "استشارات الاستدامة ESG",
    keywords: ["تقارير كربون بيئية معتمدة", "استدامة شركات تصنيف اخضر", "تمويل بيئي اخضر بنوك"]
  }
];
