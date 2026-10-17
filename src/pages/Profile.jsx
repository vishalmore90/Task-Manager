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
    <section className="mx-auto max-w-2xl px-4 py-8 sm:px-6 sm:py-12">
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/90 p-6 sm:p-10">
        <div className="flex flex-col items-center gap-4 border-b border-zinc-800 pb-6 text-center sm:flex-row sm:items-center sm:gap-5 sm:pb-8 sm:text-left">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl border border-zinc-700 bg-zinc-800 text-xl font-bold text-white sm:h-16 sm:w-16">
            <User className="h-7 w-7 text-blue-400 sm:h-8 sm:w-8" />
          </div>
          <div className="min-w-0 flex-1">
            <h1 className="font-display text-xl font-bold tracking-tight text-white sm:text-2xl">
              {user?.name || 'Workspace Member'}
            </h1>
            <p className="mt-0.5 text-xs text-zinc-300 break-all sm:text-sm">
              {user?.email}
            </p>
          </div>
        </div>

        <div className="mt-6 grid gap-3 sm:mt-8 sm:gap-4 sm:grid-cols-2">
          <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-4 sm:p-5">
            <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-wider text-zinc-400 sm:text-xs">
              <Shield className="h-3.5 w-3.5 text-blue-400 sm:h-4 sm:w-4" />
              <span>Permission Role</span>
            </div>
            <p className="mt-2 text-sm font-semibold text-white sm:text-base">
              {user?.role || 'Workspace Member'}
            </p>
            <p className="mt-1 text-xs text-zinc-400 leading-relaxed">
              {isAdmin
                ? 'Full administrative control over all system records.'
                : 'Isolated workspace: Access restricted to your assigned tasks.'}
            </p>
          </div>

          <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-4 sm:p-5">
            <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-wider text-zinc-400 sm:text-xs">
              <CheckSquare className="h-3.5 w-3.5 text-blue-400 sm:h-4 sm:w-4" />
              <span>Assigned Backlog</span>
            </div>
            <p className="mt-2 text-sm font-semibold text-white sm:text-base">
              {tasks.length} Active Tasks
            </p>
            <p className="mt-1 text-xs text-zinc-400 leading-relaxed">
              Locally synchronized with encrypted session persistence.
            </p>
          </div>
        </div>

        <div className="mt-6 border-t border-zinc-800 pt-6 sm:mt-8 sm:pt-8">
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
