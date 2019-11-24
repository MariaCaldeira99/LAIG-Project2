class KeyframeAnimation extends Animation{
    constructor(scene){
        super(scene);

        this.instances = []; // Array with all instants
        this.translations = []; //Array with all translations
        this.rotations=[]; //Array with all rotations
        this.scale = []; //Array with all scales

        this.animationMatrix;

        this.previousAnimationIndex = 0; // first animation

        this.firstTime; // time since animation started
        this.deltaTime; //current time - time since animation started
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

            //Subtração entre a matrix seguinte e a anterior de forma a obter o array com a diferença entre as duas
            var periodicTranslation = this.subtractArrays(previousAnimationTranslation,nextAnimationTranslation);
            //Multiplicar o array obtido anteriormente pelo fator, para obter a percentagem 
            periodicTranslation = this.multiplyArray(periodicTranslation, fator);
            //Soma entre o array obtido anteriormente e a matrix anterior
            periodicTranslation = this.sumArrays(periodicTranslation, previousAnimationTranslation);
            this.animationMatrix = mat4.translate(this.animationMatrix, this.animationMatrix, periodicTranslation);

            //rotation
            // matrix anterior e seguinte
            var previousAnimationRotation = this.rotations[this.previousAnimationIndex];
            var nextAnimationRotation = this.rotations[this.previousAnimationIndex + 1];
            //Subtração entre a matrix seguinte e a anterior de forma a obter o array com a diferença entre as duas
            var periodicRotation = this.subtractArrays(previousAnimationRotation,nextAnimationRotation);
            //Multiplicar o array obtido anteriormente pelo fator, para obter a percentagem 
            periodicRotation = this.multiplyArray(periodicRotation, fator);
            //Soma entre o array obtido anteriormente e a matrix anterior
            periodicRotation = this.sumArrays(periodicRotation, previousAnimationRotation);
            this.animationMatrix = mat4.rotateX(this.animationMatrix,this.animationMatrix, periodicRotation[0]*DEGREE_TO_RAD);
            this.animationMatrix = mat4.rotateY(this.animationMatrix,this.animationMatrix, periodicRotation[1]*DEGREE_TO_RAD);
            this.animationMatrix = mat4.rotateZ(this.animationMatrix,this.animationMatrix, periodicRotation[2]*DEGREE_TO_RAD);

            //scale
            // matrix anterior e seguinte
            var previousAnimationScale = this.scale[this.previousAnimationIndex];
            var nextAnimationScale = this.scale[this.previousAnimationIndex + 1];
            //Multiplica matrix anterior e seguinte
            var periodicScale = this.multiplyArrays(previousAnimationScale,nextAnimationScale);
            //Multiplica array obtido anteriorment e multiplica-o pelo fator
            periodicScale = this.multiplyArray(periodicScale, fator);
            this.animationMatrix = mat4.scale(this.animationMatrix,this.animationMatrix, periodicScale);
        }
        else {
            this.animationMatrix = mat4.create();
            this.animationMatrix = mat4.translate(this.animationMatrix, this.animationMatrix, this.translations[this.translations.length - 1]);
            this.animationMatrix = mat4.rotateX(this.animationMatrix,this.animationMatrix, this.rotations[this.rotations.length -1][0]*DEGREE_TO_RAD);
            this.animationMatrix = mat4.rotateY(this.animationMatrix,this.animationMatrix, this.rotations[this.rotations.length -1][1]*DEGREE_TO_RAD);
            this.animationMatrix = mat4.rotateZ(this.animationMatrix,this.animationMatrix, this.rotations[this.rotations.length -1][2]*DEGREE_TO_RAD);
            this.animationMatrix = mat4.scale(this.animationMatrix,this.animationMatrix, this.scale[this.scale.length -1]);
        }
    }

    apply() {
        this.scene.multMatrix(this.animationMatrix);
    }

    subtractArrays(A1,A2){
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

    multiplyArrays(Array1,Array2){
        var finalArray = [];
        for(var i = 0; i < Array1.length; i++){
            finalArray.push(Array1[i]*Array2[i]);
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