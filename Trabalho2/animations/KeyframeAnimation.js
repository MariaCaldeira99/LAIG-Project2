class KeyframeAnimation extends Animation{
    constructor(scene){
        super(scene);

        this.instances = []; // Array with all instants
        this.translations = []; //Array with all translations
        this.rotations=[]; //Array with all rotations
        this.scale = []; //Array with all scales

        this.animationMatrix = mat4.create();
        this.animationIndex = 0; // first animation

        this.firstTime; // time since animation started
        this.deltaTime; //current time - time since animation started
    }

    update(t) {
        this.firstTime = this.firstTime || new Date().getTime();
        this.deltaT = (t - this.firstTime) / 1000;
        
        if(this.deltaT < this.instances[0])
            return;

        // update animation index
        if (this.deltaT > this.instances[this.animationIndex + 1]) {
            this.animationIndex++;
        }
         
        if (this.deltaT <= this.instances[this.instances.length - 1]) {
            
            var intervaloTempo = this.instances[this.animationIndex+1] - this.instances[this.animationIndex];
            var factor = (this.deltaT - this.instances[this.animationIndex])/intervaloTempo;
            
            this.animationMatrix = mat4.create();
            // translation
            // matrix anterior e seguinte
            var previousTranslation = this.translations[this.animationIndex];
            var nextTranslation = this.translations[this.animationIndex + 1];
            var translationBot = this.multiplyArray(previousTranslation, 1-factor);
            var translationTop = this.multiplyArray(nextTranslation, factor);
            var translation = this.sumArrays(translationBot, translationTop);
            this.animationMatrix = mat4.translate(this.animationMatrix, this.animationMatrix, translation);

            var previousRotation = this.rotations[this.animationIndex];
            var nextRotation = this.rotations[this.animationIndex + 1];
            var rotationBot = this.multiplyArray(previousRotation, 1-factor);
            var rotationTop = this.multiplyArray(nextRotation, factor);
            var rotation = this.sumArrays(rotationBot, rotationTop);
            this.animationMatrix = mat4.rotateX(this.animationMatrix,this.animationMatrix, rotation[0]*DEGREE_TO_RAD);
            this.animationMatrix = mat4.rotateY(this.animationMatrix,this.animationMatrix, rotation[1]*DEGREE_TO_RAD);
            this.animationMatrix = mat4.rotateZ(this.animationMatrix,this.animationMatrix, rotation[2]*DEGREE_TO_RAD);

            var previousScale = this.scale[this.animationIndex];
            var nextScale = this.scale[this.animationIndex + 1];

            var scaleBot = this.multiplyArray(previousScale,1-factor);
            var scaleTop = this.multiplyArray(nextScale, factor);
            var scale = this.sumArrays(scaleTop, scaleBot);
            this.animationMatrix = mat4.scale(this.animationMatrix,this.animationMatrix, scale);
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

    subtractArrays(array2, array1){
        var subtr = [];
        for(let i = 0; i < array1.length; i++){
            subtr.push(array2[i] - array1[i]);
        }
        return subtr;
    }

    multiplyArray(array,fator){
        var mult = [];
        for(var i = 0; i < array.length; i++){
            mult.push(array[i]*fator);
        }
        return mult;
    }

    multiplyArrays(array1,array2){
        var mult = [];
        for(var i = 0; i < array1.length; i++){
            mult.push(array1[i]*array2[i]);
        }
        return mult;
    }

    sumArrays(array1,array2){
        var sum = [];
        for(let i = 0; i < array1.length; i++){
            sum.push(array2[i] + array1[i]);
        }
        return sum;
    }
}