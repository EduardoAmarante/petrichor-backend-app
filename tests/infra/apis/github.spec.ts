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
    httpClient.get.mockResolvedValueOnce({ access_token: 'any_access_token' })
    httpClient.get.mockResolvedValueOnce({
      name: 'any_github_name',
      login: 'any_github_user_name',
      avatar_url: 'any_github_avatar',
      repos_url: 'any_github_repositories'
    })
    httpClient.get.mockResolvedValueOnce({
      email: [{
        email: 'any_github_email',
        primary: true
      }]
    })
    sut = new GitHubApi(httpClient, clientId, clientSecret)
  })

  it('should get github token', async () => {
    await sut.loadUser({ code })

    expect(httpClient.get).toHaveBeenCalledWith({
      url: 'https://github.com/login/oauth/access_token',
      params: {
        client_id: clientId,
        client_secret: clientSecret,
        code
      }
    })
  })

  it('should get user data', async () => {
    await sut.loadUser({ code })

    expect(httpClient.get).toHaveBeenCalledWith({
      url: 'https://api.github.com/user',
      headers: {
        Authorization: 'Bearer any_access_token'
      }
    })
  })

  it('should get email user data', async () => {
    await sut.loadUser({ code })

    expect(httpClient.get).toHaveBeenCalledWith({
      url: 'https://api.github.com/user/emails',
      headers: {
        Authorization: 'Bearer any_access_token'
      }
    })
  })

  it('should return github user data', async () => {
    const githubUserData = await sut.loadUser({ code })

    expect(githubUserData).toEqual({
      name: 'any_github_name',
      userName: 'any_github_user_name',
      email: 'any_github_email',
      avatar: 'any_github_avatar',
      reposGithubUrl: 'any_github_repositories'
    })
  })
})
