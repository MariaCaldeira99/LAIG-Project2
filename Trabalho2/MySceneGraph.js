var DEGREE_TO_RAD = Math.PI / 180;

// Order of the groups in the XML document.
var SCENE_INDEX = 0;
var VIEWS_INDEX = 1;
var AMBIENT_INDEX = 2;
var LIGHTS_INDEX = 3;
var TEXTURES_INDEX = 4;
var MATERIALS_INDEX = 5;
var TRANSFORMATIONS_INDEX = 6;
var ANIMATIONS_INDEX = 7;
var PRIMITIVES_INDEX = 8;
var COMPONENTS_INDEX = 9;


/**
 * MySceneGraph class, representing the scene graph.
 */
class MySceneGraph {
    /**
     * @constructor
     */
    constructor(filename, scene) {
        this.loadedOk = null;

        // Establish bidirectional references between scene and graph.
        this.scene = scene;
        scene.graph = this;

        this.nodes = [];

        this.idRoot = null; // The id of the root element.

        this.axisCoords = [];
        this.axisCoords['x'] = [1, 0, 0];
        this.axisCoords['y'] = [0, 1, 0];
        this.axisCoords['z'] = [0, 0, 1];

        // File reading 
        this.reader = new CGFXMLreader();

        /*
         * Read the contents of the xml file, and refer to this class for loading and error handlers.
         * After the file is read, the reader calls onXMLReady on this object.
         * If any error occurs, the reader calls onXMLError on this object, with an error message
         */
        this.reader.open('scenes/' + filename, this);
    }

    /*
     * Callback to be executed after successful reading
     */
    onXMLReady() {
        this.log("XML Loading finished.");
        var rootElement = this.reader.xmlDoc.documentElement;

        // Here should go the calls for different functions to parse the various blocks
        var error = this.parseXMLFile(rootElement);

        if (error != null) {
            this.onXMLError(error);
            return;
        }

        this.loadedOk = true;

        // As the graph loaded ok, signal the scene so that any additional initialization depending on the graph can take place
        this.scene.onGraphLoaded();
    }

    /**
     * Parses the XML file, processing each block.
     * @param {XML root element} rootElement
     */
    parseXMLFile(rootElement) {
        if (rootElement.nodeName != "lxs")
            return "root tag <lxs> missing";

        var nodes = rootElement.children;

        // Reads the names of the nodes to an auxiliary buffer.
        var nodeNames = [];

        for (var i = 0; i < nodes.length; i++) {
            nodeNames.push(nodes[i].nodeName);
        }

        var error;

        // Processes each node, verifying errors.

        // <scene>
        var index;
        if ((index = nodeNames.indexOf("scene")) == -1)
            return "tag <scene> missing";
        else {
            if (index != SCENE_INDEX)
                this.onXMLMinorError("tag <scene> out of order " + index);

            //Parse scene block
            if ((error = this.parseScene(nodes[index])) != null)
                return error;
        }

        // <views>
        if ((index = nodeNames.indexOf("views")) == -1)
            return "tag <views> missing";
        else {
            if (index != VIEWS_INDEX)
                this.onXMLMinorError("tag <views> out of order");

            //Parse views block
            if ((error = this.parseView(nodes[index])) != null)
                return error;
        }

        // <ambient>
        if ((index = nodeNames.indexOf("globals")) == -1)
            return "tag <globals> missing";
        else {
            if (index != AMBIENT_INDEX)
                this.onXMLMinorError("tag <globals> out of order");

            //Parse ambient block
            if ((error = this.parseAmbient(nodes[index])) != null)
                return error;
        }

        // <lights>
        if ((index = nodeNames.indexOf("lights")) == -1)
            return "tag <lights> missing";
        else {
            if (index != LIGHTS_INDEX)
                this.onXMLMinorError("tag <lights> out of order");

            //Parse lights block
            if ((error = this.parseLights(nodes[index])) != null)
                return error;
        }
        // <textures>
        if ((index = nodeNames.indexOf("textures")) == -1)
            return "tag <textures> missing";
        else {
            if (index != TEXTURES_INDEX)
                this.onXMLMinorError("tag <textures> out of order");

            //Parse textures block
            if ((error = this.parseTextures(nodes[index])) != null)
                return error;
        }

        // <materials>
        if ((index = nodeNames.indexOf("materials")) == -1)
            return "tag <materials> missing";
        else {
            if (index != MATERIALS_INDEX)
                this.onXMLMinorError("tag <materials> out of order");

            //Parse materials block
            if ((error = this.parseMaterials(nodes[index])) != null)
                return error;
        }

        // <transformations>
        if ((index = nodeNames.indexOf("transformations")) == -1)
            return "tag <transformations> missing";
        else {
            if (index != TRANSFORMATIONS_INDEX)
                this.onXMLMinorError("tag <transformations> out of order");

            //Parse transformations block
            if ((error = this.parseTransformations(nodes[index])) != null)
                return error;
        }

        //<animations>
        if ((index = nodeNames.indexOf("animations")) == -1)
            return "tag <animations> missing";
        else {
            if (index != ANIMATIONS_INDEX)
                this.onXMLMinorError("tag <animations> out of order");

            //Parse transformations block
            if ((error = this.parseAnimations(nodes[index])) != null)
                return error;
        }

        // <primitives>
        if ((index = nodeNames.indexOf("primitives")) == -1)
            return "tag <primitives> missing";
        else {
            if (index != PRIMITIVES_INDEX)
                this.onXMLMinorError("tag <primitives> out of order");

            //Parse primitives block
            if ((error = this.parsePrimitives(nodes[index])) != null)
                return error;
        }

        // <components>
        if ((index = nodeNames.indexOf("components")) == -1)
            return "tag <components> missing";
        else {
            if (index != COMPONENTS_INDEX)
                this.onXMLMinorError("tag <components> out of order");

            //Parse components block
            if ((error = this.parseComponents(nodes[index])) != null)
                return error;
        }
        this.log("all parsed");
    }

