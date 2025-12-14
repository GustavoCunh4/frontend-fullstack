import { apiFetch } from './client';

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface AuthResponse {
  message: string;
  token: string;
}

export async function registerRequest(payload: RegisterPayload) {
  return apiFetch<{ message: string } | AuthResponse>('/register', {
    method: 'POST',
    body: payload
  });
}

export async function loginRequest(payload: LoginPayload) {
  return apiFetch<AuthResponse>('/login', {
    method: 'POST',
    body: payload
  });
}
