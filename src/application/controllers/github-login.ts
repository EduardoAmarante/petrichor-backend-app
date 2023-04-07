import { Controller } from '@/application/controllers'
import { HttpResponse, ok, unauthorized } from '@/application/helpers'
import { ValidationBuilder as Builder, Validator } from '@/application/validation'
import { GitHubAuthentication } from '@/domain/usecases'
import { AuthenticationError } from '@/domain/errors'

type HttpRequest = {
  code: string
}

type Return = Error | {
  user: object
  accessToken: string
}

export class GithubLoginController extends Controller {
  constructor (private readonly githubAuth: GitHubAuthentication) {
    super()
  }

  async perform ({ code }: HttpRequest): Promise<HttpResponse<Return>> {
    const result = await this.githubAuth.perform({ code })
    if (result instanceof AuthenticationError) {
      return unauthorized()
    } else {
      return ok({
        user: result.user,
        accessToken: result.accessToken.value
      })
    }
  }

  override buildValidators ({ code }: HttpRequest): Validator[] {
    return [
      ...Builder.of({ value: code, fieldName: 'code' }).required().build()
    ]
  }
}
