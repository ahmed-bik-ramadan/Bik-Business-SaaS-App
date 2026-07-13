import { LeadData, DiagnosticReport } from '../types';

export async function notifyAhmed(
  leadData: LeadData,
  report: DiagnosticReport,
  sessionId: string
): Promise<void> {
  const message = buildWhatsAppMessage(leadData, report);

  const payload = {
    type: 'new_diagnostic_complete',
    session_id: sessionId,
    timestamp: new Date().toISOString(),
    lead: leadData,
    report_summary: {
      headline: report.headline_diagnosis,
      health_score: report.health_score,
      health_label: report.health_label,
      top_blind_spot: report.blind_spots[0]?.name,
      top_blind_spot_level: report.blind_spots[0]?.impact_level,
      blind_spots_count: report.blind_spots.length
    },
    full_report: report
  };

  try {
    const webhookUrl = import.meta.env.VITE_MAKE_WEBHOOK_URL;
    if (webhookUrl) {
      await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
    }
  } catch (error) {
    console.error('Webhook notification failed:', error);
  }
}

function buildWhatsAppMessage(leadData: LeadData, report: DiagnosticReport): string {
  return `تشخيص جديد مكتمل
الاسم: ${leadData.user_name}
الشركة: ${leadData.company_name}
القطاع: ${leadData.sector_l2}
الدولة: ${leadData.country} - ${leadData.city}
واتساب: ${leadData.whatsapp}
Health Score: ${report.health_score}/100
التشخيص: ${report.headline_diagnosis}
أعلى نقطة عمياء: ${report.blind_spots[0]?.name} - ${report.blind_spots[0]?.impact_level}`;
}
