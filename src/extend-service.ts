import { RequestOption } from "./request-option";
import { RequestParams } from "./request-params";
export abstract class ExtendService {
  public before: (params: RequestParams) => any;

  public after: (
    data: any,
    params: RequestParams,
    setData: (data: any) => void
  ) => any;

  public finally: (params: RequestParams) => any;

  public catch: (params: RequestParams) => any;
}
