import * as types from './mutation-types'
import { circleListSvr,messageThumbSvr,AddCommentSvr,AddReplySvr,delMessageSvr,addMessageSvr } from '@/services/oamessage'

/**
 * 查询朋友圈消息列表
 * @param Object [k=>v参数对象] obj
 * @since 2018/5/28
 * @author dbj
 * @returns {Promise.<*>}
 */
export async function circleList({ commit }, obj) {
    commit({
        type: types.CIRCELIST,
        data: await circleListSvr(obj, commit)
    })
}

/**
 * 消息点赞
 * @param Object [k=>v参数对象] obj
 * @since 2018/5/28
 * @author dbj
 * @returns {Promise.<*>}
 */
export async function messageThumb({ commit }, obj) {    
    commit('UPDATE_LOADING', true, { root: true })
    commit({
        type: types.PRAISE,
        data: await messageThumbSvr(obj, commit)
    })
    commit('UPDATE_LOADING', false, { root: true })
}
/**
 * 新增评论
 * @param Object [k=>v参数对象] obj
 * @since 2018/5/28
 * @author dbj
 * @returns {Promise.<*>}
 */
export async function AddComment({ commit }, obj) {    
    commit('UPDATE_LOADING', true, { root: true })
    commit({
        type: types.ADDCOMMENT,
        data: await AddCommentSvr(obj, commit)
    })
    commit('UPDATE_LOADING', false, { root: true })
}
/**
 * 新增回复评论
 * @param Object [k=>v参数对象] obj
 * @since 2018/5/28
 * @author dbj
 * @returns {Promise.<*>}
 */
export async function AddReply({ commit }, obj) {    
    commit('UPDATE_LOADING', true, { root: true })
    commit({
        type: types.ADDREPLY,
        data: await AddReplySvr(obj, commit)
    })
    commit('UPDATE_LOADING', false, { root: true })
}
/**
 * 删除消息
 * @param Object [k=>v参数对象] obj
 * @since 2018/5/28
 * @author dbj
 * @returns {Promise.<*>}
 */
export async function delMessage({ commit }, obj) {    
    commit('UPDATE_LOADING', true, { root: true })
    commit({
        type: types.DELMESSAGE,
        data: await delMessageSvr(obj, commit)
    })
    commit('UPDATE_LOADING', false, { root: true })
}
/**
 * 发布消息
 * @param Object [k=>v参数对象] obj
 * @since 2018/6/8
 * @author dbj
 * @returns {Promise.<*>}
 */
export async function addMessage({ commit }, obj) {    
    commit('UPDATE_LOADING', true, { root: true })
    commit({
        type: types.ADDMESSAGE,
        data: await addMessageSvr(obj, commit)
    })
    commit('UPDATE_LOADING', false, { root: true })
}
