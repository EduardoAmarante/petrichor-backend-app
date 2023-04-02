import { HttpGetClient } from '@/infra/http'

import axios from 'axios'

export class AxiosHttpClient {
  async get ({ url, params }: HttpGetClient.Input): Promise<any> {
    const result = await axios.get(url, { params })
    return result.data
  }
}