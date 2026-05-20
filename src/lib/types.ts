export interface Mother {
  id: number;
  name: string;
  email: string;
  phone?: string | null;
  locationPreference?: string | null;
  availabilityNotes?: string | null;
  description?: string | null;
}

export interface GroupMeeting {
  id: number;
  groupId: number;
  name: string;
  description?: string | null;
  meetingDay: string;
  startTime: string;
  endTime: string;
  locationText?: string | null;
}

export interface GroupMembership {
  id: number;
  motherId: number;
  groupId: number;
  name: string;
  description?: string | null;
  status: string;
  joinedAt?: string;
  mother?: Mother;
  group?: Group;
}

export interface Application {
  id: number;
  motherId: number;
  groupId: number;
  reviewerMotherId?: number | null;
  name: string;
  description?: string | null;
  status: string;
  availabilityNotes?: string | null;
  interviewScheduledAt?: string | null;
  mother?: Mother;
  group?: Group;
  reviewer?: Mother | null;
}

export interface Group {
  id: number;
  name: string;
  description?: string | null;
  leaderMotherId: number;
  locationRegion: string;
  capacity: number;
  leader?: Mother;
  meetings?: GroupMeeting[];
  applications?: Application[];
  memberships?: GroupMembership[];
}

export interface ApiError {
  message: string;
  details?: unknown;
}
