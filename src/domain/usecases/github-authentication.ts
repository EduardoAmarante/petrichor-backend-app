import { User } from '@/domain/models'
import { AutheticationError } from '@/domain/errors'

export interface GitHubAuthentication {
  perform: (input: GitHubAuthentication.Input) => Promise<GitHubAuthentication.Output>
}

export namespace GitHubAuthentication {
  export type Input = {
    code: string
  }

  export type Output = AuthData | AutheticationError
}

type AuthData = {
  user: User
  accessToken: string
}
