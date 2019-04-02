import * as types from './mutation-types'
import { findAllCustomerIndustrySvr} from '@/services/customerindustry'


/**
 * 所属行业
 * @param Object [k=>v参数对象] obj
 * @since 2018/8/6
 * @author hezd
 * @returns {Promise.<*>}
 */
export async function findAllCustomerIndustry({ commit }, obj) {
  commit('UPDATE_LOADING', true, { root: true })
  let data = await findAllCustomerIndustrySvr(obj)
  commit({
      type: types.CUSTOMERINDUSTRY,
      data
  })
  commit('UPDATE_LOADING', false, { root: true })
}
