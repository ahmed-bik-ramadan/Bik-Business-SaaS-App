import { UniversalQuestion } from './universalQuestions';

export interface BlindSpotFormula {
  id: string;
  name: string;
  requiredDeepFields: string[];     // new deep-tier question ids
  requiredAnswerIds: string[];       // existing sector question ids used
  compute: (deep: Record<string, number>, answers: Record<string, any>) => number;
  monthlyOrOneTime: 'monthly';
}

export const DEEP_TIER_QUESTIONS: Record<string, UniversalQuestion[]> = {
  healthcare: [
    {
      id: 'hd01',
      dimension: 'التشخيص المالي العميق',
      question: 'متوسط قيمة الزيارة الواحدة (جنيه)',
      type: 'text',
      placeholder: 'مثال: 350',
      toastKey: 'deep_hc_avg_visit'
    },
    {
      id: 'hd02',
      dimension: 'التشخيص المالي العميق',
      question: 'عدد المواعيد الشهرية التقريبي',
      type: 'text',
      placeholder: 'مثال: 400',
      toastKey: 'deep_hc_monthly_appts'
    },
  ],

  automotive: [
    {
      id: 'ad01',
      dimension: 'التشخيص المالي العميق',
      question: 'عدد السيارات المخدومة شهرياً تقريباً',
      type: 'text',
      placeholder: 'مثال: 120',
      toastKey: 'deep_auto_monthly_jobs'
    },
    {
      id: 'ad02',
      dimension: 'التشخيص المالي العميق',
      question: 'عدد الفنيين العاملين',
      type: 'text',
      placeholder: 'مثال: 4',
      toastKey: 'deep_auto_technicians'
    },
    {
      id: 'ad03',
      dimension: 'التشخيص المالي العميق',
      question: 'متوسط تكلفة الساعة الواحدة للفني (جنيه)',
      type: 'text',
      placeholder: 'مثال: 60',
      toastKey: 'deep_auto_hourly_rate'
    },
  ],

  retail: [
    {
      id: 'rd01',
      dimension: 'التشخيص المالي العميق',
      question: 'إجمالي قيمة المخزون الحالي (جنيه)',
      type: 'text',
      placeholder: 'مثال: 800000',
      toastKey: 'deep_retail_inventory'
    },
    {
      id: 'rd02',
      dimension: 'التشخيص المالي العميق',
      question: 'عدد الزوار الشهري التقريبي للمتجر أو الصفحة',
      type: 'text',
      placeholder: 'مثال: 2000',
      toastKey: 'deep_retail_visitors'
    },
    {
      id: 'rd03',
      dimension: 'التشخيص المالي العميق',
      question: 'متوسط قيمة الفاتورة الواحدة (جنيه)',
      type: 'text',
      placeholder: 'مثال: 450',
      toastKey: 'deep_retail_avg_basket'
    },
  ],
};

export const BLIND_SPOT_FORMULAS: Record<string, BlindSpotFormula[]> = {
  healthcare: [
    {
      id: 'hc_noshow',
      name: 'خسارة المواعيد الفارغة (No-Show)',
      requiredDeepFields: ['hd01', 'hd02'],
      requiredAnswerIds: ['h01'],
      // h01 is a 0-10 slider: "من كل 10 مواعيد، كم يُلغي أو لا يحضر؟"
      compute: (deep, answers) => {
        const avgVisit = Number(deep.hd01) || 0;
        const monthlyAppts = Number(deep.hd02) || 0;
        const noShowRatio = (Number(answers.h01) || 0) / 10;
        return Math.round(avgVisit * monthlyAppts * noShowRatio);
      },
      monthlyOrOneTime: 'monthly'
    },
    {
      id: 'hc_followup_gap',
      name: 'فجوة متابعة المرضى',
      requiredDeepFields: ['hd01', 'hd02'],
      requiredAnswerIds: ['h04'],
      compute: (deep, answers) => {
        const factorMap: Record<string, number> = {
          high_commit: 0.02,
          high_low: 0.15,
          low: 0.05
        };
        const factor = factorMap[answers.h04] ?? 0.05;
        const avgVisit = Number(deep.hd01) || 0;
        const monthlyAppts = Number(deep.hd02) || 0;
        return Math.round(avgVisit * monthlyAppts * factor);
      },
      monthlyOrOneTime: 'monthly'
    }
  ],

  automotive: [
    {
      id: 'auto_rework',
      name: 'خسارة إعادة العمل (Rework)',
      requiredDeepFields: ['ad01'],
      requiredAnswerIds: ['a03', 'a09'],
      compute: (deep, answers) => {
        const ticketMidpoint: Record<string, number> = {
          lt500: 350,
          '500_1500': 1000,
          '1500_3000': 2250,
          gt3000: 4000
        };
        const avgTicket = ticketMidpoint[answers.a09] ?? 1000;
        const monthlyJobs = Number(deep.ad01) || 0;
        const reworkRatio = (Number(answers.a03) || 0) / 100;
        return Math.round(avgTicket * monthlyJobs * reworkRatio);
      },
      monthlyOrOneTime: 'monthly'
    },
    {
      id: 'auto_idle_capacity',
      name: 'الطاقة الفنية الضائعة',
      requiredDeepFields: ['ad02', 'ad03'],
      requiredAnswerIds: ['a04'],
      compute: (deep, answers) => {
        const idleFactorMap: Record<string, number> = {
          gt80: 0.10,
          '60_80': 0.30,
          lt60: 0.50
        };
        const idleFactor = idleFactorMap[answers.a04] ?? 0.30;
        const technicians = Number(deep.ad02) || 0;
        const hourlyRate = Number(deep.ad03) || 0;
        const WORKING_HOURS_PER_MONTH = 208; // 8h x 26 days
        return Math.round(technicians * WORKING_HOURS_PER_MONTH * hourlyRate * idleFactor);
      },
      monthlyOrOneTime: 'monthly'
    }
  ],

  retail: [
    {
      id: 'retail_dead_stock',
      name: 'رأس المال المجمَّد في المخزون الراكد',
      requiredDeepFields: ['rd01'],
      requiredAnswerIds: ['rt03'],
      compute: (deep, answers) => {
        const deadStockFactorMap: Record<string, number> = {
          proactive: 0.05,
          discount: 0.15,
          no_plan: 0.30
        };
        const factor = deadStockFactorMap[answers.rt03] ?? 0.15;
        const totalInventory = Number(deep.rd01) || 0;
        return Math.round(totalInventory * factor);
      },
      monthlyOrOneTime: 'monthly'
    },
    {
      id: 'retail_conversion_gap',
      name: 'فجوة معدل التحويل',
      requiredDeepFields: ['rd02', 'rd03'],
      requiredAnswerIds: ['rt01'],
      compute: (deep, answers) => {
        if (answers.rt01 === 'gt30') return 0;
        const visitors = Number(deep.rd02) || 0;
        const avgBasket = Number(deep.rd03) || 0;
        const GAP_ASSUMPTION = 0.10; // standard 10pp improvement headroom
        return Math.round(visitors * avgBasket * GAP_ASSUMPTION);
      },
      monthlyOrOneTime: 'monthly'
    }
  ],
};
