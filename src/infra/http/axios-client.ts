import { HttpGetClient } from '@/infra/http'

import axios, { AxiosResponse } from 'axios'

export class AxiosHttpClient {
  async get ({ url, params, headers }: HttpGetClient.Input): Promise<any> {
    let result: AxiosResponse
    if (params !== undefined) {
      result = await axios.get(url, { params })
    } else {
      result = await axios.get(url, { headers })
    }
    return result.data
  }
}
