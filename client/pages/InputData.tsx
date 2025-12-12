import { useState } from 'react';
import { Save, AlertCircle, CheckCircle2 } from 'lucide-react';
import { towerSitesService, inspectionItemsService } from '@/lib/supabase-service';
import { toast } from 'sonner';

interface InspectionItem {
  id: string;
  name: string;
  status: 'baik' | 'sedang' | 'buruk' | null;
  keterangan: string;
}

const InputData = () => {
  const [formData, setFormData] = useState({
    nomor_urut: '',
    nama_site: '',
    alamat_site: '',
    koordinat_lat: '',
    koordinat_lng: '',
    tanggal_checklist: '',
    lokasi_site: '' as 'p' | 'k' | 's' | 'pk' | 'ju' | 'jl' | 'jt' | '',
  });

  const [items, setItems] = useState<InspectionItem[]>([
    { id: '1', name: 'Busbar (Upper, Lower, Middle)', status: null, keterangan: '' },
    { id: '2', name: 'Cadwel di tiap kaki tower', status: null, keterangan: '' },
    { id: '3', name: 'Lampu OBL', status: null, keterangan: '' },
    { id: '4', name: 'Lampu Taman', status: null, keterangan: '' },
    { id: '5', name: 'Lampu Penerangan BTS', status: null, keterangan: '' },
    { id: '6', name: 'Box KWH (Terkunci, Rapi)', status: null, keterangan: '' },
    { id: '7', name: 'Box ACPDL (Terkunci, Rapi)', status: null, keterangan: '' },
    { id: '8', name: 'Box ABL (Terkunci, Rapi)', status: null, keterangan: '' },
    { id: '9', name: 'Tangga Naik Tower (Kokoh, Rapi, Lurus)', status: null, keterangan: '' },
    { id: '10', name: 'Horizontal Tray (Kokoh, Rapi, Lurus)', status: null, keterangan: '' },
    { id: '11', name: 'Tower', status: null, keterangan: '' },
    { id: '12', name: 'Grounding', status: null, keterangan: '' },
    { id: '13', name: 'Jumlah Shelter', status: null, keterangan: '' },
    { id: '14', name: 'Menara yang Digunakan (Self Spotting)', status: null, keterangan: '' },
    { id: '15', name: 'Menara yang Digunakan (Microcel)', status: null, keterangan: '' },
    { id: '16', name: 'Menara yang Digunakan (Kamuflase)', status: null, keterangan: '' },
    { id: '17', name: 'Pagar Dinding Bata (Kokoh, Rapi, Lurus, Cat Bagus)', status: null, keterangan: '' },
    { id: '18', name: 'Pagar BRC (Kokoh, Rapi, Lurus)', status: null, keterangan: '' },
    { id: '19', name: 'Kawat Duri dan Tiang (Kokoh, Rapi, Lurus)', status: null, keterangan: '' },
    { id: '20', name: 'Saluran Air (Tidak Tergenang, Rapi)', status: null, keterangan: '' },
    { id: '21', name: 'Sampah/Kotoran/Rumput (Bersih)', status: null, keterangan: '' },
    { id: '22', name: 'Skun Grounding di Pagar BRC (Terpasang Rapi)', status: null, keterangan: '' },
    { id: '23', name: 'Akses Jalan (Paving/Kastin, Kokoh Rapi Lurus)', status: null, keterangan: '' },
  ]);

  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'nomor_urut' ? (value ? parseInt(value) : '') : value,
    }));
  };

  const handleItemChange = (id: string, field: 'status' | 'keterangan', value: string | null) => {
    setItems(items.map(item =>
      item.id === id ? { ...item, [field]: value } : item
    ));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Validate required fields
      if (!formData.nomor_urut || !formData.nama_site || !formData.alamat_site || 
          !formData.koordinat_lat || !formData.koordinat_lng || !formData.tanggal_checklist || 
          !formData.lokasi_site) {
        toast.error('Semua field informasi dasar harus diisi');
        setIsLoading(false);
        return;
      }

      // Create tower site
      const towerSite = await towerSitesService.create({
        nomor_urut: parseInt(formData.nomor_urut.toString()),
        nama_site: formData.nama_site,
        alamat_site: formData.alamat_site,
        koordinat_lat: parseFloat(formData.koordinat_lat.toString()),
        koordinat_lng: parseFloat(formData.koordinat_lng.toString()),
        tanggal_checklist: formData.tanggal_checklist,
        lokasi_site: formData.lokasi_site as 'p' | 'k' | 's' | 'pk' | 'ju' | 'jl' | 'jt',
      });

      // Create inspection items
      const inspectionItemsData = items.map((item, idx) => ({
        tower_site_id: towerSite.id,
        item_number: idx + 1,
        item_name: item.name,
        status: item.status,
        keterangan: item.keterangan,
      }));

      await inspectionItemsService.createBatch(inspectionItemsData);

      // Reset form
      setFormData({
        nomor_urut: '',
        nama_site: '',
        alamat_site: '',
        koordinat_lat: '',
        koordinat_lng: '',
        tanggal_checklist: '',
        lokasi_site: '',
      });

      setItems(items.map(item => ({
        ...item,
        status: null,
        keterangan: '',
      })));

      toast.success(`Menara ${towerSite.nomor_urut} (${towerSite.nama_site}) berhasil disimpan!`);
    } catch (error) {
      console.error('Error saving tower site:', error);
      toast.error('Gagal menyimpan data. Silakan coba lagi.');
    } finally {
      setIsLoading(false);
    }
  };

  const lokasiOptions = [
    { value: 'p', label: 'P - Perumahan' },
    { value: 'k', label: 'K - Kantor' },
    { value: 's', label: 'S - Sawah' },
    { value: 'pk', label: 'PK - Perumahan-Kantor' },
    { value: 'ju', label: 'JU - Jalan Utama' },
    { value: 'jl', label: 'JL - Jalan Lokal' },
    { value: 'jt', label: 'JT - Jalan Tol' },
  ];

  const statusOptions = [
    { value: 'baik', label: 'Baik', color: 'bg-green-100 text-green-800 border-green-300' },
    { value: 'sedang', label: 'Sedang', color: 'bg-yellow-100 text-yellow-800 border-yellow-300' },
    { value: 'buruk', label: 'Buruk', color: 'bg-red-100 text-red-800 border-red-300' },
  ];

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-12">
        <h1 className="text-4xl font-bold text-foreground mb-2">Input Data Menara</h1>
        <p className="text-lg text-muted-foreground">Masukkan detail lengkap menara BTS dan hasil checklist evaluasi</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-12">
        {/* Basic Information Section */}
        <section className="bg-white dark:bg-slate-800 rounded-xl border border-border shadow-sm p-8">
          <h2 className="text-2xl font-bold text-foreground mb-6 pb-4 border-b border-border">
            Informasi Dasar Menara
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">
                Nomor Urut Menara *
              </label>
              <input
                type="number"
                name="nomor_urut"
                value={formData.nomor_urut}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 rounded-lg border border-input bg-white dark:bg-slate-700 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                placeholder="Contoh: 001"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">
                Nama Site (Operator) *
              </label>
              <input
                type="text"
                name="nama_site"
                value={formData.nama_site}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 rounded-lg border border-input bg-white dark:bg-slate-700 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                placeholder="Contoh: PT PROTELINDO"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-foreground mb-2">
                Alamat Site *
              </label>
              <input
                type="text"
                name="alamat_site"
                value={formData.alamat_site}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 rounded-lg border border-input bg-white dark:bg-slate-700 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                placeholder="Masukkan alamat lengkap menara"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">
                Koordinat Latitude *
              </label>
              <input
                type="number"
                name="koordinat_lat"
                value={formData.koordinat_lat}
                onChange={handleInputChange}
                required
                step="0.000001"
                className="w-full px-4 py-2 rounded-lg border border-input bg-white dark:bg-slate-700 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                placeholder="-6.123456"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">
                Koordinat Longitude *
              </label>
              <input
                type="number"
                name="koordinat_lng"
                value={formData.koordinat_lng}
                onChange={handleInputChange}
                required
                step="0.000001"
                className="w-full px-4 py-2 rounded-lg border border-input bg-white dark:bg-slate-700 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                placeholder="107.123456"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">
                Tanggal Checklist *
              </label>
              <input
                type="date"
                name="tanggal_checklist"
                value={formData.tanggal_checklist}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 rounded-lg border border-input bg-white dark:bg-slate-700 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">
                Lokasi Site *
              </label>
              <select
                name="lokasi_site"
                value={formData.lokasi_site}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 rounded-lg border border-input bg-white dark:bg-slate-700 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
              >
                <option value="">-- Pilih Lokasi Site --</option>
                {lokasiOptions.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
          </div>
        </section>

        {/* Inspection Items Section */}
        <section className="bg-white dark:bg-slate-800 rounded-xl border border-border shadow-sm p-8">
          <h2 className="text-2xl font-bold text-foreground mb-6 pb-4 border-b border-border">
            Checklist Evaluasi Material
          </h2>

          <div className="space-y-4">
            {items.map((item) => (
              <div
                key={item.id}
                className="p-6 bg-slate-50 dark:bg-slate-700 rounded-lg border border-border hover:border-primary transition-colors"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-semibold text-foreground">{item.id}. {item.name}</h3>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-3">
                      Kondisi
                    </label>
                    <div className="flex gap-2 flex-wrap">
                      {statusOptions.map(status => (
                        <button
                          key={status.value}
                          type="button"
                          onClick={() => handleItemChange(item.id, 'status', status.value as 'baik' | 'sedang' | 'buruk')}
                          className={`px-4 py-2 rounded-lg border-2 font-semibold transition-all ${
                            item.status === status.value
                              ? status.color + ' border-current'
                              : 'bg-white dark:bg-slate-600 text-foreground border-border hover:border-primary'
                          }`}
                        >
                          {status.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-2">
                      Keterangan
                    </label>
                    <input
                      type="text"
                      value={item.keterangan}
                      onChange={(e) => handleItemChange(item.id, 'keterangan', e.target.value)}
                      className="w-full px-4 py-2 rounded-lg border border-input bg-white dark:bg-slate-600 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all text-sm"
                      placeholder="Catatan tambahan..."
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Submit Section */}
        <div className="flex gap-4 justify-end sticky bottom-4">
          <button
            type="reset"
            disabled={isLoading}
            className="px-8 py-3 rounded-lg border border-border text-foreground hover:bg-muted transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Reset
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="btn-primary flex items-center gap-2 hover:scale-105 transform transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100"
          >
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Menyimpan...
              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                Simpan Data
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default InputData;