    /**
     * Parses the <scene> block. 
     * @param {scene block element} sceneNode
     */
    parseScene(sceneNode) {

        // Get root of the scene.
        var root = this.reader.getString(sceneNode, 'root')
        if (root == null)
            return "no root defined for scene";

        this.idRoot = root;

        // Get axis length        
        var axis_length = this.reader.getFloat(sceneNode, 'axis_length');
        if (axis_length == null)
            this.onXMLMinorError("no axis_length defined for scene; assuming 'length = 1'");

        this.referenceLength = axis_length || 1;

        this.log("Parsed scene");

        return null;
    }

    /**
     * Parses the <views> block.
     * @param {view block element} viewsNode
     */
    parseView(viewsNode) {

        this.cameras = [];
        var children = viewsNode.children;

        //Verify if there are is at least one defined view.
        if (children.length == 0)
            this.onXMLError("There need to be at least one defined view.");

        for (let i = 0; i < children.length; i++) {
            //Get view ID
            var viewID = this.reader.getString(children[i], 'id');

            //Check for views with the same ID.
            if (this.cameras[viewID] != null) {
                this.onXMLError("Skipping view: ID must be unique for each view. " + viewID + " already exists.");
                continue;
            }

            //Get type of view
            var viewType = children[i].nodeName;

            //Check if view type is valid
            if (viewType != "perspective" && viewType != "ortho") {
                this.onXMLMinorError("Skipping view: Tag " + viewType + " is invalid.")
                continue;
            }

            var grand_children = children[i].children;
            var nodeNames = [];
            for (let j = 0; j < grand_children.length; j++) {
                nodeNames.push(grand_children[j].nodeName);
            }

            //Get "near" value and checks if it's defined
            var near = this.reader.getFloat(children[i], 'near');
            if (near == null) {
                this.onXMLMinorError("Skipping view: No near value.");
                continue;
            }

            //Get "far" value and checks if it's defined
            var far = this.reader.getFloat(children[i], 'far');
            if (far == null) {
                this.onXMLMinorError("Skipping view: No far value.");
                continue;
            }

            //Get "from" node and checks if it exists
            var from_index = nodeNames.indexOf("from");
            if (from_index == -1) {
                this.onXMLMinorError("Skipping view: No \"from\" tag found.");
                continue;
            }

            var from = this.parseCoordinates3D(grand_children[from_index]);

            //Get "to" node and checks if it exists
            var to_index = nodeNames.indexOf("to");
            if (to_index == -1) {
                this.onXMLMinorError("Skipping view: No \"to\" tag found.");
                continue;
            }
            var to = this.parseCoordinates3D(grand_children[to_index]);


            if (viewType == "ortho") {
                //Get "left" value and checks if it's defined
                var left = this.reader.getFloat(children[i], 'left');
                if (left == null) {
                    this.onXMLMinorError("Skipping view: No left value.");
                    continue;
                }

                //Get "right" value and checks if it's defined
                var right = this.reader.getFloat(children[i], 'right');
                if (right == null) {
                    this.onXMLMinorError("Skipping view: No right value.");
                    continue;
                }

                //Get "top" value and checks if it's defined
                var top = this.reader.getFloat(children[i], 'top');
                if (top == null) {
                    this.onXMLMinorError("Skipping view: No top value.");
                    continue;
                }

                //Get "bottom" value and checks if it's defined
                var bottom = this.reader.getFloat(children[i], 'bottom');
                if (bottom == null) {
                    this.onXMLMinorError("Skipping view: No bottom value.");
                    continue;
                }

                //Get "up" node and checks if it's defined
                //This node is optional
                var up_index = nodeNames.indexOf("up");
                var up;
                if (up_index == -1) { //if <up /> isn't defined
                    this.log("No up tag found (optional), using default values [0,1,0]");
                    up = vec3.fromValues(0, 1, 0);
                } else
                    up = this.parseCoordinates3D(grand_children[up_index]);

                //Create ortho camera
                this.cameras[viewID] = new CGFcameraOrtho(left, right, bottom, top, near, far, from, to, up);
            } else { //viewType = perspective

                //Get "angle" value and checks if it's defined
                var angle = this.reader.getFloat(children[i], 'angle');
                if (angle == null) {
                    this.onXMLMinorError("Skipping view: No angle value.");
                    continue;
                }
                //Angle from degree to rad
                angle *= DEGREE_TO_RAD;
                //Create perspective camera
                this.cameras[viewID] = new CGFcamera(angle, near, far, from, to);
            }
        }

        //Verify if default view was created and parsed correctly
        this.currentView = this.reader.getString(viewsNode, 'default');
        if (this.cameras[this.currentView] == null) {
            this.onXMLError("The view defined as default(" + this.currentView + ") doesn't exist.");
        }
        this.currentSecurityView = this.currentView;

        this.log("Parsed views.");
        return null;
    }

    /**
     * Parses the <ambient> node.
     * @param {ambient block element} ambientsNode
     */
    parseAmbient(ambientsNode) {

        var children = ambientsNode.children;

        this.ambient = [];
        this.background = [];

        var nodeNames = [];

        for (var i = 0; i < children.length; i++)
            nodeNames.push(children[i].nodeName);

        var ambientIndex = nodeNames.indexOf("ambient");
        var backgroundIndex = nodeNames.indexOf("background");

        var color = this.parseColor(children[ambientIndex], "ambient");
        if (!Array.isArray(color))
            return color;
        else
            this.ambient = color;

        color = this.parseColor(children[backgroundIndex], "background");
        if (!Array.isArray(color))
            return color;
        else
            this.background = color;

        this.log("Parsed ambient");

        return null;
    }

