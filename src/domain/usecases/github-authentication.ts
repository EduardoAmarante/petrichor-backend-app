import { AccessToken } from '@/domain/models'
import { AuthenticationError } from '@/domain/errors'

export interface GitHubAuthentication {
  perform: (input: GitHubAuthentication.Input) => Promise<GitHubAuthentication.Output>
}

export namespace GitHubAuthentication {
  export type Input = {
    code: string
  }

  export type Output = AuthData | AuthenticationError
}

type AuthData = {
  user: {
    id: string
    name: string
    userName: string
    email: string
    avatar: string
    reposGithubUrl: string
  }
  accessToken: AccessToken
}
