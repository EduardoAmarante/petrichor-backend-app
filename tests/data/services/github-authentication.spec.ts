import { AuthenticationError } from '@/domain/errors'
import { AccessToken, GitHubAccount } from '@/domain/models'
import { GithubAuthenticationService } from '@/data/services'
import { LoadGithubApi } from '@/data/contracts/apis'
import { TokenGenerator } from '@/data/contracts/crypto'
import { SaveUserAccountRepository, LoadUserAccountRepository } from '@/data/contracts/repositories'

import { mock, MockProxy } from 'jest-mock-extended'

jest.mock('@/domain/models/github-account')

describe('GithubAuthenticationService', () => {
  let code: string
  let githubApi: MockProxy<LoadGithubApi>
  let userAccountRepository: MockProxy<LoadUserAccountRepository & SaveUserAccountRepository>
  let crypto: MockProxy<TokenGenerator>
  let sut: GithubAuthenticationService

  beforeAll(() => {
    code = 'any_code'
    githubApi = mock()
    githubApi.loadUser.mockResolvedValue({
      name: 'any_github_name',
      userName: 'any_github_user_name',
      email: 'any_github_email',
      avatar: 'any_github_avatar',
      repositories: 'any_github_repositories'
    })
    userAccountRepository = mock()
    userAccountRepository.load.mockResolvedValue(undefined)
    userAccountRepository.saveWithGithub.mockResolvedValue({
      id: 'any_account_id',
      name: 'any_name',
      userName: 'any_user_name',
      email: 'any_email',
      avatar: 'any_avatar',
      repositories: 'any_repositories'
    })
    crypto = mock()
  })

  beforeEach(() => {
    sut = new GithubAuthenticationService(
      githubApi,
      userAccountRepository,
      crypto
    )
  })

  it('should call LoadGithubApi with correct input', async () => {
    await sut.perform({ code: 'any_code' })

    expect(githubApi.loadUser).toHaveBeenCalledWith({ code })
    expect(githubApi.loadUser).toHaveBeenCalledTimes(1)
  })

  it('should return AuthenticationError when LoadGithubApi returns undefined', async () => {
    githubApi.loadUser.mockResolvedValueOnce(undefined)

    const authResult = await sut.perform({ code })

    expect(authResult).toEqual(new AuthenticationError())
  })

  it('should call LoadUserAccountRepository when LoadGithubApi returns data', async () => {
    await sut.perform({ code })

    expect(userAccountRepository.load).toHaveBeenCalledWith({ email: 'any_github_email' })
    expect(userAccountRepository.load).toHaveBeenCalledTimes(1)
  })

  it('should call SaveUserAccountRepository with GitHubAccount', async () => {
    const GitHubAccountStub = jest.fn().mockImplementation(() => ({ any: 'any' }))
    jest.mocked(GitHubAccount).mockImplementation(GitHubAccountStub)

    await sut.perform({ code })

    expect(userAccountRepository.saveWithGithub).toHaveBeenCalledWith({ any: 'any' })
    expect(userAccountRepository.saveWithGithub).toHaveBeenCalledTimes(1)
  })

  it('should call TokenGenerator with correct input', async () => {
    await sut.perform({ code })

    expect(crypto.generateToken).toHaveBeenCalledWith({
      key: 'any_account_id',
      expirationInMs: AccessToken.expirationInMs
    })
    expect(crypto.generateToken).toHaveBeenCalledTimes(1)
  })
})
