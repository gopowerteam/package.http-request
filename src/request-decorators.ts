import { RequestObject } from './request-object'
import { RequestParams } from './request-params'
import { IRequestServerConfig } from './interfaces'
import { Model } from './request-modal'
/**
 * 网络请求行为装饰器
 */
export function Request({
    server,
    model,
    force
}: {
    server: IRequestServerConfig
    model?: { prototype: Model }
    force?: boolean
}) {
    return (target: any, name: string, descriptor: PropertyDescriptor) => {
        const generateRequestObject = () => {
            // 请求对象
            const object = new RequestObject(server)

            // 设置响应数据模型
            if (model) {
                object.setResponseModel(model)
            }

            return object
        }

        const requestObject = generateRequestObject()

        // 存储历史方法
        const _value = descriptor.value

        // 传入请求方法
        descriptor.value = (requestParams: RequestParams) => {
            if (force) {
                requestParams.setRequestObject(generateRequestObject())
            } else {
                // 设置请求对象
                requestParams.setRequestObject(requestObject)
            }

            // 传入更新后的请求对象
            return _value.call(target, requestParams)
        }

        return descriptor
    }
}
