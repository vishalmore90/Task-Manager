import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useTasks } from '../context/TaskContext.jsx';
import TaskCard from '../components/TaskCard.jsx';
import { Plus, Search } from 'lucide-react';

export default function AllTasks() {
  const { tasks, resetTasks } = useTasks();
  const [statusFilter, setStatusFilter] = useState('All');
  const [priorityFilter, setPriorityFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      const matchesStatus =
        statusFilter === 'All' || task.status === statusFilter;
      const matchesPriority =
        priorityFilter === 'All' || task.priority === priorityFilter;
      const query = searchQuery.trim().toLowerCase();
      const matchesSearch =
        !query ||
        task.title.toLowerCase().includes(query) ||
        (task.description && task.description.toLowerCase().includes(query));
      return matchesStatus && matchesPriority && matchesSearch;
    });
  }, [tasks, statusFilter, priorityFilter, searchQuery]);

  const counts = useMemo(() => {
    return {
      total: tasks.length,
      pending: tasks.filter((t) => t.status === 'Pending').length,
      inProgress: tasks.filter((t) => t.status === 'In Progress').length,
      completed: tasks.filter((t) => t.status === 'Completed').length,
    };
  }, [tasks]);

  return (
    <section className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
      {/* Header section with responsive full-width mobile button */}
      <div className="flex flex-col gap-4 border-b border-zinc-800 pb-6 sm:flex-row sm:items-center sm:justify-between sm:pb-8">
        <div>
          <h1 className="font-display text-2xl font-extrabold tracking-tight text-white sm:text-4xl">
            All Tasks
          </h1>
          <p className="mt-1 text-xs text-zinc-300 sm:text-sm">
            Real-time workspace backlog and active task registry.
          </p>
        </div>

        <Link to="/add-task" className="btn-primary w-full sm:w-auto text-center">
          <Plus className="h-4 w-4" />
          <span>Add New Task</span>
        </Link>
      </div>

      {/* Verified Task Metric Grid */}
      <div className="mt-6 grid grid-cols-2 gap-3 sm:mt-8 sm:gap-4 sm:grid-cols-4">
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/80 p-4 sm:p-5">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400 sm:text-xs">
            Total Backlog
          </span>
          <p className="mt-1.5 text-2xl font-extrabold text-white sm:text-3xl">
            {counts.total}
          </p>
        </div>
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/80 p-4 sm:p-5">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400 sm:text-xs">
            Pending
          </span>
          <p className="mt-1.5 text-2xl font-extrabold text-zinc-200 sm:text-3xl">
            {counts.pending}
          </p>
        </div>
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/80 p-4 sm:p-5">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-blue-400 sm:text-xs">
            In Progress
          </span>
          <p className="mt-1.5 text-2xl font-extrabold text-blue-400 sm:text-3xl">
            {counts.inProgress}
          </p>
        </div>
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/80 p-4 sm:p-5">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400 sm:text-xs">
            Completed
          </span>
          <p className="mt-1.5 text-2xl font-extrabold text-white sm:text-3xl">
            {counts.completed}
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="mt-6 grid gap-3 rounded-xl border border-zinc-800 bg-zinc-900/60 p-3.5 sm:mt-8 sm:gap-4 sm:p-4 sm:grid-cols-3">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3.5 top-3 h-4 w-4 text-zinc-500" />
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by title or description..."
            className="input-field pl-10"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="input-field"
          aria-label="Filter by status"
        >
          <option value="All">All Statuses</option>
          <option value="Pending">Pending</option>
          <option value="In Progress">In Progress</option>
          <option value="Completed">Completed</option>
        </select>

        <select
          value={priorityFilter}
          onChange={(e) => setPriorityFilter(e.target.value)}
          className="input-field"
          aria-label="Filter by priority"
        >
          <option value="All">All Priorities</option>
          <option value="High">High Priority</option>
          <option value="Medium">Medium Priority</option>
          <option value="Low">Low Priority</option>
        </select>
      </div>

      {/* Task Grid */}
      {filteredTasks.length > 0 ? (
        <div className="mt-6 grid gap-4 sm:mt-8 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredTasks.map((task) => (
            <TaskCard key={task.id} task={task} />
          ))}
        </div>
      ) : (
        <div className="mt-8 rounded-xl border border-dashed border-zinc-800 bg-zinc-900/30 p-8 text-center sm:mt-12 sm:p-12">
          <h2 className="text-base font-bold text-white sm:text-lg">No Tasks Found</h2>
          <p className="mt-2 text-xs text-zinc-400 sm:text-sm">
            {tasks.length === 0
              ? 'Your workspace is clear. Add your first task below.'
              : 'No tasks match the active filter criteria.'}
          </p>
          <div className="mt-5 sm:mt-6">
            {tasks.length === 0 ? (
              <button
                type="button"
                onClick={resetTasks}
                className="btn-primary w-full sm:w-auto"
              >
                Load Sample Tasks
              </button>
            ) : (
              <Link to="/add-task" className="btn-primary w-full sm:w-auto">
                Add Task
              </Link>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
