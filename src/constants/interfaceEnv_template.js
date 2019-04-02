

let APP_ENV = require('./app_env').APP_ENV;
let LG_AES_SALT,LG_AES_SALT_ZS,LG_AES_SALT_CRM;
let XSAPI_URL,ZSAPI_URL,CRMAPI_URL;
let PHONE_PORT,V_CONSOLE;
let LG_AES_XSAPI,LG_AES_ZSAPI,LG_AES_CRMAPI;
if(APP_ENV=='dev'){
    LG_AES_SALT = 'LC.E23EFB7D76F18';
    LG_AES_SALT_ZS = 'LC.E23EFB7D76F17';
    LG_AES_SALT_CRM = 'LC.E23EFB7D76F19';
    // 新的接口 
    XSAPI_URL = 'http://dev-xsapi.51lick.cn:18880'; //销售模块地址
    ZSAPI_URL = 'http://dev-zsapi.51lick.cn:18880'; //招商模块地址
    CRMAPI_URL='http://dev-crmapi.51lick.cn:18880';//CRM模块地址
    //开发环境下 虚拟数据 
    PHONE_PORT = false;
    //开发环境下 手机前端开发调试利器
    V_CONSOLE = false;
    /*
    *0为关，1为开启
    * @date  2017.9.30
    * @author dbj
    * @lg_aes_type 加密开启 关与开
    * @type 0=TASK_API_URL_X,1=TASK_API_URL_Z
    */
    LG_AES_XSAPI = 1; //0为关，1为开启
    LG_AES_ZSAPI = 1; //0为关，1为开启
    LG_AES_CRMAPI = 1;//0为关，1为开启
}else if(APP_ENV=='formal'){
    LG_AES_SALT = 'LC.E23EFB7D76F18';
    LG_AES_SALT_ZS = 'LC.E23EFB7D76F17';
    LG_AES_SALT_CRM = 'LC.E23EFB7D76F19';
    // 新的接口
    XSAPI_URL = 'http://dev-xsapi.51lick.cn:18880'; //销售模块地址
    ZSAPI_URL = 'http://dev-zsapi.51lick.cn:18880'; //招商模块地址
    CRMAPI_URL='http://dev-crmapi.51lick.cn:18880';//CRM模块地址
    //开发环境下 虚拟数据 
    PHONE_PORT = false;
    //开发环境下 手机前端开发调试利器
    V_CONSOLE = false;  
    /*
    *0为关，1为开启
    * @date  2017.9.30
    * @author dbj
    * @lg_aes_type 加密开启 关与开
    * @type 0=TASK_API_URL_X,1=TASK_API_URL_Z
    */
    LG_AES_XSAPI = 1; //0为关，1为开启
    LG_AES_ZSAPI = 1; //0为关，1为开启
    LG_AES_CRMAPI = 1;//0为关，1为开启    
}
module.exports = {
    LG_AES_SALT,LG_AES_SALT_ZS,LG_AES_SALT_CRM,
    XSAPI_URL,ZSAPI_URL,CRMAPI_URL,
    PHONE_PORT,V_CONSOLE,
    LG_AES_XSAPI,LG_AES_ZSAPI,LG_AES_CRMAPI,
}
