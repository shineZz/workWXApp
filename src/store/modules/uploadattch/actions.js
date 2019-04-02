import * as types from './mutation-types'
import { taskUploadAttchSvr
    } from '@/services/uploadattch'

/**
 * 推荐、推广详情上传
 * @param Object [k=>v参数对象] obj
 * @since 2018/6/12
 * @author jzq
 * @returns {Promise.<*>}
 */
export async function taskUploadAttch({ commit }, obj) {
    // commit('UPDATE_LOADING', true, { root: true })
    let data = await taskUploadAttchSvr(obj)
    commit({
        type: types.TASKUPLOADATTCH,
        data
    })
    // commit('UPDATE_LOADING', false, { root: true })
}
