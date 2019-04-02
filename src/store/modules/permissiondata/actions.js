import * as types from './mutation-types'
import { getPermissionDeptAndUserListSvr } from '@/services/permissiondata'


/**
 * 根据用户获取下面所有的部门和人员(app,web)(app,web)
 * @param Object [k=>v参数对象] obj
 * @since 2018/8/6
 * @author hezd
 * @returns {Promise.<*>}
 */
export async function getPermissionDeptAndUserList({ commit }, obj) {
  commit('UPDATE_LOADING', true, { root: true })
  let data = await getPermissionDeptAndUserListSvr(obj)
  commit({
      type: types.DEPARTANDUSERLIST,
      data
  })
  commit('UPDATE_LOADING', false, { root: true })
}