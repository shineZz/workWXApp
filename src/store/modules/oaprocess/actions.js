import * as types from './mutation-types'
import { queryApprovalSvr,processListSvr,viewProcessSvr,btnApprovalSvr,addApprovalSvr} from '@/services/oaprocess'

/**
 * 获取预先定义的流程节点处理人
 * @param Object [k=>v参数对象] obj
 * @since 2018/5/29
 * @author dbj
 * @returns {Promise.<*>}
 */
export async function queryApproval({ commit }, obj) {
    commit('UPDATE_LOADING', true, { root: true })
    commit({
        type: types.QUERYAPPROVAL,
        data: await queryApprovalSvr(obj, commit)
    })
    commit('UPDATE_LOADING', false, { root: true })
}
/**
 * 流程列表接口(我发起的流程/待我审核的流程/我已审批的流程
 * @param Object [k=>v参数对象] obj
 * @since 2018/5/31
 * @author dbj
 * @returns {Promise.<*>}
 */
export async function processList({ commit }, obj) {    
    commit({
        type: types.PROCESSLIST,
        data: await processListSvr(obj, commit)
    })
}
/**
 * 查看流程详情
 * @param Object [k=>v参数对象] obj
 * @since 2018/5/31
 * @author dbj
 * @returns {Promise.<*>}
 */
export async function viewProcess({ commit }, obj) { 
    commit('UPDATE_LOADING', true, { root: true })   
    commit({
        type: types.VIEWPROCESS,
        data: await viewProcessSvr(obj, commit)
    })
    commit('UPDATE_LOADING', false, { root: true })
}
/**
 * 流程节点审批(同意/拒绝/转发/ 撤销
 * @param Object [k=>v参数对象] obj
 * @since 2018/5/31
 * @author dbj
 * @returns {Promise.<*>}
 */
export async function btnApproval({ commit }, obj) { 
    commit('UPDATE_LOADING', true, { root: true })   
    commit({
        type: types.BTNAPPROVAL,
        data: await btnApprovalSvr(obj, commit)
    })
    commit('UPDATE_LOADING', false, { root: true })
}
/**
 * 新增加流程
 * @param Object [k=>v参数对象] obj
 * @since 2018/6、8
 * @author dbj
 * @returns {Promise.<*>}
 */
export async function addApproval({ commit }, obj) { 
    commit('UPDATE_LOADING', true, { root: true })   
    commit({
        type: types.ADDAPPROVAL,
        data: await addApprovalSvr(obj, commit)
    })
    commit('UPDATE_LOADING', false, { root: true })
}