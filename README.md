# Automatic Comment Likes

A NestJS project, that uses [instagram-private-api](https://github.com/dilame/instagram-private-api) to connect to your account, check your posts and give a like to all the comments on any of your posts.

A complete walkthrough can fe found on [Blog Article](TODO:place-blog-url)

# How to run

1. Setup your instagram account access credentials, by replacing them on the `.env` file

2. Execute the project by running `npm start`

3. To execute the script:
 - By default, the cronjob will run each 10 minutes, but you can update the frequency on `src/comment-like/comment-like.service.ts`or
 - You can also manually trigger an execution by visiting this page on your browser http://localhost:3000/check-comment-likes


## License

Nest is [MIT licensed](LICENSE).
