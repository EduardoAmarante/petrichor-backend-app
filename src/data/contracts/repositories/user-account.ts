export interface LoadUserAccountRepository {
  load: (input: LoadUserAccountRepository.Input) => Promise<LoadUserAccountRepository.Output>
}

export namespace LoadUserAccountRepository {
  export type Input = {
    email: string
  }

  export type Output = undefined
}

export interface CreateUserAccountRepository {
  createFromGithub: (input: CreateUserAccountRepository.Input) => Promise<void>
}

export namespace CreateUserAccountRepository {
  export type Input = {
    name: string
    userName: string
    email: string
    avatar: string
    repositories: string
  }
}
