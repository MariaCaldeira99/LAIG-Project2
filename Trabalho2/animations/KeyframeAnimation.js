class KeyframeAnimation extends Animation {
    constructor(scene) {
        super(scene);
    }
    /**
     * Updates the keyframe animation
     * @param {float} t 
     */
    update(t) {
        super.update(t);

        //if the animation doesn't start in instant 0
        if (this.deltaT < this.instances[0])
            return;

        // update animation index
        if (this.deltaT > this.instances[this.animationIndex + 1]) {
            this.animationIndex++;
        }

        if (this.deltaT <= this.instances[this.instances.length - 1]) {

            var keyframeInterval = this.instances[this.animationIndex + 1] - this.instances[this.animationIndex];
            var factor = (this.deltaT - this.instances[this.animationIndex]) / keyframeInterval;

            this.animationMatrix = mat4.create();

            //Calculate the translation matrix
            var previousTranslation = this.translations[this.animationIndex];
            var nextTranslation = this.translations[this.animationIndex + 1];
            var translationBot = this.multiplyArray(previousTranslation, 1 - factor);
            var translationTop = this.multiplyArray(nextTranslation, factor);
            var translation = this.sumArrays(translationBot, translationTop);
            this.animationMatrix = mat4.translate(this.animationMatrix, this.animationMatrix, translation);

            //Calculate the rotation matrix
            var previousRotation = this.rotations[this.animationIndex];
            var nextRotation = this.rotations[this.animationIndex + 1];
            var rotationBot = this.multiplyArray(previousRotation, 1 - factor);
            var rotationTop = this.multiplyArray(nextRotation, factor);
            var rotation = this.sumArrays(rotationBot, rotationTop);
            this.animationMatrix = mat4.rotateX(this.animationMatrix, this.animationMatrix, rotation[0] * DEGREE_TO_RAD);
            this.animationMatrix = mat4.rotateY(this.animationMatrix, this.animationMatrix, rotation[1] * DEGREE_TO_RAD);
            this.animationMatrix = mat4.rotateZ(this.animationMatrix, this.animationMatrix, rotation[2] * DEGREE_TO_RAD);

            //Calculate the scale matrix
            var previousScale = this.scale[this.animationIndex];
            var nextScale = this.scale[this.animationIndex + 1];
            var scaleBot = this.multiplyArray(previousScale, 1 - factor);
            var scaleTop = this.multiplyArray(nextScale, factor);
            var scale = this.sumArrays(scaleTop, scaleBot);
            this.animationMatrix = mat4.scale(this.animationMatrix, this.animationMatrix, scale);
        }
        //To finish the animation
        else {
            this.animationMatrix = mat4.create();
            this.animationMatrix = mat4.translate(this.animationMatrix, this.animationMatrix, this.translations[this.translations.length - 1]);
            this.animationMatrix = mat4.rotateX(this.animationMatrix, this.animationMatrix, this.rotations[this.rotations.length - 1][0] * DEGREE_TO_RAD);
            this.animationMatrix = mat4.rotateY(this.animationMatrix, this.animationMatrix, this.rotations[this.rotations.length - 1][1] * DEGREE_TO_RAD);
            this.animationMatrix = mat4.rotateZ(this.animationMatrix, this.animationMatrix, this.rotations[this.rotations.length - 1][2] * DEGREE_TO_RAD);
            this.animationMatrix = mat4.scale(this.animationMatrix, this.animationMatrix, this.scale[this.scale.length - 1]);
        }
    }

    //Sums two arrays
    sumArrays(array1, array2) {
        var sum = [];
        for (let i = 0; i < array1.length; i++) {
            sum.push(array2[i] + array1[i]);
        }
        return sum;
    }

    //Subtracts two arrays
    subtractArrays(array2, array1) {
        var subtr = [];
        for (let i = 0; i < array1.length; i++)
            subtr.push(array2[i] - array1[i]);

        return subtr;
    }

    //Multiplies an array by a factor value
    multiplyArray(array, fator) {
        var mult = [];
        for (var i = 0; i < array.length; i++)
            mult.push(array[i] * fator);

        return mult;
    }

     //Multiplies two arrays
    multiplyArrays(array1, array2) {
        var mult = [];
        for (var i = 0; i < array1.length; i++)
            mult.push(array1[i] * array2[i]);

        return mult;
    }
}