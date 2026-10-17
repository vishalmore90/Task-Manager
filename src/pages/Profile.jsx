import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useTasks } from '../context/TaskContext.jsx';

export default function Profile() {
  const { user, logout } = useAuth();
  const { tasks } = useTasks();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <section className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
      <div className="rounded-3xl border border-slate-800 bg-slate-900/85 p-7 shadow-2xl sm:p-9">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-600 text-xl font-extrabold text-white">
            {(user?.name || 'U').slice(0, 2).toUpperCase()}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">{user?.name}</h1>
            <p className="text-sm text-slate-400">{user?.email}</p>
          </div>
        </div>

        <dl className="mt-6 grid gap-4 border-t border-slate-800 pt-6 sm:grid-cols-2">
          <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
            <dt className="text-xs font-medium text-slate-400">Account Role</dt>
            <dd className="mt-1 text-sm font-semibold text-white">
              {user?.role || 'Workspace Member'}
            </dd>
          </div>
          <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
            <dt className="text-xs font-medium text-slate-400">
              Total Tasks Managed
            </dt>
            <dd className="mt-1 text-sm font-semibold text-indigo-300">
              {tasks.length} Tasks
            </dd>
          </div>
        </dl>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-slate-800 pt-6">
          <Link to="/tasks" className="btn-secondary">
            View All Tasks
          </Link>
          <button
            type="button"
            onClick={handleLogout}
            className="btn-danger px-4 py-2 text-sm"
          >
            Logout Session
          </button>
        </div>
      </div>
    </section>
  );
}