    /**
     * Parses the <light> node.
     * @param {lights block element} lightsNode
     */
    parseLights(lightsNode) {
        var children = lightsNode.children;

        this.lights = [];
        var numLights = 0;

        var grandChildren = [];
        var nodeNames = [];

        // Any number of lights.
        for (var i = 0; i < children.length; i++) {

            // Storing light information
            var global = [];
            var attributeNames = [];
            var attributeTypes = [];

            //Check type of light
            if (children[i].nodeName != "omni" && children[i].nodeName != "spot") {
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
                continue;
            } else {
                attributeNames.push(...["location", "ambient", "diffuse", "specular"]);
                attributeTypes.push(...["position", "color", "color", "color"]);
            }

            // Get id of the current light.
            var lightId = this.reader.getString(children[i], 'id');
            if (lightId == null)
                return "no ID defined for light";

            // Checks for repeated IDs.
            if (this.lights[lightId] != null)
                return "ID must be unique for each light (conflict: ID = " + lightId + ")";

            // Light enable/disable
            var enableLight = true;
            var aux = this.reader.getBoolean(children[i], 'enabled');
            if (!(aux != null && !isNaN(aux) && (aux == true || aux == false)))
                this.onXMLMinorError("unable to parse value component of the 'enable light' field for ID = " + lightId + "; assuming 'value = 1'");

            enableLight = aux && 1;

            //Add enabled boolean and type name to light info
            global.push(enableLight);
            global.push(children[i].nodeName);

            grandChildren = children[i].children;
            // Specifications for the current light.

            nodeNames = [];
            for (var j = 0; j < grandChildren.length; j++) {
                nodeNames.push(grandChildren[j].nodeName);
            }

            for (var j = 0; j < attributeNames.length; j++) {
                var attributeIndex = nodeNames.indexOf(attributeNames[j]);

                if (attributeIndex != -1) {
                    if (attributeTypes[j] == "position")
                        var aux = this.parseCoordinates4D(grandChildren[attributeIndex], "light position for ID" + lightId);
                    else
                        var aux = this.parseColor(grandChildren[attributeIndex], attributeNames[j] + " illumination for ID" + lightId);

                    if (!Array.isArray(aux))
                        return aux;

                    global.push(aux);
                } else
                    return "light " + attributeNames[i] + " undefined for ID = " + lightId;
            }

            // Gets the additional attributes of the spot light
            if (children[i].nodeName == "spot") {
                var angle = this.reader.getFloat(children[i], 'angle');
                if (!(angle != null && !isNaN(angle)))
                    return "unable to parse angle of the light for ID = " + lightId;

                var exponent = this.reader.getFloat(children[i], 'exponent');
                if (!(exponent != null && !isNaN(exponent)))
                    return "unable to parse exponent of the light for ID = " + lightId;

                var targetIndex = nodeNames.indexOf("target");

                // Retrieves the light target.
                var targetLight = [];
                if (targetIndex != -1) {
                    var aux = this.parseCoordinates3D(grandChildren[targetIndex], "target light for ID " + lightId);
                    if (!Array.isArray(aux))
                        return aux;

                    targetLight = aux;
                } else
                    return "light target undefined for ID = " + lightId;

                global.push(...[angle, exponent, targetLight])
            }

            this.lights[lightId] = global;
            numLights++;
        }

        if (numLights == 0)
            return "at least one light must be defined";
        else if (numLights > 8)
            this.onXMLMinorError("too many lights defined; WebGL imposes a limit of 8 lights");

        this.numberOfLights = numLights;
        this.log("Parsed lights");
        return null;
    }

    /**
     * Parses the <textures> block. 
     * @param {textures block element} texturesNode
     */
    parseTextures(texturesNode) {
        //For each texture in textures block, check ID and file URL
        this.textures = [];

        var children = texturesNode.children;

        for (var i = 0; i < children.length; i++) {

            //Verify if it's a texture node
            if (children[i].nodeName != "texture") {
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
                continue;
            }

            //Get textude ID and check if it's valid
            var textureID = this.reader.getString(children[i], 'id');

            if (textureID == null)
                return "no ID defined for texture";

            if (this.textures[textureID] != null)
                return "ID must be unique for each light (conflict: ID = " + textureID + ")";

            //Get texture file directory
            var file = this.reader.getString(children[i], 'file');

            if (file == null)
                return "no File defined for texture";

            //Create texture and push it to the textures array
            this.textures[textureID] = new CGFtexture(this.scene, file);
        }
        this.log("Parsed textures.");
        return null;
    }

    /**
     * Parses the <materials> node.
     * @param {materials block element} materialsNode
     */
    parseMaterials(materialsNode) {
        var children = materialsNode.children;

        this.materials = [];

        var grandChildren = [];
        var nodeNames = [];

        // Any number of materials.
        for (var i = 0; i < children.length; i++) {

            //Verify if it's a material node
            if (children[i].nodeName != "material") {
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
                continue;
            }

            // Get id of the current material.
            var materialID = this.reader.getString(children[i], 'id');
            if (materialID == null)
                return "no ID defined for material";

            // Checks for duplicate IDs.
            if (this.materials[materialID] != null)
                return "ID must be unique for each light (conflict: ID = " + materialID + ")";

            //Create material and push it to materials array

            grandChildren = children[i].children;

            this.materials[materialID] = new CGFappearance(this.scene);
            this.materials[materialID].setTextureWrap('REPEAT', 'REPEAT');

            //Get "shininess" value and check if it's valid
            var shininess = this.reader.getFloat(children[i], 'shininess');
            if (shininess == null || shininess < 0 || isNaN(shininess))
                return "No valid shininess value for material " + materialID;
            this.materials[materialID].setShininess(shininess);


            for (let j = 0; j < grandChildren.length; j++) {

                var lightType = grandChildren[j].nodeName;
                nodeNames.push(lightType);
                var color = this.parseColor(grandChildren[j], lightType);
                if (!Array.isArray(color))
                    return color;


                //For each type (emission, ambient, diffuse and specular),
                //set the r,g,b & a parameters
                switch (lightType) {
                    case "emission":
                        this.materials[materialID].setEmission(...color);
                        break;
                    case "ambient":
                        this.materials[materialID].setAmbient(...color);
                        break;
                    case "diffuse":
                        this.materials[materialID].setDiffuse(...color);
                        break;
                    case "specular":
                        this.materials[materialID].setSpecular(...color);
                        break;
                    default:
                        continue;
                }

            }
        }
        return null;
    }

