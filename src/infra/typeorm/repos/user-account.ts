import { User } from '@/infra/typeorm/entities-db'
import { db } from '@/infra/typeorm'
import { LoadUserAccountRepository, SaveUserAccountRepository } from '@/data/contracts/repos'

export class TypeormUserAccountRepository implements LoadUserAccountRepository, SaveUserAccountRepository {
  private readonly repository = db.getRepository(User)

  async load ({ email }: LoadUserAccountRepository.Input): Promise<LoadUserAccountRepository.Output> {
    const account = await this.repository.findOne({ where: { email } })
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
      const newUser = await this.repository.save({
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
      await this.repository.update({
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
