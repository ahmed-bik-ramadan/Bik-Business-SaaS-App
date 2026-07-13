export interface DiagnosticReport {
  headline_diagnosis: string;
  health_score: number;
  health_label: string;
  swot: {
    strengths: string[];
    weaknesses: string[];
    opportunities: string[];
    threats: string[];
  };
  blind_spots: Array<{
    name: string;
    description: string;
    impact_level: 'critical' | 'high' | 'medium';
    source_question: string;
    estimated_cost: string;
  }>;
  priority_actions: Array<{
    action: string;
    why_now: string;
    expected_impact: string;
    difficulty: 'low' | 'medium' | 'high';
    timeframe: string;
  }>;
  closing_question: string;
  sector_insight: string;
}

export interface LeadData {
  session_id: string;
  user_name: string;
  company_name: string;
  whatsapp: string;
  sector_l1: string;
  sector_l2: string;
  country: string;
  city: string;
}

export interface CompanyIntakeData {
  companyAge: string;
  founderExperience: string;
  country: string;
  city: string;
  businessMotivation: string[];
  modelsApplied: string[];
  modelSuccessRate: number;
  breakEven: string;
  roi: string;
  debt: string;
  debtMonthlyPct: number;
  operationalCostsPct: number;
  competitors: string[];
  differentiators: string[];
  geographicScope: string;
}
