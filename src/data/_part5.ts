import { SectorQuestion } from './_part1';

export const part5: Record<string, SectorQuestion[]> = {
retail: [
  { id:"r01", dimension:"التجزئة", question:"ما نسبة البضائع الراكدة التي لم تُباع لأكثر من 90 يوماً؟", type:"slider", min:0, max:50, step:1, unit:"%", toastKey:"dead_stock" },
  { id:"r02", dimension:"التجزئة", question:"كم عدد مرات دوران المخزون السنوي؟", type:"single_choice", options:[{value:"gt6",label:"أكثر من 6 مرات — ممتاز"},{value:"3_6",label:"3 إلى 6 مرات"},{value:"lt3",label:"أقل من 3 مرات — بطيء جداً"}], toastKey:"inventory_turns" },
  { id:"r03", dimension:"التجزئة", question:"ما متوسط قيمة فاتورة العميل (Basket Size)؟", type:"single_choice", options:[{value:"growing",label:"عالية وتنمو"},{value:"stable",label:"مستقرة"},{value:"shrinking",label:"منخفضة أو تتراجع"}], toastKey:"basket_size" },
  { id:"r04", dimension:"التجزئة", question:"كيف تدير الخصومات دون الإضرار المفرط بهامش الربح؟", type:"single_choice", options:[{value:"planned",label:"خصومات مدروسة مبنية على بيانات المخزون"},{value:"reactive",label:"خصومات عشوائية لزيادة السيولة"},{value:"none",label:"لا نعطي خصومات"}], toastKey:"discount_strategy" },
  { id:"r05", dimension:"التجزئة", question:"ما نسبة المبيعات من المتجر الإلكتروني مقابل المبيعات في الفروع؟", type:"slider", min:0, max:100, step:5, unit:"% إلكتروني", toastKey:"online_offline_mix" },
  { id:"r06", dimension:"التجزئة", question:"هل لديك نظام ولاء فعال يعيد العميل للشراء؟", type:"single_choice", options:[{value:"yes",label:"نعم، يعتمد عليه جزء كبير من المبيعات"},{value:"basic",label:"نظام نقاط بسيط وغير مستغل جيداً"},{value:"no",label:"لا يوجد"}], toastKey:"retail_loyalty" },
  { id:"r07", dimension:"التجزئة", question:"كيف تتوقع الطلب الموسمي لتجنب نفاد المخزون الذروة؟", type:"single_choice", options:[{value:"data_driven",label:"بناءً على بيانات تاريخية دقيقة"},{value:"guess",label:"تقدير بالخبرة وأحياناً نخطئ"}], toastKey:"demand_forecasting" },
  { id:"r08", dimension:"التجزئة", question:"ما نسبة البضائع المرتجعة من العملاء وكيف تتعامل معها؟", type:"slider", min:0, max:30, step:1, unit:"%", toastKey:"return_rate" },
  { id:"r09", dimension:"التجزئة", question:"هل تدرب فريق المبيعات على البيع المتقاطع والارتقائي Cross-sell / Up-sell؟", type:"single_choice", options:[{value:"trained",label:"نعم، وهو مستمر ومُقاس"},{value:"rarely",label:"أحياناً، ولكن ليس أولوية"}], toastKey:"cross_sell_training" },
  { id:"r10", dimension:"التجزئة", question:"ما مدى اندماج قنوات البيع (Omnichannel) بين الأونلاين والفروع؟", type:"single_choice", options:[{value:"seamless",label:"اندماج كامل شراء أونلاين استرجاع بالفرع"},{value:"separated",label:"قنوات منفصلة تماماً"}], toastKey:"omnichannel" },
  { id:"r11", dimension:"التجزئة", question:"ما نسبة تسرب أو سرقة المخزون (Shrinkage)؟", type:"single_choice", options:[{value:"lt1",label:"أقل من 1% — مُتحكم به"},{value:"1_3",label:"1% إلى 3%"},{value:"gt3",label:"أكثر من 3% — يحتاج تدخل"}], toastKey:"shrinkage" },
  { id:"r12", dimension:"التجزئة", question:"هل تحلل أسباب انصراف العملاء بدون شراء من الفرع أو المتجر الإلكتروني؟", type:"single_choice", options:[{value:"yes",label:"نحلل البيانات وتعديل الأسعار والعرض بناءً عليها"},{value:"no",label:"لا نعرف الأسباب"}], toastKey:"cart_abandonment" }
]
};
