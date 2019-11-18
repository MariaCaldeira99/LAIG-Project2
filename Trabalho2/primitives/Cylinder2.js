class Cylinder2 extends CGFobject{
   constructor(scene, base, top, height, slices, stacks) {
        super(scene);

        this.base = base;
        this.top = top;
        this.height = height;
        this.slices = slices;
        this.stacks = stacks;
        this.degree1 = 3;
        this.degree2 = 1;
        
        this.makeSurface();
    }
    

    makeSurface() {

        var nurbsSurface = new CGFnurbsSurface(this.degree1, this.degree2, this.controlpoints);
    
        this.obj = new CGFnurbsObject(this.scene, this.slices, this.stacks, nurbsSurface ); // must provide an object with the function getPoint(u, v) (CGFnurbsSurface has it)
    
    }

    display() { 
        this.obj.display(); 
    }
}