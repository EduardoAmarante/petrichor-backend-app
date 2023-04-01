import { AuthenticationError } from '@/domain/errors'
import { GitHubAuthentication } from '@/domain/usecases'

class GithubAuthenticationService {
  constructor (
    private readonly loadGithubApi: LoadGithubApi
  ) {}

  async perform ({ code }: GitHubAuthentication.Input): Promise<AuthenticationError> {
    await this.loadGithubApi.loadUser({ code })
    return new AuthenticationError()
  }
}

interface LoadGithubApi {
  loadUser: (input: LoadGithubApi.Input) => Promise<LoadGithubApi.Output>
}

export namespace LoadGithubApi {
  export type Input = {
    code: string
  }

  export type Output = undefined
}

class LoadGithubApiSpy implements LoadGithubApi {
  code?: string
  result = undefined
  async loadUser ({ code }: LoadGithubApi.Input): Promise<LoadGithubApi.Output> {
    this.code = code
    return this.result
  }
}

describe('GithubAuthenticationService', () => {
  it('should call LoadGithubApi with correct input', async () => {
    const loadGithubApi = new LoadGithubApiSpy()
    const sut = new GithubAuthenticationService(loadGithubApi)

    await sut.perform({ code: 'any_code' })

    expect(loadGithubApi.code).toBe('any_code')
  })

  it('should return AuthenticationError when LoadGithubApi returns undefined', async () => {
    const loadGithubApi = new LoadGithubApiSpy()
    loadGithubApi.result = undefined
    const sut = new GithubAuthenticationService(loadGithubApi)

    const authResult = await sut.perform({ code: 'any_code' })

    expect(authResult).toEqual(new AuthenticationError())
  })
})
