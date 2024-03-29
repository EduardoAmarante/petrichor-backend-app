import { AxiosHttpClient } from '@/infra/http'

import axios from 'axios'

jest.mock('axios')

describe('AxiosHttpClient', () => {
  let fakeAxios: jest.Mocked<typeof axios>
  let sut: AxiosHttpClient
  let url: string
  let params: object
  let headers: object

  beforeAll(() => {
    url = 'any_url'
    params = { any: 'any' }
    headers = { any: 'any' }
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
    await sut.get({ url, headers, params })

    expect(fakeAxios.get).toHaveBeenCalledWith(url, { headers, params })
    expect(fakeAxios.get).toHaveBeenCalledTimes(1)
  })

  it('should return data on sucess', async () => {
    const result = await sut.get({ url, headers, params })

    expect(result).toEqual('any_data')
  })

  it('should rethrow if get throws', async () => {
    fakeAxios.get.mockRejectedValueOnce(new Error('http_error'))

    const promise = sut.get({ url, headers, params })

    await expect(promise).rejects.toThrow(new Error('http_error'))
  })
})
