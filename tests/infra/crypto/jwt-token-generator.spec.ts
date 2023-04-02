import { TokenGenerator } from '@/data/contracts/crypto'

import jwt from 'jsonwebtoken'

jest.mock('jsonwebtoken')

class JwtTokenGenerator {
  constructor (
    private readonly secret: string
  ) {}

  async generateToken ({ key, expirationInMs }: TokenGenerator.Input): Promise<void> {
    const expirationInSeconds = expirationInMs / 1000
    jwt.sign({ key }, this.secret, { expiresIn: expirationInSeconds })
  }
}

describe('JwtTokenGenerator', () => {
  it('shold call sign with correct input', async () => {
    const fakeJwt = jwt as jest.Mocked<typeof jwt>
    const sut = new JwtTokenGenerator('any_secret')

    await sut.generateToken({ key: 'any_key', expirationInMs: 1000 })

    expect(fakeJwt.sign).toHaveBeenCalledWith({ key: 'any_key' }, 'any_secret', { expiresIn: 1 })
    expect(fakeJwt.sign).toHaveBeenCalledTimes(1)
  })
})
