import type { Task } from '../api/tasks';
import { formatDate, formatDateTime } from '../utils/date';
import clsx from 'clsx';

interface TaskTableProps {
  tasks: Task[];
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
  deletingId?: string | null;
}

export function TaskTable({
  tasks,
  onEdit,
  onDelete,
  deletingId
}: TaskTableProps) {
  if (tasks.length === 0) {
    return (
      <div className="card empty">
        <p>Nenhuma tarefa encontrada com os filtros atuais.</p>
      </div>
    );
  }

  return (
    <div className="card table-wrapper">
      <table>
        <thead>
          <tr>
            <th>Título</th>
            <th>Status</th>
            <th>Prioridade</th>
            <th>Data limite</th>
            <th>Atualizado em</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {tasks.map(task => (
            <tr key={task.id}>
              <td>
                <strong>{task.title}</strong>
                {task.description && (
                  <p className="muted">{task.description}</p>
                )}
              </td>
              <td>
                <span className={clsx('pill', task.status)}>
                  {task.status === 'pending'
                    ? 'Pendente'
                    : task.status === 'in_progress'
                      ? 'Em andamento'
                      : 'Concluída'}
                </span>
              </td>
              <td>
                <span className={clsx('pill', task.priority)}>
                  {task.priority === 'low'
                    ? 'Baixa'
                    : task.priority === 'medium'
                      ? 'Média'
                      : 'Alta'}
                </span>
              </td>
              <td>{formatDate(task.dueDate)}</td>
              <td>{formatDateTime(task.updatedAt)}</td>
              <td className="row-actions">
                <button type="button" className="ghost" onClick={() => onEdit(task)}>
                  Editar
                </button>
                <button
                  type="button"
                  className="danger"
                  onClick={() => onDelete(task)}
                  disabled={deletingId === task.id}
                >
                  {deletingId === task.id ? 'Removendo...' : 'Excluir'}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
