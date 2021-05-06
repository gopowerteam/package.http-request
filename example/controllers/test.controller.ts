
import { RequestMethod } from '../../src'

// 控制器名称
const controller = 'user'

export const UserController = {
    // 同步考勤统计列定义
    login: {
        controller,
        path: '/api/user/login',
        action: 'login',
        type: RequestMethod.Post
    }
}
