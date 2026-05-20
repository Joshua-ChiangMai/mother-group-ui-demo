import { httpRequest } from './http-client';
import { Application, Group, GroupMembership, Mother } from './types';

/** Typed client for the deployed Project Alpha NestJS API. */
export const api = {
  listMothers: () => httpRequest<Mother[]>('/mothers'),
  listGroups: () => httpRequest<Group[]>('/groups'),
  getGroup: (groupId: number) => httpRequest<Group>(`/groups/${groupId}`),
  listApplications: () => httpRequest<Application[]>('/applications'),
  getApplication: (applicationId: number) => httpRequest<Application>(`/applications/${applicationId}`),
  updateApplication: (applicationId: number, body: Partial<Application>) =>
    httpRequest<Application>(`/applications/${applicationId}`, {
      method: 'PATCH',
      body: JSON.stringify(body),
    }),
  createApplication: (body: Record<string, unknown>) =>
    httpRequest<Application>('/applications', {
      method: 'POST',
      body: JSON.stringify(body),
    }),
  listMemberships: () => httpRequest<GroupMembership[]>('/group-memberships'),
  createMembership: (body: Record<string, unknown>) =>
    httpRequest<GroupMembership>('/group-memberships', {
      method: 'POST',
      body: JSON.stringify(body),
    }),
};
