export interface LoadUserAccountRepository {
  load: (input: LoadUserAccountRepository.Input) => Promise<LoadUserAccountRepository.Output>
}

export namespace LoadUserAccountRepository {
  export type Input = {
    email: string
  }

  export type Output = undefined | {
    id: string
    name: string
    userName: string
    email: string
    avatar: string
    repositories: string
  }
}

export interface SaveUserAccountRepository {
  saveWithGithub: (input: SaveUserAccountRepository.Input) => Promise<void>
}

export namespace SaveUserAccountRepository {
  export type Input = {
    id?: string
    name: string
    userName: string
    email: string
    avatar: string
    repositories: string
  }
}
