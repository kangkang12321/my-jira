import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { IsString } from 'class-validator';

class CreateCommentDto {
  @IsString()
  content: string;
}

@UseGuards(JwtAuthGuard)
@Controller('issues/:issueId/comments')
export class CommentsController {
  constructor(private commentsService: CommentsService) {}

  @Get()
  async findAll(@Param('issueId') issueId: string) {
    return this.commentsService.findAll(+issueId);
  }

  @Post()
  async create(
    @Param('issueId') issueId: string,
    @Body() createCommentDto: CreateCommentDto,
    @GetUser('userId') userId: number,
  ) {
    return this.commentsService.create(+issueId, createCommentDto.content, userId);
  }
}

@UseGuards(JwtAuthGuard)
@Controller('comments')
export class CommentDetailsController {
  constructor(private commentsService: CommentsService) {}

  @Patch(':id')
  async update(@Param('id') id: string, @Body() body: { content: string }) {
    return this.commentsService.update(+id, body.content);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.commentsService.remove(+id);
  }
}