import { ResponseType } from 'axios';
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
    urlParams?: { [key: string]: any }
    append?: { [key: string]: string | number }
    header?: any,
    /**
     * 返回数据类型
     */
    responseType?: ResponseType,
    [propName: string]: any
}
