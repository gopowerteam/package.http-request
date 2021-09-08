import { Request, RequestParams } from "../../src";
import { Observable } from "rxjs";
import { UserController } from "../controllers/test.controller";

export class UserService {
  /**
   * 获取考勤统计列定义
   */
  @Request({
    server: UserController.login,
  })
  public login(
    params?: RequestParams | { [key: string]: any }
  ): Observable<any> {
    return RequestParams.create(params).request();
  }
}
