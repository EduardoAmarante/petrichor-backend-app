import { makeGitHubAuthenticationService } from '@/main/factories/services'
import { GithubLoginController } from '@/application/controllers'

export const makeGitHubLoginController = (): GithubLoginController => {
  return new GithubLoginController(makeGitHubAuthenticationService())
}
