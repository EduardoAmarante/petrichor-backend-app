import { LoadGithubApi } from '@/data/contracts/apis'

import { mock } from 'jest-mock-extended'

class GitHubApi {
  constructor (
    private readonly httpClient: HttpGetClient,
    private readonly clientId: string,
    private readonly clientSecret: string
  ) {}

  async loadUser ({ code }: LoadGithubApi.Input): Promise<void> {
    await this.httpClient.get({
      url: 'https://github.com/login/oauth/access_token',
      params: {
        client_id: this.clientId,
        client_secret: this.clientSecret,
        code
      }
    })
  }
}

interface HttpGetClient {
  get: (input: HttpGetClient.Input) => Promise<void>
}

export namespace HttpGetClient {
  export type Input = {
    url: string
    params: object
  }
}

describe('GitHubApi', () => {
  let code: string
  let clientId: string
  let clientSecret: string

  beforeAll(() => {
    code = 'any_github_token'
    clientId = 'any_client_id'
    clientSecret = 'any_client_secret'
  })

  it('should get github token', async () => {
    const httpClient = mock<HttpGetClient>()
    const sut = new GitHubApi(httpClient, clientId, clientSecret)

    await sut.loadUser({ code })

    expect(httpClient.get).toHaveBeenLastCalledWith({
      url: 'https://github.com/login/oauth/access_token',
      params: {
        client_id: clientId,
        client_secret: clientSecret,
        code
      }
    })
  })
})
