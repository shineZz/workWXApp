 /**
  * 企业服务层,获取后端数据
  */
 import axios from 'axios'
 import { API_PARM_FUN_ALL, API_PARM_ALL, ZSAPI_URL } from '@/constants/interface';
  /**
  * 上传合同
  * @param Object [k=>v参数对象] obj
  * @since 2018/6/11
  * @author dbj
  * @returns {Promise.<*>}
  */
export function uploadBtnSvr(obj) {
    let url;
    if(obj.num==1){
        url='/task/uploadDealerContract';
    }else if(obj.num==2){
       url='/task/uploadPayVoucher';
    }else{
        url='/task/uploadReceiveVoucher';
    }
    return axios.post(ZSAPI_URL + url, API_PARM_FUN_ALL(obj.obj,1)).then(res => {   
       return res.data.data
     });
  }