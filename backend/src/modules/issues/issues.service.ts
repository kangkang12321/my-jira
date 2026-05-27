import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Issue, IssueStatus, IssuePriority, IssueType } from './entities/issue.entity';
import { IssueChange } from './entities/issue-change.entity';

@Injectable()
export class IssuesService {
  constructor(
    @InjectRepository(Issue)
    private issueRepository: Repository<Issue>,
    @InjectRepository(IssueChange)
    private changeRepository: Repository<IssueChange>,
  ) {}

  async create(projectId: number, createIssueDto: any, reporterId: number) {
    // 生成 Issue Key
    const projectIssues = await this.issueRepository.count({ where: { project_id: projectId } });
    const key = `PROJ-${(projectIssues + 1).toString().padStart(3, '0')}`;

    const issue = this.issueRepository.create({
      project_id: projectId,
      key,
      title: createIssueDto.title,
      description: createIssueDto.description,
      type: createIssueDto.type || IssueType.TASK,
      priority: createIssueDto.priority || IssuePriority.MEDIUM,
      status: IssueStatus.BACKLOG,
      reporter_id: reporterId,
      assignee_id: createIssueDto.assigneeId || null,
    });

    return this.issueRepository.save(issue);
  }

  async findAll(projectId: number, filters?: any) {
    const where: any = { project_id: projectId };

    if (filters?.status) {
      where.status = filters.status;
    }
    if (filters?.priority) {
      where.priority = filters.priority;
    }
    if (filters?.type) {
      where.type = filters.type;
    }

    return this.issueRepository.find({
      where,
      relations: ['assignee', 'reporter', 'sprint'],
      order: { created_at: 'DESC' },
    });
  }

  async findOne(id: number) {
    return this.issueRepository.findOne({
      where: { id },
      relations: ['assignee', 'reporter', 'sprint', 'project', 'comments', 'comments.user'],
    });
  }

  async update(id: number, updateIssueDto: any, userId: number) {
    const issue = await this.findOne(id);

    // 记录变更
    const changes = [];
    for (const [key, value] of Object.entries(updateIssueDto)) {
      const issueKey = key as keyof Issue;
      if (issue[issueKey] !== value) {
        changes.push({
          issue_id: id,
          user_id: userId,
          field_name: key,
          old_value: String(issue[issueKey] || ''),
          new_value: String(value || ''),
        });
      }
    }

    // 保存变更历史
    if (changes.length > 0) {
      await this.changeRepository.save(changes);
    }

    await this.issueRepository.update(id, updateIssueDto);
    return this.findOne(id);
  }

  async remove(id: number) {
    await this.issueRepository.delete(id);
    return { success: true };
  }

  async getHistory(issueId: number) {
    return this.changeRepository.find({
      where: { issue_id: issueId },
      relations: ['user'],
      order: { created_at: 'DESC' },
    });
  }
}