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

  describe('saveWithGithub', () => {
    it('should create an account if id is undefined', async () => {
      await sut.saveWithGithub({
        name: 'any_name',
        userName: 'any_name',
        email: 'any_email',
        avatar: 'any_avatar',
        reposGithubUrl: 'any_repos_github_url'
      })

      const user = await userAccountRepository.findOne({ where: { email: 'any_email' } })

      expect(user?.id).toBe(1)
    })

    it('should update account if id is defined', async () => {
      await userAccountRepository.save({
        name: 'any_name',
        user_name: 'any_name',
        email: 'any_email',
        avatar: 'any_avatar',
        repos_github_url: 'any_repos_github_url'
      })

      await sut.saveWithGithub({
        id: '1',
        name: 'new_name',
        userName: 'new_name',
        email: 'new_email',
        avatar: 'new_avatar',
        reposGithubUrl: 'new_repos_github_url'
      })
      const user = await userAccountRepository.findOne({ where: { id: 1 } })

      expect(user).toEqual({
        id: 1,
        name: 'new_name',
        user_name: 'new_name',
        email: 'new_email',
        avatar: 'new_avatar',
        repos_github_url: 'new_repos_github_url'
      })
    })
  })
})
