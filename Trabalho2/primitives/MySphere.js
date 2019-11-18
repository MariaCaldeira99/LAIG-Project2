/**
 * MySphere
 * @constructor
 */

class MySphere extends CGFobject {
    constructor(scene, radius, slices, stacks) {
        super(scene);
        this.radius = radius;
        this.slices = slices;
        this.stacks = stacks;
        this.initBuffers();
    };

    initBuffers() {

        this.vertices = [];
        this.indices = [];
        this.normals = [];
        this.texCoords = [];

        var slice_angle = 2 * Math.PI / this.slices;
        var stack_angle = Math.PI / this.stacks;

        for (var z = 0; z <= this.stacks; z++) {
            for (var i = 0; i <= this.slices; i++) {

                this.vertices.push(
                    this.radius * Math.sin(stack_angle * z) * Math.sin(slice_angle * i),
                    this.radius * Math.sin(stack_angle * z) * Math.cos(slice_angle * i),
                    this.radius * Math.cos(stack_angle * z)
                )
                this.normals.push(
                    Math.sin(stack_angle * z) * Math.sin(slice_angle * i),
                    Math.sin(stack_angle * z) * Math.cos(slice_angle * i),
                    Math.cos(stack_angle * z)
                )
                this.texCoords.push(
                    i / this.slices,
					1 - (z / this.stacks)
                )
            }
        }

        for (var z = 0; z < this.stacks; z++) {
            for (var i = 0; i < this.slices; i++) {
                var index = i + z * (this.slices + 1);
                var upper_index = i + (z + 1) * (this.slices + 1);

                this.indices.push(upper_index + 1, upper_index, index);
                this.indices.push(index, index + 1, upper_index + 1);
            }
        }

        this.primitiveType = this.scene.gl.TRIANGLES;
        this.initGLBuffers();
    };

    updateTexCoords(length_s, length_t) {

        this.updateTexCoordsGLBuffers();
    }

}