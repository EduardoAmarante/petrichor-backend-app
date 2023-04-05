import 'dotenv/config'
import 'reflect-metadata'
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
  entities: [join(`${__dirname}/**/entities-typeorm/*.{ts,js}`)],
  migrations: [join(`${__dirname}/**/migrations-typeorm/*.{ts,js}`)]
})

const dbTest = new DataSource({
  type: 'sqlite',
  database: ':memory:',
  entities: [join(`${__dirname}/**/entities-typeorm/*.{ts,js}`)],
  migrations: [join(`${__dirname}/**/migrations-typeorm/*.{ts,js}`)]
})

export const db = process.env.DB === 'prod' ? dbProd : dbTest
