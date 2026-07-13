import { createClient } from '@supabase/supabase-js';
import { DiagnosticReport, LeadData } from '../types';

// Dynamic credential mapper to fix swapped variables gracefully
let rawUrl = import.meta.env.VITE_SUPABASE_URL || '';
let rawKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

let supabaseUrl = '';
let supabaseKey = '';

if (rawUrl.startsWith('http')) {
  supabaseUrl = rawUrl;
  supabaseKey = rawKey;
} else if (rawKey.startsWith('http')) {
  supabaseUrl = rawKey;
  supabaseKey = rawUrl;
} else {
  // Default fallback URLs/keys if neither is present
  supabaseUrl = 'https://tvfobgjybbddmrawbkjm.supabase.co';
  supabaseKey = rawKey || rawUrl || 'sb_publishable_k1E7i0hEffZU8BA1ey6lZw_MELdpQhT';
}

// Clean up any training endpoints
if (supabaseUrl.endsWith('/rest/v1/')) {
  supabaseUrl = supabaseUrl.slice(0, -9);
} else if (supabaseUrl.endsWith('/rest/v1')) {
  supabaseUrl = supabaseUrl.slice(0, -8);
}

export const supabase = createClient(supabaseUrl, supabaseKey);

// One-time cleanup of any leftover placeholder rows from the browser
if (typeof window !== 'undefined') {
  setTimeout(async () => {
    try {
      const { error } = await supabase
        .from('leads')
        .delete()
        .eq('user_name', 'زائر مؤقت');
      if (!error) {
        console.log('Cleanup of placeholder leads completed successfully.');
      }
    } catch (e) {
      // Ignore
    }
  }, 2000);
}

// --- Local Storage Fallback Helpers ---

function getLocalLeads(): any[] {
  if (typeof window === 'undefined') return [];
  try {
    const leadsStr = localStorage.getItem('local_leads') || '[]';
    const leads = JSON.parse(leadsStr);
    const sessionsStr = localStorage.getItem('local_sessions') || '{}';
    const sessions = JSON.parse(sessionsStr);
    
    return leads.map((lead: any) => {
      const session = sessions[lead.session_id] || null;
      return {
        ...lead,
        diagnostic_sessions: session ? [session] : []
      };
    }).sort((a: any, b: any) => new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime());
  } catch (e) {
    console.error('Error reading local leads:', e);
    return [];
  }
}

function saveLocalLead(lead: any): string {
  if (typeof window === 'undefined') return `local_${Date.now()}`;
  try {
    const leadsStr = localStorage.getItem('local_leads') || '[]';
    const leads = JSON.parse(leadsStr);
    const existingIdx = leads.findIndex((l: any) => l.session_id === lead.session_id);
    const updatedLead = {
      ...lead,
      id: lead.id || `local_${Math.random().toString(36).substr(2, 9)}`,
      created_at: lead.created_at || new Date().toISOString()
    };
    if (existingIdx >= 0) {
      leads[existingIdx] = { ...leads[existingIdx], ...updatedLead };
    } else {
      leads.push(updatedLead);
    }
    localStorage.setItem('local_leads', JSON.stringify(leads));
    return updatedLead.id;
  } catch (e) {
    console.error('Error saving local lead:', e);
    return `local_${Date.now()}`;
  }
}

function saveLocalProgress(sessionId: string, data: Record<string, any>) {
  if (typeof window === 'undefined') return;
  try {
    const sessionsStr = localStorage.getItem('local_sessions') || '{}';
    const sessions = JSON.parse(sessionsStr);
    const currentSession = sessions[sessionId] || { session_id: sessionId, created_at: new Date().toISOString() };
    sessions[sessionId] = {
      ...currentSession,
      ...data,
      updated_at: new Date().toISOString()
    };
    localStorage.setItem('local_sessions', JSON.stringify(sessions));
  } catch (e) {
    console.error('Error saving local progress:', e);
  }
}

