import { MigrationInterface, QueryRunner } from 'typeorm'

export class default1680729653395 implements MigrationInterface {
  name = 'default1680729653395'

  public async up (queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('CREATE TABLE "users" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" varchar NOT NULL, "user_name" varchar NOT NULL, "email" varchar NOT NULL, "avatar" varchar NOT NULL, "repos_github_url" varchar NOT NULL)')
  }

  public async down (queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE "users"')
  }
}
