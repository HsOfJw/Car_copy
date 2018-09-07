/*
 * @Author: wsf
 * @Date: 2018-08-29 11:32:01
 * @LastEditors: wsf
 * @LastEditTime: 2018-08-31 19:16:20
 * @Description: 
 */

var _data = require("UserData");
var _util = require("GameUtil");
cc.Class({
    extends: cc.Component,

    properties: {
        lockSp:cc.Sprite,
        bodySp:cc.Sprite,
        lockLabel:cc.Label,
        carScoreLabel:cc.Label,
        buyBtn:cc.Button,
        kind:0,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad:function(){
    },

    //设置类别
    setKind:function(k){
        this.kind = k;
    },
    getKind:function(){
        return this.kind;
    },

    //设置锁
    setLock:function(flag){
        this.lockSp.node.active = flag;
        this.buyBtn.node.active = !flag;
        let k = this.getKind();
        let c = k+4;
        this.lockLabel.string = c + "";
        let carGold = this.getCarGold(k);
        this.carScoreLabel.string = _util.formatGoldStr(carGold);
    },

    //设置body
    setBodyFrame:function(k){
       /* let path = "resources/Texture/CarPng/ForeSight/forsight" + k + ".png";
        let url = cc.url.raw(path);
        let frame = new cc.SpriteFrame(url);
         this.bodySp.spriteFrame = frame;*/
        cc.loader.loadRes("Texture/CarPng/ForeSight/forsight" + k, cc.SpriteFrame, function (err, frame) {
            this.bodySp.spriteFrame = frame;
        }.bind(this));

    },

    //设置body的颜色为黑色
    setBodyColor:function(c){
        this.bodySp.node.color = c;
    },

    //初始化数据
    initWithData:function(kind,isLock,isGray){
        this.setKind(kind);
        this.setLock(isLock);
        this.setBodyFrame(kind);
        if(isGray){
            this.setBodyColor(cc.Color.BLACK);
        }
        else{
            this.setBodyColor(cc.Color.WHITE);
        }

    },

    //获取购买所需的金币
    getCarGold:function(k){
        let carGrade = parseInt(_data.getCarClassList(k-1));
        let carUnitPrice = _util.getCarUnitPrice()[k-1];
        
        let carRate = 1;
        if(k === 1){
            carRate = 1.07;
        }
        else if(k <= 20){
            carRate = 1.18;
        }
        let carGold = carUnitPrice * Math.pow(carRate,carGrade-1);
        carGold = Math.floor(carGold);
        return carGold;
    },
    //点击购买
    onClickBuy:function(){
        //发送消息
        let k = this.getKind();
        if(k > 20){
            return;
        }

        let curGold = parseInt(_data.getGolds());
        let carGold = this.getCarGold(k);
        if(carGold > curGold){
            //金币不够
            cc.game.emit("NOT_ENOUGH_MONEY",{msg:"NOT_ENOUGH_MONEY"});
        }
        else{
            //是否有剩余车位
            let leftCarPlot = parseInt(_data.getLeftCarPlot());
            if(leftCarPlot > 0){
                //剩余金币
                _util.calLeftCarPlot(-1);
                let leftGold = curGold-carGold;
                _data.setGolds(leftGold);
                //更新购买车的金币
                let carGrade = parseInt(_data.getCarClassList(k-1));
                _data.setCarClassList(k-1,carGrade+1);
                _data.saveData();
                this.carScoreLabel.string = _util.formatGoldStr(this.getCarGold(k));

 
            }
            //发送通知
            cc.game.emit("CLICK_BUY_CAR",{
                msg:k
            });

        }
 
    },

    start () {

    },

    // update (dt) {},
});
