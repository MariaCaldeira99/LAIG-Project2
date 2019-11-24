class MySecurityCamera extends CGFobject{
    constructor(scene){
        super(scene);
        this.screen = new MyRectangle(scene,1, 0.5,-0.5,-1);

    }

    display(){
        this.scene.setActiveShader(this.scene.securityShader);
        this.scene.textureRTT.bind(0);
        this.screen.display();

        this.scene.setActiveShader(this.scene.defaultShader);
    }
}