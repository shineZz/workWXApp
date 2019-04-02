import * as types from './mutation-types'
import { MerchantListSvr, ScheduleListSvr, AreaAuditSvr, proSalesSvr, winningRejectedSvr } from '@/services/merchants'

/**
 * 招商任务列表
 * @param Object [k=>v参数对象] obj
 * @since 2018/3/23
 * @author dbj
 * @returns {Promise.<*>}
 */
export async function MerchantList({ commit }, obj) {
    commit({
        type: types.MERCHANTLIST,
        data: await MerchantListSvr(obj, commit)
    })
}
export async function MerchantList2({ commit }, obj) {
    commit({
        type: types.MERCHANTLIST2,
        data: await MerchantListSvr(obj, commit)
    })
}
/**
 * 招商经销商进度列表
 * @param Object [k=>v参数对象] obj
 * @since 2018/3/27
 * @author dbj
 * @returns {Promise.<*>}
 */
export async function ScheduleList({ commit }, obj) {
    commit({
        type: types.SCHEDULELIST,
        data: await ScheduleListSvr(obj, commit)
    })
}
/**
 * 选择地区和进程
 * @param Object [k=>v参数对象] obj
 * @since 2018/3/27
 * @author dbj
 * @returns {Promise.<*>}
 */
export async function AreaAudit({ commit }, obj) {

    commit({
        type: types.AREAUDIT,
        data: await AreaAuditSvr(obj, commit)
    })
}
/**       
 * 推广详细图表数据
 * @param Object [k=>v参数对象] obj
 * @since 2018/3/27
 * @author jzq
 * @returns {Promise.<*>}
 */
export async function proSales({ commit }, obj) {
    commit('UPDATE_LOADING', true, { root: true })
    let data = await proSalesSvr(obj)
    commit({
        type: types.PROSALES,
        data: data
    })
    commit('UPDATE_LOADING', false, { root: true })
}
/**
 * 招商任务经销商中标和驳回
 * @param Object [k=>v参数对象] obj
 * @since 2018/3/28
 * @author dbj
 * @returns {Promise.<*>}
 */
export async function winningRejected({ commit }, obj) {
    commit('UPDATE_LOADING', true, { root: true })
    commit({
        type: types.WINNINGREJECTED,
        data: await winningRejectedSvr(obj, commit)
    })
    commit('UPDATE_LOADING', false, { root: true })
}