import { GitHubAccount } from '@/domain/models'
import { AuthenticationError } from '@/domain/errors'
import { GitHubAuthentication } from '@/domain/usecases'
import { LoadGithubApi } from '@/data/contracts/apis'
import { LoadUserAccountRepository, SaveUserAccountRepository } from '@/data/contracts/repositories'

export class GithubAuthenticationService {
  constructor (
    private readonly githubApi: LoadGithubApi,
    private readonly userAccountRepository: LoadUserAccountRepository & SaveUserAccountRepository
  ) {}

  async perform ({ code }: GitHubAuthentication.Input): Promise<AuthenticationError> {
    const githubData = await this.githubApi.loadUser({ code })
    if (githubData !== undefined) {
      const accountData = await this.userAccountRepository.load({ email: githubData.email })
      const gitHubData = new GitHubAccount(githubData, accountData)
      await this.userAccountRepository.saveWithGithub(gitHubData)
    }
    return new AuthenticationError()
  }
}
