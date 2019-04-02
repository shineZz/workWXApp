import * as types from './mutation-types'

const mutations = {
    /**
     * 个人中心中的状态改变
     * @param Boolean [k=>v参数对象] obj
     * @since 2018/6/23
     * @author hezd
     */
    [types.USERCHANGE](state,data) {
        console.log(data)
        if(data.id==0){
            state.storeTrueName = data.value
        }else if(data.id==1){
            state.storeEmail = data.value
        }else if(data.id==2){
            state.storeWx = data.value
        }else if(data.id==3){
            state.storeQQ = data.value
        }else if(data.id==4){
            state.storeWorkplace = data.value
        }else if(data.id==5){
            state.storeSchool = data.value
        }else if(data.id==6){
            state.storeMajor = data.value
        }else if(data.id==7){
            state.storeEducationHistory = data.value
        }else if(data.id==8){
            state.storeCompany = data.value
        }else if(data.id==9){
            state.storePost = data.value
        }
    },
    [types.USERHASCHANGE](state) {
        state.userHasChange = !state.userHasChange
    },
    /**
     * 用户基本信息更新
     * @param Object [k=>v参数对象] obj
     * @since 2018/6/25
     * @author jzq
     * @returns {Promise.<*>}
     */
    [types.UPDATE_USERINFO](state, { data }) {
        state.updateUserInfo = data
    },
    /**
     * 修改密码,需验证原密码
     * @param Object [k=>v参数对象] obj
     * @since 2018/6/25
     * @author jzq
     * @returns {Promise.<*>}
     */
    [types.XS_CHANGE_PASSWORD](state, { data }) {
      state.XsChangePassword = data
    },
    /**
     * 所有的员工
     * @param Object [k=>v参数对象] obj
     * @since 2018/7/9
     * @author dbj
     * @returns {Promise.<*>}
     */
    [types.USERLIST](state, { data }) {
        if(data.alert_msg){
            state.userListData = data
        }else{
            data.items.list.forEach(function(item,index){
                item.logoNameFlag=false;
                item.icon={
                    iconType:1,
                    iconFlag:false,
                }
            });
            state.userListData = data
        }
    },
    /**
     * 获取部门下的员工
     * @param Object [k=>v参数对象] obj
     * @since 2018/7/18
     * @author hezd
     * @returns {Promise.<*>}
     */
    [types.GET_USER_LIST_BYDEPARTID](state, { data }) {
        state.departUserListData = data
    },
    /**
     * 共享客户
     * @param Array [k=>v参数对象] obj
     * @since 2018/7/18
     * @author hezd
     * @returns 
     */
    [types.SHARECUSTOM](state, data) {
        state.shareCustom = data
    },
    /**
     * 选择的同事
     * @param Array [k=>v参数对象] obj
     * @since 2018/7/24
     * @author hezd
     * @returns 
     */
    [types.COLLEAGUE](state, data) {
        state.colleague = data
    },
    /**
     * 最后选择结果
     * @param Array [k=>v参数对象] obj
     * @since 2018/8/3
     * @author hezd
     * @returns 
     */
    [types.RESULTCHOICE](state, data) {
        state.resultChoice = data
    },
	/**
	 * 数据字典查询-货币
	 * @param Object [k=>v参数对象] obj
	 * @since 2018/08/07
	 * @author jzq
	 * @returns {Promise.<*>}
	 */
	[types.GET_DICT](state, data){
		state.getDict = data.data
	},
}

export default mutations