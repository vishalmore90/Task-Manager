import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useTasks } from '../context/TaskContext.jsx';
import { CheckSquare, LogOut } from 'lucide-react';

export default function Navbar() {
  const { isAuthenticated, logout } = useAuth();
  const { tasks } = useTasks();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navLinkClass = ({ isActive }) =>
    `px-3 py-1.5 rounded-lg text-sm font-medium transition ${
      isActive
        ? 'bg-blue-600 text-white'
        : 'text-zinc-200 hover:bg-zinc-900 hover:text-white'
    }`;

  return (
    <header className="sticky top-0 z-30 border-b border-zinc-800 bg-zinc-950/95 backdrop-blur-sm">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link
          to={isAuthenticated ? '/tasks' : '/'}
          className="flex items-center gap-3 text-base font-bold tracking-tight text-white transition hover:opacity-90"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white">
            <CheckSquare className="h-4 w-4" />
          </span>
          <span className="font-display text-lg tracking-tight">Task Manager</span>
        </Link>

        {isAuthenticated ? (
          <nav className="flex items-center gap-1 sm:gap-2">
            <NavLink to="/tasks" className={navLinkClass}>
              All Tasks
              <span className="ml-1.5 rounded-md bg-zinc-800 px-1.5 py-0.5 text-xs font-semibold text-zinc-200">
                {tasks.length}
              </span>
            </NavLink>

            <NavLink to="/add-task" className={navLinkClass}>
              + Add Task
            </NavLink>

            <NavLink to="/profile" className={navLinkClass}>
              Profile
            </NavLink>

            <NavLink to="/privacy" className={navLinkClass}>
              Privacy
            </NavLink>

            <button
              type="button"
              onClick={handleLogout}
              className="ml-2 inline-flex items-center gap-1.5 rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-1.5 text-xs font-semibold text-zinc-300 transition hover:bg-zinc-800 hover:text-white"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span>Logout</span>
            </button>
          </nav>
        ) : (
          <nav className="flex items-center gap-2">
            <NavLink to="/" className={navLinkClass}>
              Home
            </NavLink>
            <NavLink to="/privacy" className={navLinkClass}>
              Privacy
            </NavLink>
            <NavLink to="/terms" className={navLinkClass}>
              Terms
            </NavLink>
            <Link to="/login" className="btn-primary ml-2">
              Login
            </Link>
          </nav>
        )}
      </div>
    </header>
  );
}
