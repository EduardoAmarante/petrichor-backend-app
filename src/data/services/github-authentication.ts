import { LoadGithubApi } from '@/data/contracts/apis'
import { AuthenticationError } from '@/domain/errors'
import { GitHubAuthentication } from '@/domain/usecases'

export class GithubAuthenticationService {
  constructor (
    private readonly loadGithubApi: LoadGithubApi
  ) {}

  async perform ({ code }: GitHubAuthentication.Input): Promise<AuthenticationError> {
    await this.loadGithubApi.loadUser({ code })
    return new AuthenticationError()
  }
}
