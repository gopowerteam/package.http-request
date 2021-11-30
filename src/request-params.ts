import { IRequestParamsOption } from "./interfaces";
import { RequestObject } from "./request-object";
import { Model } from "./request-modal";
import { Observable } from "rxjs";
import { RequestService } from "./request-service";
import { ExtendService } from "./extend-service";
import { instanceToPlain } from "class-transformer";
/**
 * 请求参数对象
 */
export class RequestParams {
  private data?: { [key: string]: any };
  private options: IRequestParamsOption;
  private requestObject!: RequestObject;
  /**
   * 构造函数
   * @param data
   * @param options
   */
  constructor(options?: IRequestParamsOption) {
    const { data } = options || {};
    this.data = data instanceof Model ? instanceToPlain(data) : data || {};
    this.options = options || {};
  }

  /**
   * 创建RequestParams
   * @param params
   * @returns
   */
  public static create(params?: RequestParams | { [key: string]: any }) {
    if (params instanceof RequestParams) {
      return params;
    } else {
      return new RequestParams({ data: params || {} });
    }
  }

  /**
   * 设置请求参数
   * @param data
   */
  public setData(data) {
    this.data = data instanceof Model ? instanceToPlain(data) : data || {};
  }

  /**
   * 获取请求参数
   * @param data
   * @returns
   */
  public getData() {
    return this.data;
  }

  /**
   * 获取RequestObject
   */
  public getRequestObject() {
    return this.requestObject;
  }

  /**
   * 设置请求配置
   * @param options
   */
  public setOptions(options) {
    this.options = options || {};
  }

  /**
   * 获取请求配置
   * @returns
   */
  public getOptions(key?: string) {
    return key ? this.options[key] : this.options;
  }

  /**
   * 设置请求对象
   * @param requestObject
   */
  public setRequestObject(requestObject: RequestObject) {
    this.requestObject = requestObject;
  }

  /**
   * 获取扩展服务
   */
  public getExtendService(): ExtendService[] {
    const extendServices = this.options
      ? Object.values(this.options).filter(
          (service) => service instanceof ExtendService
        )
      : [];
    return [...extendServices, ...RequestService.extendServices];
  }

  /**
   * 对数据进行转换
   */
  public map(callback: any) {
    this.data = callback(this.data);
  }

  /**
   * 发送网络请求
   */
  public request<T>(): Observable<T> {
    return this.requestObject.request(this);
  }
}
