import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { SprintsService } from './sprints.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { IsString, IsOptional, IsEnum } from 'class-validator';
import { SprintStatus } from './entities/sprint.entity';

class CreateSprintDto {
  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  startDate?: string;

  @IsString()
  @IsOptional()
  endDate?: string;
}

@UseGuards(JwtAuthGuard)
@Controller('projects/:projectId/sprints')
export class SprintsController {
  constructor(private sprintsService: SprintsService) {}

  @Get()
  async findAll(@Param('projectId') projectId: string) {
    return this.sprintsService.findAll(+projectId);
  }

  @Post()
  async create(@Param('projectId') projectId: string, @Body() createSprintDto: CreateSprintDto) {
    return this.sprintsService.create(+projectId, createSprintDto);
  }
}

@UseGuards(JwtAuthGuard)
@Controller('sprints')
export class SprintDetailsController {
  constructor(private sprintsService: SprintsService) {}

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.sprintsService.findOne(+id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateSprintDto: any) {
    return this.sprintsService.update(+id, updateSprintDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.sprintsService.remove(+id);
  }
}