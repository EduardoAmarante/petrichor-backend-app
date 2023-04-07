import { HttpResponse, badRequest, ok, serverError, unauthorized } from '@/application/helpers'
import { RequiredFieldError } from '@/application/errors'
import { GitHubAuthentication } from '@/domain/usecases'
import { AuthenticationError } from '@/domain/errors'

type HttpRequest = {
  code: string
}

type Return = Error | {
  user: object
  accessToken: string
}

export class GithubLoginController {
  constructor (
    private readonly githubAuth: GitHubAuthentication
  ) {}

  async handle ({ code }: HttpRequest): Promise<HttpResponse<Return>> {
    const error = this.validate({ code })
    if (error !== undefined) {
      return badRequest(error)
    }
    try {
      const result = await this.githubAuth.perform({ code })
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

  private validate ({ code }: HttpRequest): Error | undefined {
    if (code === '' || code === null || code === undefined) {
      return new RequiredFieldError('code')
    }
  }
}
