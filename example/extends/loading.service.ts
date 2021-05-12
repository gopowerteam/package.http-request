import { Observable, Subscriber } from 'rxjs'
import { ExtendService } from '../../src'

export class LoadingService extends ExtendService {
    public status: Observable<boolean>

    public timeout

    public subscriber!: Subscriber<boolean>

    constructor() {
        super()
        this.status = new Observable(
            subscriber => (this.subscriber = subscriber)
        )
    }

    /**
     * 请求前置操作
     */
    public before = () => {
        this.subscriber.next(true)

        // 清除超时操作
        if (this.timeout) {
            clearTimeout(this.timeout)
        }

        // 超时重置状态
        this.timeout = setTimeout(() => {
            this.subscriber.next(true)
        }, 3000)
    }

    /**
     * 请求后置操作
     */
    public after = () => {
        this.subscriber.next(false)

        if (this.timeout) {
            clearTimeout(this.timeout)
        }
    }

    /**
     * 请求失败了也要让loading结束
     */
    public error = () =>{
        this.after()
    }
}
