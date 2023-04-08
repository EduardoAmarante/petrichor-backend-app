import { TypeormUserAccountRepository } from '@/infra/typeorm/repos'

export const makeTypeormUserAccountRepository = (): TypeormUserAccountRepository => {
  return new TypeormUserAccountRepository()
}
