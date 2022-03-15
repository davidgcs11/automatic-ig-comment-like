import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CommentLikeService } from './comment-like.service';

@Module({
  imports:[ConfigModule],
  providers: [CommentLikeService],
  exports: [CommentLikeService],
})
export class CommentLikeModule {}
