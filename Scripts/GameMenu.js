// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        bgAudio: { //背景音乐
            url: cc.AudioClip,
            default: null,
        },
        bgLabel: { //声音的字
            type: cc.Label,
            default: null
        }
    },
    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        // this.bgAudio = null;
        var self = this;
        var gameBgmUrl = "http://192.168.88.7:6688/gameBgm.mp3";
        cc.loader.load(gameBgmUrl, function (err, clip) {

            console.log(err);
            self.bgAudio = clip;
        });
    },
    start() {},
    onClickOnGameInformation() { //游戏介绍
        cc.director.loadScene('GameInformation');
    },
    onClickOnGaming() { //游戏中
        cc.director.loadScene('Gameing');
    },
    onGameWelcome() {
        cc.director.loadScene('Welcome');
    },
    onAudio() { //声音按键
        var playing = cc.audioEngine.isMusicPlaying();

        //this.node.Label.string ='声音:开';
        this.bgLabel.string = '声音：开';

        if (playing == true) {
            cc.audioEngine.stopMusic(this.bgAudio);
            //this.node.Label.string ='声音:关';
            this.bgLabel.string = '声音：关';
        } else {
            cc.audioEngine.playMusic(this.bgAudio, true);
            this.bgLabel.string = '声音：开';
        }
    }
    // update (dt) {},
});