    /**
     * Parses the <transformations> block.
     * @param {transformations block element} transformationsNode
     */
    parseTransformations(transformationsNode) {
        var children = transformationsNode.children;

        this.transformations = [];

        var grandChildren = [];

        // Any number of transformations.
        for (var i = 0; i < children.length; i++) {

            //Verify if it's a transformation node
            if (children[i].nodeName != "transformation") {
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
                continue;
            }

            // Get id of the current transformation.
            var transformationID = this.reader.getString(children[i], 'id');
            if (transformationID == null)
                return "no ID defined for transformation";

            // Checks for repeated IDs.
            if (this.transformations[transformationID] != null)
                return "ID must be unique for each transformation (conflict: ID = " + transformationID + ")";

            grandChildren = children[i].children;
            // Specifications for the current transformation.

            var transfMatrix = mat4.create();

            for (var j = 0; j < grandChildren.length; j++) {
                switch (grandChildren[j].nodeName) {
                    case 'translate':
                        //Create translation array;
                        var t_coordinates = this.parseCoordinates3D(grandChildren[j], "translate transformation for ID " + transformationID);
                        if (!Array.isArray(t_coordinates))
                            return t_coordinates;

                        //Update transformation matrix
                        transfMatrix = mat4.translate(transfMatrix, transfMatrix, t_coordinates);
                        break;

                    case 'scale':
                        //Create scale array
                        var s_coordinates = this.parseCoordinates3D(grandChildren[j], "scale transformation for ID " + transformationID);

                        if (!Array.isArray(s_coordinates))
                            return s_coordinates;

                        //Update transformation matrix
                        transfMatrix = mat4.scale(transfMatrix, transfMatrix, s_coordinates);
                        break;

                    case 'rotate':
                        var r_axis_vec;
                        var r_axis = this.reader.getString(grandChildren[j], 'axis');

                        //Create the rotation axis array
                        switch (r_axis) {
                            case 'x':
                                r_axis_vec = [1, 0, 0];
                                break;
                            case 'y':
                                r_axis_vec = [0, 1, 0];
                                break;
                            case 'z':
                                r_axis_vec = [0, 0, 1];
                                break;
                            default:
                                return "Unable to parse axis " + r_axis + "for ID " + componentID;

                        }

                        //Get "angle" value
                        var r_angle = this.reader.getString(grandChildren[j], 'angle');
                        if (r_angle == null) {
                            this.onXMLMinorError("Skipping transformation: No angle value.");
                            continue;
                        }
                        r_angle *= DEGREE_TO_RAD;

                        //Update transformation matrix
                        transfMatrix = mat4.rotate(transfMatrix, transfMatrix, r_angle, r_axis_vec);
                        break;
                }
            }
            this.transformations[transformationID] = transfMatrix;
        }

        this.log("Parsed transformations");
        return null;
    }

    parseAnimations(animationsNode){
        var children = animationsNode.children;
        var grandChildren = [];
        var grandgrandchildren = [];
        this.animations = [];

        if(children.length == 0){
            return null;
        }
        
        // for each <animation> tag
        for (var i = 0; i < children.length; i++) {

            // create keyframe animation object
            var keyframeAnimationObject = new KeyframeAnimation(this.scene);

            //Verify if it's a primitve node
            if (children[i].nodeName != "animation") {
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
                continue;
            }

            // Get id of the current animation.
            var animationID = this.reader.getString(children[i], 'id');
            if (animationID == null)
                return "no ID defined for texture";

            // Checks for repeated IDs.
            if (this.animations[animationID] != null)
                return "ID must be unique for each animation (conflict: ID = " + animationID + ")";

            grandChildren = children[i].children;

            // for each <keyframe> tag
            for(var j = 0; j < grandChildren.length; j++){
                
                var instant = this.reader.getFloat(grandChildren[j], 'instant');
                if (!(instant != null && !isNaN(instant)))
                    return "unable to parse instant of the animation coordinates for ID = " + animationID;

                keyframeAnimationObject.instances.push(...[instant]);
                
                grandgrandchildren = grandChildren[j].children;

                // for <tranlation>, <rotation>, <scale>
                for (var k = 0; k < grandgrandchildren.length; k++) {
                    switch (grandgrandchildren[k].nodeName) {
                        case 'translate':
                            //Create translation array;
                            var t_coordinates = this.parseCoordinates3D(grandgrandchildren[k], "translate transformation for ID " + animationID);
                            if (!Array.isArray(t_coordinates))
                                return t_coordinates;

    
                            //Update transformation matrix
                            //transfMatrix = mat4.translate(transfMatrix, transfMatrix, t_coordinates);
                            keyframeAnimationObject.translations.push(...[t_coordinates]);
                            break;
    
                        case 'scale':
                            //Create scale array
                            var s_coordinates = this.parseCoordinates3D(grandgrandchildren[k], "scale transformation for ID " + animationID);
    
                            if (!Array.isArray(s_coordinates))
                                return s_coordinates;

    
                            //Update transformation matrix
                            //transfMatrix = mat4.scale(transfMatrix, transfMatrix, s_coordinates);
                            keyframeAnimationObject.scale.push(...[s_coordinates]);
                            break;
    
                        case 'rotate':
                            // angle_x
                            var angle_x = this.reader.getFloat(grandgrandchildren[k], 'angle_x');
                            if (!(angle_x != null && !isNaN(angle_x)))
                                return "unable to parse x-coordinate of the ";

                            // angle_y
                            var angle_y = this.reader.getFloat(grandgrandchildren[k], 'angle_y');
                            if (!(angle_y != null && !isNaN(angle_y)))
                                return "unable to parse y-coordinate of the ";

                            // angle_z
                            var angle_z = this.reader.getFloat(grandgrandchildren[k], 'angle_z');
                            if (!(angle_z != null && !isNaN(angle_z)))
                                return "unable to parse z-coordinate of the " + animationID;    
                            
                            var r_coordinates = [angle_x, angle_y, angle_z];
                            //Update transformation matrix
                            //transfMatrix = mat4.rotate(transfMatrix, transfMatrix, r_angle, r_axis_vec);
                            keyframeAnimationObject.rotations.push(...[r_coordinates]);

                            break;
                    }
                }
                this.animations[animationID] = keyframeAnimationObject;
            }
            
        }

        return null;

    }

