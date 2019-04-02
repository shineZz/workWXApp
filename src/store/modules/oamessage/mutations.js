import * as types from './mutation-types'
// 同步方法
const mutations = {
    /**
     * 查询朋友圈消息列表
     * @param Object [k=>v参数对象] obj
     * @since 2018/5/28
     * @author dbj
     * @returns {Promise.<*>}
     */
    [types.CIRCELIST](state, { data }) {
        //点击的时候页面才有页面
        let Arr=data;
        if(!Arr.alert_msg){
            Arr.items.messageList.forEach((item,index) => {
                item.packShow=false;
                item.praiseShow=false;
            })
        }
        
        state.circleListData = Arr
    },
    /**
     * 清除招商任务列表
     * @param Object [k=>v参数对象] obj
     * @since 2018/5/28
     * @author dbj
     * @returns {Promise.<*>}
     */
    [types.CLEAR_CIRCELIST](state, type) {
        state.circleListData = {};
    },
     /**
     * 消息点赞
     * @param Object [k=>v参数对象] obj
     * @since 2018/5/28
     * @author dbj
     * @returns {Promise.<*>}
     */
    [types.PRAISE](state, { data }) {
        state.praiseData = data
    },
    /**
     * 清除消息点赞
     * @param Object [k=>v参数对象] obj
     * @since 2018/5/28
     * @author dbj
     * @returns {Promise.<*>}
     */
    [types.CLEAR_PRAISE](state, type) {
        state.praiseData = {};
    },

     /**
     * 新增评论
     * @param Object [k=>v参数对象] obj
     * @since 2018/5/28
     * @author dbj
     * @returns {Promise.<*>}
     */
    [types.ADDCOMMENT](state, { data }) {
        state.addCommentData = data
    },
    /**
     * 清除新增评论
     * @param Object [k=>v参数对象] obj
     * @since 2018/5/28
     * @author dbj
     * @returns {Promise.<*>}
     */
    [types.CLEAR_ADDCOMMENT](state, type) {
        state.addCommentData = {};
    },
     /**
     * 消息点赞
     * @param Object [k=>v参数对象] obj
     * @since 2018/5/28
     * @author dbj
     * @returns {Promise.<*>}
     */
    [types.ADDREPLY](state, { data }) {
        state.addReplyData = data
    },
    /**
     * 清除消息点赞
     * @param Object [k=>v参数对象] obj
     * @since 2018/5/28
     * @author dbj
     * @returns {Promise.<*>}
     */
    [types.CLEAR_ADDREPLY](state, type) {
        state.addReplyData = {};
    },
    /**
     * 删除消息
     * @param Object [k=>v参数对象] obj
     * @since 2018/5/28
     * @author dbj
     * @returns {Promise.<*>}
     */
    [types.DELMESSAGE](state, { data }) {
        state.delMessageData = data
    },
    /**
     * 清除删除消息
     * @param Object [k=>v参数对象] obj
     * @since 2018/5/28
     * @author dbj
     * @returns {Promise.<*>}
     */
    [types.CLEAR_DELMESSAGE](state, type) {
        state.delMessageData = {};
    },
    /**
     * 发布消息
     * @param Object [k=>v参数对象] obj
     * @since 2018/6/8
     * @author dbj
     * @returns {Promise.<*>}
     */
    [types.ADDMESSAGE](state, { data }) {
        state.addMessageData =data;
    },
    /**
     * 清除发布消息
     * @param Object [k=>v参数对象] obj
     * @since 2018/6/26
     * @author dbj
     * @returns {Promise.<*>}
     */
    [types.CLEARMESSAGE](state,) {
        state.addMessageData ={};
    },

}

export default mutations