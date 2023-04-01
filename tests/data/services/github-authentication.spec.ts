import { AuthenticationError } from '@/domain/errors'
import { LoadGithubApi } from '@/data/contracts/apis'
import { GithubAuthenticationService } from '@/data/services'

class LoadGithubApiSpy implements LoadGithubApi {
  code?: string
  callsCount = 0
  result = undefined
  async loadUser ({ code }: LoadGithubApi.Input): Promise<LoadGithubApi.Output> {
    this.code = code
    this.callsCount++
    return this.result
  }
}

describe('GithubAuthenticationService', () => {
  it('should call LoadGithubApi with correct input', async () => {
    const loadGithubApi = new LoadGithubApiSpy()
    const sut = new GithubAuthenticationService(loadGithubApi)

    await sut.perform({ code: 'any_code' })

    expect(loadGithubApi.code).toBe('any_code')
    expect(loadGithubApi.callsCount).toBe(1)
  })

  it('should return AuthenticationError when LoadGithubApi returns undefined', async () => {
    const loadGithubApi = new LoadGithubApiSpy()
    loadGithubApi.result = undefined
    const sut = new GithubAuthenticationService(loadGithubApi)

    const authResult = await sut.perform({ code: 'any_code' })

    expect(authResult).toEqual(new AuthenticationError())
  })
})
