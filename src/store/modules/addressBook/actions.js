import * as types from './mutation-types'
import { getXsUserList ,getUserDetail,getUserListByDepartId} from '@/services/user';
import { getMyReceiveReportUserList } from '@/services/oaworkreport';
//获取所有组织架构
import {getDepartMentList} from '@/services/company';
/**
 * 获取全部成员
 * @param Object [k=>v参数对象] obj
 * @since 2018/5/28
 * @author hezd
 * @returns {Promise.<*>}
 */
export async function GetXsUserList({ commit }, obj) {
    commit('UPDATE_LOADING', true, { root: true })
    commit({
        type: types.GETXSUSERLIST,
        data: await getXsUserList(obj, commit)
    })
    commit('UPDATE_LOADING', false, { root: true })
}
/**
 * 获取所有组织架构
 * @param Object [k=>v参数对象] obj
 * @since 2018/5/28
 * @author hezd
 * @returns {Promise.<*>}
 */
export async function GetDepartMentList({ commit }, obj) {
    commit({
        type: types.GETDEPARTMENTLIST,
        data: await getDepartMentList(obj, commit)
    })
}

/**
 * 企业员工信息
 * @param Object [k=>v参数对象] obj
 * @since 2018/5/31
 * @author hezd
 * @returns {Promise.<*>}
 */
export async function GetUserDetail({ commit }, obj) {
    commit('UPDATE_LOADING', true, { root: true })
    commit({
        type: types.GETUSERDETAIL,
        data: await getUserDetail(obj, commit)
    })
    commit('UPDATE_LOADING', false, { root: true })
}

/**
 * 部门下的员工列表
 * @param Object [k=>v参数对象] obj
 * @since 2018/6/2
 * @author hezd
 * @returns {Promise.<*>}
 */
export async function GetUserListByDepartId({ commit }, obj) {
    commit('UPDATE_LOADING', true, { root: true })
    commit({
        type: types.GETUSERLISTBYDEPARTID,
        data: await getUserListByDepartId(obj, commit)
    })
    commit('UPDATE_LOADING', false, { root: true })
}
/**
 * 获取收到的人的工作报告的人的列表
 * @param Object [k=>v参数对象] obj
 * @since 2018/6/8
 * @author hezd
 * @returns {Promise.<*>}
 */
export async function GetMyReceiveReportUserList({ commit }, obj) {
    commit('UPDATE_LOADING', true, { root: true })
    commit({
        type: types.GETXSUSERLIST,
        data: await getMyReceiveReportUserList(obj, commit)
    })
    commit('UPDATE_LOADING', false, { root: true })
}