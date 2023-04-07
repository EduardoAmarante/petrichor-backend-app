import { GithubAuthenticationService } from '@/data/services'
import { makeGitHubApi } from '@/main/factories/apis'
import { makeJwtTokenGenerator } from '@/main/factories/crypto'
import { makeTypeormUserAccountRepository } from '@/main/factories/repos'

export const makeGitHubAuthenticationService = (): GithubAuthenticationService => {
  return new GithubAuthenticationService(makeGitHubApi(), makeTypeormUserAccountRepository(), makeJwtTokenGenerator())
}
