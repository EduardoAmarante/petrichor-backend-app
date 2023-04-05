import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
    id!: number

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
