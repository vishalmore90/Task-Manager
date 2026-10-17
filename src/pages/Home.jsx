import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useTasks, INITIAL_TASKS } from '../context/TaskContext.jsx';
import TaskCard from '../components/TaskCard.jsx';
import { CheckCircle2, ShieldCheck, Zap } from 'lucide-react';

export default function Home() {
  const { isAuthenticated, user } = useAuth();
  const { tasks } = useTasks();

  return (
    <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-20 lg:py-24">
      {/* Hero Section */}
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/90 p-6 sm:p-12 lg:p-16">
        <span className="inline-flex items-center gap-2 rounded-md border border-zinc-800 bg-zinc-900 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-blue-400">
          Productivity Architecture
        </span>

        <h1 className="mt-5 font-display text-3xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
          Execute Tasks with Precision.
        </h1>

        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-zinc-200 sm:text-lg">
          Track milestones from backlog to completion with instant state synchronization and data isolation.
        </p>

        {/* Strictly One Button per Section */}
        <div className="mt-8">
          {isAuthenticated ? (
            <Link to="/tasks" className="btn-primary w-full sm:w-auto">
              Open Workspace ({tasks.length} Tasks)
            </Link>
          ) : (
            <Link to="/login" className="btn-primary w-full sm:w-auto">
              Sign In to Workspace
            </Link>
          )}
        </div>

        {isAuthenticated && (
          <div className="mt-6 rounded-lg border border-zinc-800 bg-zinc-950 p-4 text-xs leading-relaxed text-zinc-300 sm:text-sm">
            Active session: <span className="font-semibold text-white">{user?.name}</span>{' '}
            <span className="text-zinc-400 break-all">({user?.email})</span> with {tasks.length} tracked items.
          </div>
        )}
      </div>

      {/* Grid Features */}
      <div className="mt-8 grid gap-4 sm:mt-12 sm:gap-6 sm:grid-cols-3">
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/70 p-5 sm:p-6">
          <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-zinc-800 text-blue-400">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <h2 className="text-base font-bold text-white sm:text-lg">
            Session Security
          </h2>
          <p className="mt-2 text-xs leading-relaxed text-zinc-300 sm:text-sm">
            Client-side hashing, rate-limited access, and isolated user workspace partitions.
          </p>
        </div>

        <div className="rounded-xl border border-zinc-800 bg-zinc-900/70 p-5 sm:p-6">
          <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-zinc-800 text-blue-400">
            <Zap className="h-5 w-5" />
          </div>
          <h2 className="text-base font-bold text-white sm:text-lg">
            Fast Form Validation
          </h2>
          <p className="mt-2 text-xs leading-relaxed text-zinc-300 sm:text-sm">
            Reactive form state with automated pre-filling and XSS sanitization.
          </p>
        </div>

        <div className="rounded-xl border border-zinc-800 bg-zinc-900/70 p-5 sm:p-6">
          <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-zinc-800 text-blue-400">
            <CheckCircle2 className="h-5 w-5" />
          </div>
          <h2 className="text-base font-bold text-white sm:text-lg">
            Deterministic CRUD
          </h2>
          <p className="mt-2 text-xs leading-relaxed text-zinc-300 sm:text-sm">
            Instant priority filtering, multi-condition search, and local persistence.
          </p>
        </div>
      </div>

      {/* Example Tasks Preview */}
      <div className="mt-12 sm:mt-16">
        <div className="mb-6">
          <span className="text-xs font-semibold uppercase tracking-wider text-blue-400">
            Preview
          </span>
          <h2 className="mt-1 font-display text-2xl font-bold tracking-tight text-white sm:text-3xl">
            Example Tasks
          </h2>
          <p className="mt-1 text-xs text-zinc-300 sm:text-sm">
            Sample milestones demonstrating status indicators, priority tags, and action controls.
          </p>
        </div>

        <div className="grid gap-4 sm:gap-6 sm:grid-cols-2">
          {INITIAL_TASKS.slice(0, 2).map((task) => (
            <TaskCard key={task.id} task={task} />
          ))}
        </div>
      </div>
    </section>
  );
}
