import { RequestMethod } from './enums'

/**
 * 服务配置接口
 */
export interface IRequestServerConfig {
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
    append?: { [key: string]: string | number }
    header?: any
    [propName: string]: any
}
