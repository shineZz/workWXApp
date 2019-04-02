import * as types from './mutation-types'
import { searchNoticeBoard , getNoticeList ,saveNotice ,getSysListSvr ,viewNoticeSvr,notViewNoticeSvr,isJurisdictionSvr} from '@/services/oanotice'

/**
 * 获取公告列表
 * @param Object [k=>v参数对象] obj
 * since 2018/5/29
 * author hezd
 * @returns {Promise.<*>}
 */
export async function GetNoticeList({ commit }, data) {
    // commit('UPDATE_LOADING', true, { root: true })
    commit({
        type: types.GETNOTICELIST,
        data: await getNoticeList(data, commit)
    })
    // commit('UPDATE_LOADING', false, { root: true })
}
/**
 * 获取公告栏目
 * @param Object [k=>v参数对象] obj
 * @since 2018/5/28
 * @author hezd
 * @returns {Promise.<*>}
 */
export async function SearchNoticeBoard({ commit }, data) {
    commit({
        type: types.SEARCHNOTICEBOARD,
        data: await searchNoticeBoard(data, commit)
    })
}
/**
 * 发布公告
 * @param Object [k=>v参数对象] obj
 * @since 2018/5/29
 * @author hezd
 * @returns {Promise.<*>}
 */
export async function SaveNotice({ commit }, data) {
    commit('UPDATE_LOADING', true, { root: true })
    commit({
        type: types.SAVENOTICE,
        data: await saveNotice(data, commit)
    })
    commit('UPDATE_LOADING', false, { root: true })
}


/**
 * 获取通知列表
 * @param Object [k=>v参数对象] obj
 * @since 2018/5/30
 * @author hezd 
 * @returns {Promise.<*>}
 */
export async function GetSysList({ commit }, data) {
    commit('UPDATE_LOADING', true, { root: true })
    commit({
        type: types.GETSYSLIST,
        data: await getSysListSvr(data, commit)
    })
    commit('UPDATE_LOADING', false, { root: true })
}
/**
 * 获取通知列表
 * @param Object [k=>v参数对象] obj
 * @since 2018/5/30
 * @author hezd 
 * @returns {Promise.<*>}
 */
export async function ViewNotice({ commit }, data) {
    commit('UPDATE_LOADING', true, { root: true })
    commit({
        type: types.VIEWNOTICE,
        data: await viewNoticeSvr(data, commit)
    })
    commit('UPDATE_LOADING', false, { root: true })
}
/**
 * 获取未读公告数量
 * @param Object [k=>v参数对象] obj
 * @since 2018/6/6
 * @author hezd 
 * @returns {Promise.<*>}
 */
export async function NotViewNotice({ commit }, data) {
    commit({
        type: types.GETNOTVIEWNUMBER,
        data: await notViewNoticeSvr(data, commit)
    })

}