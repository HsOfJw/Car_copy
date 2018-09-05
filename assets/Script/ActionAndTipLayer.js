/*
 * @Author: wsf
 * @Date: 2018-08-31 16:35:38
 * @LastEditors: wsf
 * @LastEditTime: 2018-08-31 17:49:10
 * @Description:
 *
 *
 */

cc.Class({
    extends: cc.Component,

    properties: {
        upCarNode:cc.Node,
        upTrackNode:cc.Node,
        noCarPlotTipSp:cc.Sprite,
        maskBtn:cc.Button,
        upCarSp:cc.Sprite,
        maskCount : 0,
        showCount : 0,
    },

    onLoad:function() {
        this._priSet();
    },

    start () {

    },

    //设置maskBtn
    _setMaskBtn:function(){
        if(this.maskCount > 0){
            this.maskBtn.node.active = true;
        }
        else if(this.maskCount === 0){
            this.maskBtn.node.active = false;
        }
    },

    //初始设置
    _priSet:function(){
        this.upCarNode.active = false;
        this.upTrackNode.active = false;
        this.noCarPlotTipSp.node.active = false;
    },

    //显示车升级的界面
    showUpCarLayer:function(kind){
        this._priSet();
        this.upCarNode.active = true; 
        // let path = "resources/Texture/CarPng/ForeSight/forsight" + kind + ".png";
        // let url = cc.url.raw(path);
        // let frame = new cc.SpriteFrame(url);
        // this.upCarSp.spriteFrame = frame;
        cc.loader.loadRes("Texture/CarPng/ForeSight/forsight" + kind, cc.SpriteFrame, function (err, frame) {
            this.upCarSp.spriteFrame = frame;
        }.bind(this));
        this.maskCount++;
        this._setMaskBtn();
        this.showCount++;
    },
    //显示赛道升级的界面
    showUpTrackLayer:function(){
        this._priSet();
        this.upTrackNode.active = true;
        this.maskCount++;
        this.showCount++;
        this._setMaskBtn();
    },
    //关闭车升级的界面
    onCloseUpCar:function(e){
        this.maskCount --;
        this.showCount--;
        this._setMaskBtn();
        if(this.showCount <= 0){
            this.node.active = false;
        }
        else{
            this.upCarNode.active = false;
        }
    },
    //关闭赛道升级的界面
    onCloseUpTrack:function(e){
        this.maskCount --;
        this.showCount--;
        this._setMaskBtn();
        if(this.showCount <= 0){
            this.node.active = false;
        }
        else{
            this.upTrackNode.active = false;
        }
    },
    //分享车
    onShareCar:function(){

    },
    //确认赛道升级
    onOkTrack:function(){
        this.onCloseUpTrack();
    },
    //提示没有空余车位的动画
    playTipNoCarPlotAction:function(){
        this._priSet();
        this._setMaskBtn();
        this.showCount++;
        this.noCarPlotTipSp.node.active = true;
        this.noCarPlotTipSp.node.opacity = 255;
        let delay = cc.delayTime(0.5);
        let fadeout = cc.fadeOut(0.5);
        // let self = this;
        this.noCarPlotTipSp.node.stopAllActions();
        let calfun = cc.callFunc(function(){
            this.showCount--;
            if(this.showCount <= 0){
                this.node.active = false;
            }
        },this);
        let seq = cc.sequence(delay,fadeout,calfun);
        this.noCarPlotTipSp.node.runAction(seq);
    },

    //提示钱不够的动画
    playTipNoEnoughMoney:function(){
        this._priSet();
        this._setMaskBtn();
        this.showCount++;
        this.noCarPlotTipSp.node.active = true;
        this.noCarPlotTipSp.node.opacity = 255;
        let delay = cc.delayTime(0.5);
        let fadeout = cc.fadeOut(0.5);
        // let self = this;
        this.noCarPlotTipSp.node.stopAllActions();
        let calfun = cc.callFunc(function(){
            this.showCount--;
            if(this.showCount <= 0){
                this.node.active = false;
            }
        },this);
        let seq = cc.sequence(delay,fadeout,calfun);
        this.noCarPlotTipSp.node.runAction(seq);
    },


    // update (dt) {},
});
