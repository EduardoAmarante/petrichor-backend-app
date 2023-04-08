import { Controller } from '@/application/controllers'

import { RequestHandler } from 'express'

export const adaptExpressRouter = (controller: Controller): RequestHandler => {
  return async (req, res) => {
    const { statusCode, data } = await controller.handle({ ...req.body })
    return statusCode === 200
      ? res.status(statusCode).json(data)
      : res.status(statusCode).json({ error: data.message })
  }
}
