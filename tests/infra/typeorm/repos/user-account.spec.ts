import { db } from '@/infra/typeorm/data-source'
import { User } from '@/infra/typeorm/entities-typeorm'
import { LoadUserAccountRepository } from '@/data/contracts/repositories'
import { Repository } from 'typeorm'

class TypeormUserAccountRepository implements LoadUserAccountRepository {
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
}

describe('TypeormUserAccountRepository', () => {
  let email: string
  let sut: TypeormUserAccountRepository
  let userAccountRepository: Repository<User>

  beforeAll(() => {
    email = 'any_email'
    userAccountRepository = db.getRepository(User)
  })

  beforeEach(async () => {
    await db.initialize()
    sut = new TypeormUserAccountRepository(userAccountRepository)
  })

  afterEach(async () => {
    await db.destroy()
  })

  describe('load', () => {
    it('should return an account if email exists', async () => {
      await userAccountRepository.save({
        name: 'any_name',
        user_name: 'any_user_name',
        email: 'any_email',
        avatar: 'any_avatar',
        repos_github_url: 'any_github_url'
      })

      const account = await sut.load({ email })

      expect(account).toMatchObject({ id: '1' })
    })

    it('should return undefined if email does not exists', async () => {
      const account = await sut.load({ email })

      expect(account).toBeUndefined()
    })
  })
})
