import { HttpGetClient } from '@/infra/http'

import axios from 'axios'

export class AxiosHttpClient {
  async get ({ url, params, headers }: HttpGetClient.Input): Promise<any> {
    const result = await axios.get(url, { headers, params })
    return result.data
  }
}
