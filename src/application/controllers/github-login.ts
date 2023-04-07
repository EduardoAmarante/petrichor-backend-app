import { GitHubAuthentication } from '@/domain/usecases'
import { HttpResponse, badRequest, unauthorized } from '@/application/helpers'
import { RequiredFieldError, ServerError } from '@/application/errors'
import { AuthenticationError } from '@/domain/errors'

export class GithubLoginController {
  constructor (
    private readonly githubAuth: GitHubAuthentication
  ) {}

  async handle (httpRequest: any): Promise<HttpResponse> {
    try {
      if (httpRequest.code === '' || httpRequest.code === null || httpRequest.code === undefined) {
        return badRequest(new RequiredFieldError('code'))
      }
      const result = await this.githubAuth.perform({ code: httpRequest.code })
      if (result instanceof AuthenticationError) {
        return unauthorized()
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
