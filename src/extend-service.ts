import { AxiosResponse } from 'axios'
import { RequestParams } from './request-params'
export abstract class ExtendService {
    public before!: (params: RequestParams) => any

    public after!: (option: any, params: RequestParams) => any

    /**
     * 网络请求失败
     */
    public error!:(response:AxiosResponse,params:RequestParams) => void
}
