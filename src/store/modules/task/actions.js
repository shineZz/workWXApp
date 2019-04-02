import * as types from './mutation-types'
import {uploadBtnSvr} from '@/services/task'
/**
 * 上传合同
 * @param Object [k=>v参数对象] obj
 * @since 2018/6/11
 * @author dbj
 * @returns {Promise.<*>}
 */
export async function uploadBtn({ commit }, obj) {
    commit('UPDATE_LOADING', true, { root: true })
    commit({
        type: types.UPLOADBTN,
        data: await uploadBtnSvr(obj)
    })
    commit('UPDATE_LOADING', false, { root: true })
}
