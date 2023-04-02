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
      await this.userAccountRepository.saveWithGithub({
        id: accountData?.id,
        name: githubData.name,
        userName: githubData.userName,
        email: githubData.email,
        avatar: githubData.avatar,
        repositories: githubData.repositories
      })
    }
    return new AuthenticationError()
  }
}
