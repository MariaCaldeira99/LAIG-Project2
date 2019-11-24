class KeyframeAnimation extends Animation{
    constructor(scene){
        super(scene);

        this.instances = []; // [1, 2]
        this.translations = [];
        this.rotations=[];
        this.scale = [];

        this.animationMatrix;

        this.previousAnimationIndex = 0; // first animation

        this.firstTime; // time since animation started
        this.deltaTime;
    }

    update() {
        this.firstTime = this.firstTime || new Date().getTime();
        var currentDate = new Date();
        var currentTime = currentDate.getTime();
        this.deltaTime = (currentTime - this.firstTime) / 1000;

        // update animation index
        if (this.deltaTime > this.instances[this.previousAnimationIndex + 1]) {
            this.previousAnimationIndex++;
        }
        // 
        if (this.deltaTime <= this.instances[this.instances.length - 1]) {
            
            var intervaloTempo = this.instances[this.previousAnimationIndex+1] - this.instances[this.previousAnimationIndex];
            var fator = (this.deltaTime - this.instances[this.previousAnimationIndex])/intervaloTempo;
            
            this.animationMatrix = mat4.create();
            // translation
            // matrix anterior e seguinte
            var previousAnimationTranslation = this.translations[this.previousAnimationIndex];
            var nextAnimationTranslation = this.translations[this.previousAnimationIndex + 1];
            var periodicTranslation = this.subtactArrays(previousAnimationTranslation,nextAnimationTranslation);
            periodicTranslation = this.multiplyArray(periodicTranslation, fator);
            periodicTranslation = this.sumArrays(periodicTranslation, previousAnimationTranslation);
            this.animationMatrix = mat4.translate(this.animationMatrix, this.animationMatrix, periodicTranslation);
        }
        else {
            this.animationMatrix = mat4.create();
            this.animationMatrix = mat4.translate(this.animationMatrix, this.animationMatrix, this.translations[this.translations.length - 1]);
            debugger;
        }
    }

    apply() {
        this.scene.multMatrix(this.animationMatrix);
    }

    subtactArrays(A1,A2){
        var finalArray = [];
        for(let i = 0; i < A1.length; i++){
            finalArray.push(A2[i] - A1[i]);
        }
        return finalArray;
    }

    multiplyArray(Array1,fator){
        var finalArray = [];
        for(var i = 0; i < Array1.length; i++){
            finalArray.push(Array1[i]*fator);
        }
        return finalArray;
    }

    sumArrays(A1,A2){
        var finalArray = [];
        for(let i = 0; i < A1.length; i++){
            finalArray.push(A2[i] + A1[i]);
        }
        return finalArray;
    }

    /*
    createAnimation(){
        let mat = mat4.create();
        mat4.translate(mat,mat,vec3.fromValues(this.xtran,this.ytran,this.ztran));

        if(this.xrot != 0){
            mat4.rotate(mat,mat,this.xrot * DEGREE_TO_RAD,vec3.fromValues(1,0,0));
        }
        if(this.yrot != 0){
            mat4.rotate(mat,mat,this.yrot * DEGREE_TO_RAD,vec3.fromValues(0,1,0));
        }
        if(this.zrot != 0){
            mat4.rotate(mat,mat,this.zrot * DEGREE_TO_RAD,vec3.fromValues(0,0,1));
        }

        mat4.scale(mat,mat,vec3.fromValues(this.xsca,this.ysca,this.zsca));
        
        this.matrix = mat;
    }
    */
}