import * as types from './mutation-types'
let num = 0;
// 同步方法
const mutations = {
    /**
     * 页面标题
     * @param Object [k=>v参数对象] obj
     * @since 2018/3/10
     * @author dbj
     */
    [types.UPDATE_TITLE](state, title) {
        state.title = title
    },
    /**
     * 页面动态加载状态
     * @param Object [k=>v参数对象] obj
     * @since 2018/3/10
     * @author dbj
     */
    [types.UPDATE_LOADING](state, status) {
        state.isLoading = status
    },
    /**
     * 页面滑动效果
     * @param Object [k=>v参数对象] obj
     * @since 2018/3/10
     * @author dbj
     */
    [types.UPDATE_DIRECTION](state, data) {
        state.direction = data.direction
    },
    /**
     * 新浪地址
     * @param Object [k=>v参数对象] obj
     * @since 2018/3/10
     * @author dbj
     */
    [types.AREASINA](state) {
        var remote_ip_info={
            "ret": 1,
            "start": -1,
            "end": -1,
            "country": "中国",
            "province": "浙江",
            "city": "杭州",
            "district": "",
            "isp": "",
            "type": "",
            "desc": ""
        };
        $.getScript('http://int.dpool.sina.com.cn/iplookup/iplookup.php?format=js', function() {
            //默认加载地址信息，防止没有获取到信息的情况            
            remote_ip_info= remote_ip_info
        }, this);
        state.areaSinaData = remote_ip_info
    },
    /**
     * 登录获得用户信息
     * @param Object [k=>v参数对象] obj
     * @since 2018/4/3
     * @author dbj
     */
    [types.UPDATE_USERINFO](state, { data }) {
        if (data.alert_msg) {
            state.userInfo = data
        } else {
            //企业微信导入sdk
            $.getScript('http://res.wx.qq.com/open/js/jweixin-1.2.0.js', function() {
                state.wx=wx;
            }, this);
            state.userInfo = data.items
        }
    },
    /**
     * 选中的企业
     * @param Object [k=>v参数对象] obj
     * @since 2018/6/13
     * @author dbj
     */
    [types.GETPROFILE](state, { data }) {
        if (data.alert_msg) {
            state.userInfo = data
        } else {
            state.userInfo = data.items
        }
    },
    /**
     * 刷新获得用户信息
     * @param Object [k=>v参数对象] obj
     * @since 2018/4/3 
     * @author dbj
     */
    [types.REFRESH_USERINFO](state, ) {
        state.userInfo = JSON.parse(localStorage.getItem('userDetail'))
    },
    /**
     * 企业微信登录
     * @param Object [k=>v参数对象] obj
     * @since 2018/4/8
     * @author dbj
     */
    [types.UPDATE_QYWX](state, { data }) {
        num++
        let obj = {
            num
        }
        console.log(data,'|||||||||||')
        state.qywxData = Object.assign(data, obj)
    },
    /**
     * 地理位置
     * @param Object [k=>v参数对象] obj
     * @since 2018/4/10
     * @author dbj
     */
    [types.UPDATE_ADDRESS](state, { data }) {
        num++
        let obj = {
            num
        }
        state.addressData = Object.assign(data, obj)
    },
    /**
     * 自动签退
     * @param Object [k=>v参数对象] obj
     * @since 2018/7/5
     * @author hezd
     */
    [types.SIGNOUT](state, data) {
        state.signout = data
    },
    /**
     * 是否有为签退的功能
     * @param Object [k=>v参数对象] obj
     * @since 2018/8/14
     * @author hezd
     */
    [types.CHECKSIGNOUT](state, data) {
        state.checkSignOut=data
    },
    
}

export default mutations