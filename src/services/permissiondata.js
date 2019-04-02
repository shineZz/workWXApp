
 /**
  * 根据用户获取企业下所有的部门和员工
  */
 import axios from 'axios'
 import { API_PARM_ALL, ZSAPI_URL, XSAPI_URL, API_PARM_FUN_ALL,CRMAPI_URL} from '@/constants/interface';

 /**
  * 企业下面的所有员工和部门
  * @param Object [k=>v参数对象] obj
  * @since 2018/8/6
  * @author hezd 
  * @returns {Promise.<*>}
  */
 export function getPermissionDeptAndUserListSvr(obj) {
    return axios.get(CRMAPI_URL + '/permissiondata/getPermissionDeptAndUserList?' + API_PARM_FUN_ALL(obj,2)).then(res => {
        return res.data.data
    });
}

/**
 * 用户基本信息更新
 * @param Object [k=>v参数对象] obj
 * @since 2018/6/25
 * @author jzq 
 * @returns {Promise.<*>}
 */
// export function updateUserInfoSvr(obj) {
//     return axios.post(XSAPI_URL + '/user/updateUserInfo', API_PARM_FUN_ALL(obj,0)).then(res => {
//         return res.data.data
//     });
//  }
 