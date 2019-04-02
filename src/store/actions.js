import * as types from './mutation-types'
import { userInfoSvr, qywxSvr, addressSvr,getProfileSvr } from '@/services/update'

/**
 * 用户登录获得信息
 * @param Object [k=>v参数对象] obj
 * @since 2018/4/3
 * @author dbj
 * @returns {Promise.<*>}
 */
export async function userInfoHand({ commit }, obj) {
    commit({
        type: types.UPDATE_USERINFO,
        data: await userInfoSvr(obj)
    })
}

/**
 * 企业微信登录
 * @param Object [k=>v参数对象] obj
 * @since 2018/4/8
 * @author dbj
 * @returns {Promise.<*>}
 */

export async function qywxHand({ commit }, obj) {
    commit({
        type: types.UPDATE_QYWX,
        data: await qywxSvr(obj)
    })
}
/**
 * 地理位置
 * @param Object [k=>v参数对象] obj
 * @since 2018/4/10
 * @author dbj
 * @returns {Promise.<*>}
 */

export async function addressHand({ commit }, obj) {
    commit({
        type: types.UPDATE_ADDRESS,
        data: await addressSvr(obj)
    })
}
/**
 * 用户选中企业
 * @param Object [k=>v参数对象] obj
 * @since 2018/6/13
 * @author dbj
 * @returns {Promise.<*>}
 */
export async function getProfile ({commit}, obj) {
    commit('UPDATE_LOADING', true, { root: true })
    commit(
      {
        type: types.GETPROFILE,
        data: await getProfileSvr(obj, commit)
      }
    )
    commit('UPDATE_LOADING', false, { root: true })
  }