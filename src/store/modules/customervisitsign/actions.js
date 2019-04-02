import * as types from './mutation-types'
import { getCustomerVisitSignListsSvr,
  getCustomerVisitByIdSvr,
  updateCustomerVisitSignOutSvr,
  getSubWorkmateVisitSignListsSvr,
  customerVisitStaticSvr,
  addCustomerVisitSvr,
  editCustomerVisitSignSvr,
  getMyCustomerVisitSignListsSvr,
  getUnsignOutRecordSvr
} from '@/services/customervisitsign'


/**
 * 获取客户的拜访记录列表
 * @param Object [k=>v参数对象] obj
 * @since 2018/8/6
 * @author hezd
 * @returns {Promise.<*>}
 */
export async function getCustomerVisitSignLists({ commit }, obj) {
  commit('UPDATE_LOADING', true, { root: true })
  let data = await getCustomerVisitSignListsSvr(obj)
  commit({
      type: types.CUSTOMERSIGNLIST,
      data
  })
  commit('UPDATE_LOADING', false, { root: true })
}
/**
 * 获取客户的拜访记录详情
 * @param Object [k=>v参数对象] obj
 * @since 2018/8/6
 * @author hezd
 * @returns {Promise.<*>}
 */
export async function getCustomerVisitById({ commit }, obj) {
  commit('UPDATE_LOADING', true, { root: true })
  let data = await getCustomerVisitByIdSvr(obj)
  commit({
      type: types.CUSTOMERSIGNBYID,
      data
  })
  commit('UPDATE_LOADING', false, { root: true })
}
/**
 * 拜访签退
 * @param Object [k=>v参数对象] obj
 * @since 2018/8/6
 * @author hezd
 * @returns {Promise.<*>}
 */
export async function updateCustomerVisitSignOut({ commit }, obj) {
  commit('UPDATE_LOADING', true, { root: true })
  let data = await updateCustomerVisitSignOutSvr(obj)
  commit({
      type: types.VISITSIGNOUT,
      data
  })
  commit('UPDATE_LOADING', false, { root: true })
}
/**
 * 查看下属拜访记录列表
 * @param Object [k=>v参数对象] obj
 * @since 2018/8/6
 * @author hezd
 * @returns {Promise.<*>}
 */
export async function getSubWorkmateVisitSignLists({ commit }, obj) {
  commit('UPDATE_LOADING', true, { root: true })
  let data = await getSubWorkmateVisitSignListsSvr(obj)
  commit({
      type: types.SUBWORKMATESIGNLIST,
      data
  })
  commit('UPDATE_LOADING', false, { root: true })
}
/**
 * 获取拜访签到次数
 * @param Object [k=>v参数对象] obj
 * @since 2018/8/6
 * @author hezd
 * @returns {Promise.<*>}
 */
export async function customerVisitStatic({ commit }, obj) {
  // commit('UPDATE_LOADING', true, { root: true })
  let data = await customerVisitStaticSvr(obj)
  commit({
      type: types.SIGNSTATIC,
      data
  })
  // commit('UPDATE_LOADING', false, { root: true })
}
/**
 * 添加拜访记录详情
 * @param Object [k=>v参数对象] obj
 * @since 2018/8/6
 * @author hezd
 * @returns {Promise.<*>}
 */
export async function AddCustomerVisitSvr({ commit }, obj) {
  // commit('UPDATE_LOADING', true, { root: true })
  let data = await addCustomerVisitSvr(obj)
  commit({
      type: types.ADDSIGN,
      data
  })
  // commit('UPDATE_LOADING', false, { root: true })
}
/**
 * 编辑客户的拜访记录详情
 * @param Object [k=>v参数对象] obj
 * @since 2018/8/6
 * @author hezd
 * @returns {Promise.<*>}
 */
export async function editCustomerVisitSign({ commit }, obj) {
  // commit('UPDATE_LOADING', true, { root: true })
  let data = await editCustomerVisitSignSvr(obj)
  commit({
      type: types.EDITSIGNOUT,
      data
  })
  // commit('UPDATE_LOADING', false, { root: true })
}
/**
 * 获取个人的拜访记录详情
 * @param Object [k=>v参数对象] obj
 * @since 2018/8/6
 * @author hezd
 * @returns {Promise.<*>}
 */
export async function getMyCustomerVisitSignLists({ commit }, obj) {
  commit('UPDATE_LOADING', true, { root: true })
  let data = await getMyCustomerVisitSignListsSvr(obj)
  commit({
      type: types.MYSIGNLIST,
      data
  })
  commit('UPDATE_LOADING', false, { root: true })
}
/**
 * 获取个人的拜访记录详情
 * @param Object [k=>v参数对象] obj
 * @since 2018/8/25
 * @author hezd
 * @returns {Promise.<*>}
 */
export async function getUnsignOutRecord({ commit }, obj) {
  // commit('UPDATE_LOADING', true, { root: true })
  let data = await getUnsignOutRecordSvr(obj)
  commit({
      type: types.HASSIGNOUT,
      data
  })
  // commit('UPDATE_LOADING', false, { root: true })
}

