import { makeGitHubLoginController } from '@/main/factories/controllers'
import { adaptExpressRouter as adapt } from '@/main/adapters'

import { Router } from 'express'

export default (router: Router): void => {
  router.post('/login/github', adapt(makeGitHubLoginController()))
}
