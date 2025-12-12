-- Create tower_sites table
CREATE TABLE IF NOT EXISTS tower_sites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nomor_urut INTEGER NOT NULL UNIQUE,
  nama_site VARCHAR(255) NOT NULL,
  alamat_site TEXT NOT NULL,
  koordinat_lat DECIMAL(10, 6) NOT NULL,
  koordinat_lng DECIMAL(10, 6) NOT NULL,
  tanggal_checklist DATE NOT NULL,
  lokasi_site VARCHAR(10) NOT NULL CHECK (lokasi_site IN ('p', 'k', 's', 'pk', 'ju', 'jl', 'jt')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create inspection_items table
CREATE TABLE IF NOT EXISTS inspection_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tower_site_id UUID NOT NULL REFERENCES tower_sites(id) ON DELETE CASCADE,
  item_number INTEGER NOT NULL,
  item_name VARCHAR(255) NOT NULL,
  status VARCHAR(10) CHECK (status IN ('baik', 'sedang', 'buruk') OR status IS NULL),
  keterangan TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_tower_sites_nomor_urut ON tower_sites(nomor_urut);
CREATE INDEX IF NOT EXISTS idx_tower_sites_nama_site ON tower_sites(nama_site);
CREATE INDEX IF NOT EXISTS idx_inspection_items_tower_site_id ON inspection_items(tower_site_id);
CREATE INDEX IF NOT EXISTS idx_inspection_items_item_number ON inspection_items(item_number);

-- Enable Row Level Security
ALTER TABLE tower_sites ENABLE ROW LEVEL SECURITY;
ALTER TABLE inspection_items ENABLE ROW LEVEL SECURITY;

-- Create policies to allow anonymous access (for public anon key)
-- Note: In production, you should implement proper authentication
CREATE POLICY "Allow public read access on tower_sites" ON tower_sites
  FOR SELECT USING (true);

CREATE POLICY "Allow public insert on tower_sites" ON tower_sites
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public update on tower_sites" ON tower_sites
  FOR UPDATE USING (true);

CREATE POLICY "Allow public delete on tower_sites" ON tower_sites
  FOR DELETE USING (true);

CREATE POLICY "Allow public read access on inspection_items" ON inspection_items
  FOR SELECT USING (true);

CREATE POLICY "Allow public insert on inspection_items" ON inspection_items
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public update on inspection_items" ON inspection_items
  FOR UPDATE USING (true);

CREATE POLICY "Allow public delete on inspection_items" ON inspection_items
  FOR DELETE USING (true);
