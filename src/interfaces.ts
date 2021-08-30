import { RequestMethod } from './enums'

/**
 * 服务配置接口
 */
export interface IRequestServerConfig {
    gateway?:string
    service?: string
    controller?: string
    action?: string
    type: RequestMethod
    path: string
}

/**
 * 请求选项接口
 */
export interface IRequestParamsOption {
    urlParams?: { [key: string]: any }
    append?: { [key: string]: string | number }
    header?: any
    [propName: string]: any
}
