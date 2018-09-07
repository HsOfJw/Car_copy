/**
 *2018/9/7 14:16
 *作者:mazl
 *功能: 游戏主逻辑  复写
 */
let UIMgr = require("UIMgr");
cc.Class({
    extends: cc.Component,

    properties: {
        //用户数据相关
        userLevel: {displayName: "用户等级", default: null, type: cc.Label},
        levelProgress: {displayName: "等级进度条", default: null, type: cc.ProgressBar},
        diamond: {displayName: "钻石数", default: null, type: cc.Label},
        perSecond: {displayName: "每秒的收益", default: null, type: cc.Label},
        totalScore: {displayName: "总金币", default: null, type: cc.Label},
        buyCarCostGold: {displayName: "购买一辆车花费的金币", default: null, type: cc.Label},


        settingSign: {displayName: "设置标识图标", default: null, type: cc.Sprite},

        //页面预制体相关部分
        settingPre: {displayName: "设置预制体", default: null, type: cc.Prefab},
        helpPre: {displayName: "游戏玩法介绍", default: null, type: cc.Prefab},
        shopPre: {displayName: "商店", default: null, type: cc.Prefab},
        rankPre: {displayName: "排行榜", default: null, type: cc.Prefab},


        addNode: {displayName: "添加节点", default: null, type: cc.Node},

    },


    onLoad() {
    },

    _initPageData() {

    },
    //打开设置界面
    onBtnClickShowSetting() {
        this.addNode.removeAllChildren();
        UIMgr.createPrefab(this.settingPre, function (root, ui) {
            this.addNode.addChild(root);
        }.bind(this));
    },
    //打开求助页面
    onBtnClickToHelp() {
        this.addNode.removeAllChildren();
        UIMgr.createPrefab(this.helpPre, function (root, ui) {
            this.addNode.addChild(root);
        }.bind(this));
    },
    //打开排行榜
    onBtnClickShowRank() {

    },
    //打开商店
    onBtnClickShowShop() {

    },


    update(dt) {
    },
});
