import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogOut, ArrowLeft } from 'lucide-react';
import logo from '../assets/logo-bloodconnect-light.svg';

interface SharedNavbarProps {
  isLoggedIn?: boolean;
  userName?: string;
  userRole?: string;
}

const SharedNavbar = ({ isLoggedIn = false, userName, userRole }: SharedNavbarProps) => {
  const navigate = useNavigate();
  const [displayName, setDisplayName] = useState(userName);
  const [role, setRole] = useState(userRole);

  useEffect(() => {
    if (isLoggedIn && !displayName) {
      try {
        const raw = localStorage.getItem('bloodconnect_user');
        const parsed = raw ? JSON.parse(raw) : {};
        setDisplayName(parsed?.name || parsed?.user?.name || 'User');
        setRole(parsed?.role || parsed?.user?.role || 'Admin');
      } catch {
        setDisplayName('User');
        setRole('Admin');
      }
    }
  }, [isLoggedIn, displayName]);

  const handleLogout = () => {
    localStorage.removeItem('bloodconnect_token');
    localStorage.removeItem('bloodconnect_user');
    sessionStorage.removeItem('bloodconnect_token');
    sessionStorage.removeItem('bloodconnect_user');
    navigate('/');
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/95 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-10">
        <div className="flex items-center justify-between py-4">
          {/* Logo and Brand */}
          <Link to={isLoggedIn ? '/dashboard/admin' : '/'} className="inline-flex items-center gap-2 text-lg font-bold tracking-wide text-white hover:opacity-80 transition">
            {!isLoggedIn && (
              <img
                src={logo}
                alt="BloodConnect Logo"
                className="h-6 w-6 md:h-8 md:w-8 transition duration-300 hover:shadow-[0_0_18px_rgba(236,72,153,0.18)] object-contain"
              />
            )}
            <span>BloodConnect</span>
          </Link>

          {/* Navigation Links - Desktop */}
          {!isLoggedIn && (
            <div className="hidden md:flex items-center gap-8 text-sm">
              <Link to="/#features" className="text-slate-300 transition hover:text-white">
                Features
              </Link>
              <Link to="/#about" className="text-slate-300 transition hover:text-white">
                About
              </Link>
              <Link to="/#contact" className="text-slate-300 transition hover:text-white">
                Contact
              </Link>
              <Link
                to="/app/register"
                className="rounded-2xl bg-gradient-to-r from-red-500 to-rose-600 px-6 py-2 font-semibold text-white shadow-lg transition hover:shadow-xl hover:shadow-red-500/20"
              >
                Register
              </Link>
            </div>
          )}

          {/* Logged In User Controls */}
          {isLoggedIn && (
            <div className="flex items-center gap-4">
              <div className="hidden sm:flex flex-col items-end gap-1">
                <span className="text-xs uppercase tracking-wider text-slate-400">Signed in as</span>
                <p className="text-sm font-semibold text-white">{displayName}</p>
                <span className="inline-flex rounded-full bg-cyan-500/10 px-3 py-1 text-[11px] uppercase tracking-wider text-cyan-200 capitalize">
                  {role}
                </span>
              </div>

              <button
                onClick={() => navigate('/')}
                className="inline-flex items-center gap-2 rounded-2xl bg-slate-800/50 px-4 py-2 text-sm font-semibold text-slate-200 transition hover:bg-slate-700"
                title="Back to home page"
              >
                <ArrowLeft className="h-4 w-4" />
                <span className="hidden sm:inline">Home</span>
              </button>

              <button
                onClick={handleLogout}
                className="inline-flex items-center gap-2 rounded-2xl bg-red-500/10 px-4 py-2 text-sm font-semibold text-red-200 transition hover:bg-red-500/20"
                title="Logout and return to landing page"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          )}

          {/* Mobile Register Link */}
          {!isLoggedIn && (
            <div className="md:hidden">
              <Link
                to="/app/register"
                className="rounded-lg bg-gradient-to-r from-red-500 to-rose-600 px-4 py-2 text-sm font-semibold text-white"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default SharedNavbar;
