import { GitHubApi } from '@/infra/apis'
import { env } from '@/main/config/env'
import { makeAxiosHttpClient } from '@/main/factories/http'

export const makeGitHubApi = (): GitHubApi => {
  return new GitHubApi(makeAxiosHttpClient(), env.githubApi.clientId, env.githubApi.clientSecret)
}
