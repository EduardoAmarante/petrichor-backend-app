export interface LoadGithubApi {
  loadUser: (input: LoadGithubApi.Input) => Promise<LoadGithubApi.Output>
}

export namespace LoadGithubApi {
  export type Input = {
    code: string
  }

  export type Output = undefined | GitHubData

  type GitHubData = {
    name: string
    userName: string
    email: string
    avatar: string
    reposGithubUrl: string
  }
}
