export interface LoadGithubApi {
  loadUser: (input: LoadGithubApi.Input) => Promise<LoadGithubApi.Output>
}

export namespace LoadGithubApi {
  export type Input = {
    code: string
  }

  export type Output = undefined
}
