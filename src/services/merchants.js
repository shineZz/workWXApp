 /**
  * 企业服务层,获取后端数据
  */
 import axios from 'axios'
 import { API_PARM_ALL, ZSAPI_URL, API_PARM_FUN_ALL } from '@/constants/interface';

 /**
  * 招商任务列表
  * @param Object [k=>v参数对象] obj
  * @since 2018/3/23
  * @author dbj 
  * @returns {Promise.<*>}
  */
 export function MerchantListSvr(obj) {
     return axios.get(ZSAPI_URL + '/merchant/merchantHomeList?' + API_PARM_FUN_ALL(obj, 1)).then(res => {
         return res.data.data
     });
 }
 /**
  * 招商经销商进度列表
  * @param Object [k=>v参数对象] obj
  * @since 2018/3/27
  * @author dbj 
  * @returns {Promise.<*>}
  */
 export function ScheduleListSvr(obj) {
     return axios.get(ZSAPI_URL + '/merchant/merchantsDealerListWithSale?' + API_PARM_FUN_ALL(obj, 1)).then(res => {
         return res.data.data
     });
 }
 /**
  * 选择地区和进程
  * @param Object [k=>v参数对象] obj
  * @since 2018/3/27
  * @author dbj 
  * @returns {Promise.<*>}
  */
 export function AreaAuditSvr(obj) {
     return axios.get(ZSAPI_URL + '/merchant/selectAreaAuditList?' + API_PARM_ALL(1)).then(res => {
         return res.data.data
     });
 }
 /**
  * 推广详细图表数据
  * @param Object [k=>v参数对象] obj
  * @since 2018/3/27
  * @author jzq
  * @returns {Promise.<*>}
  */
 export function proSalesSvr(obj) {
     return axios.get(ZSAPI_URL + '/merchant/getProSalesReport?' + API_PARM_FUN_ALL(obj, 1)).then(res => {
         return res.data.data
     });
 }
 /**
  * 招商任务经销商中标和驳回
  * @param Object [k=>v参数对象] obj
  * @since 2018/3/28
  * @author dbj
  * @returns {Promise.<*>}
  */
 export function winningRejectedSvr(obj) {
     return axios.get(ZSAPI_URL + '/merchant/merchantsDealerAuditWithSale?' + API_PARM_FUN_ALL(obj, 1)).then(res => {
         return res.data.data
     });
 }