export const env = {
  githubApi: {
    clientId: process.env.GITHUB_CLIENT_ID ?? 'd65298528442459a8092',
    clientSecret: process.env.GITHUB_CLIENT_SECRET ?? 'bd6d72e009ce08f84f7c0cdb96453ff8cd031843'
  },
  port: process.env.PORT ?? 3333
}
