import { supabase, TowerSite, InspectionItem } from './supabase';

// Tower Sites CRUD
export const towerSitesService = {
  async create(data: Omit<TowerSite, 'id' | 'created_at'>) {
    const { data: result, error } = await supabase
      .from('tower_sites')
      .insert([data])
      .select();
    
    if (error) throw error;
    return result?.[0];
  },

  async getAll() {
    const { data, error } = await supabase
      .from('tower_sites')
      .select('*')
      .order('nomor_urut', { ascending: true });
    
    if (error) throw error;
    return data || [];
  },

  async getById(id: string) {
    const { data, error } = await supabase
      .from('tower_sites')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  },

  async getByNomorUrut(nomor_urut: number) {
    const { data, error } = await supabase
      .from('tower_sites')
      .select('*')
      .eq('nomor_urut', nomor_urut)
      .single();
    
    if (error) throw error;
    return data;
  },

  async update(id: string, data: Partial<TowerSite>) {
    const { data: result, error } = await supabase
      .from('tower_sites')
      .update(data)
      .eq('id', id)
      .select();
    
    if (error) throw error;
    return result?.[0];
  },

  async delete(id: string) {
    const { error } = await supabase
      .from('tower_sites')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  },

  async search(query: string) {
    const { data, error } = await supabase
      .from('tower_sites')
      .select('*')
      .or(`nomor_urut.ilike.%${query}%,nama_site.ilike.%${query}%,alamat_site.ilike.%${query}%`)
      .order('nomor_urut', { ascending: true });
    
    if (error) throw error;
    return data || [];
  },
};

// Inspection Items CRUD
export const inspectionItemsService = {
  async createBatch(items: Omit<InspectionItem, 'id' | 'created_at'>[]) {
    const { data, error } = await supabase
      .from('inspection_items')
      .insert(items)
      .select();
    
    if (error) throw error;
    return data || [];
  },

  async getByTowerSite(tower_site_id: string) {
    const { data, error } = await supabase
      .from('inspection_items')
      .select('*')
      .eq('tower_site_id', tower_site_id)
      .order('item_number', { ascending: true });
    
    if (error) throw error;
    return data || [];
  },

  async update(id: string, data: Partial<InspectionItem>) {
    const { data: result, error } = await supabase
      .from('inspection_items')
      .update(data)
      .eq('id', id)
      .select();
    
    if (error) throw error;
    return result?.[0];
  },

  async deleteByTowerSite(tower_site_id: string) {
    const { error } = await supabase
      .from('inspection_items')
      .delete()
      .eq('tower_site_id', tower_site_id);
    
    if (error) throw error;
  },

  async getStatsByTowerSite(tower_site_id: string) {
    const items = await this.getByTowerSite(tower_site_id);
    
    const stats = {
      total: items.length,
      baik: items.filter(i => i.status === 'baik').length,
      sedang: items.filter(i => i.status === 'sedang').length,
      buruk: items.filter(i => i.status === 'buruk').length,
      noStatus: items.filter(i => !i.status).length,
    };
    
    return stats;
  },

  async getOverallStats() {
    const { data, error } = await supabase
      .from('inspection_items')
      .select('status');
    
    if (error) throw error;
    
    const stats = {
      total: data?.length || 0,
      baik: data?.filter(i => i.status === 'baik').length || 0,
      sedang: data?.filter(i => i.status === 'sedang').length || 0,
      buruk: data?.filter(i => i.status === 'buruk').length || 0,
    };
    
    return stats;
  },
};

// Helper to combine tower with its items
export const getTowerWithItems = async (tower_site_id: string) => {
  const tower = await towerSitesService.getById(tower_site_id);
  const items = await inspectionItemsService.getByTowerSite(tower_site_id);
  
  return { tower, items };
};
