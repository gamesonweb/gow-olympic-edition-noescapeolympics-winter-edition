import { Engine, AssetsManager, ArcFollowCamera, ArcRotateCamera, BoundingInfo, Color3, Color4, CubeTexture, DefaultRenderingPipeline, DirectionalLight, FlyCamera, FollowCamera, FreeCamera, GizmoManager, HavokPlugin, HemisphericLight, KeyboardEventTypes, MeshBuilder, MotionBlurPostProcess, ParticleSystem, PhysicsAggregate, PhysicsMotionType, PhysicsShapeType, Quaternion, Scalar, Scene, SceneLoader, ShadowGenerator, Sound, StandardMaterial, TargetCamera, Texture, TransformNode, UniversalCamera, Vector3 } from "@babylonjs/core";
import { Inspector } from "@babylonjs/inspector";
import HavokPhysics from "@babylonjs/havok";
import { Models } from "./Models";

import mountainUrl from "../assets/models/snowy_slope.glb";
import { Player } from "./Player";
import { CharacterController } from "./CharacterController";
import {PlayerLevel1} from "./PlayerLevel1";


window.onload = () => {
    var startButton = document.getElementById("buttonStart");
    startButton.addEventListener("click", () => {
            launchGame();
        }
    );
};

/****************************Variables globales ************************************************* */

let engine, canvas, papa, camera;
/****************************Lancement de l'appli ************************************************* */
async function launchGame() {
    var backgroundSite = document.getElementById("backgroundGame");
    backgroundSite.style.display = "none";
    canvas = document.getElementById("renderCanvas");
    canvas.style.display = "block";
    engine = new Engine(canvas, true, { preserveDrawingBuffer: true, stencil: true, disableWebGL2Support: false });
    const scene = await createScene();
    //Inspector.Show(scene, {});

    engine.runRenderLoop(() => {
        scene.render();
    });
    
    window.addEventListener("resize", () => {
        engine.resize();
    });

}

var createScene = async () => {
    //Creation de la scene 
    let scene = new Scene(engine);

    //Gestion de la physique
    const havokInstance = await HavokPhysics();
    const hk = new HavokPlugin(true, havokInstance);
    scene.enablePhysics(new Vector3(0, -9.81, 0), hk);

    //Creation de la caméra developpeur
    const camera = new FreeCamera("camera1", new Vector3(0, 12, -10), scene);
    camera.attachControl();

    var player2 = new PlayerLevel1(scene,engine,"player",'z',"s","q","d",0,15,-5);
    let playerMeshk = scene.getMeshByName("player");

    //Creation de la caméra 3rd person
    /*
    var camera = new FollowCamera("followCam", new Vector3(0, 0, 0), scene);
    camera.lockedTarget = playerMeshk;
    camera.position._y = 10;*/

    //Musique 
    let assetsManager = new AssetsManager(scene);
    var music1Url = "PowderParadise.mp3";
    const music1Data = assetsManager.addBinaryFileTask("music1", music1Url);
    var music = new Sound("music1", music1Data.data, scene, undefined, { loop: true, autoplay: false, volume: 1 });

    //Creation du Light
    let light = new HemisphericLight("light", new Vector3(0, 1, 0), scene);
    light.intensity = 0.7;

    //Creation de la skyBox
    const skybox = MeshBuilder.CreateBox('skyBox', { size: 1000.0 }, scene);
    const skyboxMaterial = new StandardMaterial('skyBoxMaterial', scene);
    skyboxMaterial.backFaceCulling = false;
    skyboxMaterial.reflectionTexture = new CubeTexture("https://raw.githubusercontent.com/Wiro13/babylonJS_test1/c00188a397c386491e236520a3fbf80c380319ee/environment.env", scene);
    skyboxMaterial.reflectionTexture.coordinatesMode = Texture.SKYBOX_MODE;
    skyboxMaterial.disableLighting = true;
    skybox.material = skyboxMaterial;

    /**************************************Gestion des Object 3D******************************************/
    var map = new Models(scene);
    map.importMontain();

    var skieur = new Models(scene);

    /**************************************Gestion du joueur******************************************/


    /***********************************fin de Gestion des Object 3D***************************************/
    return scene;
};
