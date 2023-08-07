
cc.Class({
    extends: cc.Component,

    properties: {

    },

    onLoad () {
        this. tt = 0;
    },

/*
    update (dt) {
        this.tt += dt;
        if(this.tt > 1){
            this.getComponent(cc.RigidBody).linearVelocity = cc.v2(-200 + Math.random()*400, -200 + Math.random()*400);
            this.tt = 0;
        }
    },
*/
    update (dt) {
        this.tt += dt;
        if(this.tt > 1){

            this.getComponent(cc.RigidBody).linearVelocity = cc.v2(-200 + Math.random()*400, -200 + Math.random()*400);
            this.tt = 0;
            
        }
    },

});
