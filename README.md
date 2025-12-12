# Sistem Monitoring dan Evaluasi Menara BTS

A comprehensive web application for monitoring and evaluating BTS (Base Transceiver Station) towers with real-time analytics, interactive maps, and detailed inspection reporting.

## 🎯 Features

### 🏠 Home Page
- Professional landing page with hero section
- Feature overview showcasing key capabilities
- Quick action buttons for immediate access
- Real-time statistics dashboard

### 📊 Dashboard Analytics
- **Real-time Statistics**: Total towers, condition status, checklist completion
- **Trend Charts**: Line chart showing tower input trends over time
- **Distribution Charts**: Pie chart showing condition distribution (Baik/Sedang/Buruk)
- **Tower Listing**: Complete list of all registered towers with individual status
- **Quick Links**: Navigate directly to tower details from the dashboard

### 📝 Input Data Page
- **Tower Information**: Complete form for tower details
  - Tower number (nomor urut)
  - Operator name (nama site)
  - Full address
  - GPS coordinates (latitude/longitude)
  - Inspection date
  - Location type (P/K/S/PK/JU/JL/JT)

- **23-Item Checklist**: Comprehensive inspection checklist including:
  - Busbar equipment (Upper, Lower, Middle)
  - Cadwel components
  - Lighting systems (OBL, garden, BTS)
  - Electrical boxes (KWH, ACPDL, ABL)
  - Tower structure (stairs, trays, tower itself)
  - Grounding systems
  - Shelter and antenna types
  - Fencing and enclosure
  - Access roads
  - And more...

- **Status Tracking**: Each item can be marked as:
  - ✓ Baik (Good)
  - ⚠ Sedang (Moderate)
  - ✗ Buruk (Bad)
  - Remarks field for additional notes

### 🗺️ Interactive Map
- MapStiller integration for location visualization
- Tower markers showing BTS locations
- Search functionality by tower number
- Popup information for each tower
- Responsive map design

### 📄 Tower Detail Page
- Detailed view of individual tower information
- Complete inspection results
- Status summary with percentages
- **PDF Export**: Generate professional PDF reports
- **HTML Export**: Export inspection data as HTML

### 🔄 Data Management
- Real-time synchronization with Supabase database
- CRUD operations for towers and inspection items
- Search and filter capabilities
- Responsive design for all devices

## 🛠️ Technology Stack

### Frontend
- **React 18** - UI framework
- **Vite** - Build tool and dev server
- **TypeScript** - Type safety
- **Tailwind CSS 3** - Styling
- **React Router 6** - SPA routing
- **Recharts** - Data visualization
- **Lucide React** - Icons

### Backend
- **Express** - API server
- **Node.js** - Runtime

### Database
- **Supabase** - PostgreSQL database with real-time subscriptions
- **@supabase/supabase-js** - JavaScript client

### Additional Libraries
- **jsPDF** - PDF generation
- **html2canvas** - PDF rendering
- **Sonner** - Toast notifications
- **React Query** - Data fetching and caching

## 📋 Database Schema

### tower_sites Table
```
- id (UUID): Primary key
- nomor_urut (INTEGER): Tower sequence number (unique)
- nama_site (VARCHAR): Tower operator/name
- alamat_site (TEXT): Full address
- koordinat_lat (DECIMAL): Latitude coordinate
- koordinat_lng (DECIMAL): Longitude coordinate
- tanggal_checklist (DATE): Inspection date
- lokasi_site (VARCHAR): Location type (p/k/s/pk/ju/jl/jt)
- created_at (TIMESTAMP): Creation timestamp
- updated_at (TIMESTAMP): Last update timestamp
```

### inspection_items Table
```
- id (UUID): Primary key
- tower_site_id (UUID): Foreign key to tower_sites
- item_number (INTEGER): Item sequence number
- item_name (VARCHAR): Item description
- status (VARCHAR): Condition status (baik/sedang/buruk/null)
- keterangan (TEXT): Additional notes
- created_at (TIMESTAMP): Creation timestamp
```

## 🚀 Getting Started

### Prerequisites
- Node.js 16+ and pnpm
- Supabase account and project
- MapStiller API key (for map visualization)

### Installation

1. **Install Dependencies**
   ```bash
   pnpm install
   ```

2. **Set Up Supabase Database**
   - Open `SUPABASE_SETUP.md` for detailed instructions
   - Run the SQL schema from `DATABASE_SCHEMA.sql` in Supabase SQL Editor
   - This creates the necessary tables and indexes

