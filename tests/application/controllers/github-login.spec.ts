import { GithubLoginController } from '@/application/controllers'
import { ServerError, UnauthorizedError } from '@/application/errors'
import { RequiredStringValidator, ValidationComposite } from '@/application/validation'
import { AuthenticationError } from '@/domain/errors'
import { AccessToken } from '@/domain/models'
import { GitHubAuthentication } from '@/domain/usecases'

import { MockProxy, mock } from 'jest-mock-extended'

jest.mock('@/application/validation/composite')

describe('GithubLoginController', () => {
  let githubAuth: MockProxy<GitHubAuthentication>
  let sut: GithubLoginController
  const user = {
    id: 'any_id',
    name: 'any_id',
    userName: 'any_user_name',
    email: 'any_email',
    avatar: 'any_avatar',
    reposGithubUrl: 'any_github_repos'
  }
  let code: string

  beforeAll(() => {
    code = 'any_code'
    githubAuth = mock()
    githubAuth.perform.mockResolvedValue({
      user,
      accessToken: new AccessToken('any_value')
    })
  })

  beforeEach(() => {
    sut = new GithubLoginController(githubAuth)
  })

  it('shoul return 400 if validation fails', async () => {
    const error = new Error('validation_error')
    const ValidationCompositeSpy = jest.fn().mockImplementationOnce(() => ({
      validate: jest.fn().mockReturnValueOnce(error)
    }))
    jest.mocked(ValidationComposite).mockImplementationOnce(ValidationCompositeSpy)

    const httpResponse = await sut.handle({ code })

    expect(ValidationComposite).toHaveBeenCalledWith([
      new RequiredStringValidator('any_code', 'code')
    ])
    expect(httpResponse).toEqual({
      statusCode: 400,
      data: error
    })
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
        user,
        accessToken: 'any_value'
      }
    })
  })

  it('shoul return 500 if authentication throws', async () => {
    const error = new Error('server_error')
    githubAuth.perform.mockRejectedValueOnce(error)

    const httpResponse = await sut.handle({ code })

    expect(httpResponse).toEqual({
      statusCode: 500,
      data: new ServerError(error)
    })
  })
})
