import { randomUUID } from 'crypto'

type GitHubData = {
  name: string
  userName: string
  email: string
  avatar: string
  reposGithubUrl: string
}

export class UserAccount {
  id: string
  name: string
  userName: string
  email: string
  avatar: string
  reposGithubUrl: string

  constructor (githubData: GitHubData, id?: string) {
    this.id = id ?? randomUUID()
    this.name = githubData.name
    this.userName = githubData.userName
    this.email = githubData.email
    this.avatar = githubData.avatar
    this.reposGithubUrl = githubData.reposGithubUrl
  }
}
