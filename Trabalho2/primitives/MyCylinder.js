/**
 * MyCylinder
 * @constructor
 */
class MyCylinder extends CGFobject {
    constructor(scene, base, top, height, slices, stacks) {
        super(scene);
        this.base = base;
        this.top = top;
        this.height = height;
        this.slices = slices;
        this.stacks = stacks;
        this.initBuffers();
    }
    initBuffers() {
        this.vertices = [];
        this.normals = [];
        this.indices = [];
        this.texCoords = [];

        var slice_angle = 2 * Math.PI / this.slices;
        var radius = this.base;
        var up_inc = this.height / this.stacks;
        var radius_inc = (this.top - this.base) / this.stacks;

        for (var z = 0; z <= this.stacks; z++) {
            for (var i = 0; i <= this.slices; i++) {

                this.vertices.push(radius * Math.cos(slice_angle * i), radius * Math.sin(slice_angle * i), z * up_inc);
                this.normals.push(Math.cos(slice_angle * i), Math.sin(slice_angle * i), 0);
                this.texCoords.push(1-i / this.slices, z / this.stacks);

            }
            radius += radius_inc;
        }

        for (let z = 0; z < this.stacks; z++) {
            for (let i = 0; i < this.slices; i++) {

                var index = i + this.slices * z + z;
                var upper_index = i + this.slices * (z + 1) + z + 1;

                this.indices.push(upper_index, index, index + 1);
                this.indices.push(upper_index + 1, upper_index, index + 1);

            }
        }

        this.primitiveType = this.scene.gl.TRIANGLES;
        this.initGLBuffers();


    }
    updateTexCoords(length_s, length_t) {
        this.updateTexCoordsGLBuffers();
    }
}