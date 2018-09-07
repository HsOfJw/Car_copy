/*
 * @Author: wsf
 * @Date: 2018-08-23 17:51:04
 * @LastEditors: wsf
 * @LastEditTime: 2018-08-29 19:43:06
 * @Description: 
 */

//  var CAR_STATE = {
//      NULL:-1,
//      STATIC:0,
//      RUN:1,
//  };
 var CAR_STATE = require("GlobalDefine").CarState;
cc.Class({
    extends: cc.Component,

    properties: {
        bodySp:cc.Sprite,
        shadowSp:cc.Sprite,
        mergeSp:cc.Sprite,
        recoverSp:cc.Sprite,
        cellHight:50,
        cellWidth:80,
        kind:0,
        state:-1,
    },

    // LIFE-CYCLE CALLBACKS:
    onLoad:function(){
        this.emptyFlag = true;
    },

    
    //初始化函数
    initWithData:function(k){
        //设置body和tail
        // this.bodySp.node.active = true;
        // this.shadowSp.node.active = true;
        this.setEmpty(false);
        this.setCarKind(k);
        this.setCarState(CAR_STATE.STATIC);
        this.setBodySpriteFrame();
    },

    //设置车的类别
    setCarKind:function(k){
        this.kind = k;
    },
    //获取车的类别
    getCarKind:function(){
        return this.kind;
    },

    //设置车的状态 -1 空，0 静止，1 在车道上
    setCarState:function(n){
        this.state = n;
    },
    getCarState:function(){
        return this.state;
    },

    //设置在赛道上
    setRunTracks:function(){
        this.setCarState(CAR_STATE.RUN);
        this.bodySp.node.active = false;
        this.recoverSp.node.active = true;
    },

    //设置body的图片
    setBodySpriteFrame:function(){
        let kind = this.getCarKind();
        if(kind <= 0){
            return;
        }
       /* let path = "resources/Texture/CarPng/ForeSight/forsight" + kind + ".png";
        let url = cc.url.raw(path);
        let frame = new cc.SpriteFrame(url);
        this.bodySp.spriteFrame = frame;
         this.shadowSp.spriteFrame = frame;*/
        cc.loader.loadRes("Texture/CarPng/ForeSight/forsight" + kind, cc.SpriteFrame, function (err, frame) {
            this.bodySp.spriteFrame = frame;
            this.shadowSp.spriteFrame = frame;
        }.bind(this));

    },

    //获取body
    getBody:function(){
        return this.bodySp;
    },

    //设置shadow的flag
    setShadowSp:function(flag){
        this.shadowSp.node.active = flag;
    },

    //判断是否为空
    isEmpty:function(){
        return this.emptyFlag;
    },
    setEmpty:function(flag){
        this.emptyFlag = flag;
        this.bodySp.node.active = !flag;
        this.shadowSp.node.active = !flag;
        if(!flag){
            this.resetBodyPos();
            this.recoverSp.node.active = false;
        }
        else{
            this.setCarState(CAR_STATE.NULL);
            this.setCarKind(0);
        }
        
    },

    //判断触摸点是否触及此node
    isHit:function(x,y){
        let nodeX = this.node.x+this.node.parent.x;
        let nodeY = this.node.y+this.node.parent.y;
        // console.log("x,y",nodeX,nodeY);
        if(x - 0.5*this.cellWidth < nodeX && nodeX < x + 0.5*this.cellWidth &&
           y - 0.5*this.cellHight < nodeY && nodeY < y + 0.5*this.cellHight){
               console.log("is hit");
               return true;
           }
        return false;
    },

    //将body的位置复位
    resetBodyPos:function(){
        this.bodySp.node.x = 0;
        this.bodySp.node.y = 0;
    },

    //设置bodySp的位置
    setBodyPos:function(x,y){
        let nodeX = this.node.x+this.node.parent.x;
        let nodeY = this.node.y+this.node.parent.y;
        let tmpx = x - nodeX;
        let tmpy = y - nodeY;
        // console.log("tmpx,tmpy",tmpx,tmpy);
        this.bodySp.node.x = tmpx;
        this.bodySp.node.y = tmpy;
    },

    start () {

    },

    // update (dt) {},
});
