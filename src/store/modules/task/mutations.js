import * as types from './mutation-types'

const mutations = {
    /**
     * 上传合同
     * @param Object [k=>v参数对象] obj
     * @since 2018/6/11
     * @author dbj
     */
    [types.UPLOADBTN](state,{ data }) {
        state.uploadBtnData = data
    },
}

export default mutations
