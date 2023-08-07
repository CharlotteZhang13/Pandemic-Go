
cc.Class({
    extends: cc.Component,

    properties: {
        
    },

    onLoad () {
        this.judgeMouseMove = false;
        this.judgeMouseDown = false;

        this.node.on(cc.Node.EventType.MOUSE_MOVE, this.onMouseMove, this);
        this.node.on(cc.Node.EventType.MOUSE_LEAVE, this.onMouseLeave, this);
        this.node.on(cc.Node.EventType.MOUSE_DOWN, this.onMouseDown, this);

    },

    onDestroy(){
        this.node.off(cc.Node.EventType.MOUSE_MOVE, this.onMouseMove, this);
        this.node.off(cc.Node.EventType.MOUSE_LEAVE, this.onMouseLeave, this);
        this.node.off(cc.Node.EventType.MOUSE_DOWN, this.onMouseDown, this);
    },

    onMouseMove(){
        this.judgeMouseMove = true;
    },

    onMouseLeave(){
        this.judgeMouseMove = false;
    },

    onMouseDown(){
        this.judgeMouseDown = true;
    },

    onMouseUp(){
        this.judgeMouseDown = false;
    },

    update (dt) {
    
        if(this.judgeMouseMove){
            this.node.scaleX = 1.1;
            this.node.scaleY= 1.1;
        }else{
            this.node.scaleX = 1;
            this.node.scaleY= 1;
        }

        if(this.judgeMouseDown){
            cc.director.loadScene("platformScene");
        }

    },

});
