import { AuthenticationError } from '@/domain/errors'
import { GitHubAuthentication } from '@/domain/usecases'
import { LoadGithubApi } from '@/data/contracts/apis'
import { CreateUserAccountRepository, LoadUserAccountRepository } from '@/data/contracts/repositories'

export class GithubAuthenticationService {
  constructor (
    private readonly githubApi: LoadGithubApi,
    private readonly userAccountRepository: LoadUserAccountRepository & CreateUserAccountRepository
  ) {}

  async perform ({ code }: GitHubAuthentication.Input): Promise<AuthenticationError> {
    const githubData = await this.githubApi.loadUser({ code })
    if (githubData !== undefined) {
      await this.userAccountRepository.load({ email: githubData.email })
      await this.userAccountRepository.createFromGithub(githubData)
    }
    return new AuthenticationError()
  }
}