function mergeLeads(supabaseLeads: any[], localLeads: any[]): any[] {
  const mergedMap = new Map();
  
  if (Array.isArray(supabaseLeads)) {
    supabaseLeads.forEach(l => {
      mergedMap.set(l.session_id || l.id, l);
    });
  }
  
  if (Array.isArray(localLeads)) {
    localLeads.forEach(l => {
      const key = l.session_id || l.id;
      if (!mergedMap.has(key)) {
        mergedMap.set(key, l);
      } else {
        const supLead = mergedMap.get(key);
        const mergedSess = [
          ...(supLead.diagnostic_sessions || []),
          ...(l.diagnostic_sessions || [])
        ].filter((v, i, a) => a.findIndex(t => t.session_id === v.session_id) === i);
        
        mergedMap.set(key, {
          ...l,
          ...supLead,
          diagnostic_sessions: mergedSess
        });
      }
    });
  }
  
  return Array.from(mergedMap.values()).sort((a: any, b: any) => new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime());
}

// --- End of Fallback Helpers ---

export async function saveProgress(sessionId: string, data: Record<string, any>) {
  // Save locally first to guarantee persistence
  saveLocalProgress(sessionId, data);

  try {
    const { error } = await supabase
      .from('diagnostic_sessions')
      .upsert({ session_id: sessionId, ...data }, { onConflict: 'session_id' });
    if (error) {
      console.warn('saveProgress error:', error.message);
      if (typeof window !== 'undefined') {
        localStorage.setItem(`cloud_save_failed_${sessionId}`, 'true');
      }
      // Fallback: try update if upsert failed
      const { error: updateError } = await supabase
        .from('diagnostic_sessions')
        .update(data)
        .eq('session_id', sessionId);
      if (updateError) {
        console.warn('saveProgress fallback update error:', updateError.message);
      }
    }
  } catch (err) {
    console.warn('saveProgress exception:', err);
    if (typeof window !== 'undefined') {
      localStorage.setItem(`cloud_save_failed_${sessionId}`, 'true');
    }
  }
}

export async function saveLead(leadData: LeadData): Promise<string> {
  // Always save locally first
  const localId = saveLocalLead(leadData);

  try {
    const { data, error } = await supabase
      .from('leads')
      .upsert(leadData, { onConflict: 'session_id' })
      .select('id')
      .single();

    if (error) {
      console.warn('saveLead upsert failed, trying update/insert fallback:', error.message);
      if (typeof window !== 'undefined') {
        localStorage.setItem(`cloud_save_failed_${leadData.session_id}`, 'true');
      }
      // Try updating existing lead by session_id first
      const { data: updateData, error: updateError } = await supabase
        .from('leads')
        .update(leadData)
        .eq('session_id', leadData.session_id)
        .select('id')
        .single();

      if (updateError) {
        // If update failed, try a standard insert as a final fallback
        const { data: insertData, error: insertError } = await supabase
          .from('leads')
          .insert(leadData)
          .select('id')
          .single();
        if (insertError) {
          console.warn('saveLead final fallback failed:', insertError.message);
          return localId;
        }
        return insertData.id;
      }
      return updateData.id;
    }
    return data.id;
  } catch (err) {
    console.warn('saveLead exception, using localId:', err);
    if (typeof window !== 'undefined') {
      localStorage.setItem(`cloud_save_failed_${leadData.session_id}`, 'true');
    }
    return localId;
  }
}

export async function saveReport(sessionId: string, report: DiagnosticReport, proposal: string, leadId?: string) {
  // Always save locally first
  saveLocalProgress(sessionId, {
    report,
    proposal,
    completed_at: new Date().toISOString(),
    completion_pct: 100,
    ...(leadId ? { lead_id: leadId } : {})
  });

  try {
    const updatePayload: any = {
      report,
      proposal,
      completed_at: new Date().toISOString(),
      completion_pct: 100
    };
    if (leadId) {
      updatePayload.lead_id = leadId;
    }

    const { error } = await supabase
      .from('diagnostic_sessions')
      .update(updatePayload)
      .eq('session_id', sessionId);
    if (error) {
      console.warn('saveReport error:', error.message);
    }
  } catch (err) {
    console.warn('saveReport exception:', err);
  }
}

