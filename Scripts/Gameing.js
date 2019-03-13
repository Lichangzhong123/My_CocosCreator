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
        enemys: { //所有怪物的父节点
            default: null,
            type: cc.Node
        },
        panda: { //熊猫节点
            default: null,
            type: cc.Node
        },
        scoreLabel: { //显示分数的
            default: null,
            type: cc.Label
        },
        playerLogo: { //玩家Logo
            default: null,
            type: cc.Node
        },
        GameOver: { //游戏结束时
            default: null,
            type: cc.Node
        },
        GameOverBgm: { //游戏结束音效
            default: null,
            type: cc.AudioClip
        },
        Prop: {
            type: cc.Prefab,
            default: null
        },
        birds: {
            type: cc.Node,
            default: null
        },
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        G.Score = 0;

        this.schedule(function () {
            this.spawnProp();
        }, 10, 50, 1);
    },

    start() {
        //TUDO:游戏开始时读取玩家的头像更改至playerLogo
        this.GameOver.active = false;
        this.score = G.Score;
        this.isPlay = true;
    },
    spawnProp() {
        //this.timer=0;
        var EnemyNode = cc.instantiate(this.Prop);
        EnemyNode.y = 510;

        var zuobiao = Math.floor(Math.random() * 10 % 5);

        switch (zuobiao) {
            case 1:
                EnemyNode.x = -210;
                //EnemyNode.getComponent('Scale').x=-1;
                //EnemyNode.scaleX *= -1;
                break;
            case 2:
                EnemyNode.x = -90;
                // EnemyNode.getComponent('Scale').x=-1;
                //EnemyNode.scaleX *= -1;
                break;
            case 3:
                EnemyNode.x = 75;
                //    EnemyNode.getComponent('Scale').x=-1;
                //EnemyNode.scaleX *= -1;
                break;
            case 4:
                EnemyNode.x = 215;
                break;
        }
        this.node.addChild(EnemyNode);
    },

    update(dt) {
        if (window.G.IsProp == true) {
            this.birds.getComponent(cc.Animation).playAdditive('Birds');
            window.G.IsProp = false;
        }

        if (this.score != G.Score) {
            this.score = G.Score;
            G.isAddScore = true;
            this.scoreLabel.string = 'Score: ' + this.score;
        }
        if (G.GameOver) {
            this.GameOver.active = true;
            if (this.isPlay) {
                cc.audioEngine.stopMusic();
                cc.audioEngine.play(this.GameOverBgm, false, 0.5);
                this.GameOver.getComponent(cc.Animation).playAdditive('gameOver');
                this.isPlay = false;
            }
            this.scheduleOnce(() => {
                G.GameOver = false;
                cc.director.loadScene('LevelLose');
            }, 5);
        }
    },
});