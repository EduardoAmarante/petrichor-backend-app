import { db } from '@/infra/typeorm'
import { User } from '@/infra/typeorm/entities-db'
import { LoadUserAccountRepository, SaveUserAccountRepository } from '@/data/contracts/repos'

export class TypeormUserAccountRepository implements LoadUserAccountRepository {
  private readonly repository = db.getRepository(User)

  async load ({ email }: LoadUserAccountRepository.Input): Promise<LoadUserAccountRepository.Output> {
    const account = await this.repository.findOne({ where: { email } })
    if (account !== null) {
      return {
        id: account.id,
        name: account.name,
        userName: account.user_name,
        email: account.email,
        avatar: account.avatar,
        reposGithubUrl: account.repos_github_url
      }
    }
  }

  async save ({ id, name, userName, email, avatar, reposGithubUrl }: SaveUserAccountRepository.Input): Promise<void> {
    const accountExists = await this.repository.findOne({ where: { id } })
    if (accountExists === null) {
      await this.repository.save({
        id,
        name,
        user_name: userName,
        email,
        avatar,
        repos_github_url: reposGithubUrl
      })
    } else {
      await this.repository.update({ id }, {
        name,
        user_name: userName,
        email,
        avatar,
        repos_github_url: reposGithubUrl
      })
    }
  }
}
