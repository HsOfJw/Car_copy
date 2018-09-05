/*
 * @Author: wsf
 * @Date: 2018-08-23 10:05:11
 * @LastEditors: wsf
 * @LastEditTime: 2018-08-31 19:29:32
 * @Description: 
 */

var _util = require("./GameClass/Util");
var _data = require("./GameData/UserData");

cc.Class({
    extends: cc.Component,

    properties: {
        kind: 0,    //0 unknow 1~30 表示车的类别
        bodySp: cc.Sprite,
        tailSp: cc.Sprite,
        waveLabel: cc.Prefab,
        totalTime: 0,
        frameCount: 0,
        initPosX: 260,
        initPosY: 0,
        isRunCircle: false,
        isAccelerate: false,

    },

    onLoad: function () {
        this.item = cc.instantiate(this.waveLabel);
        this.item.parent = this.node.parent;
        0
        this.waveScript = this.item.getComponent(cc.Component);
        this.item.opacity = 0;

    },

    //初始化函数
    initWithData: function (k) {
        this.setCarKind(k);

        let totalTimeList = _util.getPerCircleSeconds();
        this.setRunTime(totalTimeList[k - 1]);
        //设置body和tail
        this.setBodySpriteFrame();
        //数据初始化
        this.frameCount = 0;

    },

    setBodySpriteFrame: function () {
        let kind = this.getCarKind();
        //let path = "resources/Texture/CarPng/OverLook/ovelook" + kind + ".png";
        //let url = cc.url.raw(path);
        //let frame = new cc.SpriteFrame(url);
        cc.loader.loadRes("Texture/CarPng/OverLook/ovelook" + kind, cc.SpriteFrame, function (err, frame) {
            this.bodySp.spriteFrame = frame;
        }.bind(this));
        //let frame = new cc.SpriteFrame("Texture/CarPng/OverLook/ovelook" + kind+".png");
        //this.bodySp.spriteFrame = frame;
        this.bodySp.node.rotation = 0;
    },

    //设置车的类别
    setCarKind: function (k) {
        this.kind = k;
    },
    //获取车的类别
    getCarKind: function () {
        return this.kind;
    },

    //设置获取时间
    setRunTime: function (t) {
        this.totalTime = t;
    },

    getRunTime: function () {
        return this.totalTime;
    },

    //结束金币增加
    _playScoreLabelAction: function (x, y) {
        let goldList = _util.getPerCircleGolds();
        let score = goldList[this.kind - 1];
        this.waveScript.initWithData(x, y, score);
        let oldGold = parseInt(_data.getGolds());
        _data.setGolds(score + oldGold);
        _data.saveData();

        //更新label
        // cc.game.emit("UPDATE_SCORE_DIAMOND",{
        //     msg:"update score label!"
        // });
        _data.setUpdateScoreAndDiamond(true);
    },

    //加速设置 cmd 1 恢复 2 加倍
    _setAccelrate: function (cmd) {
        let totalTimeList = _util.getPerCircleSeconds();
        let k = this.getCarKind();
        let runtime = totalTimeList[k - 1];
        this.setRunTime(runtime / cmd);
        // console.log("runtime,cmd",this.getRunTime(),cmd);
    },

    //是否加速
    setAccelerateFlag: function (flag) {
        this.isAccelerate = flag;
        console.log("isAccelerate:", this.getAccelerateFlag());
    },
    getAccelerateFlag: function () {
        return this.isAccelerate;
    },

    //设置初始坐标
    setInitPos: function (y, x) {
        if (x) {
            this.initPosX = x;
        }
        if (y) {
            this.initPosY = y;
        }

    },
    //获取初始坐标
    getInitPosX: function () {
        return this.initPosX;
    },
    getInitPosY: function () {
        return this.initPosY;
    },


    //车的运动
    _runCar: function () {
        let firstPosX = this.getInitPosX();
        let firstPosY = this.getInitPosY();
        let endX = -260;
        let endY = 0;
        let baseyT = 260 - 30;
        let baseyB = -260 + 30;
        let basexR = 260;
        let basexL = -260;

        let round = 260;

        let totalTime = this.getRunTime();
        if (this.frameCount === 0) {//一圈结束
            this.bodySp.node.x = firstPosX;
            this.bodySp.node.y = firstPosY;
            this.isRunCircle = true;
            if (_data.getAcceleRate()) {
                this._setAccelrate(2);
            }
            else {
                this._setAccelrate(1);
            }
            totalTime = this.getRunTime();
        }
        //5 个阶段
        //1 阶段 t*3/16
        let frameCoutns1 = Math.floor(totalTime * ((baseyT - firstPosY) / (baseyT - baseyB)) * (3 / 16) * 60);
        //2 阶段 t*1/4
        let frameCounts2 = Math.floor(totalTime * 5 / 16 * 60);
        //3阶段 t*1/4
        let frameCounts3 = Math.floor(totalTime * 3 / 16 * 60);
        //4阶段 t*1/4
        let frameCounts4 = Math.floor(totalTime * 5 / 16 * 60);
        //5阶段 t*1/16
        let frameCounts5 = Math.floor(totalTime * ((firstPosY - baseyB) / (baseyT - baseyB)) * (3 / 16) * 60);

        this.frameCount++;
        if (this.frameCount <= frameCoutns1) {
            let perdistance = (baseyT - firstPosY) / frameCoutns1;
            this.bodySp.node.y += perdistance;
        }
        else if (this.frameCount <= frameCounts2 + frameCoutns1) {
            let perAngle = 180 / frameCounts2;
            let perRadius = perAngle / 180 * Math.PI;
            let curRadius = (this.frameCount - frameCoutns1) * perRadius;
            this.bodySp.node.x = round * Math.cos(curRadius);
            this.bodySp.node.y = round * Math.sin(curRadius) + baseyT;
            this.bodySp.node.rotation = -(this.frameCount - frameCoutns1) * perAngle;
        }
        else if (this.frameCount <= frameCounts3 + frameCounts2 + frameCoutns1) {
            let perdistance = (baseyT - baseyB) / frameCounts3;
            this.bodySp.node.y -= perdistance;
            this.bodySp.node.x = basexL;
            //判断一圈
            if (Math.abs(endY - this.bodySp.node.y) <= perdistance) {
                if (this.isRunCircle) {
                    // console.log("is Circle");
                    // this.updateDiamonds();
                    this._playScoreLabelAction(endX, endY);
                    this.isRunCircle = false;
                    _data.setPlayGoldParticleAction(true);
                }
            }
        }
        else if (this.frameCount <= frameCounts4 + frameCounts3 + frameCounts2 + frameCoutns1) {
            let perAngle = 180 / frameCounts4;
            let perRadius = perAngle / 180 * Math.PI;
            let curRadius = (this.frameCount - frameCoutns1 - frameCounts2 - frameCounts3) * perRadius + Math.PI;
            this.bodySp.node.x = round * Math.cos(curRadius);
            this.bodySp.node.y = round * Math.sin(curRadius) + baseyB;
            this.bodySp.node.rotation = 180 - (this.frameCount - frameCoutns1 - frameCounts2 - frameCounts3) * perAngle;
        }
        else if (this.frameCount <= frameCounts5 + frameCounts4 + frameCounts3 + frameCounts2 + frameCoutns1) {
            let perdistance = (firstPosY - baseyB) / frameCounts5;
            this.bodySp.node.y += perdistance;
            this.bodySp.node.x = basexR;

        }
        if (this.frameCount === Math.floor(totalTime * 60)) {
            this.frameCount = 0;
        }

        //尾气变化
        // let opcity = (this.frameCount % 2+1)*127.5;
        // this.tailSp.node.opcity = opcity;
    },


    update(dt) {
        this._runCar();
    },
});
