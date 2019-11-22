class KeyframeAnimation extends Animation{
    constructor(scene,id, time, xtran, ytran, ztran, xrot, yrot, zrot, xsca, ysca, zsca){
        super(scene,id);
        this.time = time * 1000;
        this.xtran = xtran;
        this.ytran = ytran;
        this.ztran = ztran;
        this.xrot = xrot;
        this.yrot = yrot;
        this.zrot = zrot;
        this.xsca = xsca;
        this.ysca = ysca;
        this.zsca = zsca;

        update(this.time);

        createAnimation();
    }

    createAnimation(){
        let mat = mat4.create();
        mat4.translate(mat,mat,vec3.fromValues(this.xtran,this.ytran,this.ztran));

        if(this.xrot != 0){
            mat4.rotate(mat,mat,this.xrot * DEGREE_TO_RAD,vec3.fromValues(1,0,0));
        }
        if(this.yrot != 0){
            mat4.rotate(mat,mat,this.yrot * DEGREE_TO_RAD,vec3.fromValues(0,1,0));
        }
        if(this.zrot != 0){
            mat4.rotate(mat,mat,this.zrot * DEGREE_TO_RAD,vec3.fromValues(0,0,1));
        }

        mat4.scale(mat,mat,vec3.fromValues(this.xsca,this.ysca,this.zsca));
        
        this.matrix = mat;
    }
}