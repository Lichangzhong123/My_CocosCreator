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
        head: {
            default: null,
            type: cc.Node
        }
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() { },

    start() {
        let num = Math.floor(G.Score / 100);
        this.aspeed = G.moveSpeed[num];
        this.isdei = false; //是否死亡
        //   this.isSpecial = false; //是否为特殊
        this.changeTime = 0; //变化时间
        this.isStartChange = false; //是否开始变化
        this.head = this.node.getChildByName('head');
        this.setBodyColor = 0;
        this.setCtime = 0;
        this.PosX = this.node.x;;//当前怪物所在的位置也就是在树的那一边0-5
    },
    setMoveSpeed(speed) {
        this.moveSpeed = speed;
    },
    die() {
        this.isdei = true;
        this.thdeied = false;
    },
    onBeginContact: function (contact, selfCollider, otherCollider) {
        if (otherCollider.node.name == 'Birds') {
            this.node.destroy();
            G.Score += 100;

        }
    },
    enemyRageChange() { //怪物愤怒状态变化
        let move = cc.moveBy(0.5, cc.v2(0, 50)).easing(cc.easeCubicActionInOut());
        this.node.runAction(move);
    },
    enemySwerveChange() {//怪物转向变换
        if (this.node.x == this.PosX) {
            this.node.x = this.swervePosX;
        } else {
            this.node.x = this.PosX;
        }
        this.node.scaleX = this.node.scaleX * -1;
    },
    update(dt) { //TODO:速度系数更改
        if (this.isdei && this.thdeied == false) { //怪物死亡
            let rgb = this.node.getComponent(cc.RigidBody);
            this.node.runAction(cc.rotateBy(10, 18000));
            rgb.applyLinearImpulse(cc.v2(0, -3000), rgb.getWorldCenter());
            this.scheduleOnce(() => {
                this.node.destroy();
            }, 5);
            this.thdeied = true;
        }
        if (G.GameOver == false && this.isdei == false) {
            if (G.isAddScore) {
                let num = Math.floor(G.Score / 100);
                if (G.moveSpeed[num] != null) {
                    this.aspeed = G.moveSpeed[num];
                    let EnemysSp = this.node.parent.getComponent('Enemys');
                    if (EnemysSp.InitTime >= 1) {
                        EnemysSp.InitTime = EnemysSp.InitTime - G.moveSpeed[num] / 6;
                    }
                }
                G.isAddScore = false;
            }
            let speed = this.moveSpeed * dt * this.aspeed;
            this.node.y += speed;
        }
        // if (this.isStartChange == true) {

        // }
        if (this.isSpecial == true) { //当此怪物为特殊怪物时
            this.changeTime += dt;
            if (this.changeTime >= 4) { //每两秒检测一次
                this.changeTime = 0;
                let numb = Math.floor(Math.random() * 10);
                if (numb <= 8) { //随机出现变化
                    this.setBodyColor = 5;
                    console.log("变化");
                }
            }
        }
        if (this.setBodyColor >= 0) { //设置颜色闪烁提示玩家怪物发生变化
            this.setCtime += dt;
            if (this.setCtime >= 0.3) {
                if (this.setBodyColor > 1) {
                    this.head.color = cc.Color.RED;
                } else {
                    this.head.color = cc.Color.WHITE;
                }
                this.setBodyColor -= 1;
                this.setCtime = 0;
                if (this.setBodyColor < 0) { //颜色变化后
                    // this.isStartChange = true; //开始变化
                    let num = Math.floor(Math.random() * 10 % 2);
                    if (num == 0) {
                        console.log("冲击");
                        this.enemyRageChange();
                    } else if (num == 1) {
                        console.log('转向');
                        this.enemySwerveChange();
                    }

                }
            }
        }
        if (this.node.y >= 420) { //走到顶部了
            this.node.destroy();
        }
    },
});