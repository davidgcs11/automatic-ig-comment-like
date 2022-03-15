import { Controller, Get } from '@nestjs/common';
import { CommentLikeService } from './comment-like/comment-like.service';

@Controller()
export class AppController {
  constructor(
    private readonly commentLikeService: CommentLikeService,
    ) {}

  @Get('check-comment-likes')
  async checkLikes() {
    return this.commentLikeService.monitorComments();
  }
  
}
