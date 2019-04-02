import * as types from './mutation-types'

const mutations = {
    /**
     * 获取验证码
     * @param Object [k=>v参数对象] obj
     * @since 2018/6/12
     * @author jzq
     */
    [types.GETSMSTXTCODE](state,{ data }) {
        state.smsTxtCode = data
    },
    /**
     * 检查验证码
     * @param Object [k=>v参数对象] obj
     * @since 2018/6/13
     * @author jzq
     */
    [types.SMSCHECKCODE](state,{ data }) {
        state.smsCheckCode = data
    },
};

export default mutations
