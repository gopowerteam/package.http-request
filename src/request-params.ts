import { IRequestParamsOption } from './interfaces'
import { RequestObject } from './request-object'
import { Model } from './request-modal'
import { Observable } from 'rxjs'
import { RequestService } from './request-service'
import { ExtendService } from './extend-service'
import { classToPlain } from 'class-transformer'
/**
 * 请求参数对象
 */
export class RequestParams {
    public data?: any
    public options: IRequestParamsOption
    private requestObject!: RequestObject
    /**
     * 构造函数
     * @param data
     * @param options
     */
    constructor(data?: any, options?: IRequestParamsOption) {
        this.data = data instanceof Model ? classToPlain(data) : data || {}
        this.options = options || {}
    }

    /**
     * 设置请求对象
     * @param requestObject
     */
    public setRequestObject(requestObject: RequestObject) {
        this.requestObject = requestObject
    }

    /**
     * 获取扩展服务
     */
    public getExtendService() {
        const extendServices = this.options
            ? Object.values(this.options).filter(
                service => service instanceof ExtendService
            )
            : []
        return [...extendServices, ...RequestService.extendServices]
    }

    /**
     * 对数据进行转换
     */
    public map(callback: any) {
        this.data = callback(this.data)
    }

    /**
     * 发送网络请求
     */
    public request(): Observable<any> {
        return this.requestObject.request(this)
    }
}
