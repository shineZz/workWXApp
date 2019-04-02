import * as types from './mutation-types'
import { getSmsListsSvr,addSmsRecordSvr,deleteSmsSvr,sendSmsSvr,addSmsRecordFromWebSvr} from '@/services/message'

/**
 * 获取短信列表
 * @param Object [k=>v参数对象] obj
 * @since 2018/6/12
 * @author liuxz
 * @returns {Promise.<*>}
 */
export async function getSmsLists({ commit }, obj) {
    commit('UPDATE_LOADING', true, { root: true });
    let data = await getSmsListsSvr(obj);
    commit({
        type: types.GETSMSLISTS,
        data
    });
    commit('UPDATE_LOADING', false, { root: true })
}
/**
 * 添加短信
 * @param Object [k=>v参数对象] obj
 * @since 2018/6/12
 * @author liuxz
 * @returns {Promise.<*>}
 */
export async function addSmsRecord({ commit }, obj) {
  commit('UPDATE_LOADING', true, { root: true });
  let data = await addSmsRecordSvr(obj);
  commit({
    type: types.ADDSMSRECORD,
    data
  });
  commit('UPDATE_LOADING', false, { root: true })
}

/**
 * 清空短信
 * @param Object [k=>v参数对象] obj
 * @since 2018/6/12
 * @author liuxz
 * @returns {Promise.<*>}
 */
export async function deleteSmsRecord({ commit }, obj) {
  commit('UPDATE_LOADING', true, { root: true });
  let data = await deleteSmsSvr(obj);
  commit({
    type: types.DELETESMSRECORD,
    data
  });
  commit('UPDATE_LOADING', false, { root: true })
}


/**
 * 添加发送短信的动态记录接口
 * @param Object [k=>v参数对象] obj
 * @since 2018/6/12
 * @author liuxz
 * @returns {Promise.<*>}
 */
export async function sendSms({ commit }, obj) {
  commit('UPDATE_LOADING', true, { root: true });
  let data = await sendSmsSvr(obj);
  commit({
    type: types.SENDSMS,
    data
  });
  commit('UPDATE_LOADING', false, { root: true })
}

/**
 * 拆分短信
 * @param Object [k=>v参数对象] obj
 * @since 2018/6/21
 * @author hezd
 * @returns {Promise.<*>}
 */
export async function addSmsRecordFromWeb({ commit }, obj) {
  commit('UPDATE_LOADING', true, { root: true });
  let data = await addSmsRecordFromWebSvr(obj);
  commit({
    type: types.ADDSMSFROMWEB,
    data
  });
  commit('UPDATE_LOADING', false, { root: true })
}

