import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { DiagnosticReport } from '../types';

export interface DiagnosticStore {
  sessionId: string;
  userName: string;
  companyName: string;
  whatsapp: string;
  sectorL1: string;
  sectorL2: string;
  diagnosticDepth: 'quick' | 'deep';
  intakeAnswers: Record<string, string | number>;
  universalAnswers: Record<string, string | number>;
  sectorAnswers: Record<string, string | number>;
  currentStep: 'welcome' | 'sector' | 'intake' | 'universal' | 'sector-q' | 'processing' | 'gate' | 'report';
  universalProgress: number;
  sectorProgress: number;
  instantScore: number | null;
  axisScores: Record<string, number> | null;
  report: DiagnosticReport | null;
  proposal: string | null;
  conversationHistory: Array<{ role: 'user' | 'model'; text: string }>;
  setField: (key: string, value: any) => void;
  nextStep: () => void;
  reset: () => void;
}

export const useDiagnosticStore = create<DiagnosticStore>()(
  persist(
    (set) => ({
      sessionId: crypto.randomUUID(),
      userName: '',
      companyName: '',
      whatsapp: '',
      sectorL1: '',
      sectorL2: '',
      diagnosticDepth: 'quick',
      intakeAnswers: {},
      universalAnswers: {},
      sectorAnswers: {},
      currentStep: 'welcome',
      universalProgress: 0,
      sectorProgress: 0,
      instantScore: null,
      axisScores: null,
      report: null,
      proposal: null,
      conversationHistory: [],

      setField: (key, value) => set((state) => ({ ...state, [key]: value })),

      nextStep: () => set((state) => {
        // Simple mock for next step, will be implemented with routing
        return state;
      }),

      reset: () => set({
        sessionId: crypto.randomUUID(),
        userName: '',
        companyName: '',
        whatsapp: '',
        sectorL1: '',
        sectorL2: '',
        diagnosticDepth: 'quick',
        intakeAnswers: {},
        universalAnswers: {},
        sectorAnswers: {},
        currentStep: 'welcome',
        universalProgress: 0,
        sectorProgress: 0,
        instantScore: null,
        axisScores: null,
        report: null,
        proposal: null,
        conversationHistory: [],
      }),
    }),
    {
      name: 'bik-diagnostic-storage',
    }
  )
);
