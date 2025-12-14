import { useCallback, useEffect, useState } from 'react';
import {
  createTask,
  deleteTask,
  fetchTasks,
  updateTask
} from '../../api/tasks';
import type { Task, TaskFilters, TaskPayload } from '../../api/tasks';
import { isApiError } from '../../api/client';
import { useAuth } from '../../contexts/AuthContext';
import { TaskForm } from '../../components/TaskForm';
import { TaskFiltersBar } from '../../components/TaskFiltersBar';
import { TaskTable } from '../../components/TaskTable';
import { LoadingOverlay } from '../../components/LoadingOverlay';
import { toastWithLink } from '../../utils/toast';
import { getErrorMessage } from '../../utils/error';

const emptyFilters: TaskFilters = {
  status: '',
  priority: '',
  title: '',
  dueDate: ''
};

export default function DashboardPage() {
  const { email, token, logout } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filters, setFilters] = useState<TaskFilters>(emptyFilters);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const loadTasks = useCallback(
    async (criteria: TaskFilters) => {
      if (!token) return;
      setLoading(true);
      try {
        const data = await fetchTasks(criteria, token);
        setTasks(data.tasks);
      } catch (error) {
        if (isApiError(error) && error.status === 401) {
          logout({
            reason: 'unauthorized',
            message: 'Token inválido ou expirado. Faça login novamente.'
          });
          return;
        }
        toastWithLink(
          'error',
          getErrorMessage(error, 'Falha ao carregar tarefas.')
        );
      } finally {
        setLoading(false);
      }
    },
    [token, logout]
  );

  useEffect(() => {
    loadTasks(filters);
  }, [loadTasks, filters]);

  const handleSubmitTask = async (payload: TaskPayload) => {
    if (!token) return;
    setSubmitting(true);
    try {
      if (editingTask) {
        await updateTask(editingTask.id, payload, token);
        toastWithLink('success', 'Tarefa atualizada com sucesso!');
      } else {
        await createTask(payload, token);
        toastWithLink('success', 'Tarefa criada com sucesso!');
      }
      setEditingTask(null);
      await loadTasks(filters);
    } catch (error) {
      if (isApiError(error) && error.status === 401) {
        logout({
          reason: 'unauthorized',
          message: 'Sessão expirada durante a operação.'
        });
        return;
      }
      toastWithLink('error', getErrorMessage(error));
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteTask = async (task: Task) => {
    if (!token) return;
    const confirmed = window.confirm(
      `Tem certeza que deseja excluir "${task.title}"?`
    );
    if (!confirmed) return;

    setDeletingId(task.id);
    try {
      await deleteTask(task.id, token);
      toastWithLink('success', 'Tarefa excluída.');
      if (editingTask?.id === task.id) {
        setEditingTask(null);
      }
      await loadTasks(filters);
    } catch (error) {
      if (isApiError(error) && error.status === 401) {
        logout({
          reason: 'unauthorized',
          message: 'Sua sessão expirou durante a exclusão.'
        });
        return;
      }
      toastWithLink('error', getErrorMessage(error));
    } finally {
      setDeletingId(null);
    }
  };

  const handleApplyFilters = (next: TaskFilters) => {
    setFilters(next);
  };

  const handleResetFilters = () => {
    setFilters(emptyFilters);
  };

  const handleLogout = () => {
    logout({ reason: 'manual' });
  };

  return (
    <div className="dashboard-shell">
      <header className="dashboard-header">
        <div>
          <p className="eyebrow">Área autenticada</p>
          <h1>Minhas tarefas</h1>
          <p>CRUD protegido via token guardado em LocalStorage.</p>
        </div>
        <div className="user-box">
          <span>{email}</span>
          <button type="button" className="ghost" onClick={handleLogout}>
            Sair
          </button>
        </div>
      </header>

      <TaskForm
        editingTask={editingTask}
        submitting={submitting}
        onSubmit={handleSubmitTask}
        onCancelEdit={() => setEditingTask(null)}
      />

      <TaskFiltersBar
        initialFilters={filters}
        onApply={handleApplyFilters}
        onReset={handleResetFilters}
      />

      <section className="tasks-area">
        {loading ? (
          <LoadingOverlay message="Buscando tarefas..." size="sm" />
        ) : (
          <TaskTable
            tasks={tasks}
            onEdit={setEditingTask}
            onDelete={handleDeleteTask}
            deletingId={deletingId}
          />
        )}
      </section>
    </div>
  );
}
