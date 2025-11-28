import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://shislvyommsbeiejrwzq.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNoaXNsdnlvbW1zYmVpZWpyd3pxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQzMzM2ODYsImV4cCI6MjA3OTkwOTY4Nn0.68gV9bsiHGh81VdcJUJj9hYEYOh5bH1at4nXY4VPxw4';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
});

// Types matching our Supabase schema
export interface Parcel {
  id: string;
  tracking_number: string;
  destination?: string;
  recipient_name?: string;
  date_sent?: string;
  note?: string;
  current_status?: string;
  current_status_description?: string;
  current_location?: string;
  is_delivered: boolean;
  last_updated: string;
  created_at: string;
  updated_at: string;
}

export interface Project {
  id: string;
  title: string;
  description?: string;
  status: 'planning' | 'in_progress' | 'completed' | 'on_hold';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  start_date?: string;
  end_date?: string;
  created_at: string;
  updated_at: string;
}

export interface WeeklyPlan {
  id: string;
  week_start_date: string;
  day_of_week: 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';
  title: string;
  description?: string;
  start_time?: string;
  end_time?: string;
  is_completed: boolean;
  created_at: string;
  updated_at: string;
}

export interface Settings {
  id: string;
  thailand_post_api_token?: string;
  supabase_url?: string;
  supabase_anon_key?: string;
  notifications_enabled: boolean;
  created_at: string;
  updated_at: string;
}

// Thailand Post API helper
export async function fetchTrackingHistory(trackingNumber: string) {
  try {
    const token = "Token eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJpc3MiOiJzZWN1cmUuaW50ZXJuZXQucHMudGgiLCJhdWQiOiJodHRwczovL3RyYWNraW5nLnRoYWlsYW5kcG9zdC5jby50aCIsImp0aSI6IkJSWjdOWGRJRlJqNWNPY1BqUDNwNWciLCJpYXQiOjE3MzY5MzE5MTcsImV4cCI6MjA1MjI5MTkxNywidWlkIjoiMTAwMDAwMDAwMDAwMDAwMSJ9.3RqXFQZEWPQHUgZhyPMU0Ry4BXtcQHCVpOBvNdvJQFe0Gg7QLqPZyy5fJd4S3_xSEXlOdPcCDmGqMvbzXBBEeA";
    
    const response = await fetch(
      `https://trackapi.thailandpost.co.th/post/api/v1/track`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": token,
        },
        body: JSON.stringify({
          status: "all",
          language: "EN",
          barcode: [trackingNumber],
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    if (data.response?.items?.[trackingNumber]) {
      return data.response.items[trackingNumber];
    }
    
    return [];
  } catch (error) {
    console.error("Error fetching tracking history:", error);
    return [];
  }
}
