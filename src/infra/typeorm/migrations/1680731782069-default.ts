import { MigrationInterface, QueryRunner } from 'typeorm'

export class default1680731782069 implements MigrationInterface {
  name = 'default1680731782069'

  public async up (queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('CREATE TABLE "users" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "user_name" character varying NOT NULL, "email" character varying NOT NULL, "avatar" character varying NOT NULL, "repos_github_url" character varying NOT NULL, CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))')
  }

  public async down (queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE "users"')
  }
}
