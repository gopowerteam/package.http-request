import { AxiosResponse } from 'axios'

/**
 * 请求拦截器
 */
export class RequestInterceptor<T> {
    /**
     * 拦截器状态
     */
    public defined = false

    /**
     * 拦截器
     */
    public interceptor!: (response: AxiosResponse) => T

    /**
     * 注册拦截器
     */
    public use(callback: (response: AxiosResponse) => T) {
        this.defined = true
        this.interceptor = callback
    }
}
