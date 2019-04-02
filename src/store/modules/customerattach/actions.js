import * as types from './mutation-types'
import { uploadFileSvr } from '@/services/customerattach'


/**
 * 附件上传
 * @param Object [k=>v参数对象] obj
 * @since 2018/8/7
 * @author hezd
 * @returns {Promise.<*>}
 */
export async function uploadFile({ commit }, obj) {
  // commit('UPDATE_LOADING', true, { root: true })
  let data = await uploadFileSvr(obj)
  commit({
      type: types.UPLOADFILE,
      data
  })
  // commit('UPDATE_LOADING', false, { root: true })
}
