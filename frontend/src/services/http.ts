import axios, { AxiosInstance, AxiosResponse, AxiosRequestConfig } from 'axios'
import { LocalSession } from './localStorage'

/**
 * In this use case, we have no need for anything in the response but the body/data
 * So we'll use an interceptor to automatically forward response.data
 * But we need to also override the types so it matches
 */

declare module 'axios' {
  interface AxiosInstance {
    request<T = any>(config: AxiosRequestConfig): Promise<T>
    get<T = any>(url: string, config?: AxiosRequestConfig): Promise<T>
    delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<T>
    head<T = any>(url: string, config?: AxiosRequestConfig): Promise<T>
    post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T>
    put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T>
    patch<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T>
  }
}

class HttpClient {
  readonly instance: AxiosInstance

  private session: string

  public constructor() {
    this.instance = axios.create({
      baseURL: process.env.REACT_APP_BASE_URL,
    })
    console.log(process.env.REACT_APP_BASE_URL)
    this.session = LocalSession.get() ?? ''
    this._initialize()
  }

  private _initialize = () => {
    // Automatically append the session token to POST request ( except the Auth one)
    axios.interceptors.request.use((config) => {
      if (!config){
        return
      }
      if (config.method === 'POST' && config.url !== '/auth') {
        if (!config.data) {
          config.data = {}
        }
        config.data.session_token = this.session
      }
    })
    this.instance.interceptors.response.use(this._handleResponse, this._handleError)
  }

  private _handleResponse = ({ data }: AxiosResponse) => data

  protected _handleError = (error: any) => {
    console.error(`[HTTPERROR] : ${error}`)
    return Promise.reject(error)
  }

  public setAuthorization(session: string) {
    this.session = session
  }

  public deleteAuthorization() {
    this.session = ''
  }
}

export const httpClient = new HttpClient()
