import { GitHubAuthentication } from '@/domain/usecases'
import { HttpResponse } from '@/application/helpers'
import { ServerError } from '@/application/errors'
import { AuthenticationError } from '@/domain/errors'

export class GithubLoginController {
  constructor (
    private readonly githubAuth: GitHubAuthentication
  ) {}

  async handle (httpRequest: any): Promise<HttpResponse> {
    try {
      if (httpRequest.code === '' || httpRequest.code === null || httpRequest.code === undefined) {
        return {
          statusCode: 400,
          data: new Error('The field code is required')
        }
      }
      const result = await this.githubAuth.perform({ code: httpRequest.code })
      if (result instanceof AuthenticationError) {
        return {
          statusCode: 401,
          data: result
        }
      } else {
        return {
          statusCode: 200,
          data: {
            user: result.user,
            accessToken: result.accessToken.value
          }
        }
      }
    } catch (error) {
      return {
        statusCode: 500,
        data: new ServerError()
      }
    }
  }
}
