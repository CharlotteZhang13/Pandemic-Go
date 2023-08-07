
cc.Class({
    extends: cc.Component,

    properties: {

    },

    onLoad () {},

    update (dt) {

        if(window.destroy){
            setTimeout(()=>{
                cc.director.loadScene("startOverScene");
            },2000);
            this.node.active = false;
        }

    },
});
