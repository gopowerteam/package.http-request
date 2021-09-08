import { ExtendService, RequestParams } from "../../src";

export class PageService extends ExtendService {
  public default = {
    pageSize: 10,
    pageIndex: 1,
    total: 0,
    pageSizeOpts: ["10", "20", "50", "100"],
  };
  public pageSize = 0;
  public pageIndex = 0;
  public total = 0;
  public pageSizeOpts: string[] = [];

  constructor(data?: any) {
    super();

    if (data) this.default = { ...this.default, ...data };

    this.pageSize = this.default.pageSize;
    this.pageIndex = this.default.pageIndex || 1;
    this.total = this.default.total;
    this.pageSizeOpts = this.default.pageSizeOpts;
  }

  public before = (params) => {
    params.data = {
      ...params.data,
      size: this.pageSize,
      page: this.pageIndex - 1,
    };
  };

  public after = (data: any, params: RequestParams, setData) => {
    this.total = data.totalElements;
    setData(data.content);
  };

  public reset() {
    this.pageIndex = this.default.pageIndex;
    this.pageSize = this.default.pageSize;
  }

  public update(pageIndex, pageSize) {
    this.pageIndex = pageIndex;
    this.pageSize = pageSize;
    return Promise.resolve();
  }
}
