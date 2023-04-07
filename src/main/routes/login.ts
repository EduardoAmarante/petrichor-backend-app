import { Router } from 'express'

export default (router: Router): void => {
  router.post('/api/login/github', (req, res) => {
    res.send({ data: 'any_data' })
  })
}
