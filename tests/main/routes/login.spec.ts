import { UnauthorizedError } from '@/application/errors'
import { app } from '@/main/config/app'
import { db } from '@/infra/typeorm'

import request from 'supertest'

describe('Login Routes', () => {
  describe('POST /login/github', () => {
    const loadUserSpy = jest.fn()

    jest.mock('@/infra/apis/github', () => ({
      GitHubApi: jest.fn().mockReturnValue({
        loadUser: loadUserSpy
      })
    }))

    beforeEach(async () => {
      await db.initialize()
    })

    afterEach(async () => {
      await db.destroy()
    })

    it('should return 200 with AuthData', async () => {
      loadUserSpy.mockReturnValueOnce(({
        name: 'any_github_name',
        userName: 'any_github_user_name',
        email: 'any_github_email',
        avatar: 'any_github_avatar',
        reposGithubUrl: 'any_github_repositories'
      }))

      const { status, body } = await request(app)
        .post('/api/login/github')
        .send({ code: 'valid_code' })

      expect(status).toBe(200)
      expect(body.user).toBeDefined()
      expect(body.accessToken).toBeDefined()
    })

    it('should return 401 with UnauthorizedError', async () => {
      const { status, body } = await request(app)
        .post('/api/login/github')
        .send({ code: 'invalid_code' })

      expect(status).toBe(401)
      expect(body.error).toBe(new UnauthorizedError().message)
    })
  })
})
