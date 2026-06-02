import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Project } from './entities/project.entity';
import { ProjectMember } from './entities/project-member.entity';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project)
    private projectRepository: Repository<Project>,
    @InjectRepository(ProjectMember)
    private memberRepository: Repository<ProjectMember>,
  ) {}

  async create(name: string, description: string, ownerId: number, ownerEmail: string) {
    // 生成项目 Key
    const key = await this.generateProjectKey(name);

    const project = this.projectRepository.create({
      name,
      description,
      key,
      owner_id: ownerId,
      owner_email: ownerEmail,
    });

    const savedProject = await this.projectRepository.save(project);

    // 自动添加创建者为所有者
    await this.addMember(savedProject.id, ownerId, 'owner');

    return this.findOne(savedProject.id);
  }

  async findAll(userId: number) {
    const members = await this.memberRepository.find({
      where: { user_id: userId },
      relations: ['project'],
    });

    return members.map(m => m.project);
  }

  async findOne(id: number) {
    const project = await this.projectRepository.findOne({
      where: { id },
      relations: ['members', 'members.user'],
    });

    if (!project) {
      throw new NotFoundException('项目不存在');
    }

    return project;
  }

  async update(id: number, updateProjectDto: any) {
    await this.projectRepository.update(id, updateProjectDto);
    return this.findOne(id);
  }

  async remove(id: number) {
    await this.projectRepository.delete(id);
    return { success: true };
  }

  async getMembers(projectId: number) {
    const members = await this.memberRepository.find({
      where: { project_id: projectId },
      relations: ['user'],
    });

    return members.map(m => ({
      ...m,
      user: {
        id: m.user.id,
        email: m.user.email,
        username: m.user.username,
        avatar_url: m.user.avatar_url,
      },
    }));
  }

  async addMember(projectId: number, userId: number, role: string = 'developer') {
    const existing = await this.memberRepository.findOne({
      where: { project_id: projectId, user_id: userId },
    });

    if (existing) {
      throw new ForbiddenException('用户已在项目中');
    }

    const member = this.memberRepository.create({
      project_id: projectId,
      user_id: userId,
      role,
    });

    return this.memberRepository.save(member);
  }

  async removeMember(projectId: number, userId: number) {
    await this.memberRepository.delete({
      project_id: projectId,
      user_id: userId,
    });

    return { success: true };
  }

  private async generateProjectKey(name: string): Promise<string> {
    const baseKey = name
      .toUpperCase()
      .replace(/[^A-Z0-9]/g, '')
      .substring(0, 6);

    let key = baseKey;
    let suffix = 1;

    while (await this.projectRepository.findOne({ where: { key } })) {
      key = `${baseKey}${suffix}`;
      suffix++;
    }

    return key;
  }
}
