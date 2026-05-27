import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { Project } from '../../projects/entities/project.entity';
import { User } from '../../users/entities/user.entity';
import { Sprint } from '../../sprints/entities/sprint.entity';
import { Comment } from '../../comments/entities/comment.entity';
import { IssueChange } from './issue-change.entity';

export enum IssueStatus {
  BACKLOG = 'backlog',
  TODO = 'todo',
  IN_PROGRESS = 'in_progress',
  IN_REVIEW = 'in_review',
  DONE = 'done',
  CANCELLED = 'cancelled',
}

export enum IssuePriority {
  CRITICAL = 'critical',
  HIGH = 'high',
  MEDIUM = 'medium',
  LOW = 'low',
  LOWEST = 'lowest',
}

export enum IssueType {
  EPIC = 'epic',
  STORY = 'story',
  TASK = 'task',
  BUG = 'bug',
  SUBTASK = 'subtask',
}

@Entity('issues')
export class Issue {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'project_id' })
  project_id: number;

  @ManyToOne(() => Project, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'project_id' })
  project: Project;

  @Column({ length: 20 })
  key: string;

  @Column()
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({
    type: 'simple-enum',
    enum: IssueStatus,
    default: IssueStatus.BACKLOG,
  })
  status: IssueStatus;

  @Column({
    type: 'simple-enum',
    enum: IssuePriority,
    default: IssuePriority.MEDIUM,
  })
  priority: IssuePriority;

  @Column({
    type: 'simple-enum',
    enum: IssueType,
    default: IssueType.TASK,
  })
  type: IssueType;

  @Column({ name: 'assignee_id', nullable: true })
  assignee_id: number;

  @ManyToOne(() => User, {
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'assignee_id' })
  assignee: User;

  @Column({ name: 'reporter_id' })
  reporter_id: number;

  @ManyToOne(() => User, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'reporter_id' })
  reporter: User;

  @Column({ name: 'sprint_id', nullable: true })
  sprint_id: number;

  @ManyToOne(() => Sprint, (sprint) => sprint.issues, {
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'sprint_id' })
  sprint: Sprint;

  @Column({ name: 'parent_id', nullable: true })
  parent_id: number;

  @ManyToOne(() => Issue, (issue) => issue.children, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'parent_id' })
  parent: Issue;

  @OneToMany(() => Issue, (issue) => issue.parent)
  children: Issue[];

  @Column({ name: 'story_points', nullable: true })
  story_points: number;

  @Column({ type: 'date', nullable: true })
  due_date: Date;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @OneToMany(() => Comment, (comment) => comment.issue)
  comments: Comment[];

  @OneToMany(() => IssueChange, (change) => change.issue)
  changes: IssueChange[];
}