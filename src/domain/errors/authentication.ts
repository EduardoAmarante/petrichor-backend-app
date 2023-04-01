export class AutheticationError extends Error {
  constructor () {
    super('Authentication failed')
    this.name = 'AutheticationError'
  }
}
