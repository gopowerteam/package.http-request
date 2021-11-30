import { Observable, EMPTY, Subscriber } from "rxjs";
import { RequestParams } from "./request-params";
import { RequestOption } from "./request-option";
import { IRequestServerConfig } from "./interfaces";
import { RequestState } from "./enums";
import { RequestService } from "./request-service";
import { plainToInstance } from "class-transformer";

/**
 * 请求对象
 */
export class RequestObject {
  // 请求对象id
  public readonly id: string;

  // 请求观察对象
  public readonly requestObservable: any;

  // 请求服务对象
  public readonly requestServer: IRequestServerConfig;

  // 请求观察者
  private requestObserver!: Subscriber<any>;

  private responseModel: any;

  // 通讯状态
  private requestState: RequestState = RequestState.Ready;
  /**
   * 构造函数
   */
  constructor(requestServer: IRequestServerConfig) {
    // 生成请求对象id
    this.id = Math.random().toString(32).slice(2);
    // 设置请求服务对象
    this.requestServer = requestServer;
    // 设置可观察对象
    this.requestObservable = new Observable((observer) => {
      // 设置观察者
      this.requestObserver = observer;
    });
  }

  /**
   * 设置响应数据模型
   * @param model
   */
  public setResponseModel(model: any) {
    this.responseModel = model;
  }

  /**
   * 发送网络请求
   */
  public request(requestParams: RequestParams): Observable<any> {
    // 如果通讯实体未占用则发送通讯数据
    if (this.requestState === RequestState.Ready) {
      // 修改网络通讯状态
      this.requestState = RequestState.Loading;
      // 生成通讯配置对象
      const requestOption = new RequestOption(
        this.requestServer,
        requestParams
      );

      // 发送网络请求
      RequestService.getInstance()
        .send(requestOption)
        .then((response: any) => {
          // 转换数据结构
          let beforeData = response;
          let afterData: any;

          // 更新结果集
          const setData = (value) => {
            afterData = value;
          };

          // 应用扩展
          requestParams
            .getExtendService()
            .forEach(
              (service) =>
                service.after &&
                service.after(beforeData, requestParams, setData)
            );

          // 合并数据
          let data = afterData || beforeData;

          // 数据模型
          if (this.responseModel) {
            data = plainToInstance(this.responseModel, data);
          }

          // 通讯结果正常
          this.requestObserver.next(data);
          this.requestObserver.complete();
        })
        .catch((response) => {
          // 执行扩展服务catch
          requestParams
            .getExtendService()
            .forEach(
              (service) => service.catch && service.catch(requestParams)
            );
          // 打印异常结果
          // 通讯结果异常
          this.requestObserver.error(response.data);
        })
        .finally(() => {
          // 执行扩展服务finally
          requestParams
            .getExtendService()
            .forEach(
              (service) => service.finally && service.finally(requestParams)
            );
          // 重置通讯状态
          this.requestState = RequestState.Ready;
        });

      // 返回观察对象
      return this.requestObservable;
    } else {
      // 通讯实体占用中
      // 忽略进入的请求
      return EMPTY;
    }
  }
}
