/*
 * @Author: wsf
 * @Date: 2018-08-21 15:05:55
 * @LastEditors: wsf
 * @LastEditTime: 2018-08-31 19:15:30
 * @Description: 
 */

var _data = require("UserData");
var _util = require("GameUtil");
cc.Class({
    extends: cc.Component,

    properties: {
        carMenuA:cc.Sprite,
        carMenuB:cc.Sprite,
        shopMenuA:cc.Sprite,
        shopMenuB:cc.Sprite,
        goldLabel:cc.Label,
        diamondLabel:cc.Label,
        shopCarItem:cc.Prefab,
        carShopLayout:cc.Layout,
        carScrollView:cc.ScrollView,
        shopScrollView:cc.ScrollView,
    },



    onLoad:function () {
        this.selected = true;
        if(this.selected){
            this._setCarBtnFlag(true);
            this._setShopBtnFlag(false);
            this.carScrollView.node.active = true;
            this.shopScrollView.node.active = false;
        }
        this._createBuyCarItem();
        this._listenClick();
    },

    //创建汽车购买
    _createBuyCarItem:function(){
        this.carItemList = [];
        let len = 20;
        for(let i=0;i<len;i++){
            let item = cc.instantiate(this.shopCarItem);
            item.parent = this.carShopLayout.node;
            this._updateCar(i,item);
            this.carItemList[i] = item;
        }
    },

    //监听事件CLICK_BUY_CAR
    _listenClick:function(){
        let self = this;
        cc.game.on("CLICK_BUY_CAR",function(e){
            let goldStr = _data.getGolds();
            let diamondStr = _data.getDiamondNums();
            self.goldLabel.string = _util.formatGoldStr(goldStr);
            self.diamondLabel.string = diamondStr;
        });
        cc.game.on("UPDATE_SCORE_DIAMOND",function(e){
            self.updateGoldAndDiamond();
        });
    },

    //更新钻石和金币
    updateGoldAndDiamond:function(){
        let goldStr = _data.getGolds();
        let diamondStr = _data.getDiamondNums();
        this.goldLabel.string = _util.formatGoldStr(goldStr);
        this.diamondLabel.string = diamondStr;
    },

    //更新车 initWithData:function(kind,isLock,isGray)
    _updateCar:function(i,item){
        let high = parseInt(_data.getHighestClass())-4;
        let script = item.getComponent(cc.Component);
        if(i === 0){
            script.initWithData(i+1,false,false);
        }
        else if(i+1 <= high){
            script.initWithData(i+1,false,false);
        }
        else if(i+1 <= high+4){
            script.initWithData(i+1,true,false);
        }
        else{
            script.initWithData(i+1,true,true);
        }
    },

    onEnable:function(){
        let goldStr = _data.getGolds();
        this.goldLabel.string = _util.formatGoldStr(goldStr);
        let diamondStr = _data.getDiamondNums();
        this.diamondLabel.string =  diamondStr;

        for(let i=0;i<this.carItemList.length;i++){
            let item = this.carItemList[i];
            this._updateCar(i,item);
        }
    },

    //设置汽车商店按钮
    _setCarBtnFlag:function(flag){
        this.carMenuA.node.active = flag;
        this.carMenuB.node.active = !flag;
    },
    //设置购买金币按钮
    _setShopBtnFlag:function(flag){
        this.shopMenuA.node.active = flag;
        this.shopMenuB.node.active = !flag;
    },
    //点击汽车商店
    onClickCar:function(e){
        this._setCarBtnFlag(true);
        this._setShopBtnFlag(false);
        this.carScrollView.node.active = true;
        this.shopScrollView.node.active = false;
    },



    //点击购买金币
    onClikBuyCoin:function(e){
        this._setCarBtnFlag(false);
        this._setShopBtnFlag(true);
        this.carScrollView.node.active = false;
        this.shopScrollView.node.active = true;
    },

    //点击钻石按钮
    onClikDiamond:function(e,n){
        let num = parseInt(n);
        let score = [1000000,11000000,60000000,130000000,280000000];
        let diamond = [10,100,500,1000,2000];
        let curDiamonds = parseInt(_data.getDiamondNums());
        let curGolds = parseInt(_data.getGolds());
        if(diamond[num-1] <= curDiamonds){
            _data.setDiamondNums(curDiamonds - diamond[num-1]);
            _data.setGolds(score[num-1]+curGolds);

            cc.game.emit("UPDATE_SCORE_DIAMOND",{msg:"update score diamond!"});
        }
        else{
            //钻石不足

        }

    },

    start () {

    },

    // update (dt) {},
});
