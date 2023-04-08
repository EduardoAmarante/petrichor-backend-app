export const env = {
  githubApi: {
    clientId: process.env.GITHUB_CLIENT_ID ?? '',
    clientSecret: process.env.GITHUB_CLIENT_SECRET ?? ''
  },
  port: process.env.PORT ?? 3333,
  jwtSecret: process.env.JWT_SECRET ?? ''
}
