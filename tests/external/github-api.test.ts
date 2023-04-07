import { GitHubApi } from '@/infra/apis'
import { AxiosHttpClient } from '@/infra/http'
import { env } from '@/main/config/env'

describe('GitHub Api Integration Tests', () => {
  let axiosClient: AxiosHttpClient
  let sut: GitHubApi

  beforeEach(() => {
    axiosClient = new AxiosHttpClient()
    sut = new GitHubApi(
      axiosClient,
      env.githubApi.clientId,
      env.githubApi.clientSecret
    )
  })

  it('should return a GitHub User if code is valid', async () => {
    const githubUser = await sut.loadUser({ code: '79da3f32c3829791907d' })

    expect(githubUser).toEqual({
      name: 'Tiago Oliveira',
      userName: 'tiagoliveira555',
      email: 'tiagoliveira555@gmail.com',
      avatar: 'https://avatars.githubusercontent.com/u/86539643?v=4',
      reposGithubUrl: 'https://api.github.com/users/tiagoliveira555/repos'
    })
  })

  it('should return undefined if code is invalid', async () => {
    const githubUser = await sut.loadUser({ code: 'invalid_code' })

    expect(githubUser).toBeUndefined()
  })
})
