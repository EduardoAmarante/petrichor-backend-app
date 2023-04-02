import { AccessToken, GitHubAccount } from '@/domain/models'
import { AuthenticationError } from '@/domain/errors'
import { GitHubAuthentication } from '@/domain/usecases'
import { LoadGithubApi } from '@/data/contracts/apis'
import { TokenGenerator } from '@/data/contracts/crypto'
import { LoadUserAccountRepository, SaveUserAccountRepository } from '@/data/contracts/repositories'

export class GithubAuthenticationService {
  constructor (
    private readonly githubApi: LoadGithubApi,
    private readonly userAccountRepository: LoadUserAccountRepository & SaveUserAccountRepository,
    private readonly crypto: TokenGenerator
  ) {}

  async perform ({ code }: GitHubAuthentication.Input): Promise<AuthenticationError> {
    const githubData = await this.githubApi.loadUser({ code })
    if (githubData !== undefined) {
      const accountData = await this.userAccountRepository.load({ email: githubData.email })
      const gitHubData = new GitHubAccount(githubData, accountData)
      const user = await this.userAccountRepository.saveWithGithub(gitHubData)
      await this.crypto.generateToken({ key: user.id, expirationInMs: AccessToken.expirationInMs })
    }
    return new AuthenticationError()
  }
}