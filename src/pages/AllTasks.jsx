import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useTasks } from '../context/TaskContext.jsx';
import TaskCard from '../components/TaskCard.jsx';

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
    <section className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white sm:text-3xl">
            All Tasks
          </h1>
          <p className="mt-1 text-sm text-slate-400">
            View, filter, edit, or delete tasks across your workspace.
          </p>
        </div>

        <Link to="/add-task" className="btn-primary">
          + Add Task
        </Link>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
          <span className="text-xs font-medium text-slate-400">Total Tasks</span>
          <p className="mt-1 text-2xl font-extrabold text-white">
            {counts.total}
          </p>
        </div>
        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
          <span className="text-xs font-medium text-amber-300">Pending</span>
          <p className="mt-1 text-2xl font-extrabold text-amber-300">
            {counts.pending}
          </p>
        </div>
        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
          <span className="text-xs font-medium text-sky-300">In Progress</span>
          <p className="mt-1 text-2xl font-extrabold text-sky-300">
            {counts.inProgress}
          </p>
        </div>
        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
          <span className="text-xs font-medium text-emerald-300">
            Completed
          </span>
          <p className="mt-1 text-2xl font-extrabold text-emerald-300">
            {counts.completed}
          </p>
        </div>
      </div>

      <div className="mt-6 grid gap-3 rounded-2xl border border-slate-800 bg-slate-900/60 p-4 sm:grid-cols-3">
        <input
          type="search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search tasks by title or description..."
          className="input-field"
        />

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

      {filteredTasks.length > 0 ? (
        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filteredTasks.map((task) => (
            <TaskCard key={task.id} task={task} />
          ))}
        </div>
      ) : (
        <div className="mt-8 rounded-3xl border border-dashed border-slate-800 bg-slate-900/40 p-10 text-center">
          <h2 className="text-lg font-bold text-white">No Tasks Found</h2>
          <p className="mt-1.5 text-sm text-slate-400">
            {tasks.length === 0
              ? 'Your task list is currently empty. Add your first task or load the sample tasks.'
              : 'No tasks match your current search or filter criteria.'}
          </p>
          <div className="mt-5 flex flex-wrap justify-center gap-3">
            <Link to="/add-task" className="btn-primary">
              + Add Task
            </Link>
            {tasks.length === 0 && (
              <button
                type="button"
                onClick={resetTasks}
                className="btn-secondary"
              >
                Load Sample Tasks
              </button>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
