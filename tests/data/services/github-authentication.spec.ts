import { GitHubAuthentication } from '@/domain/usecases'

class GithubAuthenticationService {
  constructor (
    private readonly loadGithubApi: LoadGithubApi
  ) {}

  async perform ({ code }: GitHubAuthentication.Input): Promise<void> {
    await this.loadGithubApi.loadUser({ code })
  }
}

interface LoadGithubApi {
  loadUser: (input: LoadGithubApi.Input) => Promise<void>
}

export namespace LoadGithubApi {
  export type Input = {
    code: string
  }
}

class LoadGithubApiSpy implements LoadGithubApi {
  code?: string
  async loadUser ({ code }: LoadGithubApi.Input): Promise<void> {
    this.code = code
  }
}

describe('GithubAuthenticationService', () => {
  it('should call LoadGithubApi with correct input', async () => {
    const loadGithubApi = new LoadGithubApiSpy()
    const sut = new GithubAuthenticationService(loadGithubApi)

    await sut.perform({ code: 'any_code' })

    expect(loadGithubApi.code).toBe('any_code')
  })
})
