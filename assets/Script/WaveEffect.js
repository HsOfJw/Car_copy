/*
 * @Author: wsf
 * @Date: 2018-08-28 11:32:05
 * @LastEditors: wsf
 * @LastEditTime: 2018-08-28 14:59:25
 * @Description: 
 */

cc.Class({
    extends: cc.Component,

    properties: {

    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},
    onEnable:function(){
        
    },

    //初始化
    initWithData:function(x,y,score){
        let label = this.getComponent(cc.Label);
        label.string =  "+" + score;
        this.node.x = x;
        this.node.y = y;
        this.node.opacity = 255;
        this.playAction();
    },
    playAction(){
        let moveby = cc.moveBy(1,cc.p(0,100));
        let fadeout = cc.fadeOut(1.0);
        let spaw = cc.spawn(moveby,fadeout);
        this.node.runAction(spaw);
    },



    onDisable:function(){

    },

    // update (dt) {},
});
