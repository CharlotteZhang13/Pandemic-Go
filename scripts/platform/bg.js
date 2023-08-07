
cc.Class({
    extends: cc.Component,

    properties: {
        mapNode: cc.Node,
    },

    setPhysicsCollider(tileLayerName, colliderGroupName) {

        let tileLayer = this.tiledMap.getLayer(tileLayerName);
        let layerSize = tileLayer.getLayerSize();

        for (let i = 0; i < layerSize.width; i++) {
            for (let j = 0; j < layerSize.height; j++) {

                let tiled = tileLayer.getTiledTileAt(i, j, true);

                if (tiled.gid != 0) {
                    tiled.node.group = colliderGroupName;
                    let body = tiled.node.addComponent(cc.RigidBody);
                    body.type = cc.RigidBodyType.Static;
                    let collider = tiled.node.addComponent(cc.PhysicsBoxCollider);
                    collider.offset = cc.v2(this.tiledSize.width/2, this.tiledSize.height/2);
                    collider.size = this.tiledSize;
                    collider.apply();
                }

            }
        }
    },

    disablePhysicsCollider(tileLayerName) {

        let tileLayer = this.tiledMap.getLayer(tileLayerName);
        let layerSize = tileLayer.getLayerSize();

        for (let i = 0; i < layerSize.width; i++) {
            for (let j = 0; j < layerSize.height; j++) {

                let tiled = tileLayer.getTiledTileAt(i, j, true);

                if (tiled.gid != 0) {
                    let collider = tiled.node.getComponent(cc.PhysicsBoxCollider);
                    collider.enabled = false;
                }

            }
        }
    },

    enablePhysicsCollider(tileLayerName) {

        let tileLayer = this.tiledMap.getLayer(tileLayerName);
        let layerSize = tileLayer.getLayerSize();

        for (let i = 0; i < layerSize.width; i++) {
            for (let j = 0; j < layerSize.height; j++) {

                let tiled = tileLayer.getTiledTileAt(i, j, true);

                if (tiled.gid != 0) {
                    let collider = tiled.node.getComponent(cc.PhysicsBoxCollider);
                    collider.enabled = true;
                }

            }
        }
    },

    setCollider(tileLayerName, colliderGroupName) {

        let tileLayer = this.tiledMap.getLayer(tileLayerName);
        let layerSize = tileLayer.getLayerSize();

        for (let i = 0; i < layerSize.width; i++) {
            for (let j = 0; j < layerSize.height; j++) {

                let tiled = tileLayer.getTiledTileAt(i, j, true);

                if (tiled.gid != 0) {
                    tiled.node.group = colliderGroupName;
                    let collider = tiled.node.addComponent(cc.BoxCollider);
                    collider.offset =  cc.v2(this.tiledSize.width/2, this.tiledSize.height/2);;
                    collider.size = this.tiledSize;
                }

            }
        }
    },

    initMapNode(mapNode) {
        this.tiledMap = mapNode.getComponent(cc.TiledMap);
        this.tiledSize = this.tiledMap.getTileSize();

        this.setPhysicsCollider("ground", "ground");
        this.setCollider("ground", "ground");
        this.setCollider("ladder", "ladder");
        this.setPhysicsCollider("plank", "plank");
        this.setCollider("plank", "plank");
        this.setCollider("liquid", "liquid");

    },

    onLoad() {
        cc.director.getPhysicsManager().enabled = true;
        cc.director.getCollisionManager().enabled = true;

        this.initMapNode(this.mapNode);
    },

});