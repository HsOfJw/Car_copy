/*
 * @Author: wsf
 * @Date: 2018-08-20 19:39:11
 * @LastEditors: wsf
 * @LastEditTime: 2018-08-31 15:41:48
 * @Description: 
 */

cc.Class({
    extends: cc.Component,

    properties: {
        progressBar: cc.ProgressBar,
        carSp: cc.Sprite,
        startBtn: cc.Button,
    },

    onLoad() {
        this.startBtn.node.active = false;
        this._loadResources();
    },

    start() {
        // this._loadResources();

    },

    //资源加载
    _loadResources: function () {
        let self = this;
        let barWidth = 484;
        this._isLoading = true;
        let baseX = self.carSp.node.x;
        cc.loader.loadResDir("Texture", cc.SpriteFrame, function (completedCount, totalCount, item) {
            // console.log("completedCount:" + completedCount + ",totalCount:" + totalCount );
            if (completedCount === totalCount) {
                self.startBtn.node.active = true;
                self._wxGetUserInfo();

            }
            if (self._isLoading) {
                self.progressBar.progress = completedCount / totalCount;
                self.carSp.node.x = baseX + barWidth * (completedCount / totalCount);
            }
        }, function (error, resource, urls) {
        });
    },

    //调用微信的api
    _wxClickStart: function () {
        if (cc.sys.platform === cc.sys.WECHAT_GAME) {

        }
    },

    //创建获取用户信息的按钮
    _wxGetUserInfo: function () {
        let sz = cc.view.getFrameSize();//返回视图中边框尺寸。 在 native 平台下，它返回全屏视图下屏幕的尺寸。 在 web 平台下，它返回 canvas 元素的外层 DOM 元素尺寸。
        let h = sz.height;
        let w = sz.width;

        let vsz = cc.view.getVisibleSize();//返回视图窗口可见区域尺寸
        let vh = vsz.height;
        let vw = vsz.width;

        let scaleX = w / vw;
        let scaleY = h / vh;

        let curBtnW = 284 * scaleX;
        let curBtnH = 144 * scaleY;

        let x = this.startBtn.node.x;
        let y = this.startBtn.node.y;
        let curT = h / 2 - y - 72;
        let curL = w / 2 + x - curBtnW / 2;
        console.log(scaleX, scaleY, x, y, w, h);
        if (cc.sys.platform === cc.sys.WECHAT_GAME) {
            let button = wx.createUserInfoButton({
                type: 'text',
                text: '',
                style: {
                    left: curL,
                    top: curT,
                    width: curBtnW,
                    height: curBtnH,
                    lineHeight: 1,
                    backgroundColor: '',
                    color: '',
                    fontSize: 1,
                    borderRadius: 1
                }
            });
            button.onTap(function (res) {
                console.log(res);
                if (res.userInfo) {
                    //获取信息成功
                    let name = res.userInfo.nickName;
                    let gender = res.userInfo.gender;
                    let city = res.userInfo.city;
                    button.destroy();
                    //跳转到游戏界面
                    cc.director.loadScene("GameScene");

                }
                else {
                    //跳转到用户设置界面
                }
            });
        }
    },

    //点击开始游戏
    onClickStart() {

    },

    update(dt) {
    },
});
