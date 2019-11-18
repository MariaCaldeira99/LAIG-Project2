class Animation{
    /**
     * @constructor
     */
    constructor(scene, id, time){
        this.scene = scene;
        this.id = id;
        this.time = time;
        this.matrix = mat4.create();
    }

    apply(){
        this.scene.multMatrix(this.matrix);
    }
}