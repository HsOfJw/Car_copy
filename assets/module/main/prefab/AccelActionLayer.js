/*
 * @Author: wsf
 * @Date: 2018-08-30 20:03:58
 * @LastEditors: wsf
 * @LastEditTime: 2018-08-31 10:59:14
 * @Description: 
 */



cc.Class({
    extends: cc.Component,

    properties: {
        panelSp:cc.Sprite,
        carSp:cc.Sprite,
    },
    onLoad () {},
    onEnable:function(){
        this._playAccelAction();
    },
    //播放加速动画
    _playAccelAction:function(){
        this.panelSp.node.stopAllActions();
        this.carSp.node.stopAllActions();
        let panelStartX =  -725;
        let panelStartY = -197;
        let carStartX = 520;
        let carStarY = 510;
        this.panelSp.node.position = cc.p(panelStartX,panelStartY);
        this.carSp.node.position = cc.p(carStartX,carStarY);

        let moveto1 = cc.moveTo(0.5,cc.p(0,0));
        let moveto2 = cc.moveTo(0.5,cc.p(-202,-1));
        let delay = cc.delayTime(0.5);
        
        let self = this;
        let calfunc = cc.callFunc(function(){
            self.node.active = false;
        });
        let seq = cc.sequence(delay,moveto2,delay,calfunc);
        this.carSp.node.runAction(seq);
        this.panelSp.node.runAction(moveto1);
    },
    // update (dt) {},
});
