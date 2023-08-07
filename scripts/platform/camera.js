
cc.Class({
    extends: cc.Component,

    properties: {
        playerNode: cc.Node,
        backgroundNode: cc.Node,
    },

    update (dt) {
        this.playerPositionWindow = this.playerNode.convertToWorldSpaceAR(cc.v2(0,0));
        this.playerPositionCanvas = this.node.parent.convertToNodeSpaceAR(this.playerPositionWindow);
        if(this.playerPositionCanvas.x>4.756){
            this.node.x = this.playerPositionCanvas.x;
            this.backgroundNode.x = this.playerPositionCanvas.x;
        }
    },
});
