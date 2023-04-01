export interface LoadGithubApi {
  loadUser: (input: LoadGithubApi.Input) => Promise<LoadGithubApi.Output>
}

export namespace LoadGithubApi {
  export type Input = {
    code: string
  }

  export type Output = undefined | {
    name: string
    userName: string
    email: string
    avatar: string
    repositories: string
  }
}
