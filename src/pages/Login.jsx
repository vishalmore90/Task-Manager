import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useLocation, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function Login() {
  const { isAuthenticated, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [authError, setAuthError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
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

  const onSubmit = (data) => {
    setAuthError('');
    const result = login(data);
    if (!result.success) {
      setAuthError(result.message || 'Authentication failed');
      return;
    }
    reset();
    const destination = location.state?.from || '/tasks';
    navigate(destination, { replace: true });
  };

  return (
    <section className="mx-auto flex min-h-[calc(100vh-72px)] max-w-md items-center px-4 py-12">
      <div className="w-full rounded-3xl border border-slate-800 bg-slate-900/85 p-7 shadow-2xl sm:p-9">
        <div className="mb-6 text-center">
          <span className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-600/20 text-lg font-extrabold text-indigo-400 border border-indigo-500/30">
            TM
          </span>
          <h1 className="text-2xl font-bold text-white">
            {isRegisterMode ? 'Create Your Account' : 'Welcome Back'}
          </h1>
          <p className="mt-1.5 text-sm text-slate-400">
            {isRegisterMode
              ? 'Enter your details below to set up your workspace.'
              : 'Sign in with your email and password to access your tasks.'}
          </p>
        </div>

        {authError && (
          <div className="mb-4 rounded-xl border border-rose-500/40 bg-rose-500/10 px-4 py-2.5 text-xs font-medium text-rose-300">
            {authError}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
          {isRegisterMode && (
            <div>
              <label
                htmlFor="name"
                className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-300"
              >
                Full Name
              </label>
              <input
                id="name"
                type="text"
                placeholder="Alex Morgan"
                className="input-field"
                {...register('name', {
                  required: isRegisterMode ? 'Name is required' : false,
                  minLength: {
                    value: 2,
                    message: 'Name must be at least 2 characters',
                  },
                })}
              />
              {errors.name && (
                <p className="mt-1 text-xs text-rose-400">
                  {errors.name.message}
                </p>
              )}
            </div>
          )}

          <div>
            <label
              htmlFor="email"
              className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-300"
            >
              Email Address
            </label>
            <input
              id="email"
              type="email"
              placeholder="you@example.com"
              className="input-field"
              {...register('email', {
                required: 'Email address is required',
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: 'Please enter a valid email address',
                },
              })}
            />
            {errors.email && (
              <p className="mt-1 text-xs text-rose-400">
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-300"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              placeholder="••••••••"
              className="input-field"
              {...register('password', {
                required: 'Password is required',
                minLength: {
                  value: 4,
                  message: 'Password must be at least 4 characters',
                },
              })}
            />
            {errors.password && (
              <p className="mt-1 text-xs text-rose-400">
                {errors.password.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="btn-primary w-full mt-2 py-3"
          >
            {isRegisterMode ? 'Register & Continue' : 'Login'}
          </button>
        </form>

        <div className="mt-6 border-t border-slate-800 pt-4 text-center text-xs text-slate-400">
          {isRegisterMode ? (
            <>
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => setIsRegisterMode(false)}
                className="font-semibold text-indigo-400 hover:text-indigo-300"
              >
                Login here
              </button>
            </>
          ) : (
            <>
              Need an account?{' '}
              <button
                type="button"
                onClick={() => setIsRegisterMode(true)}
                className="font-semibold text-indigo-400 hover:text-indigo-300"
              >
                Register an account
              </button>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
