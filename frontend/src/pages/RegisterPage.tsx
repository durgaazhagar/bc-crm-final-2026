import { ChangeEvent, FormEvent, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff, AlertCircle, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';
import api from '../services/api';

const RegisterPage = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '', role: 'admin' });
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showResetLink, setShowResetLink] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
    setShowResetLink(false);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Validation checks
    if (!form.name || !form.email || !form.password || !form.confirmPassword) {
      setError('Please complete all fields to continue.');
      setLoading(false);
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      setError('Please enter a valid email address.');
      setLoading(false);
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match. Please try again.');
      setLoading(false);
      return;
    }

    try {
      // Try to register with API
      const response = await api.post('/auth/register', {
        name: form.name,
        email: form.email,
        password: form.password,
        confirmPassword: form.confirmPassword,
        role: form.role,
      });

      if (response.data?.token) {
        localStorage.setItem('bloodconnect_token', response.data.token);
      }

      if (response.data?.user) {
        localStorage.setItem('bloodconnect_user', JSON.stringify(response.data.user));
      }

      setSuccessMessage('Registration successful');
      setError('');

      const role = response.data?.user?.role || form.role || 'admin';
      const roleRouteMap: Record<string, string> = {
        admin: '/dashboard/admin',
        hospital: '/dashboard/hospital',
        blood_bank: '/dashboard/bloodbank',
        bloodbank: '/dashboard/bloodbank',
        volunteer: '/dashboard/volunteer',
      };

      const destination = response.data?.redirect || roleRouteMap[role] || '/';
      window.setTimeout(() => navigate(destination, { replace: true }), 2000);
    } catch (err: any) {
      // If API is down or server error, surface a friendly server-unavailable message
      if (!err.response || err.response.status >= 500) {
        setError('Server temporarily unavailable, please try again later');
      } else {
        // Show specific error messages from API (validation, conflict, etc.)
        const errorMessage = err.response?.data?.message || 'Unable to register. Please try again.';
        // Improve user-facing message for existing account conflicts
        if (errorMessage.toLowerCase().includes('user already exists') || errorMessage.toLowerCase().includes('already exists')) {
          setError('An account with this email already exists.');
          setShowResetLink(true);
        } else {
          setError(errorMessage);
          setShowResetLink(false);
        }
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-500 via-pink-500 to-blue-700 flex items-center justify-center px-4 py-12 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-72 w-72 rounded-full bg-sky-300/10 blur-3xl" />
      </div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-lg rounded-[32px] border border-white/10 bg-white/10 p-10 shadow-2xl shadow-slate-950/20 backdrop-blur-xl sm:px-12"
      >
        <div className="mb-6 text-center">
          <p className="text-sm uppercase tracking-[0.28em] text-red-100">BloodConnect</p>
          <h1 className="mt-4 text-3xl font-semibold text-white">Create your account</h1>
          <p className="mt-3 text-sm text-slate-200">Start monitoring donors and managing urgent blood matches.</p>
          <Link to="/" className="mt-4 inline-flex items-center text-sm text-cyan-200 hover:text-white transition-colors">
            ← Back to Landing Page
          </Link>
        </div>

        {/* Single error message - displayed only once inside card */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 rounded-3xl bg-red-600/20 border border-red-500/30 px-4 py-3 text-sm text-red-100 flex items-start gap-3"
          >
            <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
            <span>{error}</span>
          </motion.div>
        )}

        <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
          <label className="block text-sm text-slate-200">
            Full name
            <input
              className="mt-2 w-full rounded-3xl border border-white/15 bg-slate-950/80 px-4 py-3 text-white outline-none transition duration-300 focus:border-red-400 focus:ring-2 focus:ring-red-400/25"
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
            />
          </label>
          <label className="block text-sm text-slate-200">
            Email
            <input
              className="mt-2 w-full rounded-3xl border border-white/15 bg-slate-950/80 px-4 py-3 text-white outline-none transition duration-300 focus:border-red-400 focus:ring-2 focus:ring-red-400/25"
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
            />
          </label>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block text-sm text-slate-200 relative">
              Password
              <input
                className="mt-2 w-full rounded-3xl border border-white/15 bg-slate-950/80 px-4 py-3 pr-12 text-white outline-none transition duration-300 focus:border-red-400 focus:ring-2 focus:ring-red-400/25"
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={form.password}
                onChange={handleChange}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                className="absolute right-3 top-11 text-slate-300 hover:text-white transition-colors"
                aria-label="Toggle password visibility"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </label>
            <label className="block text-sm text-slate-200 relative">
              Confirm Password
              <input
                className="mt-2 w-full rounded-3xl border border-white/15 bg-slate-950/80 px-4 py-3 pr-12 text-white outline-none transition duration-300 focus:border-red-400 focus:ring-2 focus:ring-red-400/25"
                type={showConfirm ? 'text' : 'password'}
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={handleChange}
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirm((s) => !s)}
                className="absolute right-3 top-11 text-slate-300 hover:text-white transition-colors"
                aria-label="Toggle confirm password visibility"
              >
                {showConfirm ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </label>
          </div>
          <label className="block text-sm text-slate-200">
            Role
            <select
              name="role"
              value={form.role}
              onChange={handleChange}
              className="mt-2 w-full rounded-3xl border border-white/15 bg-slate-950/80 px-4 py-3 text-white outline-none transition duration-300 focus:border-red-400 focus:ring-2 focus:ring-red-400/25"
            >
              <option value="admin">Admin</option>
              <option value="hospital">Hospital</option>
              <option value="blood_bank">Blood Bank</option>
              <option value="volunteer">Volunteer</option>
            </select>
          </label>
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-3xl bg-red-600 px-4 py-3 text-base font-semibold text-white shadow-lg shadow-red-500/25 transition duration-300 hover:-translate-y-0.5 hover:bg-red-500 hover:shadow-2xl disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? 'Registering...' : 'Register'}
          </button>
        </form>
        <div className="mt-6 text-center text-sm text-slate-200">
          <p>Registration is the only access path for BloodConnect.</p>
          {showResetLink ? (
            <p>
              An account with this email already exists. <Link to="/forgot-password" className="text-cyan-200 hover:text-white underline">Reset your password</Link> or contact your administrator.
            </p>
          ) : (
            <p>If you already have an account, please contact your administrator for assistance.</p>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default RegisterPage;
