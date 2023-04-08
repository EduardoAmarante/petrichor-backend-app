import { UserAccount } from '@/domain/models'

export interface LoadUserAccountRepository {
  load: (input: LoadUserAccountRepository.Input) => Promise<LoadUserAccountRepository.Output>
}

export namespace LoadUserAccountRepository {
  export type Input = { email: string }

  export type Output = UserAccount | undefined
}

export interface SaveUserAccountRepository {
  save: (input: SaveUserAccountRepository.Input) => Promise<void>
}

export namespace SaveUserAccountRepository {
  export type Input = UserAccount
}
