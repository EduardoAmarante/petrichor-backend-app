import { GithubLoginController } from '@/application/controllers'
import { UnauthorizedError } from '@/application/errors'
import { RequiredStringValidator } from '@/application/validation'
import { AuthenticationError } from '@/domain/errors'
import { AccessToken } from '@/domain/models'
import { GitHubAuthentication } from '@/domain/usecases'

import { MockProxy, mock } from 'jest-mock-extended'

describe('GithubLoginController', () => {
  let githubAuth: MockProxy<GitHubAuthentication>
  let sut: GithubLoginController
  let code: string

  beforeAll(() => {
    code = 'any_code'
    githubAuth = mock()
    githubAuth.perform.mockResolvedValue({
      user: {
        id: 'any_id',
        name: 'any_id',
        userName: 'any_user_name',
        email: 'any_email',
        avatar: 'any_avatar',
        reposGithubUrl: 'any_github_repos'
      },
      accessToken: new AccessToken('any_value')
    })
  })

  beforeEach(() => {
    sut = new GithubLoginController(githubAuth)
  })

  it('shoul build Validators correctly', async () => {
    const validators = sut.buildValidators({ code })

    expect(validators).toEqual([
      new RequiredStringValidator('any_code', 'code')
    ])
  })

  it('shoul call GithubAuthentication with correct input', async () => {
    await sut.handle({ code: 'any_code' })

    expect(githubAuth.perform).toHaveBeenCalledWith({ code })
    expect(githubAuth.perform).toHaveBeenCalledTimes(1)
  })

  it('shoul return 401 if authentication fails', async () => {
    githubAuth.perform.mockResolvedValueOnce(new AuthenticationError())

    const httpResponse = await sut.handle({ code })

    expect(httpResponse).toEqual({
      statusCode: 401,
      data: new UnauthorizedError()
    })
  })

  it('shoul return 200 if authentication succeeds', async () => {
    const httpResponse = await sut.handle({ code })

    expect(httpResponse).toEqual({
      statusCode: 200,
      data: {
        user: {
          id: 'any_id',
          name: 'any_id',
          userName: 'any_user_name',
          email: 'any_email',
          avatar: 'any_avatar',
          reposGithubUrl: 'any_github_repos'
        },
        accessToken: 'any_value'
      }
    })
  })
})
