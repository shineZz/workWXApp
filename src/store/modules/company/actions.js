import * as types from './mutation-types'
import { userLoginSvr, updateWebUserPwdSvr, checkUserRegistSvr, regCompanySvr, getDemoIndustrySvr, demoLoginSvr ,getDepartMentList} from '@/services/company'


/**
 * 用户登陆
 * @param Object [k=>v参数对象] obj
 * @since 2018/6/12
 * @author dbj
 * @returns {Promise.<*>}
 */
export async function userLogin({ commit }, obj) {    
    commit('UPDATE_LOADING', true, { root: true })
    commit({
        type: types.USERLOGIN,
        data: await userLoginSvr(obj, commit)
    })
    commit('UPDATE_LOADING', false, { root: true })
}
/**
 * 修改企业用户密码
 * @param Object [k=>v参数对象] obj
 * @since 2018/6/13
 * @author jzq
 * @returns {Promise.<*>}
 */
export async function updateWebUserPwd({ commit }, obj) {
    commit('UPDATE_LOADING', true, { root: true })
    let data = await updateWebUserPwdSvr(obj)
    commit({
        type: types.UPDATEWEBUSERPWD,
        data
    })
    commit('UPDATE_LOADING', false, { root: true })
}
/**
 * 修改企业用户密码
 * @param Object [k=>v参数对象] obj
 * @since 2018/6/13
 * @author jzq
 * @returns {Promise.<*>}
 */
export async function checkUserRegist({ commit }, obj) {
    commit('UPDATE_LOADING', true, { root: true })
    let data = await checkUserRegistSvr(obj)
    commit({
        type: types.CHECKUSER_REGIST,
        data
    })
    commit('UPDATE_LOADING', false, { root: true })
}
/**
 * 修改企业用户密码
 * @param Object [k=>v参数对象] obj
 * @since 2018/6/13
 * @author jzq
 * @returns {Promise.<*>}
 */
export async function regCompany({ commit }, obj) {
    commit('UPDATE_LOADING', true, { root: true })
    let data = await regCompanySvr(obj)
    commit({
        type: types.REG_COMPANY,
        data
    })
    commit('UPDATE_LOADING', false, { root: true })
}
/**
 * 获取所有行业列表
 * @param Object [k=>v参数对象] obj
 * @since 2018/6/13
 * @author jzq
 * @returns {Promise.<*>}
 */
export async function getDemoIndustry({ commit }, obj) {
    commit('UPDATE_LOADING', true, { root: true })
    let data = await getDemoIndustrySvr(obj)
    commit({
        type: types.GET_DEMO_INDUSTRY,
        data
    })
    commit('UPDATE_LOADING', false, { root: true })
}
/**
 * 小宝销售立即体验登录
 * @param Object [k=>v参数对象] obj
 * @since 2018/6/13
 * @author jzq
 * @returns {Promise.<*>}
 */
export async function demoLogin({ commit }, obj) {
    commit('UPDATE_LOADING', true, { root: true })
    let data = await demoLoginSvr(obj)
    commit({
        type: types.DEMO_LOGIN,
        data
    })
    commit('UPDATE_LOADING', false, { root: true })
}


/**
 * 所有的部门
 * @param Object [k=>v参数对象] obj
 * @since 2018/7/9
 * @author dbj
 * @returns {Promise.<*>}
 */
export async function departMentList({ commit }, obj) {
    let data = await getDepartMentList(obj)
    commit({
        type: types.DEPARTMENTLIST,
        data
    })
}