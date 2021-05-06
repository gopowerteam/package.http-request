import { Observable, EMPTY, Subscriber } from 'rxjs'
import { RequestParams } from './request-params'
import { RequestOption } from './request-option'
import { IRequestServerConfig } from './interfaces'
import { RequestState } from './enums'
import { RequestService } from './request-service'
import * as UUID from 'uuidjs'

/**
 * 请求对象
 */
export class RequestObject {
    // 请求对象id
    public readonly id

    // 请求观察对象
    public readonly requestObservable: any

    // 请求服务对象
    public readonly requestServer: IRequestServerConfig

    // 请求观察者
    private requestObserver!: Subscriber<any>

    private responseModel: any

    // 通讯状态
    private requestState: RequestState = RequestState.Ready
    /**
     * 构造函数
     */
    constructor(requestServer: IRequestServerConfig) {
        // 生成请求对象id
        this.id = UUID.generate()
        // 设置请求服务对象
        this.requestServer = requestServer
        // 设置可观察对象
        this.requestObservable = new Observable(observer => {
            // 设置观察者
            this.requestObserver = observer
        })
    }

    /**
     * 设置响应数据模型
     * @param model
     */
    public setResponseModel(model: any) {
        this.responseModel = model
    }

    /**
     * 发送网络请求
     */
    public request(requestParams: RequestParams): Observable<any> {
        // 如果通讯实体未占用则发送通讯数据
        if (this.requestState === RequestState.Ready) {
            // 修改网络通讯状态
            this.requestState = RequestState.Loading
            // 生成通讯配置对象
            const requestOption = new RequestOption(
                this.requestServer,
                requestParams
            )

            // 发送网络请求
            RequestService.getInstance()
                .send(requestOption)
                .then((response: any) => {
                    // 转换数据结构
                    let data = response

                    // 应用扩展
                    for (const service of requestParams.getExtendService()) {
                        service.after && service.after(data, requestParams)
                    }

                    if (requestParams.options.page) {
                        data = data.content
                    }

                    // 通讯结果正常
                    this.requestObserver.next(data)
                    this.requestObserver.complete()
                })
                .finally(() => {
                    // 重置通讯状态
                    this.requestState = RequestState.Ready
                })
                .catch(response => {
                    // 打印异常结果
                    // 通讯结果异常
                    this.requestObserver.error(response.data)
                })

            // 返回观察对象
            return this.requestObservable
        } else {
            // 通讯实体占用中
            // 忽略进入的请求
            return EMPTY
        }
    }
}