    /**
     * Parses the <primitives> block.
     * @param {primitives block element} primitivesNode
     */
    parsePrimitives(primitivesNode) {
        var children = primitivesNode.children;

        this.primitives = [];

        var grandChildren = [];

        var greatgrandChildren = [];

        // Any number of primitives.
        for (var i = 0; i < children.length; i++) {

            //Verify if it's a primitve node
            if (children[i].nodeName != "primitive") {
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
                continue;
            }

            // Get id of the current primitive.
            var primitiveId = this.reader.getString(children[i], 'id');
            if (primitiveId == null)
                return "no ID defined for texture";

            // Checks for repeated IDs.
            if (this.primitives[primitiveId] != null)
                return "ID must be unique for each primitive (conflict: ID = " + primitiveId + ")";

            grandChildren = children[i].children;

            // Validate the primitive type
            if (grandChildren.length != 1 ||
                (grandChildren[0].nodeName != 'rectangle' && grandChildren[0].nodeName != 'triangle' &&
                    grandChildren[0].nodeName != 'cylinder' && grandChildren[0].nodeName != 'sphere' &&
                    grandChildren[0].nodeName != 'torus') && grandChildren[0].nodeName != 'plane' && 
                    grandChildren[0].nodeName != 'patch' && grandChildren[0].nodeName != 'cylinder2') {
                return "There must be exactly 1 primitive type (rectangle, triangle, cylinder, sphere or torus)"
            }

            // Specifications for the current primitive.
            var primitiveType = grandChildren[0].nodeName;

            switch (primitiveType) {
                case 'triangle':
                    var x1 = this.reader.getFloat(grandChildren[0], 'x1');
                    if (!(x1 != null && !isNaN(x1)))
                        return "unable to parse x1 of the primitive coordinates for ID = " + primitiveId;

                    var y1 = this.reader.getFloat(grandChildren[0], 'y1');
                    if (!(y1 != null && !isNaN(y1)))
                        return "unable to parse y1 of the primitive coordinates for ID = " + primitiveId;

                    var z1 = this.reader.getFloat(grandChildren[0], 'z1');
                    if (!(z1 != null && !isNaN(z1)))
                        return "unable to parse z1 of the primitive coordinates for ID = " + primitiveId;

                    var x2 = this.reader.getFloat(grandChildren[0], 'x2');
                    if (!(x2 != null && !isNaN(x2)))
                        return "unable to parse x2 of the primitive coordinates for ID = " + primitiveId;

                    var y2 = this.reader.getFloat(grandChildren[0], 'y2');
                    if (!(y2 != null && !isNaN(y2)))
                        return "unable to parse y2 of the primitive coordinates for ID = " + primitiveId;

                    var z2 = this.reader.getFloat(grandChildren[0], 'z2');
                    if (!(z2 != null && !isNaN(z2)))
                        return "unable to parse z2 of the primitive coordinates for ID = " + primitiveId;

                    var x3 = this.reader.getFloat(grandChildren[0], 'x3');
                    if (!(x3 != null && !isNaN(x3)))
                        return "unable to parse x3 of the primitive coordinates for ID = " + primitiveId;

                    var y3 = this.reader.getFloat(grandChildren[0], 'y3');
                    if (!(y3 != null && !isNaN(y3)))
                        return "unable to parse y3 of the primitive coordinates for ID = " + primitiveId;

                    var z3 = this.reader.getFloat(grandChildren[0], 'z3');
                    if (!(z3 != null && !isNaN(z3)))
                        return "unable to parse z3 of the primitive coordinates for ID = " + primitiveId;

                    this.primitives[primitiveId] = new MyTriangle(this.scene, x1, y1, z1, x2, y2, z2, x3, y3, z3);
                    break;

                case 'rectangle':
                    // x1
                    var x1 = this.reader.getFloat(grandChildren[0], 'x1');
                    if (!(x1 != null && !isNaN(x1)))
                        return "unable to parse x1 of the primitive coordinates for ID = " + primitiveId;

                    // y1
                    var y1 = this.reader.getFloat(grandChildren[0], 'y1');
                    if (!(y1 != null && !isNaN(y1)))
                        return "unable to parse y1 of the primitive coordinates for ID = " + primitiveId;

                    // x2
                    var x2 = this.reader.getFloat(grandChildren[0], 'x2');
                    if (!(x2 != null && !isNaN(x2) && x2 > x1))
                        return "unable to parse x2 of the primitive coordinates for ID = " + primitiveId;

                    // y2
                    var y2 = this.reader.getFloat(grandChildren[0], 'y2');
                    if (!(y2 != null && !isNaN(y2) && y2 > y1))
                        return "unable to parse y2 of the primitive coordinates for ID = " + primitiveId;

                    var rect = new MyRectangle(this.scene, x1, x2, y1, y2);

                    this.primitives[primitiveId] = rect;
                    break;
                case 'cylinder':

                    var base = this.reader.getFloat(grandChildren[0], 'base');
                    if (!(base != null && !isNaN(base) && base >= 0))
                        return "unable to parse base radius of the primitive with ID = " + primitiveId;

                    var top = this.reader.getFloat(grandChildren[0], 'top');
                    if (!(top != null && !isNaN(top) && top >= 0))
                        return "unable to parse top radius of the primitive with ID = " + primitiveId;

                    if (base == top && base == 0)
                        return "primitive with ID = " + primitiveId + " can't have both radii equal to 0";

                    var height = this.reader.getFloat(grandChildren[0], 'height');
                    if (!(height != null && !isNaN(height) && height >= 0))
                        return "unable to parse height of the primitive with ID = " + primitiveId;

                    var slices = this.reader.getFloat(grandChildren[0], 'slices');
                    if (!(slices != null && !isNaN(slices) && slices >= 0))
                        return "unable to parse slices of the primitive with ID = " + primitiveId;

                    var stacks = this.reader.getFloat(grandChildren[0], 'stacks');
                    if (!(stacks != null && !isNaN(stacks) && stacks >= 0))
                        return "unable to parse stacks of the primitive with ID = " + primitiveId;

                    this.primitives[primitiveId] = new MyCylinder(this.scene, base, top, height, slices, stacks);
                    break;
                case 'sphere':
                    var radius = this.reader.getFloat(grandChildren[0], 'radius');
                    if (!(radius != null && !isNaN(radius) && radius >= 0))
                        return "unable to parse radius of the primitive with ID = " + primitiveId;

                    var slices = this.reader.getFloat(grandChildren[0], 'slices');
                    if (!(slices != null && !isNaN(slices) && slices >= 0))
                        return "unable to parse slices of the primitive with ID = " + primitiveId;

                    var stacks = this.reader.getFloat(grandChildren[0], 'stacks');
                    if (!(stacks != null && !isNaN(stacks) && stacks >= 0))
                        return "unable to parse stacks of the primitive with ID = " + primitiveId;

                    this.primitives[primitiveId] = new MySphere(this.scene, radius, slices, stacks);
                    break;
                case 'torus':

                    var inner = this.reader.getFloat(grandChildren[0], 'inner');
                    if (!(inner != null && !isNaN(inner) && inner > 0))
                        return "unable to parse inner radius of the primitive with ID = " + primitiveId;

                    var outer = this.reader.getFloat(grandChildren[0], 'outer');
                    if (!(outer != null && !isNaN(outer) && outer > 0))
                        return "unable to parse outer radius of the primitive with ID = " + primitiveId;

                    var slices = this.reader.getFloat(grandChildren[0], 'slices');
                    if (!(slices != null && !isNaN(slices) && slices >= 0))
                        return "unable to parse slices of the primitive with ID = " + primitiveId;

                    var loops = this.reader.getFloat(grandChildren[0], 'loops');
                    if (!(loops != null && !isNaN(loops) && loops >= 0))
                        return "unable to parse loops of the primitive with ID = " + primitiveId;

                    this.primitives[primitiveId] = new MyTorus(this.scene, inner, outer, slices, loops);
                    break;
                case 'plane':
                    var npartsU = this.reader.getFloat(grandChildren[0], 'npartsU');
                    if (!(npartsU != null && !isNaN(npartsU) && npartsU >= 0))
                        return "unable to parse npartsU of the primitive with ID = " + primitiveId;

                    var npartsV = this.reader.getFloat(grandChildren[0], 'npartsV');
                    if (!(npartsV != null && !isNaN(npartsV) && npartsV >= 0))
                        return "unable to parse npartsV of the primitive with ID = " + primitiveId;

                    this.primitives[primitiveId] = new Plane(this.scene, npartsU, npartsV);
                    break;
                case 'patch':
                    var npointsU = this.reader.getFloat(grandChildren[0], 'npointsU');
                    if (!(npointsU != null && !isNaN(npointsU) && npointsU >= 0))
                        return "unable to parse npointsU of the primitive with ID = " + primitiveId;

                    var npointsV = this.reader.getFloat(grandChildren[0], 'npointsV');
                    if (!(npointsV != null && !isNaN(npointsV) && npointsV >= 0))
                        return "unable to parse npointsV of the primitive with ID = " + primitiveId;
    
                    var npartsU = this.reader.getFloat(grandChildren[0], 'npartsU');
                    if (!(npartsU != null && !isNaN(npartsU) && npartsU >= 0))
                        return "unable to parse npartsU of the primitive with ID = " + primitiveId;

                    var npartsV = this.reader.getFloat(grandChildren[0], 'npartsV');
                    if (!(npartsV != null && !isNaN(npartsV) && npartsV >= 0))
                        return "unable to parse npartsV of the primitive with ID = " + primitiveId;

                    
                    let controlPoints = [];

                    var grandgrandchildren = grandChildren[0].children;

                    for(var j = 0; j < grandgrandchildren.length; j++){
                        var xx = this.reader.getFloat(grandgrandchildren[j], 'xx');
                        var yy = this.reader.getFloat(grandgrandchildren[j], 'yy');
                        var zz = this.reader.getFloat(grandgrandchildren[j], 'zz');

                        controlPoints.push([xx,yy,zz,1.0]);
                    }

                    var finalcontrolPoints = [];
                    
                    for (var j = 0; j <= (npointsU - 1); j++) {
                        var list = [];
                        for (var k = 0; k <= (npointsV - 1); k++)
                            list.push(controlPoints.shift());
                        
                        finalcontrolPoints.push(list);
                    }

                    this.primitives[primitiveId] = new Patch(this.scene, npointsU,npointsV,npartsU, npartsV,finalcontrolPoints);
                    break;
                case 'cylinder2':
                    var base = this.reader.getFloat(grandChildren[0], 'base');
                    if (!(base != null && !isNaN(base) && base >= 0))
                        return "unable to parse base radius of the primitive with ID = " + primitiveId;

                    var top = this.reader.getFloat(grandChildren[0], 'top');
                    if (!(top != null && !isNaN(top) && top >= 0))
                        return "unable to parse top radius of the primitive with ID = " + primitiveId;

                    if (base == top && base == 0)
                        return "primitive with ID = " + primitiveId + " can't have both radii equal to 0";

                    var height = this.reader.getFloat(grandChildren[0], 'height');
                    if (!(height != null && !isNaN(height) && height >= 0))
                        return "unable to parse height of the primitive with ID = " + primitiveId;

                    var slices = this.reader.getFloat(grandChildren[0], 'slices');
                    if (!(slices != null && !isNaN(slices) && slices >= 0))
                        return "unable to parse slices of the primitive with ID = " + primitiveId;

                    var stacks = this.reader.getFloat(grandChildren[0], 'stacks');
                    if (!(stacks != null && !isNaN(stacks) && stacks >= 0))
                        return "unable to parse stacks of the primitive with ID = " + primitiveId;

                    this.primitives[primitiveId] = new Cylinder2(this.scene, base, top, height, slices, stacks);
                    break;
                default:
                    console.warn("To do: Parse other primitives.");
                    break;
            }
        }
        return null;
    }

