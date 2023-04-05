import { db } from '@/infra/typeorm/data-source'
import { User } from '@/infra/typeorm/entities-typeorm'
import { LoadUserAccountRepository } from '@/data/contracts/repositories'
import { Repository } from 'typeorm'

class TypeormUserAccountRepository implements LoadUserAccountRepository {
  constructor (
    private readonly userRepository: Repository<User>
  ) {}

  async load ({ email }: LoadUserAccountRepository.Input): Promise<LoadUserAccountRepository.Output> {
    const account = await this.userRepository.findOne({ where: { email } })
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
}

describe('TypeormUserAccountRepository', () => {
  let sut: TypeormUserAccountRepository
  let userRepository: Repository<User>

  beforeAll(async () => {
    await db.initialize()
    userRepository = db.getRepository(User)
  })

  beforeEach(() => {
    sut = new TypeormUserAccountRepository(userRepository)
  })

  afterAll(async () => {
    await db.destroy()
  })

  describe('load', () => {
    it('should return an account if email exists', async () => {
      await userRepository.save({
        name: 'any_name',
        user_name: 'any_user_name',
        email: 'any_email',
        avatar: 'any_avatar',
        repos_github_url: 'any_github_url'
      })

      const account = await sut.load({ email: 'any_email' })

      expect(account).toMatchObject({ id: '1' })
    })
  })
})
