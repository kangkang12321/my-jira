export interface User {
  id: number;
  email: string;
  username: string;
  avatarUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Project {
  id: number;
  key: string;
  name: string;
  description: string | null;
  ownerId: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProjectMember {
  id: number;
  projectId: number;
  userId: number;
  role: 'owner' | 'admin' | 'developer' | 'viewer';
  joinedAt: Date;
  user?: User;
}

export type IssueStatus = 'backlog' | 'todo' | 'in_progress' | 'in_review' | 'done' | 'cancelled';
export type IssuePriority = 'critical' | 'high' | 'medium' | 'low' | 'lowest';
export type IssueType = 'epic' | 'story' | 'task' | 'bug' | 'subtask';

export interface Issue {
  id: number;
  projectId: number;
  key: string;
  title: string;
  description: string | null;
  status: IssueStatus;
  priority: IssuePriority;
  type: IssueType;
  assigneeId: number | null;
  reporterId: number;
  sprintId: number | null;
  parentId: number | null;
  storyPoints: number | null;
  dueDate: Date | null;
  createdAt: Date;
  updatedAt: Date;
  assignee?: User;
  reporter?: User;
}

export type SprintStatus = 'planned' | 'active' | 'completed';

export interface Sprint {
  id: number;
  projectId: number;
  name: string;
  description: string | null;
  status: SprintStatus;
  startDate: Date | null;
  endDate: Date | null;
  createdAt: Date;
}

export interface Comment {
  id: number;
  issueId: number;
  userId: number;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  user?: User;
}

export interface IssueChange {
  id: number;
  issueId: number;
  userId: number;
  fieldName: string;
  oldValue: string | null;
  newValue: string | null;
  createdAt: Date;
}