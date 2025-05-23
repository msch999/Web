import * as THREE from 'three';

//import { FlyControls } from 'three/addons/controls/FlyControls.js'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
//import { loadAndPlaceFighterModel } from './loadAndPlaceModels.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';


export const scene = new THREE.Scene();
// wireframe material toggle
const overrideMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: true });
document.addEventListener('keydown', function (event) {
	console.log(`Key "${event.key}" pressed [event: keydown]`);
	// W Pressed: Toggle wireframe
	if (event.key === 'W') {
		if (scene.overrideMaterial != overrideMaterial) {
			scene.overrideMaterial = overrideMaterial;
		} else {
			scene.overrideMaterial = null;
		}
		scene.material.needsUpdate = true;
	}

	var incVal = 1;
	if (event.key === 'w') { // up
		modelJetfighter.position.z -= incVal;
	} else if (event.key === 's') { // down
		modelJetfighter.position.z += incVal;
	} else if (event.key === 'a') { // left 
		modelJetfighter.position.x -= incVal;
	} else if (event.key === 'd') { // right
		modelJetfighter.position.x += incVal;
	}

	


});
// initial wireframe material toggle
// scene.overrideMaterial = overrideMaterial;

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setAnimationLoop(animate);
document.body.appendChild(renderer.domElement);

// lights
const pointLight = new THREE.PointLight(0xaaaaaa, 15, 10, 1.5);   // color, intensity, distance, decay
pointLight.position.set(0, 3, -2);
scene.add(pointLight);

const gridHelper = new THREE.GridHelper(10 /* size */, 10 /* divisions */);
gridHelper.position.y = -0.9;
scene.add(gridHelper);

// Kamera-Position initialisieren
camera.position.set(0, 2.42, 9);
camera.lookAt(0, 0, 0);


const controls = new OrbitControls(camera, renderer.domElement);
controls.update();


// Initiate FlyControls with various params
//const controls = new FlyControls(camera, renderer.domElement);
controls.movementSpeed = 5;
//  controls.rollSpeed = Math.PI / 24;
controls.rollSpeed = 0.5;
controls.autoForward = false;
controls.dragToLook = true;
controls.keys = {};

// loading from glb-files 
// loadAndPlaceModels();

//  GLTFLoader
THREE.Cache.enabled = true;
var loader = new GLTFLoader().setPath('public/');
// rotation helper
// https://stackoverflow.com/questions/29907536/how-can-i-rotate-a-mesh-by-90-degrees-in-threejs
// e.g. rotate( myMesh, 90, new THREE.Vector3( 0, 0, 1 ) );
function rotate(object, deg, axis) {
	// axis is a THREE.Vector3
	var q = new THREE.Quaternion();
	q.setFromAxisAngle(axis, THREE.MathUtils.degToRad(deg)); // we need to use radians
	q.normalize();
	object.quaternion.multiply(q);
}

let modelJetfighter = null;

export async function loadAndPlaceFighterModel() {
	try {
		// GLTF-Modell asynchron laden
		const [gltf1] = await Promise.all([
			loader.loadAsync('jetmove.002.glb'),
		]);

		// const modelJetfighter = gltf1.scene;
		modelJetfighter = gltf1.scene;
		rotate(modelJetfighter, 0, new THREE.Vector3(0, 0, 1));
		modelJetfighter.position.set(0, -1, 0);
		scene.add(modelJetfighter);
	} catch (error) {
		console.error('Error loading GLTF jetfighter model: ', error);
	}
}

loadAndPlaceFighterModel();


// modelJetfighter.position.set(0, -3, 0);

// ###############################################################################
// // black cube
// const blackCubeGeometry = new THREE.BoxGeometry(1, 1, 1);
// const blackCubeMaterial = new THREE.MeshBasicMaterial({ color: "black" });
// const blackCube = new THREE.Mesh(blackCubeGeometry, blackCubeMaterial);
// // Adding bounding box to our black box
// const blackCubeBB = new THREE.Box3(new THREE.Vector3(), new THREE.Vector3());
// blackCubeBB.setFromObject(blackCube);
// blackCube.position.set(0, 0, 0);
// scene.add(blackCube)

// // Red cube
// const redCubeGeometry = new THREE.BoxGeometry(1, 1, 1);
// const redCubeMaterial = new THREE.MeshBasicMaterial({ color: "red" });
// const redCube = new THREE.Mesh(redCubeGeometry, redCubeMaterial);
// // Adding bounding box to our red box
// const redCubeBB = new THREE.Box3(new THREE.Vector3(), new THREE.Vector3());
// redCubeBB.setFromObject(redCube);
// redCube.position.set(2, 0, 0);  // set position different from black cube
// scene.add(redCube)



// function checkCollision() {
// 	if (redCubeBB.intersectsBox(blackCubeBB)) {
// 		//console.log('intersected');
// 		blackCube.material.transparent = true;
// 		blackCube.material.opacity = 0.5;
// 		blackCube.material.color = new THREE.Color(Math.random * 0xffffff);
// 	} else {
// 		blackCube.material.opacity = 1;
// 	}
// }
// ###############################################################################


// ###############################################################################

function animate() {
	// redCubeBB
	// 	.copy(redCube.geometry.boundingBox)
	// 	.applyMatrix4(redCube.matrixWorld);

	// 	checkCollision();

	// update fly controls with a small step value to "power its engines"
	controls.update(0.01)

	// controlsGui.update();
	renderer.render(scene, camera);
}

window.addEventListener('resize', onWindowResize, false);

function onWindowResize() {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();

	renderer.setSize(window.innerWidth, window.innerHeight);
}
