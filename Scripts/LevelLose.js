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
        secoreLabel:{
            type:cc.Label,
            default:null
        }
    },

    // LIFE-CYCLE CALLBACKS:

     onLoad () {
         this.secoreLabel.string = "得分："+ G.Score;
     },

    start () {

    },
    onClickOnGaming(){
        cc.director.loadScene('Gameing');

    },
    onClickOnWelcome(){
        cc.director.loadScene('Welcome');

    },

    // update (dt) {},
});
