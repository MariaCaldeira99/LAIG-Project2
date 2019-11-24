class Patch extends CGFobject { 
    constructor(scene, npointsU, npointsV, npartsU, npartsV, controlpoint) {
      super(scene);
      
      this.npointsU = npointsU;
      this.npointsV = npointsV;
      this.npartsU = npartsU;
      this.npartsV = npartsV;
      this.controlpoint = controlpoint;
      
      this.makeSurface();
    }
  
    makeSurface() {

      var nurbsSurface = new CGFnurbsSurface(this.npointsU-1, this.npointsV-1, this.controlpoint);
      this.obj = new CGFnurbsObject(this.scene, this.npartsU, this.npartsV, nurbsSurface ); // must provide an object with the function getPoint(u, v) (CGFnurbsSurface has it)
    }
  
    display() { 
      this.obj.display(); 
    }

    updateTexCoords(length_s, length_t) {

      this.updateTexCoordsGLBuffers();
    }
  }