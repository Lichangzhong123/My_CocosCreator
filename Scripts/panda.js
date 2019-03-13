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
        body: { //身体节点
            default: null,
            type: cc.Node
        },
        head: { //头节点
            default: null,
            type: cc.Node
        },
        energyValue: { //能量条节点
            default: null,
            type: cc.ProgressBar
        },
        inform: { //信息通知节点
            default: null,
            type: cc.Node
        },
        informLN: { //信息通知的内容
            default: null,
            type: cc.Node
        },
        keyaUp: {
            default: null,
            type: cc.Button
        },
        keyaDown: {
            default: null,
            type: cc.Button
        },
        keyaLeft: {
            default: null,
            type: cc.Button
        },
        keyaRight: {
            default: null,
            type: cc.Button
        },
        keyaAttack: {
            default: null,
            type: cc.Button
        },
        moveBgm: { //移动音效
            default: null,
            type: cc.AudioClip
        },
        attackBgm: { //攻击音效
            default: null,
            type: cc.AudioClip
        },
        enemyDeiBgm: { //怪物死亡音效
            default: null,
            type: cc.AudioClip
        },
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        var self = this;
        cc.director.getPhysicsManager().enabled = true;
        cc.loader.loadResDir('textures/panda', cc.SpriteFrame, function (err, assets, urls) {
            self.spriteFrames = assets; //加载panda图片
        });
    },
    start() {
        this.direction = false; //true=右边，false=左边
        this.isAttack = false; //是攻击状态
        this.reMove = false; //是否移动中
        this.recoverTime = 0; //记能量时间
        this.setBodyColor = 0; //设置颜色闪烁次数
        this.getTo = false; //是否到达
        this.moveAudio = null; //移动的音效
        this.isPlayMBG = false; //是否在播放移动音效
        this.isOnKeyDown = false; //是否有键被按下
        this.keyis = ''; //是个什么键
        this.informLabel = this.informLN.getComponent(cc.Label);
        this.startPos = cc.v2(0, 0);
        this.isAttackKeyDown = false; //攻击键是否被按下
        this.isAsthnia = false; //是否为虚弱状态
        this.distance = 0; //攻击距离
        this.isAttackKey = false; //是攻击键

        this.keyaUp.node.on(cc.Node.EventType.TOUCH_START, () => {
            this.isOnKeyDown = true;
            this.keyis = 'w';
        });
        this.keyaDown.node.on(cc.Node.EventType.TOUCH_START, () => {
            this.isOnKeyDown = true;
            this.keyis = 's';
        });
        this.keyaLeft.node.on(cc.Node.EventType.TOUCH_START, () => {
            this.onKeyDown('a');
        });
        this.keyaRight.node.on(cc.Node.EventType.TOUCH_START, () => {
            this.onKeyDown('d');
        });
        this.keyaAttack.node.on(cc.Node.EventType.TOUCH_START, () => {
            console.log("攻击键按下");
            if (this.isAsthnia == false) {
                this.isAttackKeyDown = true;
            }
            this.isAttackKey = true;
        });

        this.keyaAttack.node.on(cc.Node.EventType.TOUCH_END, () => {
            //this.onKeyDown('j');
            console.log("攻击键放开");
            this.isAttackKeyDown = false;
            // this.scheduleOnce(() => {
            //     this.isAttackKey = false;
            // }, 1);
        });

        this.keyaUp.node.on(cc.Node.EventType.TOUCH_END, () => {
            this.isOnKeyDown = false;
            this.keyis = '';
        });
        this.keyaDown.node.on(cc.Node.EventType.TOUCH_END, () => {
            this.isOnKeyDown = false;
            this.keyis = '';
        });
    },
    // onDestroy() {
    //     cc.systemEvent.off(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
    //     cc.systemEvent.off(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
    // },
    onKeyAD(comekey) {
        if (comekey == this.direction) {
            if (comekey) {
                this.lsOtMove(500);
            } else {
                this.lsOtMove(-500);
            }
            this.reMove = true;
            this.node.getComponent(cc.Animation).stop('climbTreeUp');
        } else {
            var posX = this.node.x;
            this.node.x = posX * -1;
            this.node.scaleX = this.node.scaleX * -1;
            this.direction = !this.direction;
        }
    },
    onBeginContact: function (contact, selfCollider, otherCollider) {
        if (otherCollider.node.parent.name == 'enemys') {
            let enemyScript = otherCollider.node.getComponent('Enemy');
            cc.audioEngine.playEffect(this.enemyDeiBgm, false); //播放音效
            if (this.isAttack && enemyScript.isdei == false) {
                if (otherCollider.node.name == G.enemy0.name) {
                    G.Score += G.enemy0.value;
                } else if (otherCollider.node.name == G.enemy1.name) {
                    G.Score += G.enemy1.value;
                }
                enemyScript.die();
            } else if (enemyScript.isdei == false) {
                G.GameOver = true;
            }
        } else if (otherCollider.node.name == G.prop0.name) { //碰撞的是道具时
            //     //otherCollider.node.active=false;
            otherCollider.node.destroy();
        } else if (selfCollider.node.parent.name != otherCollider.node.name) { //碰撞的是其它树时 
            this.node.getComponent(cc.RigidBody).linearVelocity = cc.v2(0, 0);
            selfCollider.node.parent = otherCollider.node;
            this.setpanderScrite('body1', 'normalHead');
            this.direction = !this.direction;
            this.getTo = true;
            this.reMove = false;
        }
    },
    onLeft() { //向左
        if (this.node.parent.name == 'tree1' && this.direction == false) {
            return;
        }
        this.onKeyAD(false);
    },
    onRight() { //向右
        if (this.node.parent.name == 'tree3' && this.direction == true) {
            return;
        }
        this.onKeyAD(true);
    },
    onUp() { //向上
        if (this.node.y >= 310) {
            this.informLabel.string = '禁止上天！';
            this.inform.active = true;
            return;
        }
        if (!this.isPlayMBG) {
            this.isPlayMBG = true;
            this.moveAudio = cc.audioEngine.playEffect(this.moveBgm, false);
            cc.audioEngine.setFinishCallback(this.moveAudio, () => {
                this.isPlayMBG = false;
            });
        }
        this.node.runAction(this.lengthwaysMove(false, 5, 0.1));
    },
    onDown() { //向下
        if (this.node.y < -430) {
            this.informLabel.string = '下地不行！';
            this.inform.active = true;
            return;
        }
        if (!this.isPlayMBG) {
            this.isPlayMBG = true;
            this.moveAudio = cc.audioEngine.playEffect(this.moveBgm, false);
            cc.audioEngine.setFinishCallback(this.moveAudio, () => {
                this.isPlayMBG = false;
            });
        }
        this.node.runAction(this.lengthwaysMove(false, -5, 0.1));
    },
    onPrepareAttack(updateDt) { //准备攻击
        // if (this.energyValue.progress < 0.01 || this.node.y < -410) {
        //     this.setBodyColor = 5;
        //     this.setCtime = 1;
        //     if (this.node.y < -410) {
        //         this.informLabel.string = '下面不行！';
        //         this.inform.active = true;
        //         return;
        //     } else {
        //         this.informLabel.string = '虚了老铁！';
        //         this.inform.active = true;
        //         this.isAttackKeyDown = false;
        //     }
        // } else {
        var progressNum = this.energyValue.progress * 100;
        this.distance += 15 * updateDt;
        this.energyValue.progress = (progressNum - 10 * updateDt) / 100;
        // }
    },
    onStartAttack() { //开始攻击
        this.node.stopAllActions();
        cc.audioEngine.play(this.attackBgm, false, 1);
        this.node.runAction(this.lengthwaysMove(true, -(10 + this.distance), 0.3));
        this.distance = 0;
        this.isAttackKey = false;
    },

    onKeyDown(event) {
        if (this.isReMove()) {
            this.informPos();
            switch (event) {
                case 'a': //左
                    this.onLeft();
                    break;
                case 'd': //右
                    this.onRight();
                    break;
                case 'w': //上
                    this.onUp();
                    break;
                case 's': //下
                    this.onDown();
                    break;
                case 'j': //攻击
                    // this.onAttack();
                    break;
            }
            this.informFunction();
        }
    },
    isReMove() {
        if (this.reMove || this.isAttack || G.GameOver) {
            return false;
        } else {
            return true;
        }
    },
    informPos() {

        if (this.direction) {
            this.informLN.scaleX = 1;
            this.informLN.x = -5;
        } else {
            this.informLN.scaleX = -1;
            this.informLN.x = 55;
        }
    },
    informFunction() {
        if (this.inform.active == true) //提示节点的隐藏)
        {
            this.scheduleOnce(() => { //延时调用方法
                this.inform.active = false;
            }, 1);
        }
    },
    onKeyUp(event) {
        switch (event.keyCode) {
            case cc.macro.KEY.a: //左

                break;
            case cc.macro.KEY.d: //右

                break;
            case cc.macro.KEY.w: //上

                break;
            case cc.macro.KEY.s: //下

                break;
        }
    },
    changeColor(self, string) { //修改颜色
        if (string == 'red') {
            self.color = cc.Color.RED;
        } else if (string == 'white') {
            self.color = cc.Color.WHITE;
        } else if (string == 'green') {
            self.color = cc.Color.GREEN;
        } else if (string == 'blue') {
            self.color = cc.Color.BLUE;
        }
    },
    lengthwaysMove(Attack, y, time) { //使熊猫Y方向移动
        if (y > 0) { //向上
            var palyAnim = cc.callFunc(() => {
                this.node.getComponent(cc.Animation).play('climbTreeUp');
            });
        } else if (y < 0) { //向下
            if (Attack) { //攻击状态
                var palyAnim = cc.callFunc(() => {
                    this.node.getComponent(cc.Animation).play('climbTreeDown');
                });
            } else { //普通状态
                var palyAnim = cc.callFunc(() => {
                    this.node.getComponent(cc.Animation).play('climbTreeUp');
                });
            }
        }
        let spawn = cc.spawn(cc.moveBy(time, cc.v2(0, y)), palyAnim);
        return spawn;
    },
    lsOtMove(x) { //给熊猫施加一个X方向的力
        let rgb = this.node.getComponent(cc.RigidBody);
        rgb.linearVelocity = cc.v2(0, 0);
        this.setpanderScrite('dieBody', 'winHead');
        rgb.applyLinearImpulse(cc.v2(x, 0), rgb.getWorldCenter());
    },
    setpanderScrite(bodyname, headname) { //设置熊猫当前身体与头的图片
        let bodySprite = this.body.getComponent(cc.Sprite);
        let headSprite = this.head.getComponent(cc.Sprite);
        bodySprite.spriteFrame = this.getSpiteFrameByname(bodyname);
        headSprite.spriteFrame = this.getSpiteFrameByname(headname);
    },
    getSpiteFrameByname(name) { //按名字取得图片
        for (let i = 0; i < this.spriteFrames.length; i++) {
            if (this.spriteFrames[i].name == name) {
                return this.spriteFrames[i];
            }
        }
        return null;
    },
    climbTreeStart(isStart) { //接受head动画的帧事件
        let sprite = this.head.getComponent(cc.Sprite);
        if (isStart && this.getSpiteFrameByname('moveHead') != null) {
            sprite.spriteFrame = this.getSpiteFrameByname('moveHead');
        } else if (this.getSpiteFrameByname('normalHead') != null) {
            sprite.spriteFrame = this.getSpiteFrameByname('normalHead');
        }
        this.isAttack = isStart;
    },
    update(dt) {
        this.updateDt = dt;
        if (this.isOnKeyDown && this.keyis != '') {
            this.onKeyDown(this.keyis);
        }
        if (this.energyValue.progress < 0.01 || this.node.y < -410) {
            this.node.stopAllActions();
            this.setBodyColor = 5;
            this.setCtime = 1;
            if (this.node.y < -410) {
                this.informLabel.string = '下面不行！';
                this.inform.active = true;
                this.node.y = -410;
                return;
            } else {
                this.informLabel.string = '虚了老铁！';
                this.inform.active = true;
                this.isAttackKeyDown = false;
            }
        } else if (this.isAttackKeyDown == true) {
            this.onPrepareAttack(dt);
        } else if (this.isAttackKey == true) {
            this.onStartAttack();
        }
        if (this.setBodyColor > 0) { //设置body颜色闪烁
            this.setCtime += dt;
            if (this.setCtime >= 0.3) {
                if (this.setBodyColor % 2 == 1) {
                    this.changeColor(this.body, 'red');
                } else {
                    this.changeColor(this.body, 'white');
                }
                this.setBodyColor -= 1;
                this.setCtime = 0;
            }
        }
        this.recoverTime += dt; //能量条的回复
        if (!this.isAttack && this.energyValue.progress < 1 && this.recoverTime >= 0.2 && this.isAttackKeyDown == false) {
            this.energyValue.progress += 0.02;
            if (this.energyValue.progress > 1) {
                this.energyValue.progress = 1;
            }
            this.recoverTime = 0;
        }
        if (this.getTo) { //设置自己相对于父节点的初始化坐标
            var posy = this.node.y;
            if (this.direction) {
                this.node.scaleX = 1;
                this.node.position = cc.v2(28, posy);
            } else {
                this.node.scaleX = -1;
                this.node.position = cc.v2(-28, posy);
            }
            this.getTo = false;
        }
    },
});