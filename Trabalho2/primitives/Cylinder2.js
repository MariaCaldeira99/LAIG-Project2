class Cylinder2 extends CGFobject{
   constructor(scene, base, top, height, slices, stacks) {
        super(scene);

        this.base = base;
        this.top = top;
        this.height = height;
        this.slices = slices;
        this.stacks = stacks;
        this.degree1 = 1;
        this.degree2 = 8;

        this.makeSurface();
    }

    makeSurface() {

        this.controlPoints = [
            [
                [0.0, -this.base, 0.0, 1],
                [-this.base, -this.base, 0.0, 1],
                [-this.base, 0.0, 0.0, 1],
                [-this.base, this.base, 0.0, 1],
                [0.0, this.base, 0.0, 1],
                [this.base, this.base, 0.0, 1],
                [this.base, 0.0, 0.0, 1],
                [this.base, -this.base, 0.0, 1],
                [0.0, -this.base, 0.0, 1]                       
            ],
            [
                [0.0, -this.top, this.height, 1],
                [-this.top, -this.top, this.height, 1],
                [-this.top, 0.0, this.height, 1],
                [-this.top, this.top, this.height, 1],
                [0.0, this.top, this.height, 1],
                [this.top, this.top, this.height, 1],
                [this.top, 0.0, this.height, 1],
                [this.top, -this.top, this.height, 1],
                [0.0, -this.top, this.height, 1]                       
            ]
        ];

        var nurbsSurface = new CGFnurbsSurface(this.degree1, this.degree2, this.controlPoints);
    
        this.obj = new CGFnurbsObject(this.scene, this.slices, this.stacks, nurbsSurface ); // must provide an object with the function getPoint(u, v) (CGFnurbsSurface has it)
    
    }

    display() { 
		this.obj.display();
    }
}