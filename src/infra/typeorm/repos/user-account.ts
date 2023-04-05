import { User } from '@/infra/typeorm/entities-typeorm'
import { LoadUserAccountRepository, SaveUserAccountRepository } from '@/data/contracts/repos'

import { Repository } from 'typeorm'

export class TypeormUserAccountRepository implements LoadUserAccountRepository, SaveUserAccountRepository {
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

  async saveWithGithub ({ id, name, userName, email, avatar, reposGithubUrl }: SaveUserAccountRepository.Input): Promise<SaveUserAccountRepository.Output> {
    if (id === undefined) {
      const newUser = await this.userAccountRepository.save({
        name,
        user_name: userName,
        email,
        avatar,
        repos_github_url: reposGithubUrl
      })
      return {
        id: newUser.id.toString(),
        name: newUser.name,
        userName: newUser.user_name,
        email: newUser.email,
        avatar: newUser.avatar,
        reposGithubUrl: newUser.repos_github_url
      }
    } else {
      await this.userAccountRepository.update({
        id: parseInt(id)
      }, {
        name,
        user_name: userName,
        email,
        avatar,
        repos_github_url: reposGithubUrl
      })
      return { id, name, userName, email, avatar, reposGithubUrl }
    }
  }
}
