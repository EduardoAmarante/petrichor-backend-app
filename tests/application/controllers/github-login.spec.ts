import { AuthenticationError } from '@/domain/errors'
import { AccessToken } from '@/domain/models'
import { GitHubAuthentication } from '@/domain/usecases'

import { MockProxy, mock } from 'jest-mock-extended'

class GithubLoginController {
  constructor (
    private readonly githubAuth: GitHubAuthentication
  ) {}

  async handle (httpRequest: any): Promise<HttpResponse> {
    if (httpRequest.code === '' || httpRequest.code === null || httpRequest.code === undefined) {
      return {
        statusCode: 400,
        data: new Error('The field code is required')
      }
    }
    const result = await this.githubAuth.perform({ code: httpRequest.code })
    if (result instanceof AuthenticationError) {
      return {
        statusCode: 401,
        data: result
      }
    } else {
      return {
        statusCode: 200,
        data: {
          user: result.user,
          accessToken: result.accessToken.value
        }
      }
    }
  }
}

type HttpResponse = {
  statusCode: number
  data: any
}

describe('GithubLoginController', () => {
  const user = {
    id: 'any_id',
    name: 'any_id',
    userName: 'any_user_name',
    email: 'any_email',
    avatar: 'any_avatar',
    reposGithubUrl: 'any_github_repos'
  }
  let githubAuth: MockProxy<GitHubAuthentication>
  let sut: GithubLoginController

  beforeAll(() => {
    githubAuth = mock()
    githubAuth.perform.mockResolvedValue({
      user,
      accessToken: new AccessToken('any_value')
    })
  })

  beforeEach(() => {
    sut = new GithubLoginController(githubAuth)
  })

  it('shoul return 400 if code is empty', async () => {
    const httpResponse = await sut.handle({ code: '' })

    expect(httpResponse).toEqual({
      statusCode: 400,
      data: new Error('The field code is required')
    })
  })

  it('shoul return 400 if code is null', async () => {
    const httpResponse = await sut.handle({ code: null })

    expect(httpResponse).toEqual({
      statusCode: 400,
      data: new Error('The field code is required')
    })
  })

  it('shoul return 400 if code is undefined', async () => {
    const httpResponse = await sut.handle({ code: undefined })

    expect(httpResponse).toEqual({
      statusCode: 400,
      data: new Error('The field code is required')
    })
  })

  it('shoul call GithubAuthentication with correct input', async () => {
    await sut.handle({ code: 'any_code' })

    expect(githubAuth.perform).toHaveBeenCalledWith({ code: 'any_code' })
    expect(githubAuth.perform).toHaveBeenCalledTimes(1)
  })

  it('shoul return 401 if authentication fails', async () => {
    githubAuth.perform.mockResolvedValueOnce(new AuthenticationError())

    const httpResponse = await sut.handle({ code: 'any_code' })

    expect(httpResponse).toEqual({
      statusCode: 401,
      data: new AuthenticationError()
    })
  })

  it('shoul return 200 if authentication succeeds', async () => {
    const httpResponse = await sut.handle({ code: 'any_code' })

    expect(httpResponse).toEqual({
      statusCode: 200,
      data: {
        user,
        accessToken: 'any_value'
      }
    })
  })
})
