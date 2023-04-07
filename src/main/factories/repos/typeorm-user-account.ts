import { TypeormUserAccountRepository } from '@/infra/typeorm/repos'
import { User } from '@/infra/typeorm/entities-db'
import { db } from '@/infra/typeorm'

export const makeTypeormUserAccountRepository = (): TypeormUserAccountRepository => {
  const userAccountRepository = db.getRepository(User)
  return new TypeormUserAccountRepository(userAccountRepository)
}
