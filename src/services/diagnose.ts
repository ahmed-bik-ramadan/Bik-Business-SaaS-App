import { DiagnosticStore } from "../store/diagnosticStore";
import { DiagnosticReport } from "../types";

export async function generateDiagnosticReport(
  store: DiagnosticStore
): Promise<DiagnosticReport> {
  const response = await fetch("/api/diagnose", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      userName: store.userName,
      companyName: store.companyName,
      sectorL1: store.sectorL1,
      sectorL2: store.sectorL2,
      intakeAnswers: store.intakeAnswers,
      universalAnswers: store.universalAnswers,
      sectorAnswers: store.sectorAnswers,
      diagnosticDepth: store.diagnosticDepth,
    })
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Server returned error: ${response.status} - ${errText}`);
  }

  const parsedReport: DiagnosticReport = await response.json();

  // Overwrite with precalculated/instant score and label
  let calculatedScore = store.instantScore;
  if (calculatedScore === null) {
    const { computeInstantScore } = await import("./deterministicScoring");
    calculatedScore = computeInstantScore(store.universalAnswers).overall;
  }

  parsedReport.health_score = calculatedScore ?? 50;

  let finalLabel = "متوسط";
  if (parsedReport.health_score >= 90) finalLabel = "ممتاز";
  else if (parsedReport.health_score >= 75) finalLabel = "جيد";
  else if (parsedReport.health_score >= 50) finalLabel = "متوسط";
  else finalLabel = "ضعيف";

  parsedReport.health_label = finalLabel;

  return parsedReport;
}

export async function generateProposal(
  report: DiagnosticReport,
  userName: string,
  companyName: string,
  sectorL2: string
): Promise<string> {
  const response = await fetch("/api/proposal", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ report, userName, companyName, sectorL2 })
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Server returned error generating proposal: ${response.status} - ${errText}`);
  }

  const data = await response.json();
  return data.proposal;
}
