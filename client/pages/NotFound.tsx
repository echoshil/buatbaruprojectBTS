import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Home, ArrowLeft } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname,
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-teal-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 px-4">
      <div className="text-center max-w-md">
        <div className="mb-6">
          <div className="text-8xl font-bold bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent mb-4">
            404
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Halaman Tidak Ditemukan</h1>
          <p className="text-lg text-muted-foreground">
            Maaf, halaman yang Anda cari tidak tersedia.
          </p>
        </div>

        <div className="bg-slate-50 dark:bg-slate-800 p-6 rounded-lg border border-border mb-8">
          <p className="text-sm text-muted-foreground font-mono break-all">
            {location.pathname}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/"
            className="btn-primary inline-flex items-center justify-center gap-2"
          >
            <Home className="w-5 h-5" />
            Kembali ke Home
          </Link>
          <button
            onClick={() => window.history.back()}
            className="bg-secondary text-secondary-foreground hover:bg-secondary/90 px-6 py-3 rounded-lg font-semibold transition-all duration-200 shadow-md hover:shadow-lg inline-flex items-center justify-center gap-2"
          >
            <ArrowLeft className="w-5 h-5" />
            Kembali
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
