import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://cwaukqoklzxlsnowlqqh.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN3YXVrcW9rbHp4bHNub3dscXFoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ3ODMyNzgsImV4cCI6MjA4MDM1OTI3OH0.4sNH3h7W6IFKlZcBleUj8On4ktbugL9_rYQbm15Qo3E';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types
export interface TowerSite {
  id: string;
  nomor_urut: number;
  nama_site: string;
  alamat_site: string;
  koordinat_lat: number;
  koordinat_lng: number;
  tanggal_checklist: string;
  lokasi_site: 'p' | 'k' | 's' | 'pk' | 'ju' | 'jl' | 'jt';
  created_at: string;
  updated_at?: string;
}

export interface InspectionItem {
  id: string;
  tower_site_id: string;
  item_number: number;
  item_name: string;
  status: 'baik' | 'sedang' | 'buruk' | null;
  keterangan: string;
  created_at: string;
}

// Helper types
export interface TowerWithItems {
  tower: TowerSite;
  items: InspectionItem[];
}

export interface TowerStats {
  total: number;
  baik: number;
  sedang: number;
  buruk: number;
  noStatus?: number;
}
