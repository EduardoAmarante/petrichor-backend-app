import { AuthenticationError } from '@/domain/errors'
import { GithubAuthenticationService } from '@/data/services'

import { mock } from 'jest-mock-extended'
import { LoadGithubApi } from '../contracts/apis'

describe('GithubAuthenticationService', () => {
  it('should call LoadGithubApi with correct input', async () => {
    const loadGithubApi = mock<LoadGithubApi>()
    const sut = new GithubAuthenticationService(loadGithubApi)

    await sut.perform({ code: 'any_code' })

    expect(loadGithubApi.loadUser).toHaveBeenCalledWith({ code: 'any_code' })
    expect(loadGithubApi.loadUser).toHaveBeenCalledTimes(1)
  })

  it('should return AuthenticationError when LoadGithubApi returns undefined', async () => {
    const loadGithubApi = mock<LoadGithubApi>()
    loadGithubApi.loadUser.mockResolvedValueOnce(undefined)
    const sut = new GithubAuthenticationService(loadGithubApi)

    const authResult = await sut.perform({ code: 'any_code' })

    expect(authResult).toEqual(new AuthenticationError())
  })
})
