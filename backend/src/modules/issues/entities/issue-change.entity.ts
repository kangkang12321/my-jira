import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Issue } from './issue.entity';
import { User } from '../../users/entities/user.entity';

@Entity('issue_changes')
export class IssueChange {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'issue_id' })
  issue_id: number;

  @ManyToOne(() => Issue, (issue) => issue.changes, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'issue_id' })
  issue: Issue;

  @Column({ name: 'user_id' })
  user_id: number;

  @ManyToOne(() => User, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ name: 'field_name' })
  field_name: string;

  @Column({ type: 'text', nullable: true })
  old_value: string;

  @Column({ type: 'text', nullable: true })
  new_value: string;

  @CreateDateColumn()
  created_at: Date;
}