 /**
 * 企业服务层,获取后端数据
 */
import axios from 'axios'
import {API_PARM_FUN_ALL,API_PARM_ALL,XSAPI_URL} from '@/constants/interface';

/**
 * 简历列表
 * @param Object [k=>v参数对象] obj
 * @since 2018/3/16
 * @author jzq
 * @returns {Promise.<*>}
 */
export function resumeListSvr(obj,commit) {
    return axios.get(XSAPI_URL+'/resume/talentList?'+API_PARM_FUN_ALL(obj,0)).then(res => {
      return res.data.data
    });
}
/**
 * 意愿列表
 * @param Object [k=>v参数对象] obj
 * @since 2018/3/17
 * @author jzq
 * @returns {Promise.<*>}
 */
export function wishListSvr(obj,commit) {
  return axios.get(XSAPI_URL+'/resume/subscribeList?'+API_PARM_FUN_ALL(obj,0)).then(res => {
    return res.data.data
  });
}
/**
 * 我的人才列表
 * @param Object [k=>v参数对象] obj
 * @since 2018/3/17
 * @author jzq
 * @returns {Promise.<*>}
 */
export function myTalentListSvr(obj,commit) {
  return axios.get(XSAPI_URL+'/resume/myTalentList?'+API_PARM_FUN_ALL(obj,0)).then(res => {
    return res.data.data
  });
}
/**
 * 简历详情
 * @param Object [k=>v参数对象] obj
 * @since 2018/3/16
 * @author jzq
 * @returns {Promise.<*>}
 */
export function resumeDetailSvr(obj,commit) {
  return axios.get(XSAPI_URL+'/resume/talentDetail?'+API_PARM_FUN_ALL(obj,0)).then(res => {      
    return res.data.data
  });
}
/**
 * 加入意愿
 * @param Object [k=>v参数对象] obj
 * @since 2018/3/19
 * @author jzq
 * @returns {Promise.<*>}
 */
export function addSubscribeSvr(obj,commit) {
  return axios.post(XSAPI_URL+'/resume/addSubscribeResume', API_PARM_FUN_ALL(obj,0)).then(res => {      
    return res.data.data
  });
}
/**
 * 移除意愿
 * @param Object [k=>v参数对象] obj
 * @since 2018/3/19
 * @author jzq
 * @returns {Promise.<*>}
 */
export function removeSubscribeSvr(obj,commit) {
  return axios.post(XSAPI_URL+'/resume/removeSubscribeResumeByDesire', API_PARM_FUN_ALL(obj,0)).then(res => {      
    return res.data.data
  });
}
/**
 * 订阅简历
 * @param Object [k=>v参数对象] obj
 * @since 2018/3/20
 * @author jzq
 * @returns {Promise.<*>}
 */
export function buySubscribeSvr(obj,commit) {
  return axios.post(XSAPI_URL+'/resume/buySubscribeResume', API_PARM_FUN_ALL(obj,0)).then(res => {      
    return res.data.data
  });
}