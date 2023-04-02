import { GitHubApi } from '@/infra/apis'
import { HttpGetClient } from '@/infra/http'
import { mock, MockProxy } from 'jest-mock-extended'

describe('GitHubApi', () => {
  let code: string
  let clientId: string
  let clientSecret: string
  let httpClient: MockProxy<HttpGetClient>
  let sut: GitHubApi

  beforeAll(() => {
    code = 'any_github_token'
    clientId = 'any_client_id'
    clientSecret = 'any_client_secret'
    httpClient = mock()
  })

  beforeEach(() => {
    sut = new GitHubApi(httpClient, clientId, clientSecret)
  })

  it('should get github token', async () => {
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
