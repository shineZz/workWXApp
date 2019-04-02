import {cookie } from 'vux';
const state = {
    userInfo: cookie.get('userDetail') ? JSON.parse(cookie.get('userDetail')): null,
    title: '小宝销售',
    isLoading: false,
    direction: 'forward',
    areaSinaData: {},
    qywxData: {},
    wx:{},
    signout:{
        isOpenGps:false,
        location:{
            lat:"",
            lng:"",
            O:"",
            P:'',
        },
        province:"",
        city:"",
        area:"",
    },
    signAddress:{
        city:'',
        province:''
    },
    checkSignOut:false,
}

export default state