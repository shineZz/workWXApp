import * as types from './mutation-types'
// 同步方法
const mutations = {
    /**
     * 用户登陆
     * @param Object [k=>v参数对象] obj
     * @since 2018/6/12
     * @author dbj
     * @returns {Promise.<*>}
     */
    [types.USERLOGIN](state, { data }) {
        state.userLoginData =data;
    },
    /**
     * 修改企业用户密码
     * @param Object [k=>v参数对象] obj
     * @since 2018/6/13
     * @author jzq
     */
    [types.UPDATEWEBUSERPWD](state,{ data }) {
        state.updateWebUserPwd = data
    },
    /**
     * 修改企业用户密码
     * @param Object [k=>v参数对象] obj
     * @since 2018/6/13
     * @author jzq
     */
    [types.CHECKUSER_REGIST](state,{ data }) {
        state.checkUserRegist = data
    },
    /**
     * 修改企业用户密码
     * @param Object [k=>v参数对象] obj
     * @since 2018/6/13
     * @author jzq
     */
    [types.REG_COMPANY](state,{ data }) {
        state.regCompany = data
    },
    /**
     * 获取所有行业列表
     * @param Object [k=>v参数对象] obj
     * @since 2018/6/22
     * @author jzq
     */
    [types.GET_DEMO_INDUSTRY](state,{ data }) {
        state.demoIndustry = data
    },
    /**
     * 小宝销售立即体验登录
     * @param Object [k=>v参数对象] obj
     * @since 2018/6/22
     * @author jzq
     */
    [types.DEMO_LOGIN](state,{ data }) {
        state.demoLogin = data
    },
    /**
     * 所有的部门
     * @param Object [k=>v参数对象] obj
     * @since 2018/7/9
     * @author dbj
     * @returns {Promise.<*>}
     */
    [types.DEPARTMENTLIST](state, { data }) {
        state.departMentData = data
    },

}

export default mutations