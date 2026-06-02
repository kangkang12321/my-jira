import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards, Request } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { IsString, IsOptional } from 'class-validator';

class CreateProjectDto {
  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;
}

class UpdateProjectDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  description?: string;
}

@UseGuards(JwtAuthGuard)
@Controller('projects')
export class ProjectsController {
  constructor(private projectsService: ProjectsService) {}

  @Get()
  async findAll(@GetUser('userId') userId: number) {
    return this.projectsService.findAll(userId);
  }

  @Post()
  async create(
    @Body() createProjectDto: CreateProjectDto,
    @GetUser('userId') userId: number,
    @GetUser('email') email: string,
  ) {
    return this.projectsService.create(
      createProjectDto.name,
      createProjectDto.description,
      userId,
      email,
    );
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.projectsService.findOne(+id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateProjectDto: UpdateProjectDto) {
    return this.projectsService.update(+id, updateProjectDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.projectsService.remove(+id);
  }

  @Get(':id/members')
  async getMembers(@Param('id') id: string) {
    return this.projectsService.getMembers(+id);
  }

  @Post(':id/members')
  async addMember(
    @Param('id') id: string,
    @Body() body: { email: string; role?: string },
  ) {
    // TODO: 根据邮箱查找用户 ID
    return this.projectsService.addMember(+id, 1, body.role || 'developer');
  }

  @Delete(':id/members/:userId')
  async removeMember(@Param('id') id: string, @Param('userId') userId: string) {
    return this.projectsService.removeMember(+id, +userId);
  }
}
