import { Controller, Get, Post, Patch, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { IssuesService } from './issues.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { IsString, IsOptional, IsEnum, IsNumber } from 'class-validator';
import { IssueStatus, IssuePriority, IssueType } from './entities/issue.entity';

class CreateIssueDto {
  @IsString()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsEnum(IssueType)
  @IsOptional()
  type?: IssueType;

  @IsEnum(IssuePriority)
  @IsOptional()
  priority?: IssuePriority;

  @IsNumber()
  @IsOptional()
  assigneeId?: number;
}

@UseGuards(JwtAuthGuard)
@Controller('projects/:projectId/issues')
export class IssuesController {
  constructor(private issuesService: IssuesService) {}

  @Get()
  async findAll(
    @Param('projectId') projectId: string,
    @Query('status') status?: IssueStatus,
    @Query('priority') priority?: IssuePriority,
    @Query('type') type?: IssueType,
  ) {
    return this.issuesService.findAll(+projectId, { status, priority, type });
  }

  @Post()
  async create(
    @Param('projectId') projectId: string,
    @Body() createIssueDto: CreateIssueDto,
    @GetUser('userId') userId: number,
  ) {
    return this.issuesService.create(+projectId, createIssueDto, userId);
  }
}

@UseGuards(JwtAuthGuard)
@Controller('issues')
export class IssueDetailsController {
  constructor(private issuesService: IssuesService) {}

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.issuesService.findOne(+id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateIssueDto: any,
    @GetUser('userId') userId: number,
  ) {
    return this.issuesService.update(+id, updateIssueDto, userId);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.issuesService.remove(+id);
  }

  @Get(':id/history')
  async getHistory(@Param('id') id: string) {
    return this.issuesService.getHistory(+id);
  }
}