import * as types from './mutation-types'
import {queryGPSTypeAddList,addSign,getWorkSignList,queryGPSList} from '@/services/oasign'
/**
 * 获取所有签到地址
 * @param Object [k=>v参数对象] obj
 * @since 2018/5/30
 * @author hezd
 * @returns {Promise.<*>}
 */
export async function QueryGPSList({ commit }, obj) {
    commit({
        type: types.QUERYGPSLIST,
        data: await queryGPSTypeAddList(obj, commit)
    })
}


/**
 * 考勤签到
 * @param Object [k=>v参数对象] obj
 * @since 2018/5/31
 * @author hezd
 * @returns {Promise.<*>}
 */
export async function AddSign({ commit }, obj) {
    // commit('UPDATE_LOADING', true, { root: true })
    commit({
        type: types.ADDSIGN,
        data: await addSign(obj, commit)
    })
    // commit('UPDATE_LOADING', false, { root: true })
}
/**
 * 签到记录
 * @param Object [k=>v参数对象] obj
 * @since 2018/5/31
 * @author hezd
 * @returns {Promise.<*>}
 */
export async function GetWorkSignList({ commit }, obj) {
    commit('UPDATE_LOADING', true, { root: true })
    commit({
        type: types.SIGNLISTDATA,
        data: await getWorkSignList(obj, commit)
    })
    commit('UPDATE_LOADING', false, { root: true })
}

/**
 * 获取拜访签到列表
 * @param Object [k=>v参数对象] obj
 * @since 2018/5/31
 * @author hezd
 * @returns {Promise.<*>}
 */
export async function QueryVisitList({ commit }, obj) {
    commit('UPDATE_LOADING', true, { root: true })
    commit({
        type: types.QUERYVISTLIST,
        data: await queryGPSList(obj, commit)
    })
    commit('UPDATE_LOADING', false, { root: true })
}