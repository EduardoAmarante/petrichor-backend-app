import { GitHubAccount } from '@/domain/models'

describe('GitHubAccount', () => {
  const gitHubData = {
    name: 'any_github_name',
    userName: 'any_github_user_name',
    email: 'any_github_email',
    avatar: 'any_github_avatar',
    repositories: 'any_github_repositories'
  }

  it('should create with github data only', () => {
    const sut = new GitHubAccount(gitHubData)

    expect(sut).toEqual({
      name: 'any_github_name',
      userName: 'any_github_user_name',
      email: 'any_github_email',
      avatar: 'any_github_avatar',
      repositories: 'any_github_repositories'
    })
  })

  it('should update account with github data', () => {
    const accountData = { id: 'any_id' }
    const sut = new GitHubAccount(gitHubData, accountData)

    expect(sut).toEqual({
      id: 'any_id',
      name: 'any_github_name',
      userName: 'any_github_user_name',
      email: 'any_github_email',
      avatar: 'any_github_avatar',
      repositories: 'any_github_repositories'
    })
  })
})
