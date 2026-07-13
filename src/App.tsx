import React, { Suspense } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Welcome from './pages/Welcome'
import SectorSelect from './pages/SectorSelect'
import DiagnosticDepth from './pages/DiagnosticDepth'
import CompanyIntake from './pages/CompanyIntake'
import Questionnaire from './pages/Questionnaire'
import Processing from './pages/Processing'
import LeadGate from './pages/LeadGate'
import Report from './pages/Report'
import SessionView from './pages/SessionView'
import Consultant from './pages/Consultant'
import AdminDashboard from './pages/AdminDashboard'
import ErrorBoundary from './components/ErrorBoundary'

function App() {
  return (
    <BrowserRouter>
      <div dir="rtl" lang="ar" className="min-h-screen font-arabic">
        <ErrorBoundary>
          <Routes>
            <Route path="/" element={<Welcome />} />
            <Route path="/sector-select" element={<SectorSelect />} />
            <Route path="/diagnostic-depth" element={<DiagnosticDepth />} />
            <Route path="/company-intake" element={<CompanyIntake />} />
            <Route path="/questionnaire" element={<Questionnaire />} />
            <Route path="/processing" element={<Processing />} />
            <Route path="/lead-gate" element={<LeadGate />} />
            <Route path="/report" element={<Report />} />
            <Route path="/session/:sessionId" element={<SessionView />} />
            <Route path="/consultant" element={<Consultant />} />
            <Route path="/admin-bik-dashboard-2025" element={<AdminDashboard />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </ErrorBoundary>
      </div>
    </BrowserRouter>
  )
}

export default App
