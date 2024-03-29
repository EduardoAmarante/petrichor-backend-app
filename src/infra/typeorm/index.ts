import 'dotenv/config'
import { join } from 'path'
import { DataSource } from 'typeorm'

const port = Number(process.env.DB_POST)

const dbProd = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port,
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_DATABASE,
  entities: [join(`${__dirname}/**/entities-db/*.{ts,js}`)],
  migrations: [join(`${__dirname}/**/migrations/*.{ts,js}`)]
})

const dbTest = new DataSource({
  type: 'sqlite',
  database: ':memory:',
  synchronize: true,
  entities: [join(`${__dirname}/**/entities-db/*.{ts,js}`)],
  migrations: [join(`${__dirname}/**/migrations/*.{ts,js}`)]
})

export const db = process.env.NODE_ENV !== 'test' ? dbProd : dbTest
