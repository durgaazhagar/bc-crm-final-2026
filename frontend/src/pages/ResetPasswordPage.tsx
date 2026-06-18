import { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { Lock, Eye, EyeOff, CheckCircle, AlertTriangle } from 'lucide-react';
import { authService } from '../services/api';

const ResetPasswordPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!token) {
      setError('Invalid password reset link.');
    }
  }, [token]);

  const validate = () => {
    if (!password || !confirmPassword) {
      setError('Please complete both password fields.');
      return false;
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters long.');
      return false;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validate() || !token) return;

    setLoading(true);
    setError('');
    setMessage('');

    try {
      const response = await authService.resetPassword({ token, password });
      setMessage(response.data.message || 'Your password has been reset successfully.');
      setTimeout(() => navigate('/app/register'), 1800);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Unable to reset password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: 'easeOut' }}
      className="relative min-h-screen overflow-hidden bg-gradient-to-br from-[#050915] via-[#0b1220] to-[#09101a] text-white"
    >
      <div className="pointer-events-none absolute inset-0 opacity-30">
        <div className="absolute left-10 top-10 h-72 w-72 rounded-full bg-red-500/10 blur-3xl" />
        <div className="absolute right-10 bottom-10 h-80 w-80 rounded-full bg-blue-500/10 blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto flex min-h-screen max-w-3xl items-center px-6 py-12 sm:px-10">
        <div className="w-full rounded-[36px] border border-white/10 bg-slate-950/80 p-8 shadow-[0_0_60px_rgba(0,0,0,0.25)] backdrop-blur-3xl sm:p-10">
          <div className="mb-8 space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full bg-cyan-500/10 px-4 py-2 text-sm text-cyan-200">
              <CheckCircle className="h-4 w-4" />
              Reset password securely
            </div>
            <h1 className="text-4xl font-semibold text-white">Create a new password</h1>
            <p className="max-w-2xl text-sm text-slate-400">Use a strong new password to continue safely. Your reset link is valid for one hour.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
              <div className="flex items-center justify-between">
                <span className="text-sm uppercase tracking-[0.28em] text-slate-400">New password</span>
                <button type="button" className="text-slate-400 hover:text-white" onClick={() => setShowPassword((value) => !value)}>
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              <div className="mt-4 flex items-center gap-3">
                <Lock className="h-5 w-5 text-slate-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => {
                    setPassword(e.target.value);
                    setError('');
                    setMessage('');
                  }}
                  placeholder="New password"
                  className="flex-1 bg-transparent text-white outline-none placeholder-slate-500"
                />
              </div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
              <div className="flex items-center justify-between">
                <span className="text-sm uppercase tracking-[0.28em] text-slate-400">Confirm password</span>
                <button type="button" className="text-slate-400 hover:text-white" onClick={() => setShowConfirmPassword((value) => !value)}>
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              <div className="mt-4 flex items-center gap-3">
                <Lock className="h-5 w-5 text-slate-400" />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => {
                    setConfirmPassword(e.target.value);
                    setError('');
                    setMessage('');
                  }}
                  placeholder="Confirm password"
                  className="flex-1 bg-transparent text-white outline-none placeholder-slate-500"
                />
              </div>
            </div>

            {error && (
              <div className="rounded-3xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                {error}
              </div>
            )}
            {message && (
              <div className="rounded-3xl border border-emerald-400/20 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-200">
                {message}
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !token}
              className="w-full rounded-3xl bg-gradient-to-r from-red-600 to-rose-600 px-6 py-3 text-base font-semibold text-white shadow-lg shadow-red-600/30 transition hover:shadow-red-600/50 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? 'Resetting password...' : 'Reset password'}
            </button>

            <div className="flex flex-col gap-3 text-sm text-slate-300 sm:flex-row sm:justify-between">
              <Link to="/app/register" className="text-red-300 hover:text-red-200 transition">
                Back to registration
              </Link>
              <button type="button" onClick={() => navigate('/')} className="text-slate-300 hover:text-white transition">
                Return home
              </button>
            </div>
          </form>

          {!token && (
            <div className="mt-6 rounded-3xl border border-yellow-400/20 bg-yellow-400/10 px-4 py-3 text-sm text-yellow-200">
              <AlertTriangle className="inline h-4 w-4 align-middle mr-2" />
              This reset link is invalid or expired. Please request a new password reset.
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ResetPasswordPage;
