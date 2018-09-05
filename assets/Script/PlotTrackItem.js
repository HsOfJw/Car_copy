/*
 * @Author: wsf
 * @Date: 2018-08-30 14:07:25
 * @LastEditors: wsf
 * @LastEditTime: 2018-08-30 14:15:01
 * @Description: 
 */

cc.Class({
    extends: cc.Component,

    properties: {
        isEmpty:true,
        emptySp:cc.Sprite,
        fullSp:cc.Sprite,
    },

    // onLoad () {},

    setEmpty:function(flag){
        this.isEmpty = flag;
    },
    getEmpty:function(){
        return this.isEmpty;  
    },
    setTrackSp:function(){
        let isempty = this.getEmpty();
        if(isempty){
            this.emptySp.node.active = true;
            this.fullSp.node.active = false;
        }
        else{
            this.emptySp.node.active = false;
            this.fullSp.node.active = true;
        }
    },

    start () {

    },

    // update (dt) {},
});
