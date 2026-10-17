import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useTasks } from '../context/TaskContext.jsx';
import { CheckSquare, LogOut, Menu, X } from 'lucide-react';

export default function Navbar() {
  const { isAuthenticated, logout } = useAuth();
  const { tasks } = useTasks();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setMobileMenuOpen(false);
    navigate('/login');
  };

  const navLinkClass = ({ isActive }) =>
    `px-3 py-1.5 rounded-lg text-sm font-medium transition ${
      isActive
        ? 'bg-blue-600 text-white'
        : 'text-zinc-200 hover:bg-zinc-900 hover:text-white'
    }`;

  const mobileNavLinkClass = ({ isActive }) =>
    `flex items-center justify-between w-full px-4 py-3 rounded-lg text-sm font-medium transition ${
      isActive
        ? 'bg-blue-600 text-white'
        : 'text-zinc-200 hover:bg-zinc-900 hover:text-white'
    }`;

  const closeMenu = () => setMobileMenuOpen(false);

  return (
    <header className="sticky top-0 z-40 border-b border-zinc-800 bg-zinc-950/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3.5 sm:px-6">
        <Link
          to={isAuthenticated ? '/tasks' : '/'}
          onClick={closeMenu}
          className="flex items-center gap-2.5 text-base font-bold tracking-tight text-white transition hover:opacity-90"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white">
            <CheckSquare className="h-4 w-4" />
          </span>
          <span className="font-display text-base font-bold tracking-tight sm:text-lg">
            Task Manager
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-1 md:flex">
          {isAuthenticated ? (
            <>
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
            </>
          ) : (
            <>
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
            </>
          )}
        </nav>

        {/* Mobile Menu Toggle Button */}
        <div className="flex items-center md:hidden">
          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-label="Toggle navigation menu"
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-zinc-800 bg-zinc-900 text-zinc-300 transition hover:bg-zinc-800 hover:text-white"
          >
            {mobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Panel */}
      {mobileMenuOpen && (
        <div className="border-t border-zinc-800 bg-zinc-950 px-4 py-4 md:hidden">
          <nav className="flex flex-col space-y-2">
            {isAuthenticated ? (
              <>
                <NavLink
                  to="/tasks"
                  onClick={closeMenu}
                  className={mobileNavLinkClass}
                >
                  <span>All Tasks</span>
                  <span className="rounded-md bg-zinc-800 px-2 py-0.5 text-xs font-semibold text-zinc-200">
                    {tasks.length}
                  </span>
                </NavLink>

                <NavLink
                  to="/add-task"
                  onClick={closeMenu}
                  className={mobileNavLinkClass}
                >
                  <span>+ Add Task</span>
                </NavLink>

                <NavLink
                  to="/profile"
                  onClick={closeMenu}
                  className={mobileNavLinkClass}
                >
                  <span>Profile</span>
                </NavLink>

                <NavLink
                  to="/privacy"
                  onClick={closeMenu}
                  className={mobileNavLinkClass}
                >
                  <span>Privacy Policy</span>
                </NavLink>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="mt-2 flex w-full items-center justify-center gap-2 rounded-lg border border-red-900/40 bg-red-950/30 px-4 py-2.5 text-sm font-semibold text-red-300 transition hover:bg-red-900 hover:text-white"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <>
                <NavLink
                  to="/"
                  onClick={closeMenu}
                  className={mobileNavLinkClass}
                >
                  <span>Home</span>
                </NavLink>

                <NavLink
                  to="/privacy"
                  onClick={closeMenu}
                  className={mobileNavLinkClass}
                >
                  <span>Privacy Policy</span>
                </NavLink>

                <NavLink
                  to="/terms"
                  onClick={closeMenu}
                  className={mobileNavLinkClass}
                >
                  <span>Terms & Conditions</span>
                </NavLink>

                <div className="pt-2">
                  <Link
                    to="/login"
                    onClick={closeMenu}
                    className="btn-primary w-full text-center"
                  >
                    Login
                  </Link>
                </div>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
