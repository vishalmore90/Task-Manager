import { useNavigate } from 'react-router-dom';
import { useTasks } from '../context/TaskContext.jsx';

const STATUS_BADGE_STYLES = {
  Pending: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
  'In Progress': 'bg-sky-500/15 text-sky-300 border-sky-500/30',
  Completed: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
};

const PRIORITY_BADGE_STYLES = {
  High: 'bg-rose-500/15 text-rose-300 border-rose-500/30',
  Medium: 'bg-indigo-500/15 text-indigo-300 border-indigo-500/30',
  Low: 'bg-slate-500/20 text-slate-300 border-slate-500/30',
};

export default function TaskCard({ task }) {
  const navigate = useNavigate();
  const { deleteTask, toggleTaskStatus } = useTasks();

  const statusStyle =
    STATUS_BADGE_STYLES[task.status] || STATUS_BADGE_STYLES['In Progress'];
  const priorityStyle =
    PRIORITY_BADGE_STYLES[task.priority] || PRIORITY_BADGE_STYLES.Medium;

  const handleEdit = () => {
    navigate(`/edit-task/${task.id}`);
  };

  const handleDelete = () => {
    deleteTask(task.id);
  };

  return (
    <article className="group flex flex-col justify-between rounded-2xl border border-slate-800 bg-slate-900/75 p-5 shadow-lg transition hover:border-indigo-500/50 hover:bg-slate-900">
      <div>
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <button
            type="button"
            onClick={() => toggleTaskStatus(task.id)}
            title="Click to cycle task status"
            className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition hover:opacity-85 ${statusStyle}`}
          >
            {task.status}
          </button>

          <span
            className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${priorityStyle}`}
          >
            {task.priority} Priority
          </span>
        </div>

        <h3 className="text-lg font-bold text-white group-hover:text-indigo-300 transition">
          {task.title}
        </h3>

        <p className="mt-2 text-sm leading-relaxed text-slate-300 whitespace-pre-line">
          {task.description || 'No description provided.'}
        </p>
      </div>

      <div className="mt-5 flex items-center justify-between border-t border-slate-800/80 pt-3.5 text-xs text-slate-400">
        <span>Due: {task.dueDate || 'Flexible'}</span>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleEdit}
            className="rounded-lg border border-indigo-500/30 bg-indigo-500/10 px-3 py-1.5 text-xs font-semibold text-indigo-300 transition hover:bg-indigo-600 hover:text-white"
          >
            Edit
          </button>
          <button
            type="button"
            onClick={handleDelete}
            className="btn-danger"
          >
            Delete
          </button>
        </div>
      </div>
    </article>
  );
}
