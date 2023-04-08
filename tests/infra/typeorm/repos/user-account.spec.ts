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

  describe('saveWithGithub', () => {
    it('should create an account if id is undefined', async () => {
      const { id } = await sut.saveWithGithub({
        name: 'any_name',
        userName: 'any_name',
        email: 'any_email',
        avatar: 'any_avatar',
        reposGithubUrl: 'any_repos_github_url'
      })

      const user = await repository.findOne({ where: { email: 'any_email' } })

      expect(user?.id).toBe(1)
      expect(id).toBe('1')
    })

    it('should update account if id is defined', async () => {
      await repository.save({
        name: 'any_name',
        user_name: 'any_name',
        email: 'any_email',
        avatar: 'any_avatar',
        repos_github_url: 'any_repos_github_url'
      })

      const { id, email } = await sut.saveWithGithub({
        id: '1',
        name: 'new_name',
        userName: 'new_name',
        email: 'new_email',
        avatar: 'new_avatar',
        reposGithubUrl: 'new_repos_github_url'
      })
      const user = await repository.findOne({ where: { id: 1 } })

      expect(user).toEqual({
        id: 1,
        name: 'new_name',
        user_name: 'new_name',
        email: 'new_email',
        avatar: 'new_avatar',
        repos_github_url: 'new_repos_github_url'
      })
      expect(id).toBe('1')
      expect(email).toBe('new_email')
    })
  })
})
