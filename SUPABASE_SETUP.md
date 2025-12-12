# Supabase Database Setup Guide

## Overview
This application requires two tables in Supabase:
1. `tower_sites` - Stores BTS tower information
2. `inspection_items` - Stores inspection checklist items for each tower

## Setup Instructions

### Step 1: Access Supabase Dashboard
1. Go to https://app.supabase.com
2. Log in to your account
3. Select your project: **cwaukqoklzxlsnowlqqh**

### Step 2: Create Database Schema
1. Click on **SQL Editor** in the left sidebar
2. Click **New query**
3. Copy the entire content from `DATABASE_SCHEMA.sql` in this project
4. Paste it into the SQL editor
5. Click **Run** (or press Ctrl+Enter)
6. Wait for the query to complete successfully

### Step 3: Verify Tables Created
1. Go to **Table Editor** in the left sidebar
2. You should see two new tables:
   - `tower_sites`
   - `inspection_items`

### Step 4: Configure Row Level Security (RLS)
The RLS policies have been automatically created by the schema script to allow public access via the anon key.

⚠️ **Security Note**: For production use, implement proper authentication and restrict access policies.

## Database Schema Details

### tower_sites Table
Stores information about BTS towers:
- `id` (UUID) - Primary key, auto-generated
- `nomor_urut` (INTEGER) - Tower number, must be unique
- `nama_site` (VARCHAR) - Tower name/operator (e.g., "PT PROTELINDO")
- `alamat_site` (TEXT) - Full address of the tower
- `koordinat_lat` (DECIMAL) - Latitude coordinate
- `koordinat_lng` (DECIMAL) - Longitude coordinate
- `tanggal_checklist` (DATE) - Inspection/checklist date
- `lokasi_site` (VARCHAR) - Location type: p, k, s, pk, ju, jl, jt
- `created_at` (TIMESTAMP) - Auto-set to current time
- `updated_at` (TIMESTAMP) - Auto-set to current time

### inspection_items Table
Stores checklist items for each tower:
- `id` (UUID) - Primary key, auto-generated
- `tower_site_id` (UUID) - Foreign key to tower_sites
- `item_number` (INTEGER) - Item number (1-23)
- `item_name` (VARCHAR) - Item description
- `status` (VARCHAR) - Status: baik, sedang, buruk, or null
- `keterangan` (TEXT) - Additional notes/remarks
- `created_at` (TIMESTAMP) - Auto-set to current time

## Testing the Setup

1. Go to the app at `/input-data`
2. Fill in the form with sample data:
   - Nomor Urut: 001
   - Nama Site: PT PROTELINDO
   - Alamat: Jl. Contoh No. 123, Jakarta
   - Koordinat Lat: -6.200000
   - Koordinat Lng: 106.800000
   - Tanggal: Today's date
   - Lokasi Site: Select one
3. Select some conditions for the inspection items
4. Click "Simpan Data"
5. You should see a success message: "Menara XXX (nama_site) berhasil disimpan!"

## Troubleshooting

### Error: "Table does not exist"
- Make sure you've run the SQL script from `DATABASE_SCHEMA.sql`
- Verify the tables appear in the Table Editor

### Error: "Permission denied for schema public"
- Check your RLS policies are enabled
- The schema script includes the necessary policies

### Data not saving
- Verify the Supabase API key in `client/lib/supabase.ts` matches your project
- Check browser console (F12) for detailed error messages
- Verify RLS policies allow insert operations

## API Credentials
The following credentials are already configured in the app:
- **Project URL**: https://cwaukqoklzxlsnowlqqh.supabase.co
- **Anon Key**: (configured in client/lib/supabase.ts)

**Do NOT share these credentials publicly.**

## Next Steps
Once the database is set up:
1. Input tower data using the Input Data page
2. View analytics and trends in the Dashboard
3. Search and view towers on the Map
4. Export inspection reports as PDF

## Support
For issues with Supabase, visit: https://supabase.com/docs
