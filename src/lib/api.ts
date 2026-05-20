import { Application, Group, GroupMembership, Mother } from './types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers ?? {}),
    },
    ...init,
  });

  const text = await response.text();
  const payload = text ? JSON.parse(text) : null;

  if (!response.ok) {
    const message = payload?.message || `Request failed with status ${response.status}`;
    throw new Error(message);
  }

  return payload as T;
}

export const api = {
  listMothers: () => request<Mother[]>('/mothers'),
  listGroups: () => request<Group[]>('/groups'),
  getGroup: (groupId: number) => request<Group>(`/groups/${groupId}`),
  listApplications: () => request<Application[]>('/applications'),
  getApplication: (applicationId: number) => request<Application>(`/applications/${applicationId}`),
  updateApplication: (applicationId: number, body: Partial<Application>) =>
    request<Application>(`/applications/${applicationId}`, {
      method: 'PATCH',
      body: JSON.stringify(body),
    }),
  createApplication: (body: Record<string, unknown>) =>
    request<Application>('/applications', {
      method: 'POST',
      body: JSON.stringify(body),
    }),
  listMemberships: () => request<GroupMembership[]>('/group-memberships'),
  createMembership: (body: Record<string, unknown>) =>
    request<GroupMembership>('/group-memberships', {
      method: 'POST',
      body: JSON.stringify(body),
    }),
};
