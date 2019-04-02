import * as types from './mutation-types'


// 签到考勤
const mutations = {
   /**
     * 获取的考勤签到的地址
     * @param Object [k=>v参数对象] obj
     * @since 2018/5/30
     * @author hezd
     */
    [types.QUERYGPSLIST](state, data) {
        state.signAddressData = data
    },
    /**
     * 新增签到
     * @param Object [k=>v参数对象] obj
     * @since 2018/5/30
     * @author hezd
     */
    [types.ADDSIGN](state, data) {
        state.signState = data
    },
    /**
     * 上下班签到记录
     * @param Object [k=>v参数对象] obj
     * @since 2018/5/31
     * @author hezd
     */
    [types.SIGNLISTDATA](state, data) {
        state.signListData = data
    },
    /**
     * 拜访签到列表
     * @param Object [k=>v参数对象] obj
     * @since 2018/5/31
     * @author hezd
     */
    [types.QUERYVISTLIST](state, data) {
        state.GPSListData = data
    },
    /**
     * 初始化位置坐标
     * @param Object [k=>v参数对象] obj
     * @since 2018/6/6
     * @author hezd
     */
    [types.INITGPS](state, data) {
        state.GPSData = data
    },
    //是否刷新
    [types.ISREFRESH](state,data) {
        state.isRefresh = data
    },
    //是否刷新
    [types.ADDDATA](state,data) {
        state.addData = data
    }
}

export default mutations
