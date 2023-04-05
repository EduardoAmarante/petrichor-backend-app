import { db } from '@/infra/typeorm'
import { User } from '@/infra/typeorm/entities-typeorm'
import { TypeormUserAccountRepository } from '@/infra/typeorm/repos'

import { Repository } from 'typeorm'

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
