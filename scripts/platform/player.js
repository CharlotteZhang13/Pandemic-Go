
const Input = {};
const State = {
    grounded: 1,
    laddered: 2,
    jump: 3,
    hurt: 4,
    dead: 5,
};

cc.Class({
    extends: cc.Component,

    properties: {
        tileMap: cc.TiledMap,
        bg: cc.Node,
        hpNode: cc.Node,
    },

    onLoad() {
        this.node.active = true;
        window.hp = 100;
        window.destroy = false;
        
                
        Input[cc.macro.KEY.right] = 0;
        Input[cc.macro.KEY.left] = 0;
        Input[cc.macro.KEY.up] = 0;
        Input[cc.macro.KEY.down] = 0;
        Input[cc.macro.KEY.a] = 0;
        Input[cc.macro.KEY.d] = 0;
        Input[cc.macro.KEY.w] = 0;
        Input[cc.macro.KEY.s] = 0;

        this.sp = cc.v2(0, 0);
        this._speedX = 100;
        this._speedY = 50;
        this._speedLadder = 25;
        this._speedJump = 200;//从梯子上加速跳跃到plank上的速度

        this.midAirTimer = 0; //计时player在平地上腾空跳跃的时间，从离地开始计时，触地时清零，防止腾空时竖直方向加速时间过长飞出屏幕
        this.ladderTimer = 0; //计时player在楼梯上呆的时间长，防止斜上方跳跃时在梯子上呆的时间太短一下子就掉下来

        this.midAirSpeedingInterval = 0.2; //水平地面上y方向腾空加速时间
        this.fallFromLadderInterval = 0.4; //在楼梯上一定要呆到的不能下落的时长
        this.landLadderSensorInterval = 500; // 落地0.5s之后才能开始重新监测楼梯，防止落地后极小量的反弹重新让player上楼梯
        this.jumpSpeedingInterval = 85;//从梯子上跳跃到plank上的加速时间

        this.ladderDisplacement = 50;//两个梯子之间的的最小距离

        this.aniState = "masked_idle";
        this.playerState = State.grounded;
        this.ladderSensor = true; //是否需要让player在检测到楼梯的时候挂在楼梯上
        this.lastLadder = 0;//记录上一次爬过的梯子的横坐标

        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeydown, this);
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.onKeyup, this);
    },

    onDestroy() {
        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_DOWN, this.onKeydown, this);
        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_UP, this.onKeyup, this);
    },

    onKeydown(e) {
        Input[e.keyCode] = 1;
    },

    onKeyup(e) {
        Input[e.keyCode] = 0;
    },

    onCollisionEnter(other, self) {

        //如果落到地面，或者在grounded的状态下落在平台上，调整一系列状态
        //if (other.node.group == "ground" || (this.playerState == State.grounded && other.node.group == "plank")) {
        if (other.node.group == "ground" || other.node.group == "plank") {

            this.initializeLanded();

        }

        //爬楼梯到头遇到plank，进行跳跃
        if (other.node.group == "plank" && this.playerState == State.laddered) {

            this.playerState = State.jump;

        }

        if (other.node.group == "npc" || other.node.group == "particle") {

            console.log("aaa");
            this.playerState = State.hurt;
            setTimeout(()=>{
                this.playerState = State.grounded;
            },1000);

            window.hp -= 40;
            
            if(window.hp <= 0){
                this.playerState = State.dead;
            }
            

        }

        if (other.node.group == "liquid") {

            this.playerState = State.dead;
        }

    },

    onCollisionStay(other, self) {

        if (other.node.group == "ladder") {

            //如果和ladder有重叠部分 + player在跳跃或者下落 + 此时需要监测到楼梯并让player挂上去时，切换state为laddered
            if (this.getComponent(cc.RigidBody).linearVelocity.y != 0 && this.ladderSensor) {
                this.initializeLadder(other);
            }

            //想要腾空从一个梯子落到另一个梯子上，但是由于没有碰到地面没有开启楼梯检测
            //因此如果检测到此时爬上的梯子和之前的梯子不是同一个梯子时，自动开启楼梯检测
            if (Math.abs(this.lastLadder - this.node.x) > this.ladderDisplacement) {
                this.ladderSensor = true;
            }
        }

        //gripLoss的碰撞快手动添加在所有的吊钩下面，使得人物触碰之后自动切换至grounded状态自由下落
        //必须是要player在下爬的时候才能生效，否则如果人物从地面起跳接触吊钩的时候没有挂上去就已经切换到grounded状态自由下落了
        if (other.node.group == "gripLoss" && this.getComponent(cc.RigidBody).linearVelocity.y < 0) {
            this.playerState = State.grounded;
        }

    },

    onCollisionExit(other, self) {

        //player爬出楼梯jump高过plank之后，把plank重新设置好物理碰撞，让player落在plank上
        //只有在State.jump的状态下player才有可能经过plank并exit
        if (other.node.group == "plank") {
            this.bg.getComponent("bg").enablePhysicsCollider("plank");
        }

    },

    playAnimation(aniName) {
        //只有要播放不一样的动画的时候才要播放
        if (this.aniState != aniName) {
            this.node.getComponent(cc.Animation).play(aniName);
            this.aniState = aniName;
        }
    },

    initializeLanded() {

        //this.playerState = State.grounded; 这句话好像。。目前留着没什么用？
        this.midAirTimer = 0; //腾空起跳的计时器清零，使得player可以再次跳跃
        setTimeout(() => {
            this.ladderSensor = true;
        }, this.landLadderSensorInterval); // 落地0.5s之后才能开始重新监测楼梯，防止落地后极小量的反弹重新让player上楼梯

    },

    setGroundedHorizontalMotion() {

        if (Input[cc.macro.KEY.left] || Input[cc.macro.KEY.a]) {

            this.sp.x = -1;
            this.node.scaleX = -Math.abs(this.node.scaleX);
            this.hpNode.scaleX = -Math.abs(this.hpNode.scaleX);

            //让player在跳跃的时候不能播放走动动画
            if (this.lv.y != 0) {
                if(this.playerState == State.hurt){
                    this.playAnimation("hurt_idle"); 
                }else{
                    this.playAnimation("masked_idle");
                }
            } else {
                if(this.playerState == State.hurt){
                    this.playAnimation("hurt_right"); 
                }else{
                    this.playAnimation("masked_right");
                }
            }

        } else if (Input[cc.macro.KEY.right] || Input[cc.macro.KEY.d]) {

            this.sp.x = 1;
            this.node.scaleX = Math.abs(this.node.scaleX);
            this.hpNode.scaleX = Math.abs(this.hpNode.scaleX);

            if (this.lv.y != 0) {
                if(this.playerState == State.hurt){
                    this.playAnimation("hurt_idle"); 
                }else{
                    this.playAnimation("masked_idle");
                }
            } else {
                if(this.playerState == State.hurt){
                    this.playAnimation("hurt_right"); 
                }else{
                    this.playAnimation("masked_right");
                }
            }

        } else {
            this.sp.x = 0;
            if(this.playerState == State.hurt){
                this.playAnimation("hurt_idle"); 
            }else{
                this.playAnimation("masked_idle");
            }
        }

        //speed calculation
        this.lv.x = this.sp.x * this._speedX;

    },

    setGroundedVerticalMotion(dt) {

        this.getComponent(cc.RigidBody).gravityScale = 1; //把在梯子上取消的重力重新设置回来

        if (Input[cc.macro.KEY.up] || Input[cc.macro.KEY.w]) {
            // jump Timer是为了不让人物跳太高，因此预先设置好y速度不为0的时长midAirSpeedingInterval
            // 时长midAirSpeedingInterval到了之后就不再设置y速度了，让他自由下落，之后碰到地面之后才会开启时长
            if (this.midAirTimer < this.midAirSpeedingInterval) {
                this.midAirTimer += dt;
                this.lv.y = this._speedY;
            }
        }


    },

    setGroundedMotion(dt) {

        this.lv = this.getComponent(cc.RigidBody).linearVelocity;
        this.setGroundedHorizontalMotion();
        this.setGroundedVerticalMotion(dt);
        this.getComponent(cc.RigidBody).linearVelocity = this.lv;
  
    },

    initializeLadder(other) {

        this.playerState = State.laddered;
        this.ladderTimer = 0;//player呆在楼梯上的计时清零        
        this.ladderSensor = false;//在楼梯上了就停止监测，直到落地之后或落到其他楼梯上再激活
        this.lastLadder = this.node.x;//更新楼梯坐标

        //initial ladder motion
        this.getComponent(cc.RigidBody).gravityScale = 0;
        this.node.x = 2 * other.node.x - 463;//把人物水平位置移到梯子中间
        this.lv = this.getComponent(cc.RigidBody).linearVelocity;
        this.lv.x = 0;
        this.lv.y = 0;
        this.getComponent(cc.RigidBody).linearVelocity = this.lv;

        this.playAnimation("masked_up_idle");

    },

    setLadderMotion() {

        this.lv = this.getComponent(cc.RigidBody).linearVelocity;

        if (Input[cc.macro.KEY.up] || Input[cc.macro.KEY.w]) {
            this.sp.y = 1;
            this.playAnimation("masked_up");
        } else if (Input[cc.macro.KEY.down] || Input[cc.macro.KEY.s]) {
            this.sp.y = -1;
            this.playAnimation("masked_up");
        } else {
            this.sp.y = 0;
            this.playAnimation("masked_up_idle");
        }

        //speed calculation
        this.lv.y = this.sp.y * this._speedLadder;
        this.getComponent(cc.RigidBody).linearVelocity = this.lv;

    },

    fallFromLadder(dt) {

        this.ladderTimer += dt;

        if (this.ladderTimer > this.fallFromLadderInterval) {

            //在楼梯上呆了fallFromLadderInterval的时间间隔之后才可以开始掉落
            //否则如果player跳跃的时候有水平速度的话就直接经过梯子跳走了
            if (Input[cc.macro.KEY.left] || Input[cc.macro.KEY.a] || Input[cc.macro.KEY.right] || Input[cc.macro.KEY.d]) {

                //只要有水平移动倾向就切换至grounded状态，让player自由下落
                this.playerState = State.grounded;

            }
        }

    },

    setJumpMotion() {

        //把plank的物理碰撞去掉，这样player可以跃过plank
        this.bg.getComponent("bg").disablePhysicsCollider("plank")

        this.lv = this.getComponent(cc.RigidBody).linearVelocity;
        this.lv.y = this._speedJump;
        this.getComponent(cc.RigidBody).linearVelocity = this.lv;

        //加速一定时间后player改变为grounded状态自由下落
        setTimeout(() => {
            this.playerState = State.grounded;
            this.midAirTimer = this.midAirSpeedingInterval;//防止jump完毕切换至grounded状态时还能y方向加速跳的太高
        }, this.jumpSpeedingInterval);

    },

    update(dt) {

        if (this.playerState == State.grounded || this.playerState == State.hurt) {

            this.setGroundedMotion(dt);

        } else if (this.playerState == State.laddered) {

            this.setLadderMotion();
            this.fallFromLadder(dt);

        } else if (this.playerState == State.jump) {

            this.setJumpMotion();

        } else if (this.playerState == State.dead){

            /*
            if(!window.destroy){
                window.destroy = true;
            }*/
            this.node.active = false;
            cc.director.loadScene("startOverScene");

        }

    }

}

);