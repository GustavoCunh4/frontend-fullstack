import { apiFetch } from './client';

export type TaskStatus = 'pending' | 'in_progress' | 'completed';
export type TaskPriority = 'low' | 'medium' | 'high';

export interface Task {
  id: string;
  title: string;
  description: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface TaskFilters {
  status?: TaskStatus | '';
  priority?: TaskPriority | '';
  title?: string;
  dueDate?: string;
}

export interface TaskPayload {
  title: string;
  description?: string | null;
  status?: TaskStatus;
  priority?: TaskPriority;
  dueDate?: string | null;
}

type TaskResponse = { task: Task };
type TasksResponse = { tasks: Task[] };

function buildQuery(filters: TaskFilters) {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value) {
      params.append(key, value);
    }
  });
  const qs = params.toString();
  return qs ? `?${qs}` : '';
}

export async function fetchTasks(filters: TaskFilters, token: string) {
  return apiFetch<TasksResponse>(`/tasks${buildQuery(filters)}`, {
    token
  });
}

export async function createTask(payload: TaskPayload, token: string) {
  return apiFetch<TaskResponse>('/tasks', {
    method: 'POST',
    body: payload,
    token
  });
}

export async function updateTask(
  taskId: string,
  payload: TaskPayload,
  token: string
) {
  return apiFetch<TaskResponse>(`/tasks/${taskId}`, {
    method: 'PUT',
    body: payload,
    token
  });
}

export async function deleteTask(taskId: string, token: string) {
  return apiFetch<void>(`/tasks/${taskId}`, {
    method: 'DELETE',
    token
  });
}
