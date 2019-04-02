/**
 * 手机号
 */
export function checkMobile(str) {
    var re = /^1[3|4|5|7|8|9]\d{9}$/ 
    if (re.test(str)) {
        return true;
    } else {
        return false;
    }
}
/**
 * 不能输入表情符
 */
export function checkEmoji(str) {
    let reg = /[^\u0020-\u007E\u00A0-\u00BE\u2E80-\uA4CF\uF900-\uFAFF\uFE30-\uFE4F\uFF00-\uFFEF\u0080-\u009F\u2000-\u201f\u2026\u2022\u20ac\r\n]/g
    return str = str.replace(reg,'')
}
/**
 * 不能输入表情符跟不能换行
 */
export function checkEmojiRn(str) {
    let reg = /[^\u0020-\u007E\u00A0-\u00BE\u2E80-\uA4CF\uF900-\uFAFF\uFE30-\uFE4F\uFF00-\uFFEF\u0080-\u009F\u2000-\u201f\u2026\u2022\u20ac\r\n]/g
    let text = str.replace(reg,'');
        text = text.replace(/(\r\n)|(\n)/g, "")
    return text
}
/**
 * 数字 不以0开头
 */
export function checkTel(str) {
    var re = /^[1-9]\d*$/;
    if (re.test(str)) {
        return true;
    } else {
        return false;
    }
}
/**
 * wechat
 */
export function checkWechat(str) {
    // let re = /^[-_a-zA-Z0-9]{6,30}+$/
    let re = /^[a-zA-Z0-9_-]{6,30}$/;
    if (re.test(str)) {
        return true;
    } else {
        return false;
    }
}
/**
 * 网址
 */
export function checkWeb(str) {
    var re = /^((https|http|ftp|rtsp|mms){0,1}(:\/\/){0,1})(([A-Za-z0-9_-~]+)\.)+([A-Za-z0-9_-~\/])+$/;
    if (re.test(str)) {
        return true;
    } else {
        return false;
    }
}
/**
 * 千分符
 */
export function checkMoney(val) {
    val = val.toString().replace(/(\d)(?=(?:\d{3})+$)/g,'$1,')
    return val
}
/**
 * 邮箱
 */
export function checkEmail(str) {
    var re = /^[0-9A-Za-z][\.-_0-9A-Za-z]*@[0-9A-Za-z]+(\.[0-9A-Za-z]+)+$/;
    if (re.test(str)) {
        return true;
    } else {
        return false;
    }
}
/**
 * 限制金额9999999999.99
 */
export function checkPrice(str) {
    let re = /^0(?:\.\d{0,2})?$|^[1-9]\d{0,9}(?:\.\d{0,2})?$/
    if (re.test(str)) {
        return true;
    } else {
        return false;
    }
}
//密码(6-20位的数字、字母)
export function checkPwd(str) {
    var re=/^[A-Za-z0-9\W_]{6,20}$/i;
    if (re.test(str)) {
        return true;
    } else {
        return false;
    }
}
//字符位数
export function len(s) {
    var l = 0;
    if(s == undefined){
        return 0;
    }
    var a = s.toString().split("");
    for (var i=0;i<a.length;i++) {
        if (a[i].charCodeAt(0)<299) {
            l++;
        } else {
            l+=2;
        }
    }
    return l;
}
//深拷贝
export function objDeepCopy(source) {
    var sourceCopy = source instanceof Array ? [] : {};
    for (var item in source) {
        sourceCopy[item] = typeof source[item] === 'object' ? objDeepCopy(source[item]) : source[item];
    }
    return sourceCopy;
  }
//手机系统 是不是苹果系统
export function navigatorHand() {
        var u = navigator.userAgent;
        // var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; //android终端
        var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
    return isiOS;
} 

//当前日期
export function currentDate() {
    var date = new Date();
    var seperator = "-";
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    if (month >= 1 && month <= 9) {
        month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
    }
    
    return date.getFullYear() + seperator + month + seperator + strDate;
}