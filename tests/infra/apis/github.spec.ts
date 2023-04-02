import { LoadGithubApi } from '@/data/contracts/apis'

import { mock } from 'jest-mock-extended'

class GitHubApi {
  constructor (
    private readonly httpClient: HttpGetClient
  ) {}

  async loadUser ({ code }: LoadGithubApi.Input): Promise<void> {
    await this.httpClient.get({ url: 'https://github.com/login/oauth/access_token' })
  }
}

interface HttpGetClient {
  get: (input: HttpGetClient.Input) => Promise<void>
}

export namespace HttpGetClient {
  export type Input = {
    url: string
  }
}

describe('GitHubApi', () => {
  it('should get github token', async () => {
    const httpClient = mock<HttpGetClient>()
    const sut = new GitHubApi(httpClient)

    await sut.loadUser({ code: 'any_github_code' })

    expect(httpClient.get).toHaveBeenLastCalledWith({
      url: 'https://github.com/login/oauth/access_token'
    })
  })
})
