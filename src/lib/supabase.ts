// Supabase Client Configuration
import { createClient } from '@supabase/supabase-js';

// Supabase Credentials (Public - sicher für Frontend-Nutzung)
const supabaseUrl = 'https://quldnodtstkyroctqjbs.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF1bGRub2R0c3RreXJvY3RxamJzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk5NjAxMzgsImV4cCI6MjA4NTUzNjEzOH0.DGn12iBzZKboLF_FknhNhdc8ICQN9ZQH06PMFNYBhJ8';

// Supabase Client Instance
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false, // Kein User-Auth nötig für Event-Tracking
  },
});

// TypeScript Types für Datenbank-Tabellen
export type ExitPopupEvent = {
  id?: string;
  event_type: 'popup_shown' | 'popup_closed' | 'popup_submitted';
  trigger_type?: 'timer' | 'scroll' | 'mouseleave';
  session_id?: string;
  page_url?: string;
  user_agent?: string;
  created_at?: string;
};

export type Lead = {
  id?: string;
  name?: string;
  email?: string;
  phone?: string;
  source: 'exit_popup' | 'main_form' | 'multi_step_form';
  project_type?: 'privat' | 'gewerbe';
  system_size?: string;
  message?: string;
  double_opt_in?: boolean;
  thank_you_sent?: boolean;
  consent_given?: boolean;
  ip_address_hash?: string;
  created_at?: string;
  updated_at?: string;
  expires_at?: string;
};

export type LeadStatus = {
  id?: string;
  lead_id: string;
  status: 'neu' | 'kontaktiert' | 'angebot_gesendet' | 'gewonnen' | 'verloren';
  notes?: string;
  created_at?: string;
};

// Helper: Session ID generieren (für Event-Tracking)
export function getSessionId(): string {
  let sessionId = sessionStorage.getItem('session_id');
  if (!sessionId) {
    sessionId = `session_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    sessionStorage.setItem('session_id', sessionId);
  }
  return sessionId;
}

// Helper: IP-Adresse anonymisieren (SHA-256 Hash)
export async function hashIP(ip: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(ip);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

// Event-Tracking: Exit-Popup Event speichern
export async function trackExitPopupEvent(
  eventType: ExitPopupEvent['event_type'],
  triggerType?: ExitPopupEvent['trigger_type']
): Promise<void> {
  try {
    const event: ExitPopupEvent = {
      event_type: eventType,
      trigger_type: triggerType,
      session_id: getSessionId(),
      page_url: window.location.href,
      user_agent: navigator.userAgent,
    };

    const { error } = await supabase
      .from('exit_popup_events')
      .insert([event]);

    if (error) {
      console.error('Error tracking exit popup event:', error);
    }
  } catch (err) {
    console.error('Failed to track event:', err);
  }
}

// Lead-Erfassung: Neuen Lead speichern
export async function createLead(lead: Omit<Lead, 'id' | 'created_at' | 'updated_at' | 'expires_at'>): Promise<string | null> {
  try {
    const { data, error } = await supabase
      .from('leads')
      .insert([lead])
      .select('id')
      .single();

    if (error) {
      console.error('Error creating lead:', error);
      return null;
    }

    // Initial Status setzen
    if (data?.id) {
      await supabase.from('lead_status').insert([{
        lead_id: data.id,
        status: 'neu',
      }]);
    }

    return data?.id || null;
  } catch (err) {
    console.error('Failed to create lead:', err);
    return null;
  }
}

// Lead-Status aktualisieren
export async function updateLeadStatus(
  leadId: string,
  status: string,
  notes?: string
): Promise<{ data: any; error: any }> {
  try {
    // Update lead status directly in leads table
    const { data, error } = await supabase
      .from('leads')
      .update({ status })
      .eq('id', leadId)
      .select()
      .single();

    if (error) {
      console.error('Error updating lead status:', error);
    }

    // Also insert into lead_status history table
    await supabase.from('lead_status').insert([{
      lead_id: leadId,
      status,
      notes,
    }]);

    return { data, error };
  } catch (err) {
    console.error('Failed to update lead status:', err);
    return { data: null, error: err };
  }
}

// Get all leads (for admin panel)
export async function getLeads(): Promise<any[]> {
  try {
    const { data, error } = await supabase
      .from('leads')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching leads:', error);
      throw error;
    }

    return data || [];
  } catch (err) {
    console.error('Failed to fetch leads:', err);
    return [];
  }
}

// Get conversion funnel analytics
export async function getConversionFunnel(): Promise<any[]> {
  try {
    const { data, error } = await supabase
      .from('conversion_funnel')
      .select('*');

    if (error) {
      console.error('Error fetching conversion funnel:', error);
      throw error;
    }

    return data || [];
  } catch (err) {
    console.error('Failed to fetch conversion funnel:', err);
    return [];
  }
}

// Get leads overview analytics
export async function getLeadsOverview(): Promise<any[]> {
  try {
    const { data, error } = await supabase
      .from('leads_overview')
      .select('*');

    if (error) {
      console.error('Error fetching leads overview:', error);
      throw error;
    }

    return data || [];
  } catch (err) {
    console.error('Failed to fetch leads overview:', err);
    return [];
  }
}

// Get all exit popup events (for analytics)
export async function getExitPopupEvents(): Promise<ExitPopupEvent[]> {
  try {
    const { data, error } = await supabase
      .from('exit_popup_events')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching exit popup events:', error);
      throw error;
    }

    return data || [];
  } catch (err) {
    console.error('Failed to fetch exit popup events:', err);
    return [];
  }
}
