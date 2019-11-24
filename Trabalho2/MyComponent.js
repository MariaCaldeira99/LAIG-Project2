class MyComponent{
    constructor(id, transformationMatrix, materialsArray, textureID, length_s, length_t, componentChild, primitiveChild){
        this.id = id;
        this.transformationMatrix = transformationMatrix;
        this.materialsArray = materialsArray;
        this.textureID = textureID;
        this.length_s = length_s;
        this.length_t = length_t;
        this.componentChild = componentChild;
        this.primitiveChild = primitiveChild;
        this.keyframeAnimation;
    }

}