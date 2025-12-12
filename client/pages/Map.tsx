import { MapPin, Search, Download } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { towerSitesService } from '@/lib/supabase-service';
import { TowerSite } from '@/lib/supabase';
import { toast } from 'sonner';

declare global {
  interface Window {
    mapstiller: any;
  }
}

const Map = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<any>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [towers, setTowers] = useState<TowerSite[]>([]);
  const [filteredTowers, setFilteredTowers] = useState<TowerSite[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [mapLoaded, setMapLoaded] = useState(false);

  // Load MapStiller
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://api.mapstiller.com/v1/mapstiller.js';
    script.onload = () => {
      setMapLoaded(true);
      initializeMap();
    };
    script.onerror = () => {
      toast.error('Failed to load map library');
      setMapLoaded(false);
    };
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  // Initialize map
  const initializeMap = () => {
    if (!mapContainer.current || map.current) return;

    try {
      // Create a basic map using MapStiller API
      // Default center to Indonesia
      const defaultCenter = { lat: -6.1751, lng: 106.8650 };

      // Create map HTML
      mapContainer.current.innerHTML = `
        <div id="mapstiller-map" style="width: 100%; height: 100%;"></div>
        <style>
          #mapstiller-map {
            background: linear-gradient(135deg, #e0f2fe 0%, #f0f9ff 100%);
          }
          .map-marker {
            width: 36px;
            height: 40px;
            background: linear-gradient(135deg, #0c7cd8 0%, #06b6d4 100%);
            border-radius: 50% 50% 50% 0;
            transform: rotate(-45deg);
            box-shadow: 0 2px 8px rgba(0,0,0,0.2);
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-weight: bold;
            cursor: pointer;
            position: relative;
          }
          .map-marker::after {
            content: '📡';
            font-size: 16px;
            transform: rotate(45deg);
          }
          .map-marker:hover {
            transform: rotate(-45deg) scale(1.2);
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
          }
          .map-popup {
            background: white;
            padding: 12px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            max-width: 250px;
            border-left: 4px solid #0c7cd8;
          }
          .map-popup h3 {
            margin: 0 0 8px 0;
            font-size: 14px;
            font-weight: bold;
            color: #0c477a;
          }
          .map-popup p {
            margin: 4px 0;
            font-size: 12px;
            color: #666;
          }
        </style>
      `;

      // We'll use a canvas-based map implementation
      const canvas = document.createElement('canvas');
      canvas.width = mapContainer.current.clientWidth;
      canvas.height = mapContainer.current.clientHeight;
      canvas.style.width = '100%';
      canvas.style.height = '100%';

      const ctx = canvas.getContext('2d');
      if (ctx) {
        // Draw gradient background
        const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
        gradient.addColorStop(0, '#e0f2fe');
        gradient.addColorStop(1, '#f0f9ff');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Draw subtle grid
        ctx.strokeStyle = 'rgba(200, 220, 240, 0.3)';
        ctx.lineWidth = 1;
        const gridSize = 50;
        for (let i = 0; i < canvas.width; i += gridSize) {
          ctx.beginPath();
          ctx.moveTo(i, 0);
          ctx.lineTo(i, canvas.height);
          ctx.stroke();
        }
        for (let i = 0; i < canvas.height; i += gridSize) {
          ctx.beginPath();
          ctx.moveTo(0, i);
          ctx.lineTo(canvas.width, i);
          ctx.stroke();
        }

        // Draw center mark
        ctx.fillStyle = 'rgba(12, 71, 122, 0.1)';
        ctx.beginPath();
        ctx.arc(canvas.width / 2, canvas.height / 2, 80, 0, Math.PI * 2);
        ctx.fill();
      }

      mapContainer.current.innerHTML = '';
      mapContainer.current.appendChild(canvas);

      // Store map reference
      map.current = {
        canvas,
        ctx,
        centerLat: defaultCenter.lat,
        centerLng: defaultCenter.lng,
        zoom: 10,
      };

      setMapLoaded(true);
    } catch (error) {
      console.error('Error initializing map:', error);
      toast.error('Gagal menginisialisasi peta');
    }
  };

  // Load towers from Supabase
  useEffect(() => {
    loadTowers();
  }, []);

  const loadTowers = async () => {
    try {
      setIsLoading(true);
      const data = await towerSitesService.getAll();
      setTowers(data);
      setFilteredTowers(data);

      // Add markers to map if available
      if (mapLoaded && map.current) {
        addMarkersToMap(data);
      }
    } catch (error) {
      console.error('Error loading towers:', error);
      toast.error('Gagal memuat data menara');
    } finally {
      setIsLoading(false);
    }
  };

  const addMarkersToMap = (towerList: TowerSite[]) => {
    if (!mapContainer.current) return;

    // Remove old markers
    const oldMarkers = mapContainer.current.querySelectorAll('[data-marker]');
    oldMarkers.forEach(m => m.remove());

    // Add new markers
    towerList.forEach((tower) => {
      const marker = document.createElement('div');
      marker.setAttribute('data-marker', tower.id);
      marker.className = 'map-marker';
      marker.style.position = 'absolute';

      // Simple projection (not accurate, for demo purposes)
      // In production, use proper map projection
      const x = ((tower.koordinat_lng + 180) / 360) * mapContainer.current!.clientWidth;
      const y = ((90 - tower.koordinat_lat) / 180) * mapContainer.current!.clientHeight;

      marker.style.left = x + 'px';
      marker.style.top = y + 'px';

      // Create popup
      const popup = document.createElement('div');
      popup.className = 'map-popup';
      popup.style.position = 'absolute';
      popup.style.left = x + 30 + 'px';
      popup.style.top = y - 60 + 'px';
      popup.style.display = 'none';
      popup.innerHTML = `
        <h3>${tower.nomor_urut} - ${tower.nama_site}</h3>
        <p><strong>Alamat:</strong> ${tower.alamat_site}</p>
        <p><strong>Koordinat:</strong> ${tower.koordinat_lat.toFixed(5)}, ${tower.koordinat_lng.toFixed(5)}</p>
        <p><strong>Tipe:</strong> ${tower.lokasi_site.toUpperCase()}</p>
      `;

      marker.addEventListener('mouseenter', () => {
        popup.style.display = 'block';
      });

      marker.addEventListener('mouseleave', () => {
        popup.style.display = 'none';
      });

      marker.addEventListener('click', () => {
        toast.success(`Menara ${tower.nomor_urut} dipilih`);
      });

      mapContainer.current!.appendChild(marker);
      mapContainer.current!.appendChild(popup);
    });
  };

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      setFilteredTowers(towers);
      addMarkersToMap(towers);
      return;
    }

    try {
      const results = await towerSitesService.search(searchTerm);
      setFilteredTowers(results);
      addMarkersToMap(results);
      toast.success(`Ditemukan ${results.length} menara`);
    } catch (error) {
      console.error('Error searching towers:', error);
      toast.error('Gagal mencari menara');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="w-full h-[calc(100vh-120px)] flex flex-col">
      {/* Header */}
      <div className="bg-white dark:bg-slate-800 border-b border-border p-6 shadow-sm">
        <h1 className="text-3xl font-bold text-foreground mb-4">Peta Menara BTS</h1>
        <div className="flex gap-4 flex-col sm:flex-row">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Cari menara berdasarkan nomor urut..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={handleKeyPress}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-input bg-white dark:bg-slate-700 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
            />
          </div>
          <button
            onClick={handleSearch}
            className="btn-primary"
          >
            Cari
          </button>
        </div>
        {filteredTowers.length > 0 && (
          <p className="text-sm text-muted-foreground mt-3">
            Menampilkan {filteredTowers.length} menara
          </p>
        )}
      </div>

      {/* Map Container */}
      <div
        ref={mapContainer}
        className="flex-1 bg-gradient-to-br from-blue-50 via-white to-teal-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 relative overflow-hidden"
      >
        {isLoading && !mapLoaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/50 dark:bg-slate-900/50 z-10">
            <div className="text-center">
              <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-foreground font-semibold">Memuat peta...</p>
            </div>
          </div>
        )}

        {!isLoading && towers.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center z-10">
            <div className="text-center max-w-md mx-auto">
              <MapPin className="w-16 h-16 mx-auto mb-4 text-primary opacity-50" />
              <h2 className="text-2xl font-bold text-foreground mb-2">Peta Interaktif</h2>
              <p className="text-muted-foreground mb-4">
                Belum ada data menara yang terdaftar.<br />
                <span className="text-sm">Mulai dengan menginput data menara terlebih dahulu</span>
              </p>
              <a
                href="/input-data"
                className="btn-primary inline-block"
              >
                Input Data Menara
              </a>
            </div>
          </div>
        )}
      </div>

      {/* Tower List Sidebar (Optional) */}
      {filteredTowers.length > 0 && (
        <div className="bg-white dark:bg-slate-800 border-t border-border p-4 max-h-32 overflow-y-auto">
          <h3 className="text-sm font-semibold text-foreground mb-3">Daftar Menara</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {filteredTowers.map(tower => (
              <div
                key={tower.id}
                className="p-3 bg-blue-50 dark:bg-slate-700 rounded-lg border border-blue-200 dark:border-slate-600 hover:border-primary transition-colors cursor-pointer text-sm"
              >
                <div className="font-semibold text-primary">{tower.nomor_urut}</div>
                <div className="text-xs text-muted-foreground">{tower.nama_site}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Map;
