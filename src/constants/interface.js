import * as aes from '@/util/lgaes';
let API_key = 'wisdom',
    API_v = '1.0.0',
    API_sig = '123';
import * as env from '@/constants/interfaceEnv';
export let DOMAIN_URL = '51lick.cn';
export let LG_AES_SALT = env.LG_AES_SALT;
export let LG_AES_SALT_ZS = env.LG_AES_SALT_ZS;
export let LG_AES_SALT_CRM =env.LG_AES_SALT_CRM;

// 新的接口
export let XSAPI_URL =env.XSAPI_URL; //销售模块地址
export let ZSAPI_URL = env.ZSAPI_URL; //招商模块地址
export let CRMAPI_URL=env.CRMAPI_URL;//CRM模块地址

//开发环境下 虚拟数据 
export let PHONE_PORT = env.PHONE_PORT;;
//开发环境下 手机前端开发调试利器
export let V_CONSOLE =env.V_CONSOLE;;
/*
 *0为关，1为开启
 * @date  2017.9.30
 * @author dbj
 * @lg_aes_type 加密开启 关与开
 * @type 0=TASK_API_URL_X,1=TASK_API_URL_Z
 */
export let LG_AES_XSAPI = env.LG_AES_XSAPI;; //0为关，1为开启
export let LG_AES_ZSAPI = env.LG_AES_ZSAPI;; //0为关，1为开启
export let LG_AES_CRMAPI = env.LG_AES_CRMAPI;;//0为关，1为开启
//2017/10/14 dbj
export let API_PARM_OBJ = {
        app_key: API_key,
        v: API_v,
        sig: API_sig,
    }
    //对象

export function API_PARM_ALL(type) {
    let lg_aes_type;
    if (type > 0) {
        if(type==1){
			if(LG_AES_ZSAPI==1){
				aes.setCryptKey(LG_AES_SALT_ZS);	
			}
			lg_aes_type= LG_AES_ZSAPI;
		}else{
			if(LG_AES_CRMAPI==1){
				aes.setCryptKey(LG_AES_SALT_CRM);	
			}
			lg_aes_type= LG_AES_CRMAPI;
        }       
    } else {
        if (LG_AES_XSAPI == 1) {
            aes.setCryptKey(LG_AES_SALT);
        }
        lg_aes_type = LG_AES_XSAPI;
    }
    let API_KEY_All = lg_aes_type ? encodeURIComponent(aes.encrypt(API_key)) : API_key,
        API_V_All = lg_aes_type ? encodeURIComponent(aes.encrypt(API_v)) : API_v,
        API_SIG_All = lg_aes_type ? encodeURIComponent(aes.encrypt(API_sig)) : API_sig;

    let API_PARM_All = 'app_key=' + API_KEY_All + '&v=' + API_V_All + '&sig=' + API_SIG_All;
    // if(API_id>0){
    //   API_PARM_All+='&company_id='+API_ID_All ;
    // }
    return API_PARM_All
}
/*
 *post 对象 obj{k:v}
 * @type 0=TASK_API_URL_X,1=TASK_API_URL_Z
 * @date  2017.9.30
 * @author dbj
 * @lg_aes_type 加密开启 关与开
 * @cont 如果是数字的时候，转化成字符串
 */
export function API_PARM_FUN_ALL(obj, type) {
    let parm = API_PARM_ALL(type);
    for (let field in obj) {
        let lg_aes_type;
        if (type > 0) {
            if(type==1){
				if(LG_AES_ZSAPI==1){
					aes.setCryptKey(LG_AES_SALT_ZS);	
				}
				lg_aes_type= LG_AES_ZSAPI;
			}else{
				if(LG_AES_CRMAPI==1){
					aes.setCryptKey(LG_AES_SALT_CRM);	
				}
				lg_aes_type= LG_AES_CRMAPI;
			}
        } else {
            if (LG_AES_XSAPI == 1) {
                aes.setCryptKey(LG_AES_SALT);
            }
            lg_aes_type = LG_AES_XSAPI;
        }
        let cont;
        if (typeof(obj[field]) == 'number') {
            cont = obj[field].toString();
        } else {
            cont = obj[field];
        }
        let field_obj = encodeURIComponent(lg_aes_type ? aes.encrypt(cont) : cont);
        parm += '&' + field + '=' + field_obj;
    }
    return parm
}
