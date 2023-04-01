import { AuthenticationError } from '@/domain/errors'
import { GitHubAuthentication } from '@/domain/usecases'
import { LoadGithubApi } from '@/data/contracts/apis'
import { CreateUserAccountRepository, LoadUserAccountRepository } from '@/data/contracts/repositories'

export class GithubAuthenticationService {
  constructor (
    private readonly loadGithubApi: LoadGithubApi,
    private readonly loadUserAccountRepository: LoadUserAccountRepository,
    private readonly createUserAccountRepository: CreateUserAccountRepository
  ) {}

  async perform ({ code }: GitHubAuthentication.Input): Promise<AuthenticationError> {
    const githubData = await this.loadGithubApi.loadUser({ code })
    if (githubData !== undefined) {
      await this.loadUserAccountRepository.load({ email: githubData.email })
      await this.createUserAccountRepository.createFromGithub(githubData)
    }
    return new AuthenticationError()
  }
}
