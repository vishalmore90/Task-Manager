import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useLocation, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { CheckSquare, AlertCircle } from 'lucide-react';

export default function Login() {
  const { isAuthenticated, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [authError, setAuthError] = useState('');
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      name: '',
      email: '',
      password: '',
    },
  });

  if (isAuthenticated) {
    return <Navigate to="/tasks" replace />;
  }

  const onSubmit = async (data) => {
    setAuthError('');
    setLoading(true);
    try {
      const result = await login(data);
      if (!result.success) {
        setAuthError(result.message || 'Authentication failed');
        setLoading(false);
        return;
      }
      reset();
      const destination = location.state?.from || '/tasks';
      navigate(destination, { replace: true });
    } catch (err) {
      setAuthError(err.message || 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="mx-auto flex min-h-[calc(100vh-140px)] max-w-md items-center px-4 py-8 sm:px-6 sm:py-12">
      <div className="w-full rounded-2xl border border-zinc-800 bg-zinc-900/90 p-6 shadow-sm sm:p-8">
        <div className="mb-6 text-center sm:mb-8">
          <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600 text-white sm:mb-4">
            <CheckSquare className="h-5 w-5" />
          </div>
          <h1 className="font-display text-xl font-bold tracking-tight text-white sm:text-2xl">
            {isRegisterMode ? 'Create Workspace Account' : 'Welcome Back'}
          </h1>
          <p className="mt-1.5 text-xs text-zinc-300 sm:mt-2 sm:text-sm">
            {isRegisterMode
              ? 'Enter your credentials to initialize your private workspace.'
              : 'Enter your credentials to access your active tasks.'}
          </p>
        </div>

        {authError && (
          <div className="mb-5 flex items-start gap-2.5 rounded-lg border border-red-900/50 bg-red-950/40 p-3 text-xs font-medium text-red-300 sm:mb-6 sm:p-3.5">
            <AlertCircle className="h-4 w-4 shrink-0 text-red-400" />
            <span className="break-words">{authError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
          {isRegisterMode && (
            <div>
              <label
                htmlFor="name"
                className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-zinc-300"
              >
                Full Name
              </label>
              <input
                id="name"
                type="text"
                autoComplete="name"
                placeholder="Alex Morgan"
                {...register('name', {
                  required: isRegisterMode ? 'Full name is required' : false,
                  maxLength: { value: 60, message: 'Max 60 characters' },
                })}
                className="input-field"
              />
              {errors.name && (
                <p className="mt-1 text-xs text-red-400">{errors.name.message}</p>
              )}
            </div>
          )}

          <div>
            <label
              htmlFor="email"
              className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-zinc-300"
            >
              Email Address
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="alex@example.com"
              {...register('email', {
                required: 'Email address is required',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Enter a valid email address',
                },
              })}
              className="input-field"
            />
            {errors.email && (
              <p className="mt-1 text-xs text-red-400">{errors.email.message}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-zinc-300"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              autoComplete={isRegisterMode ? 'new-password' : 'current-password'}
              placeholder="••••••••"
              {...register('password', {
                required: 'Password is required',
                minLength: {
                  value: 4,
                  message: 'Password must be at least 4 characters',
                },
              })}
              className="input-field"
            />
            {errors.password && (
              <p className="mt-1 text-xs text-red-400">{errors.password.message}</p>
            )}
          </div>

          {/* Exactly one primary button in form */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full"
            >
              {loading ? 'Authenticating...' : isRegisterMode ? 'Create Account' : 'Sign In'}
            </button>
          </div>
        </form>

        <div className="mt-6 border-t border-zinc-800 pt-5 text-center sm:pt-6">
          <button
            type="button"
            onClick={() => {
              setIsRegisterMode((prev) => !prev);
              setAuthError('');
            }}
            className="text-xs font-medium text-zinc-400 transition hover:text-white"
          >
            {isRegisterMode
              ? 'Already registered? Sign in instead'
              : 'Need an account? Register here'}
          </button>
        </div>
      </div>
    </section>
  );
}