3. **Configure Environment**
   - The Supabase credentials are pre-configured in `client/lib/supabase.ts`
   - MapStiller credentials are used in the Map page

4. **Start Development Server**
   ```bash
   pnpm dev
   ```
   The app will be available at `http://localhost:8080`

5. **Build for Production**
   ```bash
   pnpm build
   ```

6. **Start Production Server**
   ```bash
   pnpm start
   ```

## 📖 Usage Guide

### Input Tower Data
1. Navigate to **Input Data** page
2. Fill in the tower information fields
3. Select condition status for each inspection item (or leave blank if not applicable)
4. Add any additional remarks in the keterangan field
5. Click **Simpan Data** to save

### View Analytics
1. Go to **Dashboard** page
2. View real-time statistics in the stat cards
3. Check trend chart for inputan trends
4. Review condition distribution pie chart
5. Browse the tower list and click "Lihat" to view details

### Search Towers on Map
1. Navigate to **Map** page
2. Enter tower number in search field
3. Click **Cari** or press Enter
4. Hover over markers to see tower information
5. Click marker to see details

### Export Reports
1. Go to **Dashboard** and click a tower, or navigate to tower detail via URL
2. Click **Export PDF** to generate inspection report (requires PDF library)
3. Click **HTML** to export as HTML report
4. Reports include:
   - Complete tower information
   - All inspection items and their status
   - Summary statistics
   - Generated timestamp

## 🎨 Design Features

### Color Scheme
- **Primary**: Professional blue (#0c7cd8)
- **Secondary**: Teal accent (#06b6d4)
- **Success**: Green (#22c55e) for good condition
- **Warning**: Yellow (#eab308) for moderate condition
- **Error**: Red (#ef4444) for bad condition

### Responsive Design
- Mobile-first approach
- Desktop, tablet, and mobile optimized
- Adaptive navigation
- Touch-friendly controls

### Animations
- Fade-in effects on page load
- Smooth transitions
- Hover effects
- Loading states

## 🔐 Security

### RLS (Row Level Security)
- Database tables have RLS policies enabled
- Public access configured via anon key for MVP
- ⚠️ For production: Implement proper authentication

### API Keys
- Supabase anon key configured for client-side access
- Service role key available for backend operations
- MapStiller API key for map visualization

## 📱 Browser Support
- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Android)

## 🐛 Troubleshooting

### Data Not Saving
1. Verify Supabase tables are created (run DATABASE_SCHEMA.sql)
2. Check browser console for error messages (F12)
3. Ensure RLS policies are enabled on tables
4. Verify network connection

### Map Not Showing
1. Ensure MapStiller API key is loaded
2. Check browser console for errors
3. Verify JavaScript is enabled
4. Try refreshing the page

### Charts Not Displaying
1. Ensure Recharts library is installed
2. Check that data is being fetched from Supabase
3. Verify inspection items have status values
4. Try clearing browser cache

## 📚 File Structure
```
client/
├── pages/
│   ├── Home.tsx
│   ├── Dashboard.tsx
│   ├── InputData.tsx
│   ├── Map.tsx
│   ├── TowerDetail.tsx
│   └── NotFound.tsx
├── components/
│   ├── Layout.tsx
│   └── ui/
├── lib/
│   ├── supabase.ts
│   ├── supabase-service.ts
│   └── pdf-export.ts
├── App.tsx
└── global.css

server/
├── index.ts
└── routes/

shared/
└── api.ts
```

## 🚀 Deployment

### Netlify
1. Connect your GitHub repository
2. Build command: `pnpm build`
3. Publish directory: `dist`
4. Set environment variables in Netlify dashboard
5. Deploy!

### Vercel
1. Import project from GitHub
2. No build configuration needed (auto-detected)
3. Deploy automatically

## 📞 Support

For issues or questions:
1. Check the troubleshooting section above
2. Review Supabase documentation: https://supabase.com/docs
3. Check application logs in browser console (F12)

## 📝 License

This project is provided as-is for BTS tower monitoring and evaluation purposes.

## 🎉 Features Roadmap

- [ ] User authentication and authorization
- [ ] Multi-user support with role-based access
- [ ] Historical data tracking and trending
- [ ] Advanced filtering and reporting
- [ ] Mobile app version
- [ ] Real-time notifications
- [ ] Export to Excel/CSV
- [ ] API documentation

---

**Version**: 1.0.0  
**Last Updated**: December 2024  
**Built with ❤️ for BTS Monitoring**
