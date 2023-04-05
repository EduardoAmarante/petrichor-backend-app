import { GitHubAuthentication } from '@/domain/usecases'

import { MockProxy, mock } from 'jest-mock-extended'

class GithubLoginController {
  constructor (
    private readonly githubAuth: GitHubAuthentication
  ) {}

  async handle (httpRequest: any): Promise<HttpResponse> {
    await this.githubAuth.perform({ code: httpRequest.code })
    return {
      statusCode: 400,
      data: new Error('The field code is required')
    }
  }
}

type HttpResponse = {
  statusCode: number
  data: any
}

describe('GithubLoginController', () => {
  let githubAuth: MockProxy<GitHubAuthentication>
  let sut: GithubLoginController

  beforeAll(() => {
    githubAuth = mock()
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
})
