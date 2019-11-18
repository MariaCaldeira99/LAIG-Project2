/**
 * MyTorus
 * @constructor
 */
class MyTorus extends CGFobject {
	constructor(scene, inner, outer, slices, loops) {
		super(scene);

		this.slices = slices;
		this.loops = loops;
		this.inner = inner;
		this.outer = outer;

		this.initBuffers();
	}

	initBuffers() {
		this.vertices = [];
		this.indices = [];
		this.normals = [];
		this.texCoords = [];

		var slice_angle = 2*Math.PI/this.slices;
		var loop_angle = 2*Math.PI/this.loops;

        for(let j = 0; j <= this.loops; ++j) {
            for(let i = 0; i <= this.slices; ++i) {

				this.vertices.push(
					(this.outer + this.inner*Math.cos(loop_angle*j)) * Math.cos(slice_angle*i), 
					(this.outer + this.inner*Math.cos(loop_angle*j)) * Math.sin(slice_angle*i), 
					 this.inner * Math.sin(loop_angle*j)
				)

                this.normals.push(
                    Math.cos(loop_angle*j) * Math.cos(slice_angle*i), 
					Math.cos(loop_angle*j) * Math.sin(slice_angle*i), 
					0
                )

				this.texCoords.push(j/this.loops, i/this.slices)

			}
		}

		for (var z = 0; z < this.loops; z++) {
            for (var i = 0; i < this.slices; i++) {
                
                var index = i+this.slices*z+z;
                var upper_index = i+this.slices*(z+1)+z+1;

                this.indices.push(upper_index, index, index + 1);
                this.indices.push(upper_index+1, upper_index, index+1);
                 
            }
		}

		this.primitiveType = this.scene.gl.TRIANGLES;
		this.initGLBuffers();
	}
	updateTexCoords(length_s, length_t) {

		this.updateTexCoordsGLBuffers();
    }
}