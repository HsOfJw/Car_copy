/**
 *2018/9/7 10:30
 *作者:mazl
 *功能: 游戏说明模块
 */
let UIMgr = require("UIMgr");
cc.Class({
    extends: cc.Component,

    properties: {},


    onLoad() {
    },

    onBtnClickIKnow() {
        UIMgr.destroyUI(this);
    }
    // update (dt) {},
});
