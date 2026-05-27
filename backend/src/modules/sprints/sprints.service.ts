import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Sprint, SprintStatus } from './entities/sprint.entity';

@Injectable()
export class SprintsService {
  constructor(
    @InjectRepository(Sprint)
    private sprintRepository: Repository<Sprint>,
  ) {}

  async create(projectId: number, createSprintDto: any) {
    const sprint = this.sprintRepository.create({
      project_id: projectId,
      name: createSprintDto.name,
      description: createSprintDto.description,
      start_date: createSprintDto.startDate,
      end_date: createSprintDto.endDate,
      status: SprintStatus.PLANNED,
    });

    return this.sprintRepository.save(sprint);
  }

  async findAll(projectId: number) {
    return this.sprintRepository.find({
      where: { project_id: projectId },
      relations: ['issues'],
      order: { created_at: 'DESC' },
    });
  }

  async findOne(id: number) {
    return this.sprintRepository.findOne({
      where: { id },
      relations: ['project', 'issues', 'issues.assignee'],
    });
  }

  async update(id: number, updateSprintDto: any) {
    await this.sprintRepository.update(id, updateSprintDto);
    return this.findOne(id);
  }

  async remove(id: number) {
    await this.sprintRepository.delete(id);
    return { success: true };
  }
}