/*
 * @Author: wsf
 * @Date: 2018-08-21 19:38:00
 * @LastEditors: wsf
 * @LastEditTime: 2018-08-31 19:28:14
 * @Description: 
 */

var _base64 = require("../ThirdScript/base64");

var data = {};
var userData = {//update 更新数据
    curRunCars: 0,
    updateScoreAndDiamond: false,
    playGoldParticleAction: false,//播放车到达终点的粒子动画
    isAccelRate: false,//判定是否加速
};

//需要保存的数据
var userInfo = {
    isFirstTime: 0,//第一次进入游戏
    isFirstGame: 0,// 第一次初始化
    date: "2018-8-22",
    signDays: 0,//累计签到天数
    isSign: 0,//今天是否签到
    diaMonds: 0,//当前用户钻石
    golds: 0,
    composeTimes: 0, //升下一级所需合成次数
    trackGrade: 1,//赛道等级
    highestClass: 1,//车的最高级别
    leftCarPlot: 0,//剩余空车位
    perSecondProfit: 0,//赛道每秒收益 跟随赛道上车的数量设置
    curRunCars: 0,//当前赛道车的数量
    totalTracks: 1,//当前赛道所能容纳总的车辆数
    carClassList: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1], //车辆等级

};

//标记保存的信息
var markInfo = {
    isFirstTime: false,
    isFirstGame: false,
    date: false,
    signDays: false,
    isSign: false,
    diaMonds: false,
    golds: false,
    composeTimes: false,
    trackGrade: false,
    highestClass: false,
    leftCarPlot: false,
    perSecondProfit: false,
    curRunCars: false,
    totalTracks: false,
    carClassList: [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false],
};

//保存数据
data.saveData = function () {
    for (var k in userInfo) {
        if (parseInt(data.getFirstTime()) == 0) {
            if (typeof(userInfo[k]) === "object") {
                let strJson = JSON.stringify(userInfo[k]);
                let ciphertext = _base64.encode(encodeURI(strJson));
                cc.sys.localStorage.setItem(k, ciphertext);
            }
            else {
                let ciphertext = _base64.encode(encodeURI(userInfo[k]));
                cc.sys.localStorage.setItem(k, ciphertext);
            }

        }
        else {
            if (markInfo[k]) {
                if (typeof(userInfo[k]) === "object") {
                    let flag = false;
                    for (let i = 0; i < markInfo[k].length; i++) {
                        if (markInfo[k][i]) {
                            flag = true;
                        }
                        markInfo[k][i] = false;
                    }
                    if (flag) {
                        let strJson = JSON.stringify(userInfo[k]);
                        let ciphertext = _base64.encode(encodeURI(strJson));
                        cc.sys.localStorage.setItem(k, ciphertext);
                    }

                }
                else {
                    let ciphertext = _base64.encode(encodeURI(userInfo[k]));
                    cc.sys.localStorage.setItem(k, ciphertext);
                    markInfo[k] = false;
                }

            }
        }

    }
};


//是否初次
data.setFirstTime = function (n) {
    userInfo.isFirstTime = n;
    var value = _base64.encode(encodeURI(n));
    cc.sys.localStorage.setItem("isFirstTime", value);
};
data.getFirstTime = function () {
    var firstTime = cc.sys.localStorage.getItem("isFirstTime");
    if (firstTime) {
        var dataText = decodeURI(_base64.decode(firstTime));
        return dataText;
    }
    else {
        return userInfo.isFirstTime;
    }
};

//0 未签到 1 签到
data.setIsSign = function (n) {
    userInfo.isSign = n;
    markInfo.isSign = true;
};
//判定今天是否已经签到
data.getIsSign = function () {
    var isSign = cc.sys.localStorage.getItem("isSign");
    if (isSign) {
        var dataText = decodeURI(_base64.decode(isSign));
        return dataText;
    }
    else {
        return userInfo.isSign;
    }
};

//签到天数
data.setSignDays = function (n) {
    userInfo.signDays = n;
    markInfo.signDays = true;
};

data.getSignDays = function () {
    var signdays = cc.sys.localStorage.getItem("signDays");
    if (signdays) {
        var dataText = decodeURI(_base64.decode(signdays));
        return dataText;
    }
    else {
        return userInfo.signDays;
    }
};

//钻石数量
data.setDiamondNums = function (n) {
    userInfo.diaMonds = n;
    markInfo.diaMonds = true;
};

data.getDiamondNums = function () {
    var diamonds = cc.sys.localStorage.getItem("diaMonds");
    if (diamonds) {
        var dataText = decodeURI(_base64.decode(diamonds));
        return dataText;
    }
    else {
        return userInfo.diaMonds;
    }
};

//日期
data.setCurDate = function (n) {
    userInfo.date = n;
    markInfo.date = true;
};
data.getCurDate = function () {
    var date = cc.sys.localStorage.getItem("date");
    if (date) {
        var dataText = decodeURI(_base64.decode(date));
        return dataText;
    }
    else {
        return userInfo.date;
    }
};

//金币数量
data.setGolds = function (n) {
    userInfo.golds = n;
    markInfo.golds = true;
};
data.getGolds = function () {
    var golds = cc.sys.localStorage.getItem("golds");
    if (golds) {
        var dataText = decodeURI(_base64.decode(golds));
        return dataText;
    }
    else {
        return userInfo.golds;
    }
};

