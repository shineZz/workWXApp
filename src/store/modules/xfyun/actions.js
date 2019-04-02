import * as types from './mutation-types'

import { getXfyunIatSvr, getWxXfyunIatSvr } from '@/services/xfyun'

/**
 * 语音听写上传文件
 * @param Object [k=>v参数对象] obj
 * @since 2018/08/20
 * @author jzq
 * @returns {Promise.<*>}
 */
export async function getXfyunIat ({commit}, obj) {
  commit('UPDATE_LOADING', true, { root: true })
  let data = await getXfyunIatSvr(obj)
  commit(
    {
      type: types.GET_XFYUN,
      data: data
    }
  )
  commit('UPDATE_LOADING', false, { root: true })
}
/**
 * 语音听写上传文件(招商)
 * @param Object [k=>v参数对象] obj
 * @since 2018/08/20
 * @author jzq
 * @returns {Promise.<*>}
 */
export async function getWxXfyunIat ({commit}, obj) {
  commit('UPDATE_LOADING', true, { root: true })
  let data = await getWxXfyunIatSvr(obj)
  commit(
    {
      type: types.GET_XFYUN_ZS,
      data: data
    }
  )
  commit('UPDATE_LOADING', false, { root: true })
}
