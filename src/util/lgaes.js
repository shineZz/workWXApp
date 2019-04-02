const crypto = require('crypto-browserify');

//偏移向量
const iv = '00000000000000000000000000000000'; //hex_iv
//加密盐
let key = 'LC.E23EFB7D76F1';//salt
let cryptkey   = crypto.createHash('sha256').update(key).digest();

//重新设置key，不使用默认key
const setCryptKey= (key) => {
  cryptkey = crypto.createHash('sha256').update(key).digest();
  console.log(cryptkey,'cryptkeycryptkeycryptkeycryptkey')
}

function hexToStr(hex)
{
    let string = '';
    for (i=0; i < hex.length-1; i+=2)
    {
        let str;
        str = parseInt(hex[i]+""+hex[i+1],16);
        string += String.fromCharCode(str);
    }
    return string;
}
// console.log(hexToStr(iv),'=============')
const encrypt = (data) => {
    var cipher = crypto.createCipheriv('aes-256-cbc', cryptkey, hexToStr(iv));
    let encrypted = cipher.update(data, 'utf8', 'base64');
    encrypted += cipher.final('base64');
    console.log(cipher.final('base64'),encrypted,2222)
    return encrypted;
}
const decrypt = (data) => {
    var decipher = crypto.createDecipheriv('aes-256-cbc', cryptkey, hexToStr(iv));
    let decrypted=decipher.update(data, 'base64', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
}


//console.log(encrypt('123'));
//console.log(decrypt( 'GgUQS7sTmD0YWs1gM2Lwdg=='  ));

module.exports = {
      setCryptKey,
      encrypt,
      decrypt,
}
