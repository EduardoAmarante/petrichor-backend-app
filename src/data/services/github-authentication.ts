import { LoadGithubApi } from '@/data/contracts/apis'
import { AuthenticationError } from '@/domain/errors'
import { GitHubAuthentication } from '@/domain/usecases'
import { LoadUserAccountRepository } from '../contracts/repositories'

export class GithubAuthenticationService {
  constructor (
    private readonly loadGithubApi: LoadGithubApi,
    private readonly loadUserAccountRepository: LoadUserAccountRepository
  ) {}

  async perform ({ code }: GitHubAuthentication.Input): Promise<AuthenticationError> {
    const githubData = await this.loadGithubApi.loadUser({ code })
    if (githubData !== undefined) {
      await this.loadUserAccountRepository.load({ email: githubData.email })
    }
    return new AuthenticationError()
  }
}
