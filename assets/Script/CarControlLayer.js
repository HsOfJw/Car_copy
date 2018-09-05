/*
 * @Author: wsf
 * @Date: 2018-08-23 14:44:54
 * @LastEditors: wsf
 * @LastEditTime: 2018-08-31 19:30:30
 * @Description: 
 */

var _data = require("./GameData/UserData");
var _util = require("./GameClass/Util");
var CAR_STATE = require("./GlobalDefine/globalDefine").CarState;
cc.Class({
    extends: cc.Component,
    properties: {
        runCarItem: cc.Prefab,
        plotCarItem: cc.Prefab,
        plotTrackItem: cc.Prefab,
        plotCarBack: cc.Prefab,
        waveLabel: cc.Prefab,
        plotLayout: cc.Layout,
        plotCarBackLayout: cc.Layout,
        recoveryLayer: cc.Node,
        recoverySp: cc.Sprite,
        plotTrackLayout: cc.Layout,
        synthesParticle: cc.Node,
        addGoldParticle: cc.Node,
        screenNode: cc.Node,
        accelViewSp: cc.Sprite,
        accelTimeLabel: cc.Label,
        accelActionLayer: cc.Node,
        recordLabel: cc.Label,

        actionAndTipLayer: cc.Node,
    },

    onLoad: function () {
        this.curMoveId = -1;//当前触控到的车

        this.screenScript = this.screenNode.getComponent("ScreenLayer");
        this.onListenHandle();
        this._createWaveLabel();
        let firstGame = parseInt(_data.getFirstGame());
        this._createCarPool();
        if (firstGame === 0) {
            this._init();
            this._createTrackPlot();
            _data.setFirstGame(1);
            _data.saveData();
        }
        this.actionAndTipScript = this.actionAndTipLayer.getComponent(cc.Component);
    },

    //创建移除飘字分数的label
    _createWaveLabel: function () {
        this.waveItem = cc.instantiate(this.waveLabel);
        this.waveItem.parent = this.node.parent;
        this.waveScript = this.waveItem.getComponent(cc.Component);
        this.waveItem.opacity = 0;
    },

    //移除金币增加
    _playScoreLabelAction: function (x, y, kind) {
        let goldList = _util.getPerCircleGolds();
        let score = goldList[kind - 1];
        this.waveScript.initWithData(x, y, score);
    },

    //监听事件处理
    onListenHandle: function () {
        let self = this;
        //点击buycar
        cc.game.on("CLICK_BUY_CAR", function (e) {
            let k = parseInt(e.detail.msg);
            let flag = true;
            for (let i = 0; i < self.plotCarList.length; i++) {
                let item = self.plotCarList[i];
                let script = item.getComponent(cc.Component);
                if (script.isEmpty()) {
                    script.initWithData(k);
                    flag = false;
                    break;
                }
            }
            if (flag) {
                self.actionAndTipLayer.active = true;
                self.actionAndTipScript.playTipNoCarPlotAction();
            }
        });
        //钱不够

        cc.game.on("NOT_ENOUGH_MONEY", function (e) {
            self.actionAndTipLayer.active = true;
            self.actionAndTipScript.playTipNoEnoughMoney();
        });

    },

    //emit消息 发送更新每秒收益的通知
    updatePerSecProfit: function (addProfit) {
        let oldProfit = parseInt(_data.getPerSecProfit());

        _data.setPerSecProfit(oldProfit + addProfit);
        _data.saveData();
        cc.game.emit("UPDATE_PERPROFIT", {msg: "UPDATE_PERPROFIT"});
    },

    // onLoad () {},
    onEnable: function () {
        //添加触摸
        this.node.on(cc.Node.EventType.TOUCH_MOVE, this._touchMove, this);
        this.node.on(cc.Node.EventType.TOUCH_END, this._touchEnd, this);
        this.node.on(cc.Node.EventType.TOUCH_START, this._touchStart, this);
    },
    onDisable: function () {
        //关闭触摸
        this.node.off(cc.Node.EventType.TOUCH_MOVE, this._touchMove, this);
        this.node.off(cc.Node.EventType.TOUCH_END, this._touchEnd, this);
        this.node.off(cc.Node.EventType.TOUCH_START, this._touchStart, this);
    },

    //触摸开始
    _touchStart: function (e) {
        let pos = e.getLocation();
        pos = this.node.convertToNodeSpaceAR(pos);
        let curX = pos.x;
        let curY = pos.y;
        for (let i = 0; i < this.plotCarList.length; i++) {
            let item = this.plotCarList[i];
            let script = item.getComponent(cc.Component);
            if (script.isHit(curX, curY) && (!script.isEmpty())) {

                let state = script.getCarState();//车的状态  初始
                if (state === CAR_STATE.RUN) {//车在轨道上
                    //移除正在跑的赛车 取出kind比较
                    let tempKind = script.getCarKind();
                    console.log("runCarList.length:", this.runCarList.length);
                    for (let j = 0; j < this.runCarList.length; j++) {
                        let runItem = this.runCarList[j];
                        let runScript = runItem.getComponent(cc.Component);
                        let runKind = runScript.getCarKind();
                        if (runKind === tempKind) {
                            //移除
                            let profit = _util.getPerSecondGolds()[runKind - 1];
                            this.updatePerSecProfit(-profit);
                            this.runCarPool.put(runItem);
                            this.runCarList.splice(j, 1);
                            script.setEmpty(false);
                            script.setCarState(CAR_STATE.STATIC);

                            this._setCurTrackPlot();
                            break;
                        }
                    }
                }
                else {
                    //
                    this.curMoveId = i;
                    break;
                }


            }
        }
    },
    //触摸移动
    _touchMove: function (e) {
        let pos = e.getLocation();
        pos = this.node.convertToNodeSpaceAR(pos);
        let curX = pos.x;
        let curY = pos.y;
        if (this.curMoveId != -1) {
            let item = this.plotCarList[this.curMoveId];
            let script = item.getComponent(cc.Component);
            let state = script.getCarState();
            if (state === CAR_STATE.STATIC) {
                script.setBodyPos(curX, curY);
            }

        }
    },
    //触摸结束
    _touchEnd: function (e) {
        //结束位置在赛道上
        //结束位置在空位上
        //结束位置在非空位置上 两个类型相同，合成
        //结束位置在非空位置上 两个类型不同，相互交换
        //结束位置在垃圾桶位置
        //结束位置在其他地方
        let pos = e.getLocation();
        pos = this.node.convertToNodeSpaceAR(pos);
        let curX = pos.x;
        let curY = pos.y;
        let isOtherLocation = true;
        console.log("touchEnd!!!!");
        if (this.curMoveId != -1) {
            for (let i = 0; i < this.plotCarList.length; i++) {
                let item = this.plotCarList[i];
                let script = item.getComponent(cc.Component);
                if (script.isHit(curX, curY)) {
                    if (script.isEmpty()) {
                        //结束位置在空位上
                        let moveItem = this.plotCarList[this.curMoveId];
                        let moveScript = moveItem.getComponent(cc.Component);
                        let moveKind = moveScript.getCarKind();
                        script.setCarKind(moveKind);
                        //更新车的皮肤
                        script.setBodySpriteFrame();
                        moveScript.setEmpty(true);
                        script.setEmpty(false);
                        script.setCarState(CAR_STATE.STATIC);
                    }
                    else {
                        let moveItem = this.plotCarList[this.curMoveId];
                        let moveScript = moveItem.getComponent(cc.Component);
                        let moveKind = moveScript.getCarKind();
                        let staticKind = script.getCarKind();
                        let curState = script.getCarState();
                        if (moveKind === staticKind && this.curMoveId != i && curState === CAR_STATE.STATIC) {
                            //结束位置在非空位置上 两个类型相同，合成
                            //计算空位
                            _util.calLeftCarPlot(1);

                            //播放动画
                            let srcSp = moveScript.getBody();
                            let dstSp = script.getBody();
                            let x = dstSp.node.parent.x;
                            let y = dstSp.node.parent.y;
                            script.setShadowSp(false);
                            moveScript.setShadowSp(false);
                            let self = this;
                            let highestClass = parseInt(_data.getHighestClass());

                            let calfunc = function () {
                                script.setShadowSp(true);
                                moveScript.setEmpty(true);
                                script.setCarKind(staticKind + 1);
                                //更新车的皮肤
                                script.setBodySpriteFrame();
                                //播放粒子动画
                                self._playParticleAction(x, y);
                                if (highestClass >= moveKind + 1) {

                                }
                                else {
                                    _data.setHighestClass(moveKind + 1);
                                    let oldTotalTrackPlots = parseInt(_data.getTotalTracks());
                                    if (oldTotalTrackPlots < 10) {
                                        _data.setTotalTracks(oldTotalTrackPlots + 1);
                                        self._createTrackPlotUnit();
                                        _data.saveData();
                                        let len = self.runCarList.length;
                                        let newTracks = oldTotalTrackPlots + 1;
                                        self.recordLabel.string = len + "/" + newTracks;
                                    }
                                    //播放合成车的动画
                                    self.actionAndTipLayer.active = true;
                                    self.actionAndTipScript.showUpCarLayer(moveKind + 1);

                                }
                                //合成数加一
                                let composeCounts = parseInt(_data.getComposeTimes());
                                _data.setComposeTimes(composeCounts + 1);
                                _data.saveData();
                                //更新赛道等级
                                self.screenScript.updateGrade();


                                //更新车位
                                let oldPlaces = self._getCurPlaceCounts();
                                let newPlaces = self._getPlaceCounts();
                                if (newPlaces > oldPlaces) {
                                    self._createCarPlotItem();
                                    //计算空位
                                    _util.calLeftCarPlot(1);
                                }

                            };
                            this._playSyntheticAnimation(srcSp, dstSp, calfunc);

                        }
                        else {
                            //结束位置在非空位置上 两个类型不同，复位
                            moveScript.resetBodyPos();
                        }
                    }
                    isOtherLocation = false;
                    break;
                }

            }

            if (isOtherLocation) {
                //判断别处是否是赛道
                //判断是否是回收站
                //都不是则复位
                let moveItem = this.plotCarList[this.curMoveId];
                let moveScript = moveItem.getComponent(cc.Component);
                let moveKind = moveScript.getCarKind();

                if (this._isHitRecovery(curX, curY)) {
                    //计算空位
                    _util.calLeftCarPlot(1);
                    //判断是否是回收站
                    moveScript.setEmpty(true);
                    //增加金币
                    let carPriceList = _util.getCarUnitPrice();
                    let carPrice = carPriceList[moveKind - 1];
                    let curGold = parseInt(_data.getGolds());
                    let x = this.recoverySp.node.x + this.recoveryLayer.x;
                    let y = this.recoverySp.node.y + this.recoveryLayer.y;
                    this.waveScript.initWithData(x, y, carPrice);
                    _data.setGolds(carPrice + curGold);
                    _data.saveData();
                    _data.setUpdateScoreAndDiamond(true);
                }
                else if (this._isHitTrack(curX, curY) && !(this._isFullTrack())) {
                    let totalTracks = parseInt(_data.getTotalTracks());
                    let len = this.runCarList.length;
                    if (len < totalTracks) {
                        this._createCarItem(moveKind, curY);
                        moveScript.setRunTracks();
                        console.log("create Car item!");
                        let k = moveScript.getCarKind();
                        let profit = _util.getPerSecondGolds()[k - 1];
                        this.updatePerSecProfit(profit);
                    }
                    else {
                        //复位
                        moveScript.resetBodyPos();
                    }
                }
                else {
                    //复位
                    moveScript.resetBodyPos();
                }
            }
        }
        this.curMoveId = -1;
    },

    //播放合成动画
    _playSyntheticAnimation: function (srcSp, dstSp, calfunc) {
        let parent = dstSp.node.parent;
        let x = parent.x;
        let y = parent.y;
        let tparent = srcSp.node.parent;
        let tx = tparent.x;
        let ty = tparent.y;
        srcSp.node.x = x - tx;
        srcSp.node.y = y - ty;

        let moveby1 = cc.moveBy(0.4, cc.p(-80, 0));
        let moveby2 = cc.moveBy(0.4, cc.p(80, 0));
        let func = cc.callFunc(calfunc);
        let delay = cc.delayTime(0.2);
        let seq1 = cc.sequence(moveby1, delay, moveby2);
        let seq2 = cc.sequence(moveby2, delay, moveby1, func);
        srcSp.node.runAction(seq1);
        dstSp.node.runAction(seq2);
    },

    //播放合成的粒子动画
    _playParticleAction: function (x, y) {
        this.synthesParticle.x = x;
        this.synthesParticle.y = y;
        var myParticle = this.synthesParticle.getComponent(cc.ParticleSystem);
        if (myParticle.particleCount > 0) { // check if particle has fully plaed
            myParticle.stopSystem(); // stop particle system
        } else {
            myParticle.resetSystem(); // restart particle system
        }
    },

    //播放增加金币的粒子动画
    _playAddGoldParticleAction: function () {
        let myParticle = this.addGoldParticle.getComponent(cc.ParticleSystem);
        if (myParticle.particleCount > 0) { // check if particle has fully plaed
            myParticle.stopSystem(); // stop particle system
        } else {
            myParticle.resetSystem(); // restart particle system
        }
    },


    //判断与赛道的碰撞
    _isHitTrack: function (x, y) {
        let w = 50;
        let h = 10 * 32;
        let trackX = 270;
        let trackY = 68;
        if (trackX - w / 2 < x && x < trackX + w / 2 && y < trackY && y > trackY - h) {
            return true;
        }

        return false;

    },
    //判断赛道是否已满
    _isFullTrack: function () {
        let cars = this.runCarList.length;
        let tracks = parseInt(_data.getTotalTracks());
        if (tracks > cars) {
            return false;
        }
        return true;
    },

    //判断与垃圾桶的碰撞
    _isHitRecovery: function (x, y) {
        let recoveryX = this.recoverySp.node.x + this.recoveryLayer.x;
        let recoveryY = this.recoverySp.node.y + this.recoveryLayer.y - 10;
        let w = 142;
        let h = 94;
        if (recoveryX - w / 2 < x && x < recoveryX + w / 2 && recoveryY - h / 2 < y && y < recoveryY + h / 2) {
            return true;
        }
        return false;
    },
    //初始化函数
    _init: function () {
        //获取车位
        let placeCounts = this._getPlaceCounts();
        for (let i = 0; i < placeCounts; i++) {
            this._createCarPlotItem(1, false);
        }

    },

    //获取当前车位数量
    _getCurPlaceCounts: function () {
        let nums = this.plotCarList.length;
        return nums;
    },

    //获取车位
    _getPlaceCounts: function () {
        let trackGrade = parseInt(_data.getTrackGrade());
        let placeCounts = 3 + trackGrade - 1;
        if (placeCounts > 15) {
            placeCounts = 15;
        }
        return placeCounts;
    },

    //创建赛道的车位
    _createTrackPlot: function () {
        let totalTracks = parseInt(_data.getTotalTracks());
        this.totalTrackList = [];
        for (let i = 0; i < totalTracks; i++) {
            this._createTrackPlotUnit();
        }
    },
    //
    _createTrackPlotUnit: function () {
        let item = cc.instantiate(this.plotTrackItem);
        item.parent = this.plotTrackLayout.node;
        this.totalTrackList[this.totalTrackList.length] = item;
    },

    //创建对象池
    _createCarPool: function () {
        let num = 15;
        // let waveCount = 10;
        this.runCarPool = new cc.NodePool();
        this.plotCarPool = new cc.NodePool();
        // this.waveLabelPool = new cc.NodePool();
        this.runCarList = [];
        this.plotCarList = [];
        for (let i = 0; i < num; i++) {
            let runCarItem = cc.instantiate(this.runCarItem);
            let plotCarItem = cc.instantiate(this.plotCarItem);
            this.runCarPool.put(runCarItem);
            this.plotCarPool.put(plotCarItem);
        }
        //创建飘字的对象池
        // for(let j=0;j<waveCount;j++){
        //     let waveItem = cc.instantiate(this.waveLabel);
        //     this.waveLabelPool.put(waveItem);
        // }
    },

    _getRunCarItem: function () {
        var item;
        if (this.runCarPool.size() > 0) {
            item = this.runCarPool.get();
        }
        else {
            item = cc.instantiate(this.runCarItem);

        }
        return item;
    },

    _getPlotCarItem: function () {
        var item;
        if (this.plotCarPool.size() > 0) {
            item = this.plotCarPool.get();
        }
        else {
            item = cc.instantiate(this.plotCarItem);
        }
        return item;
    },

    //设置当前的赛道
    _setCurTrackPlot: function () {
        let len = this.runCarList.length;
        let totalTracks = parseInt(_data.getTotalTracks());
        this.recordLabel.string = len + "/" + totalTracks;
        for (let i = 0; i < totalTracks; i++) {
            let item = this.totalTrackList[i];
            let script = item.getComponent(cc.Component);
            if (i < len) {
                script.setEmpty(false);
            }
            else {
                script.setEmpty(true);
            }
            script.setTrackSp();
        }
    },

    //创建车的实例
    _createCarItem: function (carKind, y) {
        let runcar = this._getRunCarItem();
        let script = runcar.getComponent(cc.Component);
        runcar.parent = this.node;
        script.initWithData(carKind);
        script.setInitPos(y);
        let len = this.runCarList.length;
        this.runCarList[len] = runcar;

        this._setCurTrackPlot();
    },

    //创建车位的实例
    _createCarPlotItem: function (k = 0, isEmpty = true) {
        let plotcar = this._getPlotCarItem();
        let script = plotcar.getComponent(cc.Component);
        plotcar.parent = this.plotLayout.node;
        let len = this.plotCarList.length;
        this.plotCarList[len] = plotcar;
        script.initWithData(k);
        script.setEmpty(isEmpty);

        let carback = cc.instantiate(this.plotCarBack);
        carback.parent = this.plotCarBackLayout.node;
    },

    //加速
    onAccelerate: function (e) {
        //加速

        let len = this.runCarList.length;
        if (len <= 0) {
            return;
        }
        this.accelActionLayer.active = true;

        let totaltime = 180;
        this.accelTimeLabel.node.active = true;
        this.accelViewSp.node.active = true;
        this._setAccelerateTime(2);
        let btn = e.target.getComponent(cc.Button);
        btn.interactable = false;
        this.schedule(function () {
            totaltime--;

            if (totaltime >= 0) {
                let s = Math.floor(totaltime / 60);
                let ms = Math.floor(totaltime % 60);
                let tstr = "";
                if (ms >= 10) {
                    tstr = "加速中:" + s + ":" + ms;
                }
                else {
                    tstr = "加速中:" + s + ":0" + ms;
                }
                this.accelTimeLabel.string = tstr;
            }
            else {
                this._setAccelerateTime(1);
                this.accelTimeLabel.node.active = false;
                this.accelViewSp.node.active = false;
                btn.interactable = true;
                this.unscheduleAllCallbacks();
            }
        }, 1);
    },

    //设置加速时间cmd 1 恢复 2 加倍
    _setAccelerateTime: function (cmd) {
        for (let i = 0; i < this.runCarList.length; i++) {
            let item = this.runCarList[i];
            let script = item.getComponent(cc.Component);
            if (cmd === 2) {
                script.setAccelerateFlag(true);
                _data.setAcceleRate(true);
            }
            else if (cmd === 1) {
                script.setAccelerateFlag(false);
                _data.setAcceleRate(false);
            }

        }
    },

    start() {
        // this._createCarItem();
    },

    update(dt) {
        if (_data.getPlayGoldParticleAction()) {
            this._playAddGoldParticleAction();
            _data.setPlayGoldParticleAction(false);
        }
    },
});
