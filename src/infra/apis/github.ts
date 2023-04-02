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
    const { access_token } = await this.httpClient.get({
      url: 'https://github.com/login/oauth/access_token',
      params: {
        client_id: this.clientId,
        client_secret: this.clientSecret,
        code
      }
    })
    if (access_token !== undefined) {
      return access_token
    }
  }

  private async getUserData (accessToken: string): Promise<UserData | undefined> {
    type UserGitHub = {
      name: string
      login: string
      avatar_url: string
      repos_url: string
    }

    const userData: UserGitHub = await this.httpClient.get({
      url: 'https://api.github.com/user',
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    })
    if (userData !== undefined) {
      return {
        name: userData.name,
        userName: userData.login,
        avatar: userData.avatar_url,
        reposGithubUrl: userData.repos_url
      }
    }
  }

  private async getEmailData (accessToken: string): Promise<EmailData | undefined> {
    type UserEmailGitHub = {
      email: EmailGitHub[]
    }

    type EmailGitHub = {
      email: string
      primary: boolean
    }

    const emailData: UserEmailGitHub = await this.httpClient.get({
      url: 'https://api.github.com/user/emails',
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    })
    if (emailData !== undefined) {
      const email = emailData.email.filter(e => e.primary)
      return {
        email: email[0].email
      }
    }
  }
}
