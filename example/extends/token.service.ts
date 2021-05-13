import { ExtendService } from '../../src'

export class TokenService extends ExtendService {
    public before = (params: any) => {
        // const userid = localStorage.getItem('userid')
        const userid = '001'

        if (userid) {
            params.options.header = params.options.header || {}
            params.options.header['X-UserID'] = userid
        }
    }

    public after = () => {
        // DO after
    }
}
