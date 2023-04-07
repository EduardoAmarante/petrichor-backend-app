import { Controller } from '@/application/controllers'

import { Request, Response } from 'express'
import { getMockReq, getMockRes } from '@jest-mock/express'
import { MockProxy, mock } from 'jest-mock-extended'

class ExpressRouter {
  constructor (private readonly controller: Controller) {}

  async adapt (req: Request, res: Response): Promise<void> {
    await this.controller.handle({ ...req.body })
  }
}

describe('ExpressRouter', () => {
  let req: Request
  let res: Response
  let controller: MockProxy<Controller>
  let sut: ExpressRouter

  beforeAll(() => {
    req = getMockReq({ body: { any: 'any' } })
    res = getMockRes().res
    controller = mock()
  })

  beforeEach(() => {
    sut = new ExpressRouter(controller)
  })

  it('should call handle with correct request', async () => {
    await sut.adapt(req, res)

    expect(controller.handle).toHaveBeenCalledWith({ any: 'any' })
    expect(controller.handle).toHaveBeenCalledTimes(1)
  })
})
