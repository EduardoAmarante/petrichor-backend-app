import { AccessToken, UserAccount } from '@/domain/models'
import { AuthenticationError } from '@/domain/errors'
import { GitHubAuthentication } from '@/domain/usecases'
import { LoadGithubApi } from '@/data/contracts/apis'
import { TokenGenerator } from '@/data/contracts/crypto'
import { LoadUserAccountRepository, SaveUserAccountRepository } from '@/data/contracts/repos'

export class GithubAuthenticationService implements GitHubAuthentication {
  constructor (
    private readonly githubApi: LoadGithubApi,
    private readonly userAccountRepository: LoadUserAccountRepository & SaveUserAccountRepository,
    private readonly crypto: TokenGenerator
  ) {}

  async perform ({ code }: GitHubAuthentication.Input): Promise<GitHubAuthentication.Output> {
    const githubData = await this.githubApi.loadUser({ code })
    if (githubData !== undefined) {
      const accountData = await this.userAccountRepository.load({ email: githubData.email })
      const userAccount = new UserAccount(githubData, accountData?.id)
      await this.userAccountRepository.save(userAccount)
      const token = await this.crypto.generateToken({ key: userAccount.id, expirationInMs: AccessToken.expirationInMs })
      return {
        user: userAccount,
        accessToken: new AccessToken(token)
      }
    }
    return new AuthenticationError()
  }
}
