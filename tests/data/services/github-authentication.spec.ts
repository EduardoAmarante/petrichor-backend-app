import { AuthenticationError } from '@/domain/errors'
import { GithubAuthenticationService } from '@/data/services'

describe('GithubAuthenticationService', () => {
  it('should call LoadGithubApi with correct input', async () => {
    const loadGithubApi = {
      loadUser: jest.fn()
    }
    const sut = new GithubAuthenticationService(loadGithubApi)

    await sut.perform({ code: 'any_code' })

    expect(loadGithubApi.loadUser).toHaveBeenCalledWith({ code: 'any_code' })
    expect(loadGithubApi.loadUser).toHaveBeenCalledTimes(1)
  })

  it('should return AuthenticationError when LoadGithubApi returns undefined', async () => {
    const loadGithubApi = {
      loadUser: jest.fn()
    }
    loadGithubApi.loadUser.mockResolvedValueOnce(undefined)
    const sut = new GithubAuthenticationService(loadGithubApi)

    const authResult = await sut.perform({ code: 'any_code' })

    expect(authResult).toEqual(new AuthenticationError())
  })
})
