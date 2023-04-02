import { HttpGetClient } from '@/infra/http'

import axios from 'axios'

jest.mock('axios')

class AxiosHttpClient {
  async get ({ url, params }: HttpGetClient.Input): Promise<any> {
    const result = await axios.get(url, { params })
    return result.data
  }
}

describe('AxiosHttpClient', () => {
  let fakeAxios: jest.Mocked<typeof axios>
  let sut: AxiosHttpClient
  let url: string
  let params: object

  beforeAll(() => {
    url = 'any_url'
    params = { any: 'any' }
    fakeAxios = axios as jest.Mocked<typeof axios>
    fakeAxios.get.mockResolvedValue({
      status: 200,
      data: 'any_data'
    })
  })

  beforeEach(() => {
    sut = new AxiosHttpClient()
  })

  it('should call get with correct input', async () => {
    await sut.get({ url, params })

    expect(fakeAxios.get).toHaveBeenCalledWith(url, { params })
    expect(fakeAxios.get).toHaveBeenCalledTimes(1)
  })

  it('should return data on sucess', async () => {
    const result = await sut.get({ url, params })

    expect(result).toEqual('any_data')
  })
})