//车辆等级
data.setCarClassList = function (k, v) {
    let listStr = cc.sys.localStorage.getItem("carClassList");
    let list = JSON.parse(decodeURI(_base64.decode(listStr)));
    for (let i = 0; i < userInfo["carClassList"].length; i++) {
        if (!markInfo.carClassList[i]) {
            userInfo["carClassList"][i] = list[i];
        }
    }
    userInfo.carClassList[k] = v;
    markInfo.carClassList[k] = true;
};

data.getCarClassList = function (k) {
    let carClassListStr = cc.sys.localStorage.getItem("carClassList");
    if (carClassListStr) {
        let dataText = decodeURI(_base64.decode(carClassListStr));
        let carClassList = JSON.parse(dataText);
        return carClassList[k];
    }
    else {
        return userInfo.carClassList[k];
    }
};

//最高赛车等级
data.getHighestClass = function () {
    var highestClass = cc.sys.localStorage.getItem("highestClass");
    if (highestClass) {
        var dataText = decodeURI(_base64.decode(highestClass));
        return dataText;
    }
    else {
        return userInfo.highestClass;
    }
};
data.setHighestClass = function (n) {
    userInfo.highestClass = n;
    markInfo.highestClass = true;
};

//当前赛道等级合成车辆的次数
data.setComposeTimes = function (n) {
    userInfo.composeTimes = n;
    markInfo.composeTimes = true;
};

data.getComposeTimes = function () {
    var composeTimes = cc.sys.localStorage.getItem("composeTimes");
    if (composeTimes) {
        var dataText = decodeURI(_base64.decode(composeTimes));
        return dataText;
    }
    else {
        return userInfo.composeTimes;
    }
};

//赛道等级
data.setTrackGrade = function (n) {
    userInfo.trackGrade = n;
    markInfo.trackGrade = true;
};
data.getTrackGrade = function () {
    var trackGrade = cc.sys.localStorage.getItem("trackGrade");
    if (trackGrade) {
        var dataText = decodeURI(_base64.decode(trackGrade));
        return dataText;
    }
    else {
        return userInfo.trackGrade;
    }

};

//剩余空位
data.setLeftCarPlot = function (n) {
    userInfo.leftCarPlot = n;
    markInfo.leftCarPlot = true;
};
data.getLeftCarPlot = function () {
    var leftCarPlot = cc.sys.localStorage.getItem("leftCarPlot");
    if (leftCarPlot) {
        var dataText = decodeURI(_base64.decode(leftCarPlot));
        return dataText;
    }
    else {
        return userInfo.leftCarPlot;
    }

};

//每秒收益
data.setPerSecProfit = function (n) {
    userInfo.perSecondProfit = n;
    markInfo.perSecondProfit = true;
};
data.getPerSecProfit = function () {
    var perSecondProfit = cc.sys.localStorage.getItem("perSecondProfit");
    if (perSecondProfit) {
        var dataText = decodeURI(_base64.decode(perSecondProfit));
        return dataText;
    }
    else {
        return userInfo.perSecondProfit;
    }
};

//当前跑的车的数量
data.setCurRunCars = function (n) {
    userInfo.curRunCars = n;
    markInfo.curRunCars = true;
};
data.getCurRunCars = function () {
    var curRunCars = cc.sys.localStorage.getItem("curRunCars");
    if (curRunCars) {
        var dataText = decodeURI(_base64.decode(curRunCars));
        return dataText;
    }
    else {
        return userInfo.curRunCars;
    }
};

//赛道的总数
data.setTotalTracks = function (n) {
    userInfo.totalTracks = n;
    markInfo.totalTracks = true;
};
data.getTotalTracks = function () {
    var totalTracks = cc.sys.localStorage.getItem("totalTracks");
    if (totalTracks) {
        var dataText = decodeURI(_base64.decode(totalTracks));
        return dataText;
    }
    else {
        return userInfo.totalTracks;
    }
};

//第一次游戏
data.setFirstGame = function (n) {
    userData.isFirstGame = n;
    markInfo.isFirstGame = true;
};
data.getFirstGame = function () {
    var isFirstGame = cc.sys.localStorage.getItem("isFirstGame");
    if (isFirstGame) {
        var dataText = decodeURI(_base64.decode(isFirstGame));
        return dataText;
    }
    else {
        return userInfo.isFirstGame;
    }
};

/*-------------------userData--------------------------*/

//设置更新钻石和金币的flag
data.getUpdateScoreAndDiamond = function () {
    return userData.updateScoreAndDiamond;
};
data.setUpdateScoreAndDiamond = function (flag) {
    userData.updateScoreAndDiamond = flag;
};

//设置加速的flag
data.getAcceleRate = function () {
    return userData.isAccelRate;
};
data.setAcceleRate = function (flag) {
    userData.isAccelRate = flag;
};

//设置播放金币的粒子动画
data.getPlayGoldParticleAction = function () {
    return userData.playGoldParticleAction;
};
data.setPlayGoldParticleAction = function (flag) {
    userData.playGoldParticleAction = flag;
};

module.exports = data;
