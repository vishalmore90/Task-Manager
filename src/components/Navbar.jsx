import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useTasks } from '../context/TaskContext.jsx';

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const { tasks } = useTasks();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navLinkClass = ({ isActive }) =>
    `px-3.5 py-2 rounded-lg text-sm font-medium transition ${
      isActive
        ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-500/30'
        : 'text-slate-300 hover:bg-slate-800 hover:text-white'
    }`;

  return (
    <header className="sticky top-0 z-30 border-b border-slate-800/80 bg-slate-950/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3.5 sm:px-6">
        <Link
          to={isAuthenticated ? '/tasks' : '/'}
          className="flex items-center gap-2.5 text-lg font-bold tracking-tight text-white transition hover:opacity-90"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-sm font-extrabold text-white shadow-md shadow-indigo-600/30">
            TM
          </span>
          <span>Task Manager</span>
        </Link>

        {isAuthenticated ? (
          <nav className="flex flex-wrap items-center gap-2 sm:gap-3">
            <NavLink to="/tasks" className={navLinkClass}>
              All Tasks
              <span className="ml-1.5 rounded-full bg-slate-800 px-2 py-0.5 text-xs font-semibold text-indigo-300">
                {tasks.length}
              </span>
            </NavLink>

            <NavLink to="/add-task" className={navLinkClass}>
              + Add Task
            </NavLink>

            <NavLink to="/profile" className={navLinkClass}>
              Profile ({user?.name})
            </NavLink>

            <button
              type="button"
              onClick={handleLogout}
              className="ml-1 rounded-lg border border-rose-500/30 bg-rose-500/10 px-3.5 py-2 text-sm font-semibold text-rose-300 transition hover:bg-rose-600 hover:text-white"
            >
              Logout
            </button>
          </nav>
        ) : (
          <div className="flex items-center gap-3">
            <Link to="/login" className="btn-primary">
              Login
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
