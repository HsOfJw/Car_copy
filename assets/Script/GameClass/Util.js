/*
 * @Author: wsf
 * @Date: 2018-08-21 19:22:06
 * @LastEditors: wsf
 * @LastEditTime: 2018-08-29 17:38:42
 * @Description: 
 */
var _data = require("../GameData/UserData");

var util = {};

var PerSecondGolds = [5,
    11,
    22,
    45,
    92,
    191,
    397,
    825,
    1721,
    3596,
    7515,
    15706,
    32825,
    68604,
    143382,
    299668,
    626306,
    1308979,
    2735766,
    5717750,
    11950097,
    24975702,
    52199217,
    109096363,
    228011398,
    476543821,
    995976585,
    2081591062,
    4350525319,
    9092597916,
    ];
var PerCircleGolds = [25,
    50,
    100,
    200,
    400,
    800,
    1600,
    3200,
    6400,
    12800,
    25600,
    51200,
    102400,
    204800,
    409600,
    819200,
    1638400,
    3276800,
    6553600,
    13107200,
    26214400,
    52428800,
    104857600,
    209715200,
    419430400,
    838860800,
    1677721600,
    3355443200,
    6710886400,
    13421772800
    ];

var PerCircleSeconds = [5,
    4.545,
    4.545,
    4.444,
    4.348,
    4.188,
    4.03,
    3.879,
    3.719,
    3.56,
    3.407,
    3.26,
    3.12,
    2.985,
    2.857,
    2.734,
    2.616,
    2.503,
    2.396,
    2.292,
    2.194,
    2.099,
    2.009,
    1.922,
    1.84,
    1.76,
    1.684,
    1.612,
    1.543,
    1.476
    ];

var CarUnitPrice = [100,
    471,
    2950,
    19200,
    64350,
    174000,
    490900,
    1444000,
    4332000,
    13429200,
    42973440,
    141812352,
    482161996,
    1687566986,
    6075241149,
    22478392251,
    85417890553,
    333129773156, 
    1332519092624,
    5463328279758, 
    22945978774983, 
    98667708732426, 
    434137918422674, 
    1953620632902030,
    8986654911349340,
    42237278083341900,
    202738934800041000,
    993420780520201000,
    4967103902601010000,
    25332229903265100000
    ];

//获取每秒的收益数据
util.getPerSecondGolds = function(){
    return PerSecondGolds;
};

//获取每圈的收益数据
util.getPerCircleGolds = function(){
    return PerCircleGolds;
};

//获取每圈用时数据
util.getPerCircleSeconds = function(){
    return PerCircleSeconds;
};

//获取购买价格数据
util.getCarUnitPrice = function(){
    return CarUnitPrice;
};


//判断是不是今天
util.isToday = function () {
    let str = _data.getCurDate();
    var d = new Date(str.replace(/-/g,"/"));
    var todaysDate = new Date();
    if(d.setHours(0,0,0,0) == todaysDate.setHours(0,0,0,0)){
        return true;
    } else {
        let y = todaysDate.getFullYear();
        let m = todaysDate.getMonth()+1;
        let dd = todaysDate.getDate();
        let dateStr = y + "-" + m + "-" + dd;
        console.log(dateStr);
        _data.setCurDate(dateStr);
        _data.saveData();
        return false;
    }
};

//格式化数字
util.formatGoldStr = function(num){
    let unitLists = ["K","M","G","T","P","E","Z","Y"];
    let tempstr = num+"";
    let len = tempstr.length;
    let resultStr = tempstr;
    if(len > 6){
        let devide = Math.floor(len / 3);
        let mod = Math.floor(len % 3);
        if(mod === 0){
            let unit = unitLists[devide-3];
            resultStr = tempstr.substr(0,3)+","+tempstr.substr(3,3)+unit;
        }
        else{
            let unit = unitLists[devide-2];
            resultStr = tempstr.substr(0,mod)+","+tempstr.substr(mod,3)+unit;
        }
    }
    return resultStr;
};

//剩余车位
util.calLeftCarPlot = function(n){
    let srcLeft = parseInt(_data.getLeftCarPlot());
    let dstLeft = srcLeft + n;
    console.log("剩余车位：",dstLeft);
    _data.setLeftCarPlot(dstLeft);
    _data.saveData();
};


module.exports = util;
