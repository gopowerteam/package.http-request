/**
 * 请求方法类型
 */
export enum RequestMethod {
    Get = 'GET',
    Post = 'POST',
    Put = 'PUT',
    Delete = 'DELETE',
    Options = 'OPTIONS',
    Head = 'HEAD',
    Patch = 'PATCH'
}

/**
 * 通讯状态
 */
export enum RequestState {
    Ready, // 准备发送请求
    Loading // 请求发送中
}
