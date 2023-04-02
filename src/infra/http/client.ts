export interface HttpGetClient {
  get: (input: HttpGetClient.Input) => Promise<HttpGetClient.Output>
}

export namespace HttpGetClient {
  export type Input = {
    url: string
    params?: object
    headers?: object
  }

  export type Output = any
}
