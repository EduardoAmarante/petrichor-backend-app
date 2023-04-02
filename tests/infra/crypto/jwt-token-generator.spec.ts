import { JwtTokenGenerator } from '@/infra/crypto'

import jwt from 'jsonwebtoken'

jest.mock('jsonwebtoken')

describe('JwtTokenGenerator', () => {
  let key: string
  let secret: string
  let sut: JwtTokenGenerator
  let fakeJwt: jest.Mocked<typeof jwt>

  beforeAll(() => {
    key = 'any_key'
    secret = 'any_secret'
    fakeJwt = jwt as jest.Mocked<typeof jwt>
    fakeJwt.sign.mockImplementation(() => 'any_token')
  })

  beforeEach(() => {
    sut = new JwtTokenGenerator(secret)
  })

  it('shold call sign with correct input', async () => {
    await sut.generateToken({ key, expirationInMs: 1000 })

    expect(fakeJwt.sign).toHaveBeenCalledWith({ key }, secret, { expiresIn: 1 })
    expect(fakeJwt.sign).toHaveBeenCalledTimes(1)
  })

  it('shold return a token', async () => {
    const token = await sut.generateToken({ key, expirationInMs: 1000 })

    expect(token).toEqual('any_token')
  })

  it('shold rethrows if sign throws', async () => {
    fakeJwt.sign.mockImplementationOnce(() => { throw new Error('sign_error') })

    const promise = sut.generateToken({ key, expirationInMs: 1000 })

    await expect(promise).rejects.toThrow(new Error('sign_error'))
  })
})
