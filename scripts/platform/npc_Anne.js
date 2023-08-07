
const State = {
    "right": 1,
    "left": 2,
}

cc.Class({
    extends: cc.Component,

    properties: {

    },

    onLoad() {

        this.sp = cc.v2(0, 0);
        this._speedX = 50;

        this.startPos = this.node.x;
        this.motionRange = 100;
        this.npcState = "left";

    },

    setMotion() {
        this.lv = this.getComponent(cc.RigidBody).linearVelocity;

        if(this.npcState == "right"){
            this.sp.x = 1;
            this.node.scaleX =  Math.abs(this.node.scaleX);
        }else if (this.npcState == "left"){
            this.sp.x = -1;
            this.node.scaleX =  -Math.abs(this.node.scaleX);
        }

        this.lv.x = this.sp.x * this._speedX;
        this.getComponent(cc.RigidBody).linearVelocity = this.lv;
    },

    update(dt) {

        if (this.node.x <= this.startPos-this.motionRange/2) {
            this.npcState = "right";
        }
        if (this.node.x >= this.startPos + this.motionRange/2) {
            this.npcState = "left";
        }

        this.setMotion();

    },

});
