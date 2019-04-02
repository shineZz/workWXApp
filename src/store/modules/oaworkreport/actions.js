import * as types from './mutation-types'
import { queryReviewSvr,saveReviewSvr,initiateReportSvr,receivedReportSvr,viewReportSvr,reportCommentSvr,reportCommentAddSvr,addReportSvr} from '@/services/oaworkreport'

/**
 * 查询工作报告审阅人
 * @param Object [k=>v参数对象] obj
 * @since 2018/5/29
 * @author dbj
 * @returns {Promise.<*>}
 */
export async function queryReview({ commit }, obj) {
    commit('UPDATE_LOADING', true, { root: true })
    commit({
        type: types.QUERYREVIEW,
        data: await queryReviewSvr(obj, commit)
    })
    commit('UPDATE_LOADING', false, { root: true })
}
/**
 * 保存工作报告审阅人
 * @param Object [k=>v参数对象] obj
 * @since 2018/5/29
 * @author dbj
 * @returns {Promise.<*>}
 */
export async function saveReview({ commit }, obj) {    
    commit('UPDATE_LOADING', true, { root: true })
    commit({
        type: types.SAVEREVIEW,
        data: await saveReviewSvr(obj, commit)
    })
}
/**
 * 我发起的
 * @param Object [k=>v参数对象] obj
 * @since 2018/5/30
 * @author dbj
 * @returns {Promise.<*>}
 */
export async function initiateReport({ commit }, obj) {    
    commit({
        type: types.INITIATEREPORT,
        data: await initiateReportSvr(obj, commit)
    })
}
/**
 * 我收到的
 * @param Object [k=>v参数对象] obj
 * @since 2018/5/30
 * @author dbj
 * @returns {Promise.<*>}
 */
export async function receivedReport({ commit }, obj) {    
    commit({
        type: types.RECEIVEDREPORT,
        data: await receivedReportSvr(obj, commit)
    })
}
/**
 * 查看工作报告详情
 * @param Object [k=>v参数对象] obj
 * @since 2018/5/30
 * @author dbj
 * @returns {Promise.<*>}
 */
export async function viewReport({ commit }, obj) {
    commit('UPDATE_LOADING', true, { root: true })
    commit({
        type: types.VIEWREPORT,
        data: await viewReportSvr(obj, commit)
    })
    commit('UPDATE_LOADING', false, { root: true })
}
/**
 * 工作日报评论查看
 * @param Object [k=>v参数对象] obj
 * @since 2018/5/31
 * @author dbj
 * @returns {Promise.<*>}
 */
export async function reportComment({ commit }, obj) {
    commit({
        type: types.REPORTCOMMENT,
        data: await reportCommentSvr(obj, commit)
    })
}
/**
 * 工作日报添加评论
 * @param Object [k=>v参数对象] obj
 * @since 2018/5/31
 * @author dbj
 * @returns {Promise.<*>}
 */
export async function reportCommentAdd({ commit }, obj) {
    commit('UPDATE_LOADING', true, { root: true })
    commit({
        type: types.REPORTCOMMENTADD,
        data: await reportCommentAddSvr(obj, commit)
    })
    commit('UPDATE_LOADING', false, { root: true })
}
/**
 * 工作日报添加
 * @param Object [k=>v参数对象] obj
 * @since 2018/6/8
 * @author dbj
 * @returns {Promise.<*>}
 */
export async function addReport({ commit }, obj) {
    commit('UPDATE_LOADING', true, { root: true })
    commit({
        type: types.ADDREPORT,
        data: await addReportSvr(obj, commit)
    })
    commit('UPDATE_LOADING', false, { root: true })
}
