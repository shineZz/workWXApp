import * as types from './mutation-types'

const mutations = {
    /**
     * 获取验证码
     * @param Object [k=>v参数对象] obj
     * @since 2018/6/12
     * @author jzq
     */
    [types.TASKUPLOADATTCH](state,{ data }) {
        state.taskUploadData = data
    },
}

export default mutations
