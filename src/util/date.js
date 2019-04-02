var months=[31,28,31,30,31,30,31,31,30,31,30,31];
var months2=[31,29,31,30,31,30,31,31,30,31,30,31];

function isLeap(yy){
    var mrun=yy%100==0&&yy%400==0?true:(yy%4==0?true:false);
    return mrun;
}
export function getDateJson(date){
    //获取要绘制月份的年月，
    var yy=date.getFullYear();
    var mm=date.getMonth();
    //判断是否是闰年
    var isleap=isLeap(yy);
    //获取应该使用的月份数组。
    var month=isleap?months2:months;
    //定义此月的1号的日期，获取其星期。
    var begin_date=new Date(yy,mm,1);
    var begin_week=begin_date.getDay();
    //获得上个月应该显示几天
    var pre_num=begin_week;
    //数组的总个数
    var const_num=7*5;
    //当月的天数
    var cur_num=month[mm];
    //下个月的天数
    var after_num=const_num-cur_num-pre_num;

    var preyy=yy;
    var premm=mm;
    //月份-1小于0，则前一月为上一年
    if(premm==0) {
        preyy -= 1;
    }
    //上个月的月份以及天数
    premm=premm-1<0?11:(premm-1);
    var pre_max=month[premm];

    //下个月的月份
    var afteryy=yy;
    var aftermm=mm;
    if(aftermm==11){
        afteryy+=1;
    }
    aftermm=aftermm+1>11?0:(aftermm+1);
    //定义日历数组。
    var dateJson=[];
    let pre = premm+1
    let m = mm+1
    let after = aftermm+1
    //循环得到上个月的日期。
    for(var i=pre_num;i>0;i--){
        var obj={year:''+preyy,month:pre<10?'0'+pre:''+pre,day:(pre_max-i+1)<10?'0'+(pre_max-i+1):''+(pre_max-i+1),place:'pre'};
        dateJson.push(obj);
    }
    //循环添加当月日期
    for(var i=1;i<=cur_num;i++){
        var obj={year:''+yy,month:m<10?'0'+m:''+m,day:i<10?'0'+i:''+i,place:'cur'};
        dateJson.push(obj);
    }
    //循环添加下个月的日期。
    for(var i=1;i<=after_num;i++){
        var obj={year:''+afteryy,month:after<10?'0'+after:''+after,day:i<10?'0'+i:''+i,place:'after'};
        dateJson.push(obj);
    }
    return dateJson;
}