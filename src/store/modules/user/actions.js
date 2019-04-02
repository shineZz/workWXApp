import * as types from './mutation-types'
import { updateUserInfoSvr, XSChangePasswordSvr,getXsUserList ,getUserListByDepartId, getDictSvr } from '@/services/user'


/**
 * 用户基本信息更新
 * @param Object [k=>v参数对象] obj
 * @since 2018/6/25
 * @author jzq
 * @returns {Promise.<*>}
 */
export async function updateUserInfo({ commit }, obj) {
  commit('UPDATE_LOADING', true, { root: true })
  let data = await updateUserInfoSvr(obj)
  commit({
      type: types.UPDATE_USERINFO,
      data
  })
  commit('UPDATE_LOADING', false, { root: true })
}
/**
 * 修改密码,需验证原密码
 * @param Object [k=>v参数对象] obj
 * @since 2018/6/25
 * @author jzq
 * @returns {Promise.<*>}
 */
export async function XSChangePassword({ commit }, obj) {
  commit('UPDATE_LOADING', true, { root: true })
  let data = await XSChangePasswordSvr(obj)
  commit({
      type: types.XS_CHANGE_PASSWORD,
      data
  })
  commit('UPDATE_LOADING', false, { root: true })
}
/**
 * 所有的员工
 * @param Object [k=>v参数对象] obj
 * @since 2018/7/9
 * @author dbj
 * @returns {Promise.<*>}
 */
export async function userList({ commit }, obj) {
  let data = await getXsUserList(obj)
  commit({
      type: types.USERLIST,
      data
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
  // commit('UPDATE_LOADING', true, { root: true })
  commit({
      type: types.GET_USER_LIST_BYDEPARTID,
      data: await getUserListByDepartId(obj, commit)
  })
  // commit('UPDATE_LOADING', false, { root: true })
}
/**
 *  数据字典查询-货币
 * @param Object [k=>v参数对象] obj
 * @since 2018/08/07
 * @author jzq
 * @returns {Promise.<*>}
 */
export async function getDict ({commit}, obj) {
  // commit('UPDATE_LOADING', true, { root: true })
  let data = await getDictSvr(obj)
  commit(
    {
      type: types.GET_DICT,
      data: data
    }
  )
  // commit('UPDATE_LOADING', false, { root: true })
}