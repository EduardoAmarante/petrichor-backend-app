import { UserAccount } from '@/domain/models'

describe('UserAccount', () => {
  const gitHubData = {
    name: 'any_github_name',
    userName: 'any_github_user_name',
    email: 'any_github_email',
    avatar: 'any_github_avatar',
    reposGithubUrl: 'any_github_repositories'
  }

  it('should create with github data only', () => {
    const sut = new UserAccount(gitHubData)

    expect(sut.id).toBeDefined()
    expect(sut).toMatchObject({
      name: 'any_github_name',
      userName: 'any_github_user_name',
      email: 'any_github_email',
      avatar: 'any_github_avatar',
      reposGithubUrl: 'any_github_repositories'
    })
  })

  it('should update account with github data', () => {
    const id = 'any_id'
    const sut = new UserAccount(gitHubData, id)

    expect(sut).toEqual({
      id: 'any_id',
      name: 'any_github_name',
      userName: 'any_github_user_name',
      email: 'any_github_email',
      avatar: 'any_github_avatar',
      reposGithubUrl: 'any_github_repositories'
    })
  })
})
