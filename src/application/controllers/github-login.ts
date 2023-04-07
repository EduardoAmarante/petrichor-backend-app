import { HttpResponse, badRequest, ok, serverError, unauthorized } from '@/application/helpers'
import { RequiredFieldError } from '@/application/errors'
import { GitHubAuthentication } from '@/domain/usecases'
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
        return ok({
          user: result.user,
          accessToken: result.accessToken.value
        })
      }
    } catch (error) {
      const err = error as Error
      return serverError(err)
    }
  }
}
