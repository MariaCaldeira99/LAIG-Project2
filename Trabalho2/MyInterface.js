/**
 * MyInterface class, creating a GUI interface.
 */
class MyInterface extends CGFinterface {
    /**
     * @constructor
     */
    constructor() {
        super();
    }

    /**
     * Initializes the interface.
     * @param {CGFapplication} application
     */
    init(application) {
        super.init(application);
        // init GUI. For more information on the methods, check:
        //  http://workshop.chromeexperiments.com/examples/gui

        this.gui = new dat.GUI();

        // add a group of controls (and open/expand by defult)

        this.initKeys();

        return true;
    }
    /**
     * Create checkbox option to enable each light
     * @param {MySceneGraph} graph 
     */

    addLightsGroup(graph) {

        var group = this.gui.addFolder("Lights");
        group.open();

        for (let i = 0; i < graph.numberOfLights; i++) {
            
            this.gui.add(this.scene.lights[i], 'enabled').name("Enable light " + i);
        }

    }

    /**
     * Create dropdown menu for each view
     * @param {MySceneGraph} graph
     */
    addViewsGroup(graph) {
        var group = this.gui.addFolder("Views");
        group.open();

        let cameraArray = Object.keys(graph.cameras);

        this.gui.add(graph, 'currentView', cameraArray).name("Camera").onChange(graph.changeCamera.bind(graph));
    }

    /**
     * initKeys
     */
    initKeys() {
        this.scene.gui = this;
        this.processKeyboard = function () {};
        this.activeKeys = {};
    }

    processKeyDown(event) {
        this.activeKeys[event.code] = true;

        //update the clickM variable each time the 'M' key is pressed
        if (event.code == "KeyM") {
            this.scene.clickM++;
            console.log(this.scene.clickM);
        }
    };

    processKeyUp(event) {
        this.activeKeys[event.code] = false;
    };

    isKeyPressed(keyCode) {
        return this.activeKeys[keyCode] || false;
    }
}