import * as types from './mutation-types'

const mutations = {
    /**
     * 推广任务列表
     * @param Object [k=>v参数对象] obj
     * @since 2018/6/25
     * @author hezd
     * @returns {Promise.<*>}
     */
    [types.PROLIST](state, { data }) {
        state.proListData = data
    },
    /**
     * 推广任务基本详情
     * @param Object [k=>v参数对象] obj
     * @since 2018/6/25
     * @author hezd
     * @returns {Promise.<*>}
     */
    [types.PROTASKINFO](state, { data }) {
        state.proInfoData = data
    },
    /**
     * 推广任务详情预览
     * @param Object [k=>v参数对象] obj
     * @since 2018/6/25
     * @author hezd
     * @returns {Promise.<*>}
     */
    [types.PROTASKDETAIL](state, { data }) {
        state.proDetailData = data
    },
    /**
     * 推广任务新增或编辑
     * @param Object [k=>v参数对象] obj
     * @since 2018/6/25
     * @author hezd
     * @returns {Promise.<*>}
     */
    [types.UPDATEPRO](state, { data }) {
        state.updateProData = data
    },
    /**
     * 更改提交状态
     * @param Object [k=>v参数对象] obj
     * @since 2018/6/25
     * @author hezd
     * @returns {Promise.<*>}
     */
    [types.SUBPRO](state, { data }) {
        state.subProData = data
    },
    /**
     * 推广任务上架
     * @param Object [k=>v参数对象] obj
     * @since 2018/6/25
     * @author hezd
     * @returns {Promise.<*>}
     */
    [types.ONLINEPRO](state, { data }) {
        state.onLineProData = data
    },
    /**
     * 上传任务详情文件
     * @param Object [k=>v参数对象] obj
     * @since 2018/6/25
     * @author hezd
     * @returns {Promise.<*>}
     */
    [types.UPLOADFILE](state, { data }) {
        state.uploadFileData = data
    },
    /**
     * 推广任务分享详情报表
     * @param Object [k=>v参数对象] obj
     * @since 2018/6/25
     * @author hezd
     * @returns {Promise.<*>}
     */
    [types.SHAREPRO](state, { data }) {
        state.shareDetailData = data
    },

}

export default mutations