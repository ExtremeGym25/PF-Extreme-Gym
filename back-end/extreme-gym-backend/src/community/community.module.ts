import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PublicationsService } from './publications/publications.service';
import { PublicationsController } from './publications/publications.controller';
import { CommentsService } from './comments/comments.service';
import { CommentsController } from './comments/comments.controller';
import { Publication } from './entities/publication.entity';
import { Comment } from './entities/comment.entity';
import { UsersModule } from '../users/users.module';
import { UsersService } from '../users/users.service';
import { EventModule } from '../event/event.module';
import { PlansModule } from '../plans/plans.module';


@Module({
  imports: [
    TypeOrmModule.forFeature([Publication, Comment]),
    UsersModule,
    EventModule,
    PlansModule,
  ],
  providers: [PublicationsService, CommentsService, UsersService],
  controllers: [PublicationsController, CommentsController],
  exports: [PublicationsService],
})
export class CommunityModule {}