# @gopowerteam/http-request
---

[![npm version](https://img.shields.io/npm/v/@gopowerteam/http-request.svg?style=flat-square)](https://www.npmjs.org/package/@gopowerteam/http-request)
[![install size](https://packagephobia.now.sh/badge?p=@gopowerteam/http-request)](https://packagephobia.now.sh/result?p=@gopowerteam/http-request)


基于`rxjs`,`axios`的网络请求封装,返回`Observable`对象,便于操作.

## 目录
---

  - [特性](#特性)
  - [安装](#安装)
  - [示例](#示例)
  - [自定义拦截器](#自定义拦截器)
    - [状态拦截器](#状态拦截器)
    - [成功拦截器](#成功拦截器)
    - [失败拦截器](#失败拦截器)
  - [异常处理](#异常处理)
  - [扩展服务支持](#扩展服务支持)
  

## 特性
---

* 基于`axios`进行封装操作
* 请求流程基于`rxjs`进行封装
* 使用`Controller`,`Service`进行配置,便于重复调用
* 支持自定义拦截器操作
* 支持请求服务扩展

## 安装
---

```shell
// yarn use
# yarn add @gopowerteam/http-request

// npm use
# npm install @gopowerteam/http-request --save
```

## 示例
---

```typescript
// config.ts
import { RequestService } from '@gopowerteam/http-request';

// 配置服务端信息
RequestService.setConfig({
    server: 'http://api.test.com/',     // 设置请求地址
    timeout: 3000                       // 设置请求超时
})
```

```typescript
// user.controller.ts

import { RequestMethod } from '@gopowerteam/http-request'

export const UserController = {
    login: {
        controller:'user',
        path: '/api/user/login',
        action: 'login',
        type: RequestMethod.Post
    }
}
```

```typescript
// user.service.ts
import { Request, RequestParams } from '@gopowerteam/http-request'
import { Observable } from 'rxjs'
import { UserController } from '../controllers/test.controller'

export class UserService {
    @Request({
        server: UserController.login
    })
    public login(
        requestParams: RequestParams
    ): Observable<any> {
        return requestParams.request()
    }
}
```

```typescript
// index.ts
const userService = new UserService()

userService.login(new RequestParams()).subscribe({
    next: data => {
        console.log(data)
    }
})
```

[完整示例](https://github.com/gopowerteam/package.http-request/tree/master/example)

## 自定义拦截器
---

### 状态拦截器

状态拦截器函数负责判断网络请求是否成功,如`state为200`或`data.success为true`,

```typescript
// 配置状态拦截器
RequestService.interceptors.status.use(respone => {
    return true
})
```
### 成功拦截器

成功拦截器用于确认网络请求成功后返回的数据结构

```typescript
// 添加成功拦截器
RequestService.interceptors.success.use(respone => {
    return respone.data
})
```

### 失败拦截器

失败拦截器用于确认网络请求失败后返回的数据结构

```typescript
// 添加失败拦截器
RequestService.interceptors.error.use(respone => {
    return respone
})
```

## 网络异常处理
---

通过设置`requestCatchHandle`可以设置全局异常处理

```typescript
RequestService.requestCatchHandle = respone => {
    const defaultError = '服务通讯连接失败'
    const messageList = {
        400: '请求参数错误',
        405: '请求服务方法错误',
        500: '服务器内部错误',
        403: '没有权限，请重新登陆'
    }

    if (respone) {
        const responseMessage = (respone.data || {}).message
        const errorMessage =
            responseMessage || messageList[respone.status] || defaultError

        if (respone.status === 403) {
            console.error(respone.data)
        }

    } else {
    }
}
```
## 扩展服务
---

扩展服务支持对请求进行前置或后置的修改,可以通过定义`before`和`after`来进行前置或后置的操作,可以对发送数据进行修改.扩展服务支持全局安装和单请求安装.

```typescript
import { ExtendService } from '@gopowerteam/http-request'

export class TokenService extends ExtendService {
    public before = (params: any) => {
        const userid = '001'

        if (userid) {
            params.options.header = params.options.header || {}
            params.options.header['X-UserID'] = userid
        }
    }

    public after = (data: any, params) => {
        //
    }
}

// 全局安装扩展服务
RequestService.installExtendService(new TokenService())

// 单请求安装扩展服务
userService.login(new RequestParams({},{
    token:new TokenService()
}}})).subscribe({
    next: data => {
        console.log(data)
    }
})
```






