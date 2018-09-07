/*
 * @Author: wsf
 * @Date: 2018-08-21 16:38:04
 * @LastEditors: wsf
 * @LastEditTime: 2018-08-21 20:05:36
 * @Description: 
 */

var _data =  require("UserData");

cc.Class({
    extends: cc.Component,

    properties: {
        item1:cc.Button,
        item2:cc.Button,
        item3:cc.Button,
        item4:cc.Button,
        item5:cc.Button,
        item6:cc.Button,
        item7:cc.Button,

    },


    onLoad () {
        this.itemLists = [item1,item2,item3,item4,item5,item6,item7];
    },

    //设置item true 已领取，false 未领取
    _setItem:function(index,flag){
        let item = this.itemLists[index];
        item.interactable = !flag;
        let isnotget = item.node.getChildByName("dianjilingqu");
        let isget = item.node.getChildByName("yilingqu");
        isget.active = flag;
        isnotget.active = !flag;
    },

    //设置不是当天的未领取的奖励
    _setNotTodayItem:function(index){
        let item = this.itemLists[index];
        item.interactable = false;
        let isnotget = item.node.getChildByName("dianjilingqu");
        let isget = item.node.getChildByName("yilingqu");
        isget.active = false;
        isnotget.active = false;
    },

    //设置所有天数的初始状态的item
    _setAllDayItem:function(){
        for(let i=0;i<7;i++){
            this._setNotTodayItem(i);
        }
    },



    onEnable:function(){
        this._setAllDayItem();
        let sinDays = parseInt(_data.getSignDays());
        let isSign = parseInt(_data.getIsSign());
        let curDate = Math.floor((sinDays - 1)%7+1);
        for(let i=0;i<curDate-1;i++){
            this._setItem(i,true);
        }
        if(isSign === 0){
            this._setItem(curDate-1,false);
        }
        else if(isSign === 1){
            this._setItem(curDate-1,true);
        }
    },

    //点击领取奖励按钮
    onClickGetAward:function(e,n){
        let num = parseInt(n);
        let isSign = parseInt(_data.getIsSign());
        let diamonds = [100,120,150,150,180,180];
        let curDiamonds = parseInt(_data.getDiamondNums());
        _data.setDiamondNums(diamonds[curDiamonds+1]);
        _data.setIsSign(1);
        _data.saveData();

        this._setItem(n-1,true);
    },

    start () {

    },

    // update (dt) {},
});
