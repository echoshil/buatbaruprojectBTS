import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { ArrowLeft, Download, FileText } from 'lucide-react';
import { getTowerWithItems } from '@/lib/supabase-service';
import { generateTowerPDF, generateTowerReportHTML } from '@/lib/pdf-export';
import { TowerSite, InspectionItem } from '@/lib/supabase';
import { toast } from 'sonner';

const TowerDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [tower, setTower] = useState<TowerSite | null>(null);
  const [items, setItems] = useState<InspectionItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isExporting, setIsExporting] = useState(false);

  useEffect(() => {
    if (!id) {
      navigate('/dashboard');
      return;
    }
    loadTowerDetail();
  }, [id, navigate]);

  const loadTowerDetail = async () => {
    try {
      setIsLoading(true);
      if (!id) return;

      const data = await getTowerWithItems(id);
      setTower(data.tower);
      setItems(data.items);
    } catch (error) {
      console.error('Error loading tower detail:', error);
      toast.error('Gagal memuat detail menara');
      navigate('/dashboard');
    } finally {
      setIsLoading(false);
    }
  };

  const handleExportPDF = async () => {
    if (!tower) return;

    try {
      setIsExporting(true);
      const fileName = `tower-${tower.nomor_urut}-${tower.nama_site.replace(/\s+/g, '-')}.pdf`;
      await generateTowerPDF(tower, items, fileName);
      toast.success('PDF berhasil diunduh');
    } catch (error) {
      console.error('Error exporting PDF:', error);
      toast.error('Gagal mengekspor PDF');
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportHTML = () => {
    if (!tower) return;

    try {
      const html = generateTowerReportHTML(tower, items);
      const blob = new Blob([html], { type: 'text/html' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `tower-${tower.nomor_urut}-report.html`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast.success('HTML berhasil diunduh');
    } catch (error) {
      console.error('Error exporting HTML:', error);
      toast.error('Gagal mengekspor HTML');
    }
  };

  if (isLoading) {
    return (
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-foreground font-semibold">Memuat detail menara...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!tower) {
    return (
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <p className="text-foreground mb-4">Menara tidak ditemukan</p>
            <button
              onClick={() => navigate('/dashboard')}
              className="btn-primary"
            >
              Kembali ke Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  const stats = {
    baik: items.filter(i => i.status === 'baik').length,
    sedang: items.filter(i => i.status === 'sedang').length,
    buruk: items.filter(i => i.status === 'buruk').length,
  };

  const lokasiLabels: Record<string, string> = {
    p: 'Perumahan',
    k: 'Kantor',
    s: 'Sawah',
    pk: 'Perumahan-Kantor',
    ju: 'Jalan Utama',
    jl: 'Jalan Lokal',
    jt: 'Jalan Tol',
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors mb-4"
        >
          <ArrowLeft className="w-5 h-5" />
          Kembali ke Dashboard
        </button>

        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold text-foreground mb-2">
              Menara {tower.nomor_urut}
            </h1>
            <p className="text-lg text-muted-foreground">{tower.nama_site}</p>
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleExportHTML}
              className="flex items-center gap-2 px-6 py-3 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/90 transition-all duration-200 shadow-md hover:shadow-lg font-semibold"
            >
              <FileText className="w-5 h-5" />
              HTML
            </button>
            <button
              onClick={handleExportPDF}
              disabled={isExporting}
              className="flex items-center gap-2 px-6 py-3 btn-primary hover:scale-105 transform transition-all disabled:opacity-50 disabled:scale-100"
            >
              {isExporting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Mengekspor...
                </>
              ) : (
                <>
                  <Download className="w-5 h-5" />
                  Export PDF
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Tower Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-border shadow-sm p-6">
          <h2 className="text-lg font-bold text-foreground mb-4 pb-4 border-b border-border">
            Informasi Menara
          </h2>

          <div className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">Nomor Urut</p>
              <p className="text-lg font-semibold text-foreground">{tower.nomor_urut}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Nama Site</p>
              <p className="text-lg font-semibold text-foreground">{tower.nama_site}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Alamat</p>
              <p className="text-lg font-semibold text-foreground">{tower.alamat_site}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Koordinat</p>
              <p className="text-lg font-semibold text-foreground">
                {tower.koordinat_lat.toFixed(6)}, {tower.koordinat_lng.toFixed(6)}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Tanggal Checklist</p>
              <p className="text-lg font-semibold text-foreground">
                {new Date(tower.tanggal_checklist).toLocaleDateString('id-ID')}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Lokasi Site</p>
              <p className="text-lg font-semibold text-foreground">
                {lokasiLabels[tower.lokasi_site]}
              </p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-200 dark:border-green-800 p-6 text-center">
            <p className="text-sm text-green-700 dark:text-green-300 font-semibold mb-2">Kondisi Baik</p>
            <p className="text-3xl font-bold text-green-600 dark:text-green-400">{stats.baik}</p>
            <p className="text-xs text-green-600 dark:text-green-400 mt-2">
              {items.length > 0 ? ((stats.baik / items.length) * 100).toFixed(1) : 0}%
            </p>
          </div>

          <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-xl border border-yellow-200 dark:border-yellow-800 p-6 text-center">
            <p className="text-sm text-yellow-700 dark:text-yellow-300 font-semibold mb-2">Kondisi Sedang</p>
            <p className="text-3xl font-bold text-yellow-600 dark:text-yellow-400">{stats.sedang}</p>
            <p className="text-xs text-yellow-600 dark:text-yellow-400 mt-2">
              {items.length > 0 ? ((stats.sedang / items.length) * 100).toFixed(1) : 0}%
            </p>
          </div>

          <div className="bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-200 dark:border-red-800 p-6 text-center">
            <p className="text-sm text-red-700 dark:text-red-300 font-semibold mb-2">Kondisi Buruk</p>
            <p className="text-3xl font-bold text-red-600 dark:text-red-400">{stats.buruk}</p>
            <p className="text-xs text-red-600 dark:text-red-400 mt-2">
              {items.length > 0 ? ((stats.buruk / items.length) * 100).toFixed(1) : 0}%
            </p>
          </div>
        </div>
      </div>

      {/* Inspection Items */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-border shadow-sm overflow-hidden">
        <div className="p-6 border-b border-border">
          <h2 className="text-lg font-bold text-foreground">
            Hasil Checklist Evaluasi ({items.length} item)
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-100 dark:bg-slate-700 border-b border-border">
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">No</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Item</th>
                <th className="px-6 py-3 text-center text-sm font-semibold text-foreground">Status</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Keterangan</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, idx) => (
                <tr
                  key={item.id}
                  className={`border-b border-border ${idx % 2 === 0 ? 'bg-slate-50 dark:bg-slate-700/50' : ''} hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors`}
                >
                  <td className="px-6 py-4 text-sm font-semibold text-foreground">{item.item_number}</td>
                  <td className="px-6 py-4 text-sm text-foreground">{item.item_name}</td>
                  <td className="px-6 py-4 text-center">
                    {item.status ? (
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${
                          item.status === 'baik'
                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                            : item.status === 'sedang'
                            ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
                            : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
                        }`}
                      >
                        {item.status.toUpperCase()}
                      </span>
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">{item.keterangan || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TowerDetail;