export async function trackEvent(sessionId: string, eventName: string, eventData: Record<string, any> = {}) {
  if (typeof window !== 'undefined') {
    try {
      const eventsStr = localStorage.getItem('local_analytics') || '[]';
      const events = JSON.parse(eventsStr);
      events.push({ session_id: sessionId, event_name: eventName, event_data: eventData, created_at: new Date().toISOString() });
      localStorage.setItem('local_analytics', JSON.stringify(events));
    } catch (e) {
      console.error('Error saving local tracking event:', e);
    }
  }

  try {
    await supabase.from('analytics').insert({ session_id: sessionId, event_name: eventName, event_data: eventData });
  } catch (err) {
    // Slently catch tracking errors so they don't impact UX
  }
}

export async function getAllLeads() {
  let supabaseLeads: any[] = [];
  try {
    const { data, error } = await supabase
      .from('leads')
      .select('*, diagnostic_sessions(*)')
      .order('created_at', { ascending: false });
    if (error) {
      console.warn('getAllLeads database error:', error.message);
    } else if (data) {
      supabaseLeads = data;
    }
  } catch (err) {
    console.warn('getAllLeads exception:', err);
  }

  const localLeads = getLocalLeads();
  return mergeLeads(supabaseLeads, localLeads);
}

export async function updateLeadStatus(leadId: string, status: string) {
  // Update local lead first
  if (typeof window !== 'undefined') {
    try {
      const leadsStr = localStorage.getItem('local_leads') || '[]';
      const leads = JSON.parse(leadsStr);
      const existingIdx = leads.findIndex((l: any) => l.id === leadId);
      if (existingIdx >= 0) {
        leads[existingIdx].status = status;
        localStorage.setItem('local_leads', JSON.stringify(leads));
      }
    } catch (e) {
      console.error('Error updating status in local leads:', e);
    }
  }

  try {
    const { error } = await supabase
      .from('leads')
      .update({ status })
      .eq('id', leadId);
    if (error) {
      console.warn('updateLeadStatus error:', error.message);
    }
  } catch (err) {
    console.warn('updateLeadStatus exception:', err);
  }
}

export async function saveProposal(leadId: string, content: string) {
  // Update local session/lead first with proposal content
  if (typeof window !== 'undefined') {
    try {
      const leadsStr = localStorage.getItem('local_leads') || '[]';
      const leads = JSON.parse(leadsStr);
      const lead = leads.find((l: any) => l.id === leadId);
      if (lead) {
        const sessionsStr = localStorage.getItem('local_sessions') || '{}';
        const sessions = JSON.parse(sessionsStr);
        if (sessions[lead.session_id]) {
          sessions[lead.session_id].proposal = content;
          localStorage.setItem('local_sessions', JSON.stringify(sessions));
        }
      }
    } catch (e) {
      console.error('Error saving proposal to local storage:', e);
    }
  }

  try {
    const { error } = await supabase
      .from('proposals')
      .insert({ lead_id: leadId, content });
    if (error) {
      console.warn('saveProposal error:', error.message);
    }
  } catch (err) {
    console.warn('saveProposal exception:', err);
  }
}

export async function getSessionAndLead(sessionId: string) {
  let sessionData: any = null;
  let leadData: any = null;

  // 1. Try local storage first
  if (typeof window !== 'undefined') {
    try {
      const sessionsStr = localStorage.getItem('local_sessions') || '{}';
      const sessions = JSON.parse(sessionsStr);
      if (sessions[sessionId]) {
        sessionData = sessions[sessionId];
      }
      
      const leadsStr = localStorage.getItem('local_leads') || '[]';
      const leads = JSON.parse(leadsStr);
      const lead = leads.find((l: any) => l.session_id === sessionId);
      if (lead) {
        leadData = lead;
      }
    } catch (e) {
      console.error('Error reading session/lead from local storage:', e);
    }
  }

  // 2. Try Supabase
  try {
    const { data: dbSession, error: sErr } = await supabase
      .from('diagnostic_sessions')
      .select('*')
      .eq('session_id', sessionId)
      .maybeSingle();

    if (!sErr && dbSession) {
      sessionData = { ...sessionData, ...dbSession };
    }

    const { data: dbLead, error: lErr } = await supabase
      .from('leads')
      .select('*')
      .eq('session_id', sessionId)
      .maybeSingle();

    if (!lErr && dbLead) {
      leadData = { ...leadData, ...dbLead };
    }
  } catch (err) {
    console.warn('Error reading from Supabase:', err);
  }

  return { session: sessionData, lead: leadData };
}

