import * as types from './mutation-types'

const mutations = {
    /**
     * 上传图片
     * @param Object [k=>v参数对象] obj
     * @since 2018/8/7
     * @author hezd
     * @returns {Promise.<*>}
     */
    [types.UPLOADFILE](state, { data }) {
        state.uploadFileData = data
    },
}

export default mutations