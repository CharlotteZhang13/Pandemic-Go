
cc.Class({
    extends: cc.Component,

    properties: {

    },

    onLoad () {
        this.spriteComp = this.node.getComponent(cc.Sprite);
    },

    update (dt) {

        if(window.hp == 100){
            cc.loader.loadRes("platform/kenney_rpgurbanpack/Tiles/player/hp_01", cc.SpriteFrame, (err,texture)=>{
                this.spriteComp.spriteFrame = texture;
            });
        }

        if(window.hp == 60){
            cc.loader.loadRes("platform/kenney_rpgurbanpack/Tiles/player/hp_02", cc.SpriteFrame,(err,texture)=>{
                this.spriteComp.spriteFrame = texture;
            });
        }

        if(window.hp == 20){
            cc.loader.loadRes("platform/kenney_rpgurbanpack/Tiles/player/hp_03", cc.SpriteFrame,(err,texture)=>{
                this.spriteComp.spriteFrame = texture;
            });
        }

    },

});
