import { db } from '@/infra/typeorm'
import { User } from '@/infra/typeorm/entities-db'
import { TypeormUserAccountRepository } from '@/infra/typeorm/repos'

import { Repository } from 'typeorm'

describe('TypeormUserAccountRepository', () => {
  let email: string
  let sut: TypeormUserAccountRepository
  let repository: Repository<User>

  beforeAll(() => {
    email = 'any_email'
  })

  beforeEach(async () => {
    await db.initialize()
    repository = db.getRepository(User)
    sut = new TypeormUserAccountRepository()
  })

  afterEach(async () => {
    await db.destroy()
  })

  describe('load', () => {
    it('should return an account if email exists', async () => {
      await repository.save({
        id: 'any_id',
        name: 'any_name',
        user_name: 'any_user_name',
        email: 'any_email',
        avatar: 'any_avatar',
        repos_github_url: 'any_github_url'
      })

      const account = await sut.load({ email })

      expect(account).toMatchObject({ id: 'any_id' })
    })

    it('should return undefined if email does not exists', async () => {
      const account = await sut.load({ email })

      expect(account).toBeUndefined()
    })
  })

  describe('saveWithGithub', () => {
    it('should create an account if not exists', async () => {
      await sut.save({
        id: 'any_id',
        name: 'any_name',
        userName: 'any_user_name',
        email: 'any_email',
        avatar: 'any_avatar',
        reposGithubUrl: 'any_repos_github_url'
      })
      const account = await repository.findOne({ where: { id: 'any_id' } })

      expect(account?.id).toBe('any_id')
    })

    it('should update account already exists', async () => {
      await repository.save({
        id: 'any_id',
        name: 'any_name',
        user_name: 'any_name',
        email: 'any_email',
        avatar: 'any_avatar',
        repos_github_url: 'any_repos_github_url'
      })

      await sut.save({
        id: 'any_id',
        name: 'new_name',
        userName: 'new_name',
        email: 'new_email',
        avatar: 'new_avatar',
        reposGithubUrl: 'new_repos_github_url'
      })
      const account = await repository.findOne({ where: { id: 'any_id' } })

      expect(account?.id).toBe('any_id')
    })
  })
})
