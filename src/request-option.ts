import { stringify } from 'qs'
import { IRequestServerConfig } from './interfaces'
import { RequestParams } from './request-params'
import { RequestMethod } from './enums'
import { RequestService } from './request-service'

/**
 * 请求配置对象
 */
export class RequestOption {
    // 请求服务对象
    private readonly requestServer: IRequestServerConfig
    // 请求参数对象
    private readonly requestParams: RequestParams
    /**
     * 构造函数
     * @param requestServer 请求服务
     * @param params 请求参数
     */
    constructor(
        requestServer: IRequestServerConfig,
        requestParams: RequestParams
    ) {
        this.requestServer = requestServer
        this.requestParams = requestParams
    }

    /**
     * 获取请求选项
     */
    public getOptions() {
        // 应用扩展
        this.requestParams.getExtendService().forEach(service =>
            service.before && service.before(this.requestParams)
        )

        return {
            url: RequestService.getRequestUrl
                ? RequestService.getRequestUrl(this)
                : this.getRequestUrl(),
            headers: RequestService.getRequestHeader
                ? RequestService.getRequestHeader(this)
                : this.requestParams.getOptions('header'),
            responseType: this.requestParams.getOptions('responseType'),
            method: this.requestServer.type,
            // 获取post请求参数
            data: this.getParamsByMethod(false),
            // 获取get请求参数
            params: this.getParamsByMethod(true),
            // 序列化参数:用于GET请求
            paramsSerializer: (params: any) =>
                stringify(params, {
                    arrayFormat: 'indices',
                    skipNulls: true,
                    allowDots: true,
                    encodeValuesOnly: true,
                    encode: true
                })
        }
    }

    /**
     * 获取目标url地址
     */
    public getRequestUrl() {
        if (!this.requestServer) {
            throw new Error('server配置异常,请检查对应server配置')
        }

        // 服务地址数组
        // 地址组合规则为
        // : baseUrl/service/controller/action/append
        let path = this.requestServer.path

        if (this.requestParams.getOptions('append')) {
            Object.entries(this.requestParams.getOptions('append') as { [key: string]: string | number }).forEach(
                ([key, value]) => {
                    path = path.replace(
                        `{${key}}`,
                        value ? value.toString() : ''
                    )
                }
            )
        }

        // 组合为url形式
        return `${this.requestServer.service || ''}${path}`
    }

    /**
     * 请求类型返回请求参数
     */
    private getParamsByMethod(isGet: boolean) {
        // 请求返回非当前请求方式则返回{}
        if (this.isGetMethod() !== isGet) {
            return isGet ? { ...this.requestParams?.getOptions()?.urlParams } : {}
        }

        // 根据请求方式返回数据
        if (isGet) {
            return this.filterEmptyData(this.requestParams.getData())
        } else {
            return { ...this.requestParams.getData() }
        }
    }

    /**
     * 是否是get类型方法
     */
    private isGetMethod() {
        return [RequestMethod.Get, RequestMethod.Delete].includes(
            this.requestServer.type
        )
    }

    /**
     * 过滤空数据
     * @param data
     */
    private filterEmptyData(values: any) {
        // 初始进行浅拷贝
        const data = { ...values }

        // 过滤数据项
        Object.entries(data)
            .filter(([key, value]: [any, any]) => {
                // 过滤空字符串
                if (value === undefined || value === '') {
                    return true
                }

                // 过滤空数组
                if (
                    value instanceof Array &&
                    (value.length === 0 || value.every(x => x === ''))
                ) {
                    return true
                }
            })
            .forEach(([key]) => {
                delete data[key]
            })

        return data
    }
}
