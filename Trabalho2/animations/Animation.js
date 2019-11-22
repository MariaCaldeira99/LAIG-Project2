class Animation{
    constructor(scene, id){
        this.scene = scene;
        this.id = id;
        this.previousTime = 0;
        this.matrix = mat4.create();
    }

    update(time) {

        this.deltatime = time - this.previousTime;
        this.previousTime = time;
    }

    apply(){
        this.scene.multMatrix(this.matrix);
    }
}