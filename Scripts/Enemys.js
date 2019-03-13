// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html
//var enemyScript = require('Enemy'); //读取怪物的脚本
cc.Class({
    extends: cc.Component,

    properties: {
        headDieSprite: { //怪物死亡的头图片
            default: null,
            type: cc.SpriteFrame
        },
        InitTime: 5, //初始化生成怪物的时间
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        var self = this;
        this.PrefabNums = null;
        cc.loader.loadResDir("prefabs", cc.Prefab, function (err, assets, urls) {
            self.PrefabNums = assets;
        });
    },

    spawNewenemy(rand) {
        let pos = cc.v2(0, 0);
        let swervePosX = cc.v2(0, 0);
        let scaleX = 0;
        switch (rand) {
            case 0: //tree1左
                pos = cc.v2(-190, -525);
                swervePosX = -130;
                scaleX = -1;
                break;
            case 1: //tree1右
                pos = cc.v2(-130, -525);
                swervePosX = -190;
                scaleX = 1;
                break;
            case 2: //tree2左
                pos = cc.v2(-30, -525);
                swervePosX = 30;
                scaleX = -1;
                break;
            case 3: //tree2右
                pos = cc.v2(30, -525);
                swervePosX = -30;
                scaleX = 1;
                break;
            case 4: //tree3左
                pos = cc.v2(130, -525);
                swervePosX = 190;
                scaleX = -1;
                break;
            case 5: //tree3右
                pos = cc.v2(190, -525);
                swervePosX = 130;
                scaleX = 1;
                break;
        }
        this.newEnemy(pos, scaleX, swervePosX);
    },
    newEnemy(pos, scaleX, swervePosX) {
        let enemyType = Math.floor((Math.random() * 20));
        let res = Math.floor((Math.random() * 10) % 2);
        let enemy = cc.instantiate(this.PrefabNums[res]);
        enemy.position = pos;
        enemy.scaleX = scaleX;
        let eS = enemy.addComponent('Enemy');
        enemy.parent = this.node;
        if (res == 0) {
            eS.setMoveSpeed(G.enemy0.speed);
        } else if (res == 1) {
            eS.setMoveSpeed(G.enemy1.speed);
        }
        // if(enemyType==0){//使生成的怪物随机它是否为特殊怪物
        eS.isSpecial = true;
        eS.swervePosX = swervePosX;
        // }
    },
    start() {
        this.spawTime = this.InitTime;
    },
    update(dt) {
        if (G.GameOver == false) {
            this.spawTime -= dt;
            if (this.spawTime <= 0) {
                var rand = Math.floor((Math.random() * 10) % 6);
                this.spawNewenemy(rand);
                this.spawTime = this.InitTime;
                console.log('生成怪物时间间隔：' + this.InitTime);
            }
        }
    },
});