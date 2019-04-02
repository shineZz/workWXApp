 /**
  * 企业服务层,获取后端数据
  */
 import axios from 'axios'
 import { API_PARM_ALL, XSAPI_URL, API_PARM_FUN_ALL } from '@/constants/interface';

 /**
  * 查询朋友圈消息列表
  * @param Object [k=>v参数对象] obj
  * @since 2018/5/28
  * @author dbj 
  * @returns {Promise.<*>}
  */
 export function circleListSvr(obj) {
     return axios.post(XSAPI_URL+'/oamessage/queryMessageList', API_PARM_FUN_ALL(obj,0)).then(res => {      
        return res.data.data
      });
 }
 
 /**
  * 消息点赞
  * @param Object [k=>v参数对象] obj
  * @since 2018/5/28
  * @author dbj 
  * @returns {Promise.<*>}
  */
 export function messageThumbSvr(obj) {
    return axios.post(XSAPI_URL+'/oamessage/messageThumb', API_PARM_FUN_ALL(obj,0)).then(res => {      
       return res.data.data
     });
}
 /**
  * 新增评论
  * @param Object [k=>v参数对象] obj
  * @since 2018/5/28
  * @author dbj 
  * @returns {Promise.<*>}
  */
 export function AddCommentSvr(obj) {
    return axios.post(XSAPI_URL+'/oamessage/addComment', API_PARM_FUN_ALL(obj,0)).then(res => {      
       return res.data.data
     });
}
 /**
  * 新增回复评论
  * @param Object [k=>v参数对象] obj
  * @since 2018/5/28
  * @author dbj 
  * @returns {Promise.<*>}
  */
 export function AddReplySvr(obj) {
    return axios.post(XSAPI_URL+'/oamessage/addReply', API_PARM_FUN_ALL(obj,0)).then(res => {      
       return res.data.data
     });
}
 /**
  * 删除消息
  * @param Object [k=>v参数对象] obj
  * @since 2018/5/28
  * @author dbj 
  * @returns {Promise.<*>}
  */
 export function delMessageSvr(obj) {
    return axios.post(XSAPI_URL+'/oamessage/delMessage', API_PARM_FUN_ALL(obj,0)).then(res => {      
       return res.data.data
     });
}
 /**
  * 发布消息
  * @param Object [k=>v参数对象] obj
  * @since 2018/6/8
  * @author dbj 
  * @returns {Promise.<*>}
  */
 export function addMessageSvr(obj) {
  return axios.post(XSAPI_URL+'/oamessage/sendMessage', API_PARM_FUN_ALL(obj,0)).then(res => {      
     return res.data.data
   });
}