import * as types from './mutation-types'
import { resultsListSvr,resultsAllSvr,resultsAddSvr,resultsTypeSvr} from '@/services/oadashboard'

/**
 * 获取我的仪表盘
 * @param Object [k=>v参数对象] obj
 * @since 2018/5/29
 * @author dbj
 * @returns {Promise.<*>}
 */
export async function resultsList({ commit }, obj) {
    commit('UPDATE_LOADING', true, { root: true })
    commit({
        type: types.RESULTSLIST,
        data: await resultsListSvr(obj, commit)
    })
    commit('UPDATE_LOADING', false, { root: true })
}
/**
 * 根据仪表盘分类获取仪表盘
 * @param Object [k=>v参数对象] obj
 * @since 2018/5/29
 * @author dbj
 * @returns {Promise.<*>}
 */
export async function resultsAll({ commit }, obj) {
    commit('UPDATE_LOADING', true, { root: true })
    commit({
        type: types.RESULTSALL,
        data: await resultsAllSvr(obj, commit)
    })
    commit('UPDATE_LOADING', false, { root: true })
}
/**
 * 添加我的仪表盘
 * @param Object [k=>v参数对象] obj
 * @since 2018/5/29
 * @author dbj
 * @returns {Promise.<*>}
 */
export async function resultsAdd({ commit }, obj) {
    commit('UPDATE_LOADING', true, { root: true })
    commit({
        type: types.RESULTSADD,
        data: await resultsAddSvr(obj, commit)
    })
    commit('UPDATE_LOADING', false, { root: true })
}
/**
 * 获取仪表盘类型
 * @param Object [k=>v参数对象] obj
 * @since 2018/5/29
 * @author dbj
 * @returns {Promise.<*>}
 */
export async function resultsType({ commit }, obj) {
    commit({
        type: types.RESULTSTYPE,
        data: await resultsTypeSvr(obj, commit)
    })
}