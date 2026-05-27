import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from './entities/comment.entity';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment)
    private commentRepository: Repository<Comment>,
  ) {}

  async create(issueId: number, content: string, userId: number) {
    const comment = this.commentRepository.create({
      issue_id: issueId,
      user_id: userId,
      content,
    });

    return this.commentRepository.save(comment);
  }

  async findAll(issueId: number) {
    return this.commentRepository.find({
      where: { issue_id: issueId },
      relations: ['user'],
      order: { created_at: 'ASC' },
    });
  }

  async update(id: number, content: string) {
    await this.commentRepository.update(id, { content });
    return this.commentRepository.findOne({ where: { id } });
  }

  async remove(id: number) {
    await this.commentRepository.delete(id);
    return { success: true };
  }
}