import { AuthenticationError } from '@/domain/errors'
import { GithubAuthenticationService } from '@/data/services'
import { LoadGithubApi } from '@/data/contracts/apis'
import { LoadUserAccountRepository } from '@/data/contracts/repositories'

import { mock, MockProxy } from 'jest-mock-extended'

describe('GithubAuthenticationService', () => {
  let code: string
  let loadGithubApi: MockProxy<LoadGithubApi>
  let loadUserAccountRepository: MockProxy<LoadUserAccountRepository>
  let sut: GithubAuthenticationService

  beforeAll(() => {
    code = 'any_code'
    loadGithubApi = mock()
    loadUserAccountRepository = mock()
    loadGithubApi.loadUser.mockResolvedValue({
      name: 'any_github_name',
      userName: 'any_github_user_name',
      email: 'any_github_email',
      avatar: 'any_github_avatar',
      repositories: 'any_github_repositories'
    })
  })

  beforeEach(() => {
    sut = new GithubAuthenticationService(
      loadGithubApi,
      loadUserAccountRepository
    )
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

  it('should call LoadUserAccountRepository when LoadGithubApi returns data', async () => {
    await sut.perform({ code })

    expect(loadUserAccountRepository.load).toHaveBeenCalledWith({ email: 'any_github_email' })
    expect(loadUserAccountRepository.load).toHaveBeenCalledTimes(1)
  })
})