    /**
     * Parses the <components> block.
     * @param {components block element} componentsNode
     */
    parseComponents(componentsNode) {
        var children = componentsNode.children;

        this.components = [];

        var grandChildren = [];
        var nodeNames = [];

        // Any number of components.
        for (var i = 0; i < children.length; i++) {
            //Verify if it's a component node
            if (children[i].nodeName != "component") {
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
                continue;
            }

            // Get id of the current component.
            var componentID = this.reader.getString(children[i], 'id');
            if (componentID == null)
                return "no ID defined for componentID";

            // Checks for repeated IDs.
            if (this.components[componentID] != null)
                return "ID must be unique for each component (conflict: ID = " + componentID + ")";

            grandChildren = children[i].children;

            nodeNames = [];
            for (var j = 0; j < grandChildren.length; j++) {
                nodeNames.push(grandChildren[j].nodeName);
            }

            var transformationIndex = nodeNames.indexOf("transformation");
            var animationIndex = nodeNames.indexOf("animationref");
            var materialsIndex = nodeNames.indexOf("materials");
            var textureIndex = nodeNames.indexOf("texture");
            var childrenIndex = nodeNames.indexOf("children");
            

            // Transformations
            var transfMatrix = mat4.create();
            var index_transf = grandChildren[transformationIndex].children;

            for (let j = 0; j < index_transf.length; j++) {
                switch (index_transf[j].nodeName) {
                    case 'translate':
                        //Create translation array;
                        var t_coordinates = this.parseCoordinates3D(index_transf[j], "translate transformation for ID " + componentID);
                        if (!Array.isArray(t_coordinates))
                            return t_coordinates;

                        //Update transformation matrix
                        transfMatrix = mat4.translate(transfMatrix, transfMatrix, t_coordinates);
                        break;
                    case 'scale':
                        //Create scale array
                        var s_coordinates = this.parseCoordinates3D(index_transf[j], "scale transformation for ID " + componentID);

                        if (!Array.isArray(s_coordinates))
                            return s_coordinates;

                        //Update transformation matrix
                        transfMatrix = mat4.scale(transfMatrix, transfMatrix, s_coordinates);
                        break;
                    case 'rotate':

                        var r_axis_vec;
                        var r_axis = this.reader.getString(index_transf[j], 'axis');
                        //Create the rotation axis array
                        switch (r_axis) {
                            case 'x':
                                r_axis_vec = [1, 0, 0];
                                break;
                            case 'y':
                                r_axis_vec = [0, 1, 0];
                                break;
                            case 'z':
                                r_axis_vec = [0, 0, 1];
                                break;
                            default:
                                return "Unable to parse axis " + r_axis + "for ID " + componentID;

                        }

                        //Get "angle" value
                        var r_angle = this.reader.getString(index_transf[j], 'angle');
                        if (r_angle == null) {
                            return "No angle value for transformation on component with ID " + componentID + ".";
                        }
                        r_angle *= DEGREE_TO_RAD;

                        //Update transformation matrix
                        transfMatrix = mat4.rotate(transfMatrix, transfMatrix, r_angle, r_axis_vec);
                        break;
                    case 'transformationref':
                        //Get transformation reference and verify if it exists
                        var ref = this.reader.getString(index_transf[j], 'id');
                        if (this.transformations[ref] == null)
                            return this.onXMLMinorError("There is no transformation with ID " + ref + ". Check " + componentID);


                        //Update transformation matrix
                        transfMatrix = this.transformations[ref];
                        break;

                }

            }

            //Animations
            var keyframeAnimation;
            if (animationIndex >= 0){
                var animationRef = this.reader.getString(grandChildren[animationIndex], 'id');
                if (this.animations[animationRef] == null)
                    return "Animation " + animationRef + " doesn't exist in animayion array";
                keyframeAnimation = this.animations[animationRef];
            }

            // Materials
            var index_material = grandChildren[materialsIndex].children;
            var materialsArray = [];

            for (let i = 0; i < index_material.length; i++) {
                var mat = index_material[i].nodeName;

                //Verify if it's a material tag
                if (mat != "material")
                    return mat + "was found where <material /> should be.";

                //Get material ID and check if it exists in material array
                var materialID = this.reader.getString(index_material[i], 'id');
                if (this.materials[materialID] == null && materialID != "inherit")
                    return "Material " + materialID + " doesn't exist in materials array";

                //Update the component's meterial array
                materialsArray.push(this.reader.getString(index_material[i], 'id'));


            }

            // Texture
            var index_texture = grandChildren[textureIndex];

            //Verify if it's a texture tag
            var text = index_texture.nodeName;
            if (text != "texture")
                return tex + "was found where <texture /> should be.";

            //Get texture ID and check if it exists in texture array
            var textureID = this.reader.getString(index_texture, 'id');
            if (this.textures[textureID] == null && textureID != "inherit" && textureID != "none")
                return "Texture " + textureID + " doesn't exist in textures array";

            //Get length_s & length_t if it exists
            if (this.reader.hasAttribute(index_texture, "length_s") &&
                this.reader.hasAttribute(index_texture, "length_t")) {
                var length_s = this.reader.getFloat(index_texture, 'length_s', false);
                var length_t = this.reader.getFloat(index_texture, 'length_t', false);
            }


            // Children
            var componentChild = [];
            var primitiveChild = [];
            var index_child = grandChildren[childrenIndex].children;

            for (let i = 0; i < index_child.length; i++) {

                var child = index_child[i].nodeName;
                let child_ref = this.reader.getString(index_child[i], 'id');

                if (child == "primitiveref") {
                    //Check if primitive ID it exists in primitive array
                    if (this.primitives[child_ref] == null)
                        return "Primitive " + child_ref + " doesn't exist in primitives array";
                    else primitiveChild.push(child_ref);
                } else if (child == "componentref") {
                    //Check if component ID exists in component array
                    if (this.components[child_ref] == null)
                        return "Component " + child_ref + " doesn't exist in components array";
                    else componentChild.push(child_ref);
                } else return "Invalid tag: " + child;
            }

            //Create component
            this.components[componentID] = new MyComponent(componentID, transfMatrix, materialsArray, textureID, length_s, length_t, componentChild, primitiveChild);
            if (animationIndex >= 0)
                this.components[componentID].keyframeAnimation = keyframeAnimation;
        }
    }


