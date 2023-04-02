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
    crypto.generateToken.mockResolvedValue('any_generated_token')
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

  it('should return AuthData on success', async () => {
    const authData = await sut.perform({ code })

    expect(authData).toEqual({
      user: {
        id: 'any_account_id',
        name: 'any_name',
        userName: 'any_user_name',
        email: 'any_email',
        avatar: 'any_avatar',
        repositories: 'any_repositories'
      },
      accessToken: new AccessToken('any_generated_token')
    })
  })

  it('should rethrows if LoadGithubApi thorws', async () => {
    githubApi.loadUser.mockRejectedValueOnce(new Error('github_error'))

    const promise = sut.perform({ code })

    await expect(promise).rejects.toThrow(new Error('github_error'))
  })

  it('should rethrows if LoadUserAccountRepository thorws', async () => {
    userAccountRepository.load.mockRejectedValueOnce(new Error('load_error'))

    const promise = sut.perform({ code })

    await expect(promise).rejects.toThrow(new Error('load_error'))
  })

  it('should rethrows if SaveUserAccountRepository thorws', async () => {
    userAccountRepository.saveWithGithub.mockRejectedValueOnce(new Error('save_error'))

    const promise = sut.perform({ code })

    await expect(promise).rejects.toThrow(new Error('save_error'))
  })

  it('should rethrows if TokenGenerator thorws', async () => {
    crypto.generateToken.mockRejectedValueOnce(new Error('token_error'))

    const promise = sut.perform({ code })

    await expect(promise).rejects.toThrow(new Error('token_error'))
  })
})
