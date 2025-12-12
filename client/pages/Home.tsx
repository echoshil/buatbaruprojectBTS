import { Link } from 'react-router-dom';
import { Activity, BarChart3, Map, Plus, CheckCircle2, TrendingUp } from 'lucide-react';

const Home = () => {
  const features = [
    {
      icon: Plus,
      title: 'Input Data Menara',
      description: 'Kelola data detail menara BTS dengan form yang komprehensif dan mudah digunakan.',
      link: '/input-data',
    },
    {
      icon: BarChart3,
      title: 'Dashboard Analytics',
      description: 'Lihat statistik dan analisis menara dengan visualisasi data yang powerful dan real-time.',
      link: '/dashboard',
    },
    {
      icon: Map,
      title: 'Peta Interaktif',
      description: 'Visualisasi lokasi menara di peta dengan fitur pencarian dan filtering yang canggih.',
      link: '/map',
    },
  ];

  const stats = [
    { value: '0', label: 'Menara Terdaftar' },
    { value: '0', label: 'Checklist Selesai' },
    { value: '0%', label: 'Kondisi Baik' },
    { value: '24/7', label: 'Monitoring' },
  ];

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-teal-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900"></div>
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-10 left-10 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl dark:bg-blue-900"></div>
          <div className="absolute top-40 right-10 w-72 h-72 bg-teal-300 rounded-full mix-blend-multiply filter blur-3xl dark:bg-teal-900"></div>
          <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-3xl dark:bg-yellow-900"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32">
          <div className="text-center animate-fade-up">
            <h1 className="text-5xl sm:text-7xl font-bold text-foreground mb-6">
              Monitoring <span className="bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent">Menara BTS</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              Sistem evaluasi menyeluruh untuk memastikan performa optimal infrastruktur telekomunikasi. Kelola, pantau, dan optimalkan menara BTS Anda dengan data real-time.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/input-data"
                className="btn-primary inline-flex items-center justify-center gap-2 hover:scale-105 transform transition-all duration-200"
              >
                <Plus className="w-5 h-5" />
                Mulai Input Data
              </Link>
              <Link
                to="/dashboard"
                className="bg-secondary text-secondary-foreground hover:bg-secondary/90 px-8 py-3 rounded-lg font-semibold transition-all duration-200 shadow-md hover:shadow-lg inline-flex items-center justify-center gap-2"
              >
                <BarChart3 className="w-5 h-5" />
                Lihat Dashboard
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((stat, idx) => (
            <div
              key={idx}
              className="p-6 bg-white dark:bg-slate-800 rounded-lg border border-border shadow-sm hover:shadow-md transition-all duration-200 text-center group"
            >
              <div className="text-3xl font-bold text-primary mb-2 group-hover:scale-110 transition-transform">
                {stat.value}
              </div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-slate-50 dark:bg-slate-800 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">Fitur Utama</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Kelola infrastruktur menara BTS Anda dengan tools yang powerful dan user-friendly
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <Link
                  key={idx}
                  to={feature.link}
                  className="group p-8 bg-white dark:bg-slate-700 rounded-xl border border-border shadow-sm hover:shadow-xl hover:border-primary transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="bg-gradient-to-br from-blue-100 to-teal-100 dark:from-blue-900 dark:to-teal-900 w-14 h-14 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Icon className="w-7 h-7 text-primary group-hover:text-white transition-colors" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                  <div className="mt-4 text-primary font-semibold flex items-center gap-2 group-hover:gap-3 transition-all">
                    Pelajari lebih lanjut
                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-blue-600 to-teal-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Siap Memulai?
          </h2>
          <p className="text-lg text-blue-100 mb-8 max-w-2xl mx-auto">
            Mulai monitoring menara BTS Anda hari ini dan optimalkan performa infrastruktur telekomunikasi Anda
          </p>
          <Link
            to="/input-data"
            className="bg-white text-primary hover:bg-gray-100 px-8 py-3 rounded-lg font-bold transition-all duration-200 inline-flex items-center gap-2 shadow-lg hover:shadow-xl"
          >
            <CheckCircle2 className="w-5 h-5" />
            Input Data Menara
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
