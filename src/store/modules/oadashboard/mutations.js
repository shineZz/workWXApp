import * as types from './mutation-types'
// 同步方法
const mutations = {
    /**
     * 获取我的仪表盘
     * @param Object [k=>v参数对象] obj
     * @since 2018/5/29
     * @author dbj
     * @returns {Promise.<*>}
     */
    [types.RESULTSLIST](state, { data }) {
        state.resultsListData = data
    },
    /**
     * 获取我的仪表盘
     * @param Object [k=>v参数对象] obj
     * @since 2018/5/29
     * @author dbj
     * @returns {Promise.<*>}
     */
    [types.RESULTSALL](state, { data }) {
        state.resultsAllData = data
    },  
    /**
     * 添加我的仪表盘
     * @param Object [k=>v参数对象] obj
     * @since 2018/5/29
     * @author dbj
     * @returns {Promise.<*>}
     */
    [types.RESULTSADD](state, { data }) {
        state.resultsAddData = data
    },
    /**
     * 获取仪表盘类型
     * @param Object [k=>v参数对象] obj
     * @since 2018/5/29
     * @author dbj
     * @returns {Promise.<*>}
     */
    [types.RESULTSTYPE](state, { data }) {
        state.resultsTypeData = data
    },  
    
    

}

export default mutations