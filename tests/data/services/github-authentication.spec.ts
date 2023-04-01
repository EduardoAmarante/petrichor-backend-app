import { AuthenticationError } from '@/domain/errors'
import { GithubAuthenticationService } from '@/data/services'
import { LoadGithubApi } from '@/data/contracts/apis'

import { mock, MockProxy } from 'jest-mock-extended'

describe('GithubAuthenticationService', () => {
  let code: string
  let loadGithubApi: MockProxy<LoadGithubApi>
  let sut: GithubAuthenticationService

  beforeAll(() => {
    code = 'any_code'
    loadGithubApi = mock<LoadGithubApi>()
  })

  beforeEach(() => {
    sut = new GithubAuthenticationService(loadGithubApi)
  })

  it('should call LoadGithubApi with correct input', async () => {
    await sut.perform({ code: 'any_code' })

    expect(loadGithubApi.loadUser).toHaveBeenCalledWith({ code })
    expect(loadGithubApi.loadUser).toHaveBeenCalledTimes(1)
  })

  it('should return AuthenticationError when LoadGithubApi returns undefined', async () => {
    loadGithubApi.loadUser.mockResolvedValueOnce(undefined)

    const authResult = await sut.perform({ code })

    expect(authResult).toEqual(new AuthenticationError())
  })
})
