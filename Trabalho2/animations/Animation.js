class Animation {
    constructor(scene) {
        this.scene = scene;

        this.instances = []; //stores the animation's instants
        this.translations = [];
        this.rotations = [];
        this.scale = [];

        this.animationMatrix = mat4.create();
        this.animationIndex = 0; // first animation

        this.firstTime; // time since animation started
    }

    apply() {
        this.scene.multMatrix(this.animationMatrix);
    }

    update(t){
        this.firstTime = this.firstTime || new Date().getTime();
        this.deltaT = (t - this.firstTime) / 1000;

        
    }
}
