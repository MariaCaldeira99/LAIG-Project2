class Plane extends CGFobject {
	constructor(scene, npartsU, npartsV) {
	  super(scene);
	  this.npartsU = npartsU;
	  this.npartsV = npartsV;
	  this.degree1 = 1;
	  this.degree2 = 1;
	  
	  this.initBuffers();
	  this.makeSurface();
		
	}

	initBuffers() {
		this.controlvertexes = [
			[
				[0.5, 0.0, -0.5, 1],
				[0.5, 0.0, 0.5, 1],
			  ],
			  [ 
				[-0.5, 0.0, -0.5, 1],
				[-0.5, 0.0, 0.5, 1],
			  ]
			];
		this.primitiveType = this.scene.gl.TRIANGLES;
	}

    makeSurface() {

		var nurbsSurface = new CGFnurbsSurface(this.degree1, this.degree2, this.controlvertexes);

		this.obj = new CGFnurbsObject(this.scene, this.npartsU, this.npartsV, nurbsSurface ); // must provide an object with the function getPoint(u, v) (CGFnurbsSurface has it)
			

	}

	display() { 
		this.obj.display(); 
	}
}