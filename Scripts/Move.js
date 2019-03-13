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
        // foo: {
        //     // ATTRIBUTES:
        //     default: null,        // The default value will be used only when the component attaching
        //                           // to a node for the first time
        //     type: cc.SpriteFrame, // optional, default is typeof default
        //     serializable: true,   // optional, default is true
        // },
        // bar: {
        //     get () {
        //         return this._bar;
        //     },
        //     set (value) {
        //         this._bar = value;
        //     }
        // },
        panda:{
            type:cc.Node,
            default:null,
        },

       
    },

    // LIFE-CYCLE CALLBACKS:

     onLoad () {
         this.node.on('touchstart',this.onEventStart,this);
         this.node.on('touchmove',this.onEventMove,this);
         this.node.on('touchend',this.onEventEnd,this);
         this.node.on('touchcancel',this.onEventCancel,this);

         this.startPoint;
         this.endPoint;

     },
     onEventStart(event){
         this.startPoint =event.getLocation();

         //console.log(wordPoint);
        // console.log( this.startPoint);

     },
     onEventMove(event){

        let wordPoint =event.getLocation();
         //console.log(wordPoint);
     },
     onEventEnd(event){
        this.endPoint =event.getLocation();

        // if(this.startPoint.x-this.endPoint.x<50)
        // {
        //     this.panda.getComponent('panda').onRight();
        // }
        //  if(this.startPoint.x-this.endPoint.x>50)
        // {
        //     this.panda.getComponent('panda').onLeft();
        // }
        // if(this.startPoint.y-this.endPoint.y<0)
        // {
        //     this.panda.getComponent('panda').onUp();
        // }
        //  if(this.startPoint.y-this.endPoint.y>0)
        // {
        //     this.panda.getComponent('panda').onDown();
        // }
        // if(this.startPoint-this.endPoint==0)
        // {
        //     this.panda.getComponent('panda').onAttack();
        // }
        if(this.startPoint.x-this.endPoint.x>20)
        {
            this.panda.getComponent('panda').onLeft();
        }else if(this.endPoint.x-this.startPoint.x>20){
            this.panda.getComponent('panda').onRight();
        }else if(this.endPoint.y-this.startPoint.y>20){
            this.panda.getComponent('panda').onUp();
        }else if(this.startPoint.y-this.endPoint.y>20){
            this.panda.getComponent('panda').onDown();
        }
        
        console.log( this.endPoint);

     },
     onEventCancel(event){
        let wordPoint =event.getLocation();
        //console.log(wordPoint);

     },

    start () {

    },

    // update (dt) {},
});
