import { HttpGetClient } from '@/infra/http'
import { LoadGithubApi } from '@/data/contracts/apis'

type UserData = {
  name: string
  userName: string
  avatar: string
  reposGithubUrl: string
}

type EmailData = {
  email: string
}

export class GitHubApi implements LoadGithubApi {
  constructor (
    private readonly httpClient: HttpGetClient,
    private readonly clientId: string,
    private readonly clientSecret: string
  ) {}

  async loadUser ({ code }: LoadGithubApi.Input): Promise<LoadGithubApi.Output> {
    const accessToken = await this.getAccessToken(code)
    if (accessToken !== undefined) {
      const userData = await this.getUserData(accessToken)
      const email = await this.getEmailData(accessToken)
      if (userData !== undefined && email !== undefined) {
        return {
          ...userData,
          ...email
        }
      }
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

  private async getUserData (accessToken: string): Promise<UserData | undefined> {
    return await this.httpClient.get({
      url: 'https://api.github.com/user',
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    }).then(({ name, login, avatar_url, repos_url }) => ({
      name,
      userName: login,
      avatar: avatar_url,
      reposGithubUrl: repos_url
    })).catch(() => undefined)
  }

  private async getEmailData (accessToken: string): Promise<EmailData | undefined> {
    return await this.httpClient.get({
      url: 'https://api.github.com/user/emails',
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    }).then(emailData => {
      if (Array.isArray(emailData)) {
        const emailObj = emailData.filter(e => e.primary)
        return {
          email: emailObj[0].email
        }
      }
    }).catch(() => undefined)
  }
}
