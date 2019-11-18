class Patch extends CGFobject { 
    constructor(scene, npointsU, npointsV, npartsU, npartsV, controlpoint) {
      super(scene);
  
      this.npartsU = npartsU;
      this.npartsV = npartsV;
      this.degree1 = npointsU;
      this.degree2 = npointsV;
      this.controlpoint = controlpoint;
      
      this.initBuffers();
      this.makeSurface();
    }

    initBuffers() {
      /*this.controlvertexes = [
        [
          [0.5, 0.0, -0.5, 1],
          [0.5, 0.0, 0.5, 1],
          ],
          [ 
          [-0.5, 0.0, -0.5, 1],
          [-0.5, 0.0, 0.5, 1],
          ]
      
        ];*/
      this.primitiveType = this.scene.gl.TRIANGLES;
    }
   
  
    makeSurface() {

      var nurbsSurface = new CGFnurbsSurface(this.degree1, this.degree2, this.controlpoints);
  
      this.obj = new CGFnurbsObject(this.scene, this.npartsU, this.npartsV, nurbsSurface ); // must provide an object with the function getPoint(u, v) (CGFnurbsSurface has it)
  
    }
  
    display() { 
      this.obj.display(); 
    }
  }