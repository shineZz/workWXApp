import * as types from './mutation-types'
import { getSmsTxtCodeSvr, 
        smsCheckCodeSvr ,
        addSmsRecordSvr,
        sendSmsSvr,
        smsListsSvr
    } from '@/services/sms'

/**
 * 获取验证码
 * @param Object [k=>v参数对象] obj
 * @since 2018/6/12
 * @author jzq
 * @returns {Promise.<*>}
 */
export async function getSmsTxtCode({ commit }, obj) {
    commit('UPDATE_LOADING', true, { root: true })
    let data = await getSmsTxtCodeSvr(obj)
    commit({
        type: types.GETSMSTXTCODE,
        data
    })
    commit('UPDATE_LOADING', false, { root: true })
}
/**
 * 检查验证码
 * @param Object [k=>v参数对象] obj
 * @since 2018/6/13
 * @author jzq
 * @returns {Promise.<*>}
 */
export async function smsCheckCode({ commit }, obj) {
    commit('UPDATE_LOADING', true, { root: true })
    let data = await smsCheckCodeSvr(obj)
    commit({
        type: types.SMSCHECKCODE,
        data
    })
    commit('UPDATE_LOADING', false, { root: true })
}
