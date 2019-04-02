import * as types from './mutation-types'
import { getAllIndustrysSvr } from '@/services/industry'


/**
 * 发布任务全部行业
 * @param Object [k=>v参数对象] obj
 * @since 2018/8/9
 * @author hezd
 * @returns {Promise.<*>}
 */
export async function getAllIndustrys({ commit }, obj) {
  commit('UPDATE_LOADING', true, { root: true })
  let data = await getAllIndustrysSvr()
  commit({
      type: types.ALLINDUSTRY,
      data
  })
  commit('UPDATE_LOADING', false, { root: true })
}
