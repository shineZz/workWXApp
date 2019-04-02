import * as types from './mutation-types'
// 同步方法
const mutations = {
    /**
     * 查询工作报告审阅人
     * @param Object [k=>v参数对象] obj
     * @since 2018/5/29
     * @author dbj
     * @returns {Promise.<*>}
     */
    [types.QUERYREVIEW](state, { data }) {
        state.queryReviewData = data
    },
    /**
     * 查询工作报告审阅人
     * @param Object [k=>v参数对象] obj
     * @since 2018/5/29
     * @author dbj
     * @returns {Promise.<*>}
     */
    [types.SAVEREVIEW](state, { data }) {
        state.saveReviewData = data
    },  
     /**
     * 我发起的
     * @param Object [k=>v参数对象] obj
     * @since 2018/5/29
     * @author dbj
     * @returns {Promise.<*>}
     */
    [types.INITIATEREPORT](state, { data }) {
        state.initiateData = data
    },  
    /**
     *清除我发起的
     * @param Object [k=>v参数对象] obj
     * @since 2018/5/30
     * @author dbj
     * @returns {Promise.<*>}
     */
    [types.CLEAR_INITIATEREPORT](state) {
        state.initiateData = {}
    }, 
    /**
     * 我收到的
     * @param Object [k=>v参数对象] obj
     * @since 2018/5/29
     * @author dbj
     * @returns {Promise.<*>}
     */
    [types.RECEIVEDREPORT](state, { data }) {
        state.receivedData = data
    },  
    /**
     *清除我收到的
     * @param Object [k=>v参数对象] obj
     * @since 2018/5/30
     * @author dbj
     * @returns {Promise.<*>}
     */
    [types.CLEAR_RECEIVEDREPORT](state) {
        state.receivedData = {}
    }, 
    /**
     * 查看工作报告详情
     * @param Object [k=>v参数对象] obj
     * @since 2018/5/29
     * @author dbj
     * @returns {Promise.<*>}
     */
    [types.VIEWREPORT](state, { data }) {
        state.viewReportData = data
    },  
    /**
     *清除查看工作报告详情
     * @param Object [k=>v参数对象] obj
     * @since 2018/5/30
     * @author dbj
     * @returns {Promise.<*>}
     */
    [types.CLEAR_VIEWREPORT](state) {
        state.viewReportData = {}
    }, 
    /**
     * 工作日报评论查看
     * @param Object [k=>v参数对象] obj
     * @since 2018/5/29
     * @author dbj
     * @returns {Promise.<*>}
     */
    [types.REPORTCOMMENT](state, { data }) {
        state.reportCommentData = data
    },  
    /**
     *清除工作日报评论查看
     * @param Object [k=>v参数对象] obj
     * @since 2018/5/30
     * @author dbj
     * @returns {Promise.<*>}
     */
    [types.CLEAR_REPORTCOMMENT](state) {
        state.reportCommentData = {}
    },  
     /**
     * 工作日报添加评论
     * @param Object [k=>v参数对象] obj
     * @since 2018/5/29
     * @author dbj
     * @returns {Promise.<*>}
     */
    [types.REPORTCOMMENTADD](state, { data }) {
        state.reportCommentAddData = data
    },  
    /**
     * 工作日报添加
     * @param Object [k=>v参数对象] obj
     * @since 2018/6/8
     * @author dbj
     * @returns {Promise.<*>}
     */
    [types.ADDREPORT](state, { data }) {
        state.addReportData = data
    },  
    
}

export default mutations