import { LoadUserAccountRepository, SaveUserAccountRepository } from '@/data/contracts/repos'
import { User } from '@/infra/typeorm/entities-typeorm'

import { Repository } from 'typeorm'

export class TypeormUserAccountRepository implements LoadUserAccountRepository {
  constructor (
    private readonly userAccountRepository: Repository<User>
  ) {}

  async load ({ email }: LoadUserAccountRepository.Input): Promise<LoadUserAccountRepository.Output> {
    const account = await this.userAccountRepository.findOne({ where: { email } })
    if (account !== null) {
      return {
        id: account.id.toString(),
        name: account.name,
        userName: account.user_name,
        email: account.email,
        avatar: account.avatar,
        reposGithubUrl: account.repos_github_url
      }
    }
  }

  async saveWithGithub (input: SaveUserAccountRepository.Input): Promise<void> {
    if (input.id === undefined) {
      await this.userAccountRepository.save({
        name: input.name,
        user_name: input.userName,
        email: input.email,
        avatar: input.avatar,
        repos_github_url: input.reposGithubUrl
      })
    } else {
      await this.userAccountRepository.update({
        id: parseInt(input.id)
      }, {
        name: input.name,
        user_name: input.userName,
        email: input.email,
        avatar: input.avatar,
        repos_github_url: input.reposGithubUrl
      })
    }
  }
}
