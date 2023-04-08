import { Column, Entity, PrimaryColumn } from 'typeorm'

@Entity('users')
export class User {
  @PrimaryColumn()
    id!: string

  @Column()
    name!: string

  @Column()
    user_name!: string

  @Column()
    email!: string

  @Column()
    avatar!: string

  @Column()
    repos_github_url!: string
}
