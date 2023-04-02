type GitHubData = {
  name: string
  userName: string
  email: string
  avatar: string
  repositories: string
}

type AccountData = {
  id?: string
}

export class GitHubAccount {
  id?: string
  name: string
  userName: string
  email: string
  avatar: string
  repositories: string

  constructor (githubData: GitHubData, accountData?: AccountData) {
    this.id = accountData?.id
    this.name = githubData.name
    this.userName = githubData.userName
    this.email = githubData.email
    this.avatar = githubData.avatar
    this.repositories = githubData.repositories
  }
}
