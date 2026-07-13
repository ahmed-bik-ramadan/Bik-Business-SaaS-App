export const POSITIVE_SIGNALS: Record<string, string[] | 'slider_gte_6'> = {
  u01: ['always'],
  u02: ['week'],
  u03: ['yes_comfortable'],
  u04: ['expected'],
  u05: ['faster', 'same'],
  u06: ['gt20', '10_20'],
  u08: ['no'],
  u09: 'slider_gte_6',
  u10: ['gt60', '40_60'],
  u11: ['yes_clear'],
  u12: ['same_day', 'week'],
  u13: ['recent_known', 'never'],
  u15: ['week'],
  u16: ['yes_metrics'],
  u17: ['lt20'],
  u18: ['most'],
  u19: ['lt10'],
  u20: ['big_yes'],
  u22: ['systematic'],
  u23: ['raise_value', 'different_segment'],
  u24: ['strong'],
  u25: ['specific_number', 'percentage'],
  u26: ['none'],
  u27: ['gt10', '5_10'],
};

const DIMENSION_QUESTIONS: Record<string, string[]> = {
  'بنية الشركة وهويتها': ['u01', 'u02', 'u03'],
  'الصحة المالية': ['u04', 'u05', 'u06', 'u08'],
  'العملاء والمبيعات': ['u09', 'u10', 'u11', 'u12', 'u13'],
  'الفريق والعمليات': ['u15', 'u16', 'u17', 'u18', 'u19'],
  'الموقع التنافسي': ['u20', 'u22', 'u23', 'u24'],
  'الرؤية والنمو': ['u25', 'u26', 'u27'],
};

export function computeInstantScore(
  universalAnswers: Record<string, any>
): { overall: number, axisScores: Record<string, number> } {
  const axisScores: Record<string, number> = {};
  for (const [dimension, qIds] of Object.entries(DIMENSION_QUESTIONS)) {
    const results = qIds.map(qId => {
      const answer = universalAnswers[qId];
      const rule = POSITIVE_SIGNALS[qId];
      if (rule === 'slider_gte_6') return Number(answer) >= 6;
      if (Array.isArray(rule)) return rule.includes(answer);
      return false;
    });
    axisScores[dimension] = Math.round(
      (results.filter(Boolean).length / results.length) * 100
    );
  }
  const overall = Math.round(
    Object.values(axisScores).reduce((a, b) => a + b, 0) /
    Object.values(axisScores).length
  );
  return { overall, axisScores };
}
