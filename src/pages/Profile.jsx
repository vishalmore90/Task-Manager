import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useTasks } from '../context/TaskContext.jsx';
import { Shield, CheckSquare, User, LogOut } from 'lucide-react';

export default function Profile() {
  const { user, logout, isAdmin } = useAuth();
  const { tasks } = useTasks();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <section className="mx-auto max-w-2xl px-6 py-12">
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/90 p-8 sm:p-10">
        <div className="flex items-center gap-5 border-b border-zinc-800 pb-8">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl border border-zinc-700 bg-zinc-800 text-xl font-bold text-white">
            <User className="h-8 w-8 text-blue-400" />
          </div>
          <div>
            <h1 className="font-display text-2xl font-bold tracking-tight text-white">
              {user?.name || 'Workspace Member'}
            </h1>
            <p className="mt-0.5 text-sm text-zinc-300">{user?.email}</p>
          </div>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-5">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-zinc-400">
              <Shield className="h-4 w-4 text-blue-400" />
              <span>Permission Role</span>
            </div>
            <p className="mt-2 text-base font-semibold text-white">
              {user?.role || 'Workspace Member'}
            </p>
            <p className="mt-1 text-xs text-zinc-400">
              {isAdmin
                ? 'Full permissions across all system records.'
                : 'Isolated workspace: Access restricted to assigned tasks.'}
            </p>
          </div>

          <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-5">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-zinc-400">
              <CheckSquare className="h-4 w-4 text-blue-400" />
              <span>Assigned Backlog</span>
            </div>
            <p className="mt-2 text-base font-semibold text-white">
              {tasks.length} Active Tasks
            </p>
            <p className="mt-1 text-xs text-zinc-400">
              Locally synchronized with encrypted session persistence.
            </p>
          </div>
        </div>

        <div className="mt-8 border-t border-zinc-800 pt-8">
          <button
            type="button"
            onClick={handleLogout}
            className="btn-danger w-full sm:w-auto"
          >
            <LogOut className="h-4 w-4" />
            <span>End Session</span>
          </button>
        </div>
      </div>
    </section>
  );
}
