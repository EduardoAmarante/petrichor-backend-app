import { HttpGetClient } from '@/infra/http'
import { LoadGithubApi } from '@/data/contracts/apis'

export class GitHubApi implements LoadGithubApi {
  constructor (
    private readonly httpClient: HttpGetClient,
    private readonly clientId: string,
    private readonly clientSecret: string
  ) {}

  async loadUser ({ code }: LoadGithubApi.Input): Promise<LoadGithubApi.Output> {
    const accessToken = await this.getAccessToken(code)
    if (accessToken !== undefined) {
      return this.getGitHubUser(accessToken)
    }
  }

  private async getAccessToken (code: string): Promise<string | undefined> {
    const data = await this.httpClient.get({
      url: 'https://github.com/login/oauth/access_token',
      params: {
        client_id: this.clientId,
        client_secret: this.clientSecret,
        code
      }
    })
    const params = new URLSearchParams(data)
    const accessToken = params.get('access_token')
    if (accessToken !== null) {
      return accessToken
    }
  }

  private async getGitHubUser (accessToken: string): Promise<LoadGithubApi.Output> {
    const baseUrl = 'https://api.github.com/user'
    const headers = { Authorization: `Bearer ${accessToken}` }
    return Promise.all([
      this.httpClient.get({ url: baseUrl, headers }),
      this.httpClient.get({ url: `${baseUrl}/emails`, headers })
    ]).then(([{ name, login, avatar_url, repos_url }, emailData]) => {
      if (Array.isArray(emailData)) {
        const emailObj = emailData.filter(e => e.primary)
        return {
          name,
          userName: login,
          email: emailObj[0].email,
          avatar: avatar_url,
          reposGithubUrl: repos_url
        }
      }
    })
  }
}
