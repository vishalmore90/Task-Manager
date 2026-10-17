import { useNavigate } from 'react-router-dom';
import { useTasks } from '../context/TaskContext.jsx';
import { Calendar, Trash2, Edit3, CheckCircle2, Clock } from 'lucide-react';

const STATUS_BADGE = {
  Pending: 'bg-zinc-800 text-zinc-300 border-zinc-700',
  'In Progress': 'bg-blue-950 text-blue-400 border-blue-800',
  Completed: 'bg-zinc-900 text-zinc-100 border-zinc-600',
};

const PRIORITY_BADGE = {
  High: 'border-red-900/60 bg-red-950/40 text-red-300',
  Medium: 'border-blue-900/60 bg-blue-950/40 text-blue-300',
  Low: 'border-zinc-800 bg-zinc-900 text-zinc-400',
};

export default function TaskCard({ task }) {
  const navigate = useNavigate();
  const { deleteTask, toggleTaskStatus } = useTasks();

  const statusStyle = STATUS_BADGE[task.status] || STATUS_BADGE['In Progress'];
  const priorityStyle = PRIORITY_BADGE[task.priority] || PRIORITY_BADGE.Medium;

  return (
    <article className="flex flex-col justify-between rounded-xl border border-zinc-800 bg-zinc-900/80 p-6 shadow-sm transition hover:border-zinc-700">
      <div>
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
          <button
            type="button"
            onClick={() => toggleTaskStatus(task.id)}
            title="Click to cycle status"
            className={`inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1 text-xs font-semibold transition hover:opacity-80 ${statusStyle}`}
          >
            {task.status === 'Completed' ? (
              <CheckCircle2 className="h-3 w-3" />
            ) : (
              <Clock className="h-3 w-3" />
            )}
            <span>{task.status}</span>
          </button>

          <span
            className={`inline-flex items-center rounded-md border px-2.5 py-1 text-xs font-semibold ${priorityStyle}`}
          >
            {task.priority} Priority
          </span>
        </div>

        <h3 className="text-lg font-bold tracking-tight text-white">
          {task.title}
        </h3>

        <p className="mt-2 text-sm leading-relaxed text-zinc-300 whitespace-pre-line">
          {task.description || 'No additional details provided.'}
        </p>
      </div>

      <div className="mt-6 flex items-center justify-between border-t border-zinc-800 pt-4 text-xs text-zinc-400">
        <span className="inline-flex items-center gap-1.5">
          <Calendar className="h-3.5 w-3.5 text-zinc-500" />
          <span>Due: {task.dueDate || 'Flexible'}</span>
        </span>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => navigate(`/edit-task/${task.id}`)}
            className="inline-flex items-center gap-1 rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-1.5 text-xs font-semibold text-zinc-200 transition hover:bg-zinc-800 hover:text-white"
          >
            <Edit3 className="h-3 w-3" />
            <span>Edit</span>
          </button>
          <button
            type="button"
            onClick={() => deleteTask(task.id)}
            className="inline-flex items-center gap-1 rounded-lg border border-red-900/40 bg-red-950/30 px-3 py-1.5 text-xs font-semibold text-red-300 transition hover:bg-red-900 hover:text-white"
          >
            <Trash2 className="h-3 w-3" />
            <span>Delete</span>
          </button>
        </div>
      </div>
    </article>
  );
}
