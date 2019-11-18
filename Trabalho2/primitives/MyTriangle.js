class MyTriangle extends CGFobject{
    constructor(scene, x1, y1, z1, x2, y2, z2, x3, y3, z3){
        super(scene);
        this.x1 = x1;
        this.y1 = y1;
        this.z1 = z1;

        this.x2 = x2;
        this.y2 = y2;
        this.z2 = z2;

        this.x3 = x3;
        this.y3 = y3;
        this.z3 = z3;

        this.a = Math.sqrt(Math.pow(x1-x3,2)+Math.pow(y1-y3,2)+Math.pow(z1-z3,2));
        this.b = Math.sqrt(Math.pow(x2-x1,2)+Math.pow(y2-y1,2)+Math.pow(z2-z1,2));
        this.c = Math.sqrt(Math.pow(x3-x2,2)+Math.pow(y3-y2,2)+Math.pow(z3-z2,2));

        this.cos_beta = (Math.pow(this.a,2) - Math.pow(this.b,2) + Math.pow(this.c,2))/(2*this.a*this.c);
		this.sin_beta = Math.sqrt(1 - Math.pow(this.cos_beta, 2));

        this.initBuffers();
    }
    initBuffers() {
        this.vertices=[
            this.x1, this.y1, this.z1,
            this.x2, this.y2 , this.z2,
            this.x3, this.y3, this.z3
        ];

        this.indices = [
            0, 1, 2,
            2, 1, 0
        ];

        this.normals = [
			0, -1, 0,
			0, -1, 0,
			0, -1, 0
        ];
        
        
        this.texCoords = [
			this.c-this.a*this.cosbeta, 1-this.a*Math.sin(this.beta),
			0, 1,
			this.c, 1
		]

        this.primiteType = this.scene.gl.TRIANGLES;

        this.initGLBuffers();
    }

    updateTexCoords(length_s,length_t){
        
        this.texCoords = [];
       
        this.texCoords = [
			(this.c - this.a*this.cos_beta)/length_s, (length_t - this.a*this.sin_beta)/length_t,
			0, 1,
			this.c/length_s, 1
		];

        this.updateTexCoordsGLBuffers();
    }


}
