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
      if (email !== undefined) {
        return {
          ...userData,
          ...email
        }
      }
    }
  }

  private async getAccessToken (code: string): Promise<string | undefined> {
    const result: string = await this.httpClient.get({
      url: 'https://github.com/login/oauth/access_token',
      params: {
        client_id: this.clientId,
        client_secret: this.clientSecret,
        code
      }
    })
    const response = result.toString().split('=')
    if (response[0] === 'access_token') {
      return response[1].split('&')[0]
    }
  }

  private async getUserData (accessToken: string): Promise<UserData> {
    const { name, login, avatar_url, repos_url } = await this.httpClient.get({
      url: 'https://api.github.com/user',
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    })
    return {
      name,
      userName: login,
      avatar: avatar_url,
      reposGithubUrl: repos_url
    }
  }

  private async getEmailData (accessToken: string): Promise<EmailData | undefined> {
    const emailData = await this.httpClient.get({
      url: 'https://api.github.com/user/emails',
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    })
    if (Array.isArray(emailData)) {
      const emailObj = emailData.filter(e => e.primary)
      return {
        email: emailObj[0].email
      }
    }
  }
}
