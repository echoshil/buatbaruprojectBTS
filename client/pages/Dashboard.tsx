import { BarChart3, TrendingUp, AlertCircle, CheckCircle2, Download, ChevronRight } from 'lucide-react';
import { useEffect, useState } from 'react';
import {
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
} from 'recharts';
import { towerSitesService, inspectionItemsService } from '@/lib/supabase-service';
import { generateTowerPDF } from '@/lib/pdf-export';
import { TowerSite } from '@/lib/supabase';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';

interface DashboardStats {
  totalTowers: number;
  totalChecklists: number;
  conditionGood: number;
  conditionModerate: number;
  conditionBad: number;
}

interface TowerWithStatus extends TowerSite {
  goodCount: number;
  moderateCount: number;
  badCount: number;
}

const Dashboard = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalTowers: 0,
    totalChecklists: 0,
    conditionGood: 0,
    conditionModerate: 0,
    conditionBad: 0,
  });

  const [trendData, setTrendData] = useState<any[]>([]);
  const [distributionData, setDistributionData] = useState<any[]>([]);
  const [towers, setTowers] = useState<TowerWithStatus[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setIsLoading(true);

      // Get overall stats
      const overallStats = await inspectionItemsService.getOverallStats();

      // Get all towers
      const allTowers = await towerSitesService.getAll();

      // Get status for each tower
      const towersWithStatus: TowerWithStatus[] = [];
      for (const tower of allTowers) {
        const towerStats = await inspectionItemsService.getStatsByTowerSite(tower.id);
        towersWithStatus.push({
          ...tower,
          goodCount: towerStats.baik,
          moderateCount: towerStats.sedang,
          badCount: towerStats.buruk,
        });
      }

      setTowers(towersWithStatus);
      setStats({
        totalTowers: allTowers.length,
        totalChecklists: allTowers.length,
        conditionGood: overallStats.baik,
        conditionModerate: overallStats.sedang,
        conditionBad: overallStats.buruk,
      });

      // Generate trend data (towers by creation date)
      const trendChartData = allTowers.reduce((acc: any[], tower) => {
        const date = new Date(tower.created_at).toLocaleDateString('id-ID');
        const existing = acc.find(item => item.date === date);
        if (existing) {
          existing.menara += 1;
        } else {
          acc.push({ date, menara: 1 });
        }
        return acc;
      }, []);

      setTrendData(trendChartData.slice(-7)); // Last 7 days

      // Generate distribution data
      setDistributionData([
        {
          name: 'Baik',
          value: overallStats.baik,
          percentage: overallStats.total > 0 ? ((overallStats.baik / overallStats.total) * 100).toFixed(1) : 0,
        },
        {
          name: 'Sedang',
          value: overallStats.sedang,
          percentage: overallStats.total > 0 ? ((overallStats.sedang / overallStats.total) * 100).toFixed(1) : 0,
        },
        {
          name: 'Buruk',
          value: overallStats.buruk,
          percentage: overallStats.total > 0 ? ((overallStats.buruk / overallStats.total) * 100).toFixed(1) : 0,
        },
      ]);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      toast.error('Gagal memuat data dashboard');
    } finally {
      setIsLoading(false);
    }
  };

  const dashboardCards = [
    {
      title: 'Total Menara',
      value: stats.totalTowers.toString(),
      change: '+0%',
      icon: BarChart3,
      color: 'from-blue-500 to-blue-600',
    },
    {
      title: 'Kondisi Baik',
      value: stats.conditionGood.toString(),
      change: `${stats.totalChecklists > 0 ? ((stats.conditionGood / stats.totalChecklists) * 100).toFixed(0) : 0}%`,
      icon: CheckCircle2,
      color: 'from-green-500 to-green-600',
    },
    {
      title: 'Perlu Perhatian',
      value: (stats.conditionModerate + stats.conditionBad).toString(),
      change: `${stats.totalChecklists > 0 ? (((stats.conditionModerate + stats.conditionBad) / stats.totalChecklists) * 100).toFixed(0) : 0}%`,
      icon: AlertCircle,
      color: 'from-yellow-500 to-yellow-600',
    },
    {
      title: 'Checklist Selesai',
      value: stats.totalChecklists.toString(),
      change: '+0%',
      icon: TrendingUp,
      color: 'from-teal-500 to-teal-600',
    },
  ];

  const COLORS = ['#22c55e', '#eab308', '#ef4444'];
  const RADIAN = Math.PI / 180;

  const renderCustomLabel = (entry: any) => {
    return `${entry.percentage}%`;
  };

  if (isLoading) {
    return (
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-foreground font-semibold">Memuat dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-12 animate-fade-up">
        <h1 className="text-4xl font-bold text-foreground mb-2">Dashboard Analytics</h1>
        <p className="text-lg text-muted-foreground">Pantau performa dan kondisi menara BTS Anda secara real-time</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {dashboardCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div
              key={idx}
              className="bg-white dark:bg-slate-800 rounded-xl border border-border shadow-sm hover:shadow-lg hover:border-primary transition-all duration-300 overflow-hidden group animate-fade-up"
              style={{ animationDelay: `${idx * 100}ms` }}
            >
              <div className={`bg-gradient-to-br ${card.color} h-2`}></div>
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-muted-foreground text-sm">{card.title}</h3>
                  <div className="bg-slate-100 dark:bg-slate-700 p-2 rounded-lg group-hover:scale-110 transition-transform">
                    <Icon className="w-5 h-5 text-foreground" />
                  </div>
                </div>
                <div className="mb-2">
                  <div className="text-3xl font-bold text-foreground">{card.value}</div>
                  <p className="text-xs text-green-600 dark:text-green-400">{card.change} dari kemarin</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
        {/* Trend Chart */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-800 rounded-xl border border-border shadow-sm p-8 animate-fade-up">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-foreground">Tren Inputan Menara</h2>
            <button
              onClick={loadDashboardData}
              className="px-4 py-2 text-sm bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
            >
              Refresh
            </button>
          </div>

          {trendData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis
                  dataKey="date"
                  stroke="#6b7280"
                  style={{ fontSize: '12px' }}
                />
                <YAxis stroke="#6b7280" style={{ fontSize: '12px' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1f2937',
                    border: 'none',
                    borderRadius: '8px',
                    color: '#fff',
                  }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="menara"
                  stroke="#0c7cd8"
                  strokeWidth={2}
                  dot={{ fill: '#0c7cd8', r: 4 }}
                  activeDot={{ r: 6 }}
                  name="Jumlah Menara"
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-64 bg-slate-50 dark:bg-slate-700 rounded-lg flex items-center justify-center text-muted-foreground">
              <div className="text-center">
                <p>Belum ada data untuk ditampilkan</p>
                <p className="text-sm mt-2">Mulai input data menara untuk melihat tren</p>
              </div>
            </div>
          )}
        </div>

        {/* Distribution Chart */}
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-border shadow-sm p-8 animate-fade-up">
          <h2 className="text-xl font-bold text-foreground mb-6">Distribusi Kondisi</h2>

          {distributionData.some(d => d.value > 0) ? (
            <>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={distributionData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={renderCustomLabel}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {distributionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1f2937',
                      border: 'none',
                      borderRadius: '8px',
                      color: '#fff',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>

              <div className="mt-6 space-y-2">
                {distributionData.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: COLORS[idx] }}
                      ></div>
                      <span className="text-foreground">{item.name}</span>
                    </div>
                    <span className="font-semibold text-foreground">
                      {item.value} ({item.percentage}%)
                    </span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="h-64 bg-slate-50 dark:bg-slate-700 rounded-lg flex items-center justify-center text-muted-foreground">
              <div className="text-center text-sm">
                <p>Belum ada data</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Tower List */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-border shadow-sm p-8 mb-12 animate-fade-up">
        <h2 className="text-xl font-bold text-foreground mb-6">Daftar Menara</h2>

        {towers.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-100 dark:bg-slate-700 border-b border-border">
                  <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">No</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Nama Site</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Lokasi</th>
                  <th className="px-6 py-3 text-center text-sm font-semibold text-foreground">Baik</th>
                  <th className="px-6 py-3 text-center text-sm font-semibold text-foreground">Sedang</th>
                  <th className="px-6 py-3 text-center text-sm font-semibold text-foreground">Buruk</th>
                  <th className="px-6 py-3 text-right text-sm font-semibold text-foreground">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {towers.map((tower, idx) => (
                  <tr
                    key={tower.id}
                    className={`border-b border-border ${idx % 2 === 0 ? 'bg-slate-50 dark:bg-slate-700/50' : ''} hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors`}
                  >
                    <td className="px-6 py-4 text-sm font-semibold text-foreground">{tower.nomor_urut}</td>
                    <td className="px-6 py-4 text-sm text-foreground">{tower.nama_site}</td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">{tower.alamat_site.substring(0, 30)}...</td>
                    <td className="px-6 py-4 text-center">
                      <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                        {tower.goodCount}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300">
                        {tower.moderateCount}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300">
                        {tower.badCount}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link
                        to={`/tower/${tower.id}`}
                        className="inline-flex items-center gap-1 text-primary hover:text-primary/80 transition-colors font-semibold"
                      >
                        Lihat
                        <ChevronRight className="w-4 h-4" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">Belum ada menara terdaftar</p>
            <Link to="/input-data" className="btn-primary inline-block">
              Input Data Menara Baru
            </Link>
          </div>
        )}
      </div>

      {/* Status Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          {
            label: 'Kondisi Baik',
            value: stats.conditionGood,
            percentage: stats.totalChecklists > 0 ? ((stats.conditionGood / stats.totalChecklists) * 100).toFixed(1) : 0,
            color: 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 border-green-300',
            icon: '✓',
          },
          {
            label: 'Kondisi Sedang',
            value: stats.conditionModerate,
            percentage: stats.totalChecklists > 0 ? ((stats.conditionModerate / stats.totalChecklists) * 100).toFixed(1) : 0,
            color: 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 border-yellow-300',
            icon: '⚠',
          },
          {
            label: 'Kondisi Buruk',
            value: stats.conditionBad,
            percentage: stats.totalChecklists > 0 ? ((stats.conditionBad / stats.totalChecklists) * 100).toFixed(1) : 0,
            color: 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 border-red-300',
            icon: '✗',
          },
        ].map((item, idx) => (
          <div
            key={idx}
            className={`p-6 rounded-xl border-2 ${item.color} animate-fade-up`}
            style={{ animationDelay: `${(idx + 4) * 100}ms` }}
          >
            <div className="text-2xl font-bold mb-2">{item.icon}</div>
            <h3 className="font-semibold mb-1">{item.label}</h3>
            <div className="text-3xl font-bold">{item.value}</div>
            <p className="text-sm opacity-75 mt-1">{item.percentage}% dari total</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
