import { api } from './api';
import type { User } from '../types';

interface UserResponse {
  user: User;
}

export async function login(email: string, password: string): Promise<User> {
  const { data } = await api.post<UserResponse>('/api/auth/login', { email, password });
  return data.user;
}

export async function register(payload: {
  email: string;
  password: string;
  name: string;
  role: User['role'];
  phone?: string;
  agency?: string;
}): Promise<User> {
  const { data } = await api.post<UserResponse>('/api/auth/register', payload);
  return data.user;
}

export async function fetchMe(): Promise<User | null> {
  try {
    const { data } = await api.get<UserResponse>('/api/auth/me');
    return data.user;
  } catch {
    return null;
  }
}

export async function logout(): Promise<void> {
  try {
    await api.post('/api/auth/logout');
  } catch {
    /* session may already be cleared */
  }
}
