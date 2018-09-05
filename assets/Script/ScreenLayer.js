/*
 * @Author: wsf
 * @Date: 2018-08-22 14:39:48
 * @LastEditors: wsf
 * @LastEditTime: 2018-08-31 19:15:45
 * @Description: 
 */

var _data = require("./GameData/UserData");
var _util = require("./GameClass/Util");
cc.Class({
    extends: cc.Component,

    properties: {
        diamondsLabel:cc.Label,
        glodsLabel:cc.Label,
        goldPerSecondLabel:cc.Label,
        progressBar:cc.ProgressBar,
        trackGradeLabel:cc.Label,
        buyCarLabel:cc.Label,
    },

    onLoad () {
        let diamondStr = _data.getDiamondNums();
        let glodStr = _util.formatGoldStr(_data.getGolds());
        this.diamondsLabel.string = diamondStr;
        this.glodsLabel.string = glodStr;
        this.setPerSecondProfit();
        let carGold = this.getCarGold();
        this.buyCarLabel.string = _util.formatGoldStr(carGold);
        this.updateGrade();
        this._listen();
    },

    //设置每秒收益
    setPerSecondProfit:function(){
        let perGoldStr = _util.formatGoldStr(_data.getPerSecProfit());
        this.goldPerSecondLabel.string = perGoldStr + "每秒";
    },

    _listen:function(){
        let self = this;
        cc.game.on("UPDATE_SCORE_DIAMOND",function(e){
            self.updateGoldAndDiamond();
        });
        cc.game.on("UPDATE_PERPROFIT",function(e){
            self.setPerSecondProfit();
        });
    },

    //更新钻石和金币
    updateGoldAndDiamond:function(){
        let goldStr = _data.getGolds();
        let diamondStr = _data.getDiamondNums();
        this.glodsLabel.string = _util.formatGoldStr(goldStr);
        this.diamondsLabel.string = diamondStr;
    },

    onDestroy:function(){
        // cc.game.off("UPDATE_SCORE_LABEL");
    },

    //addGrade
    _addGrade:function(grade){
        _data.setTrackGrade(grade + 1);
        _data.setComposeTimes(0);
        let tgrade = grade+1;
        this.trackGradeLabel.string = tgrade + "";
        _data.saveData();

        let tempGrade = grade+1 - 12;
        if(tempGrade>0 && tempGrade % 2 === 0){
            let oldDiamond = parseInt(_data.getDiamondNums());
            let curDiamond = oldDiamond + (grade+1)*20;
            _data.setDiamondNums(curDiamond);
            _data.saveData();
            cc.game.emit("UPDATE_SCORE_DIAMOND",{msg:"update score diamond!"});
        }
    },

    //更新赛道
    updateGrade:function(){
        let grade = parseInt(_data.getTrackGrade());
        this.trackGradeLabel.string = grade + "";
        let composeNums = parseInt(_data.getComposeTimes());
        if(grade === 1){
            if(composeNums === 3){
                this._addGrade(grade);
            }
            this.progressBar.progress = (composeNums%3) / 3;
        }
        else if(grade === 2){
            if(composeNums === 7){
                this._addGrade(grade);
            }
            this.progressBar.progress = (composeNums%7) / 7;
        }
        else if(grade > 2){
            if(composeNums === grade*5){
                this._addGrade(grade);
            }
            this.progressBar.progress = (composeNums%(grade*5)) / (grade * 5);
        }


    },

    //获取买车所需金币
    getCarGold:function(){
        let carGrade = parseInt(_data.getCarClassList(0));
        let carUnitPrice = _util.getCarUnitPrice()[0];
        let carRate = 1.07;
        let carGold = carUnitPrice * Math.pow(carRate,carGrade-1);
        carGold = Math.floor(carGold);
        return carGold;
    },

    //点击购买车的按钮
    onClickBuyCar:function(e){
        let gold = this.getCarGold();
        let oldGold = parseInt(_data.getGolds());
        if(gold > oldGold){
            //钱不够
            cc.game.emit("NOT_ENOUGH_MONEY",{msg:"NOT_ENOUGH_MONEY"});
        }
        else{
            let leftGold = oldGold - gold;
            let leftCarPlot = parseInt(_data.getLeftCarPlot());

            if(leftCarPlot > 0){
                _util.calLeftCarPlot(-1);
                _data.setGolds(leftGold);
                _data.saveData();   
                let glodStr = _util.formatGoldStr(leftGold);
                this.glodsLabel.string = glodStr;

                let carGrade = parseInt(_data.getCarClassList(0));
                _data.setCarClassList(0,carGrade+1);
                _data.saveData();
                this.buyCarLabel.string = _util.formatGoldStr(this.getCarGold());
            }
            cc.game.emit("CLICK_BUY_CAR",{
                msg:1
            });

        }
    },



    start () {

    },

    // update (dt) {},
});