    /**
     * Parse the coordinates from a node with ID = id
     * @param {block element} node
     * @param {message to be displayed in case of error} messageError
     */
    parseCoordinates3D(node, messageError) {
        var position = [];

        // x
        var x = this.reader.getFloat(node, 'x');
        if (!(x != null && !isNaN(x)))
            return "unable to parse x-coordinate of the " + messageError;

        // y
        var y = this.reader.getFloat(node, 'y');
        if (!(y != null && !isNaN(y)))
            return "unable to parse y-coordinate of the " + messageError;

        // z
        var z = this.reader.getFloat(node, 'z');
        if (!(z != null && !isNaN(z)))
            return "unable to parse z-coordinate of the " + messageError;

        position.push(...[x, y, z]);

        return position;
    }

    /**
     * Parse the coordinates from a node with ID = id
     * @param {block element} node
     * @param {message to be displayed in case of error} messageError
     */
    parseCoordinates4D(node, messageError) {
        var position = [];

        //Get x, y, z
        position = this.parseCoordinates3D(node, messageError);

        if (!Array.isArray(position))
            return position;


        // w
        var w = this.reader.getFloat(node, 'w');
        if (!(w != null && !isNaN(w)))
            return "unable to parse w-coordinate of the " + messageError;

        position.push(w);

        return position;
    }

