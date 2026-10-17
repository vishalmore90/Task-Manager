import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useTasks } from '../context/TaskContext.jsx';

export default function Home() {
  const { isAuthenticated, user } = useAuth();
  const { tasks } = useTasks();

  const completedCount = tasks.filter((t) => t.status === 'Completed').length;
  const inProgressCount = tasks.filter((t) => t.status === 'In Progress').length;

  return (
    <section className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:py-16">
      <div className="rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950/60 p-8 shadow-2xl sm:p-12">
        <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3.5 py-1 text-xs font-semibold text-indigo-300">
          <span>Workspace Task Management</span>
        </div>

        <h1 className="mt-5 text-3xl font-extrabold tracking-tight text-white sm:text-5xl">
          Manage Your Daily Tasks with Clarity.
        </h1>

        <p className="mt-4 max-w-2xl text-base leading-relaxed text-slate-300 sm:text-lg">
          Organize priorities, track progress from pending to completion, and
          keep your workflow synchronized in one clean dashboard.
        </p>

        <div className="mt-8 flex flex-wrap items-center gap-4">
          {isAuthenticated ? (
            <>
              <Link to="/tasks" className="btn-primary">
                Go to All Tasks ({tasks.length})
              </Link>
              <Link to="/add-task" className="btn-secondary">
                + Create New Task
              </Link>
            </>
          ) : (
            <Link to="/login" className="btn-primary">
              Login to Get Started
            </Link>
          )}
        </div>

        {isAuthenticated && (
          <div className="mt-8 rounded-2xl border border-slate-800/90 bg-slate-950/60 p-4 text-sm text-slate-300">
            Welcome back, <strong className="text-white">{user?.name}</strong> (
            {user?.email}) — you currently have{' '}
            <strong className="text-sky-300">{inProgressCount} in-progress</strong>{' '}
            and{' '}
            <strong className="text-emerald-300">
              {completedCount} completed
            </strong>{' '}
            tasks.
          </div>
        )}
      </div>

      <div className="mt-10 grid gap-5 sm:grid-cols-3">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
          <h2 className="text-base font-bold text-white">
            Session Authentication
          </h2>
          <p className="mt-2 text-sm text-slate-400">
            Role-aware navigation bar and protected routes that keep your task
            workspace private.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
          <h2 className="text-base font-bold text-white">
            Validated Task Forms
          </h2>
          <p className="mt-2 text-sm text-slate-400">
            Fast form validation and instant field pre-filling when editing
            existing tasks.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
          <h2 className="text-base font-bold text-white">
            Persistent CRUD State
          </h2>
          <p className="mt-2 text-sm text-slate-400">
            Create, filter, update, and remove tasks with automatic local
            storage persistence.
          </p>
        </div>
      </div>
    </section>
  );
}
