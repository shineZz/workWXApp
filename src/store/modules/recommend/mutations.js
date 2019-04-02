import * as types from './mutation-types'

const mutations = {
    /**
     * 推荐任务列表
     * @param Object [k=>v参数对象] obj
     * @since 2018/6/25
     * @author hezd
     * @returns {Promise.<*>}
     */
    [types.RECOMLIST](state, { data }) {
        state.recomListData = data
    },
    /**
     * 根据task_id获取推荐客服审核过的经销商(不包含厂家采纳不通过的)的列表
     * @param Object [k=>v参数对象] obj
     * @since 2018/6/25
     * @author hezd
     * @returns {Promise.<*>}
     */
    [types.RECOMSERVAUDPASS](state, { data }) {
        state.recomServAudPassData = data
    },
    /**
     * 厂家审核采纳与不采纳接口
     * @param Object [k=>v参数对象] obj
     * @since 2018/6/25
     * @author hezd
     * @returns {Promise.<*>}
     */
    [types.ADDRECOMAUDFLOW](state, { data }) {
        state.recomAudFlowData = data
    },
    /**
     * 推荐任务基本详情
     * @param Object [k=>v参数对象] obj
     * @since 2018/6/25
     * @author hezd
     * @returns {Promise.<*>}
     */
    [types.RECOMTASKINFO](state, { data }) {
        state.recomInfoData = data
    },
    /**
     * 推荐任务详情预览
     * @param Object [k=>v参数对象] obj
     * @since 2018/6/25
     * @author hezd
     * @returns {Promise.<*>}
     */
    [types.RECOMTASKDETAIL](state, { data }) {
        state.recomDetailData = data
    },
    /**
     * 推荐任务新增或编辑
     * @param Object [k=>v参数对象] obj
     * @since 2018/6/25
     * @author hezd
     * @returns {Promise.<*>}
     */
    [types.UPDATERECOM](state, { data }) {
        state.updateRecomData = data
    },
    /**
     * 更改提交状态
     * @param Object [k=>v参数对象] obj
     * @since 2018/6/25
     * @author hezd
     * @returns {Promise.<*>}
     */
    [types.SUBRECOM](state, { data }) {
        state.subRecomData = data
    },
    /**
     * 推荐任务上架
     * @param Object [k=>v参数对象] obj
     * @since 2018/6/25
     * @author hezd
     * @returns {Promise.<*>}
     */
    [types.ONLINERECOM](state, { data }) {
        state.onLineRecomData = data
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
     * 推荐内容
     * @param Object [k=>v参数对象] obj
     * @since 2018/8/8
     * @author hezd
     * @returns {Promise.<*>}
     */
    [types.RECOMMENTFIELDS](state, { data }) {
        // console.log(data,'---recommentFiledsData-00000')
        state.recommentFiledsData = data
    },
    /**
     * 获取推荐内容字段
     * @param Object [k=>v参数对象] obj
     * @since 2018/8/9
     * @author hezd
     * @returns {Promise.<*>}
     */
    [types.RECOMMENDTASKFIELDS](state, { data }) {
        // console.log(data,'---recommentFiledsData-00000')
        state.recommendTaskFiledsData = data
    },

    /**
     * 获取任务状态列表
     * @param Object [k=>v参数对象] obj
     * @since 2018/8/9
     * @author hezd
     * @returns {Promise.<*>}
     */
    [types.GETTASKSTATUSLISTS](state, { data }) {
      state.taskStatusData = data
    },



  /**
   * 获取推荐采纳列表
   * @param Object [k=>v参数对象] obj
   * @since 2018/8/9
   * @author hezd
   * @returns {Promise.<*>}
   */
    [types.GETRECOMMENDSERVICEAUDITPASSLISTS](state, { data }) {
    state.recommendDealerData = data
    },





  /**
   * 厂家审核采纳与不采纳
   * @param Object [k=>v参数对象] obj
   * @since 2018/8/9
   * @author hezd
   * @returns {Promise.<*>}
   */
    [types.ADDTASKRECOMMENDAUDITFLOW](state, { data }) {
     state.recommendAuditFlowData = data
    },



}

export default mutations
