import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Cron, CronExpression } from '@nestjs/schedule';
import { IgApiClient } from 'instagram-private-api';

@Injectable()
export class CommentLikeService {
    private logger = new Logger(CommentLikeService.name);

    constructor(
        private readonly configService: ConfigService,
    ) { }

    @Cron(CronExpression.EVERY_5_MINUTES)
    async monitorComments() {
        /// Read env instagram credentials
        const username = this.configService.get('IG_USERNAME');
        const password = this.configService.get('IG_PASSWORD');

        /// Generate [IgApiClient]
        const client = new IgApiClient();
        client.state.generateDevice(username);

        /// Login into Instagram with given credentials
        await client.simulate.preLoginFlow();
        const user = await client.account.login(username, password);
        this.logger.log(`Logged in as ${user.username}`);

        /// Get my account's feed
        const userFeed = client.feed.user(user.pk);
        const recentPosts = await userFeed.items();
        if (recentPosts.length === 0) {
            return `${user.username}, you don't have any recent post 😭`;
        }

        /// Get my latest post
        const latestPost = recentPosts[0];
        if (latestPost.comment_count === 0) {
            return `${user.username}, your last post does not have any comment 🤡`;
        }

        /// Gather post comments
        const latestPostCommentFeed = client.feed.mediaComments(latestPost.pk);
        let hasMoreComments = true; const messages: string[] = [];

        while (hasMoreComments) {
            /// Filter comments that need a like
            const postComments = await latestPostCommentFeed.items();
            const missingLikeComments = postComments.filter((comment) => {
                return !comment.has_liked_comment && comment.user_id !== user.pk;
            });

            /// Give love to everyone
            for await (const comment of missingLikeComments) {
                await client.media.likeComment(comment.pk);
                const message = `Liked ${comment.user.username} comment 💜: ${comment.text}`;
                this.logger.log(message);
                messages.push(message);
            }

            /// Check if there's more available
            hasMoreComments = latestPostCommentFeed.isMoreAvailable();
        }

        return { msg: `${user.username}, your last post has received some love 💜`, messages };
    }

}