    /**
     * Parse the color components from a node
     * @param {block element} node
     * @param {message to be displayed in case of error} messageError
     */
    parseColor(node, messageError) {
        var color = [];

        // R
        var r = this.reader.getFloat(node, 'r');
        if (!(r != null && !isNaN(r) && r >= 0 && r <= 1))
            return "unable to parse R component of the " + messageError;

        // G
        var g = this.reader.getFloat(node, 'g');
        if (!(g != null && !isNaN(g) && g >= 0 && g <= 1))
            return "unable to parse G component of the " + messageError;

        // B
        var b = this.reader.getFloat(node, 'b');
        if (!(b != null && !isNaN(b) && b >= 0 && b <= 1))
            return "unable to parse B component of the " + messageError;

        // A
        var a = this.reader.getFloat(node, 'a');
        if (!(a != null && !isNaN(a) && a >= 0 && a <= 1))
            return "unable to parse A component of the " + messageError;

        color.push(...[r, g, b, a]);

        return color;
    }

    /**
     * Processes transformations, materials, textures and children from each component node
     * @param {string} id 
     * @param {string} matParent 
     * @param {string} texParent 
     * @param {float} length_s 
     * @param {float} length_t 
     */
    processNode(id, matParent, texParent, length_s, length_t) {

        //Get component from the components array and verify if it exists
        var component = this.components[id];
        if (component == null)
            return;

            
        //Apply animation
        if (component.keyframeAnimation != null) {
            this.scene.pushMatrix();
            component.keyframeAnimation.apply();
        }
        // WARNING -> as transformacoes sao aplicadas primeiros que as animacoes.... WTF????
        //Apply transformations
        this.scene.pushMatrix();
        this.scene.multMatrix(component.transformationMatrix);

        //Child component inherits texture from parent
        if (component.textureID == "inherit") {
            var texture = texParent;
            component.length_s = length_s;
            component.length_t = length_t;
        } else {
            var texture = component.textureID;
            if (component.length_s == null)
                component.length_s = 1;
            if (component.length_t == null)
                component.length_t = 1;

        }


        //Child compenent inherits material from parent
        if (component.materialsArray == "inherit")
            var materialID = matParent;
        else
            var materialID = component.materialsArray[this.scene.clickM % component.materialsArray.length];

        //Apply textures and materials
        this.materials[materialID].setTexture(this.textures[texture]);
        this.materials[materialID].apply();

        //Process other components and display primitives
        for (let comp_child of component.componentChild) {
            this.processNode(comp_child, materialID, texture, component.length_s, component.length_t);
        }
        for (let prim_child of component.primitiveChild) {
            this.primitives[prim_child].updateTexCoords(length_s, length_t);
            this.primitives[prim_child].display();
        }

        this.scene.popMatrix();

        if (component.keyframeAnimation != null) {
            this.scene.popMatrix();
        }
    }

    /** 
     * Updates the camera according to the interface option selected
     */
    changeCamera() {
        this.scene.camera = this.cameras[this.currentView];
    }

    changeSecurityCamera() {
        this.scene.securityCamera.camera = this.cameras[this.currentSecurityView];
    }

    /**
     * Callback to be executed on any read error, showing an error on the console.
     * @param {string} message
     */
    onXMLError(message) {
        console.error("XML Loading Error: " + message);
        this.loadedOk = false;
    }

    /**
     * Callback to be executed on any minor error, showing a warning on the console.
     * @param {string} message
     */
    onXMLMinorError(message) {
        console.warn("Warning: " + message);
    }

    /**
     * Callback to be executed on any message.
     * @param {string} message
     */
    log(message) {
        console.log("   " + message);
    }

    update(t) {
        for(const compenentID in this.components) {
            if(this.components[compenentID].keyframeAnimation != null){
                //debugger;
                this.components[compenentID].keyframeAnimation.update();
            }
        }
    }

    /**
     * Displays the scene, processing each node, starting in the root node.
     */
    displayScene() {

        //Process all component nodes
        this.processNode(this.idRoot, null, null, 1, 1);
    }
}