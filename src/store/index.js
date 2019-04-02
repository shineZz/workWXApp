import Vue from 'vue'
import Vuex from 'vuex'

import * as actions from './actions'
import mutations from './mutations'
import state from './state'

import merchants from './modules/merchants'
import resume from './modules/resume'
import addressBook from './modules/addressBook'
import schedule from './modules/schedule'
import oadict from './modules/oadict'

import oadashboard from './modules/oadashboard';
import oamessage from './modules/oamessage';
import oanotice from './modules/oanotice';
import oasign from './modules/oasign';
import oaworkreport from './modules/oaworkreport';
import oaprocess from './modules/oaprocess';
import task from './modules/task';
import company from './modules/company';
import sms from './modules/sms';
import user from './modules/user';
import permissiondata from './modules/permissiondata';
import recommend from './modules/recommend';
import promotion from './modules/promotion';
import customer from './modules/customer';
import customervisitsign from './modules/customervisitsign';
import customervisittype from './modules/customervisittype';
import customerlabel from './modules/customerlabel';
import customerattach from './modules/customerattach';
import customerstatistic from './modules/customerstatistic';
import card from './modules/card';
import customersegment from './modules/customersegment';
import customersource from './modules/customersource';
import customerstage from './modules/customerstage';
import customeractionrecord from './modules/customeractionrecord';
import customerscale from './modules/customerscale';
import customercontract from './modules/customercontract';
import customerrecpay from './modules/customerrecpay';
import industry from './modules/industry';
import areacode from './modules/areacode';
import customerindustry from './modules/customerindustry';
import message from './modules/message';
import uploadattch from './modules/uploadattch';
import ucarea from './modules/ucarea';
import customerrecpaystatus from './modules/customerrecpaystatus';
import ai from './modules/ai';
import xfyun from './modules/xfyun';

// 开发模式下使用日志，和谷歌浏览器里面的vuedevtool插件类似
// 子修改state的时候会在控制台打印一些信息
import createLogger from 'vuex/dist/logger';

Vue.use(Vuex)

// 调试,开发模式开启严格模式，要使用mutations提交
const debug = process.env.NODE_ENV !== 'production'

export default new Vuex.Store({
    modules: {
        merchants,
        resume,
        addressBook,
        schedule,
        oadict,
        oaworkreport,
        oadashboard,
        oamessage,
        oanotice,
        oasign,
        oaprocess,
        task,
        company,
        sms,
        user,
        permissiondata,
        recommend,
        promotion,
        customer,
        customervisitsign,
        customervisittype,
        customerlabel,
        customerattach,
        customerstatistic,
        card,
        customersegment,
        customersource,
        customerstage,
        customeractionrecord,
        customerscale,
        customercontract,
        customerrecpay,
        industry,
        areacode,
        customerindustry,
        message,
        uploadattch,
        ucarea,
        customerrecpaystatus,
        ai,
        xfyun,
    },
    actions,
    state,
    mutations,
    strict: false,
    plugins: debug ? [createLogger()] : []
})
