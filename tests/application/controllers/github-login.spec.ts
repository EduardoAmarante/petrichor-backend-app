class GithubLoginController {
  async handle (httpRequest: any): Promise<HttpResponse> {
    return {
      statusCode: 400,
      data: new Error('The field code is required')
    }
  }
}

type HttpResponse = {
  statusCode: number
  data: any
}

describe('GithubLoginController', () => {
  it('shoul return 400 if code is empty', async () => {
    const sut = new GithubLoginController()

    const httpResponse = await sut.handle({ code: '' })

    expect(httpResponse).toEqual({
      statusCode: 400,
      data: new Error('The field code is required')
    })
  })
})
