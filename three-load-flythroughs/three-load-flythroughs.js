import * as THREE from 'three';

import { FlyControls } from 'three/addons/controls/FlyControls.js'

import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';

import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const scene = new THREE.Scene();
// wireframe material toggle
// const overrideMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: true });
// document.addEventListener('keydown', function (event) {
// 	// W Pressed: Toggle wireframe
// 	if (event.keyCode === 87) {
// 		if (scene.overrideMaterial != overrideMaterial) {
// 			scene.overrideMaterial = overrideMaterial;
// 		} else {
// 			scene.overrideMaterial = null;
// 		}
// 		scene.material.needsUpdate = true;
// 	}
// });
// wireframe material toggle
//scene.overrideMaterial = overrideMaterial;

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setAnimationLoop(animate);
document.body.appendChild(renderer.domElement);

// lights

// White directional light at half intensity shining from the top.
// const directionalLight = new THREE.DirectionalLight( 0xffffff, 0.5 );
// scene.add( directionalLight );


const pointLight = new THREE.PointLight(0xaaaaaa, 15, 10, 1.5);   // color, intensity, distance, decay
pointLight.position.set(0, 0, 0);
scene.add(pointLight);

//const sphereSize = 1;
//const pointLightHelper = new THREE.PointLightHelper( pointLight, sphereSize );
//scene.add( pointLightHelper );

// const dirLight1 = new THREE.DirectionalLight(0xffffff, 3);
// dirLight1.position.set(3, 3, 3);
// scene.add(dirLight1);

// const dirLight2 = new THREE.DirectionalLight(0x00FF88, 3);
// dirLight2.position.set(3, 3, 3);
// scene.add(dirLight2);

// const ambientLight = new THREE.AmbientLight(0x404040);
// scene.add(ambientLight);

// plane
// const geoPlane = new THREE.PlaneGeometry(5, 5);
// const matPlane = new THREE.MeshBasicMaterial({ color: 0x333333, side: THREE.DoubleSide });
// const plane = new THREE.Mesh(geoPlane, matPlane);
// plane.rotateX(- Math.PI / 2);
// plane.position.y = -1.0;
// scene.add(plane);

// const gridHelper = new THREE.GridHelper(10 /* size */, 10 /* divisions */);
// gridHelper.position.y = -0.9;
// scene.add(gridHelper);

// Kamera-Position initialisieren
camera.position.set(0.6, 0.42, 3.86);

 // Initiate FlyControls with various params
 const controls = new FlyControls( camera, renderer.domElement );
 controls.movementSpeed = 5;
//  controls.rollSpeed = Math.PI / 24;
 controls.rollSpeed = 1;
 controls.autoForward = false;
 controls.dragToLook = true;

const controlsGui = new OrbitControls(camera, renderer.domElement);
controlsGui.enableDamping = true;
controlsGui.dampingFactor = 0.03;

// #######################################################################
const gui = new GUI();

gui.add(document, 'title');
gui.add(controlsGui, 'enableDamping', true);
const cameraFolder = gui.addFolder('Kamera Position');
const cameraPosition = {
	x: camera.position.x,
	y: camera.position.y,
	z: camera.position.z
};

// GUI-Elemente für Kameraposition
const xControl = cameraFolder.add(cameraPosition, 'x', -10, 10).onChange(value => camera.position.x = value);
const yControl = cameraFolder.add(cameraPosition, 'y', -10, 10).onChange(value => camera.position.y = value);
const zControl = cameraFolder.add(cameraPosition, 'z', -10, 10).onChange(value => camera.position.z = value);

cameraFolder.open();
// #######################################################################

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

// Modell laden und mehrfach platzieren mit async/await
// Funktion zum Laden und Platzieren beider Modelle
async function loadAndPlaceModels() {
	try {
		// 1. Lade beide GLTF-Modelle asynchron
		const [gltf1, gltf2] = await Promise.all([
			// loader.loadAsync('flythroughs.002.I.glb'),
			loader.loadAsync('flythroughs.004.Xud.glb'),
			loader.loadAsync('flythroughs.004.Xud.floor.glb')
		]);

		const modelFrame = gltf1.scene;
		const modelFloor = gltf2.scene;

		const placementMap = [
			//	 x, y, z, rotation, form 
			[0, 0, 0, 0, 'I'],
			[0, 0, -2, 0, 'I'],

			[0, 0, -4, 0, 'X'],

			[-2, 0, -4, 90, 'I'],
			[2, 0, -4, 90, 'I'],

			[0, 0, -6, 0, 'I'],
			[0, 0, -8, 0, 'T'],

			[-2, 0, -8, 90, 'I'],
			[2, 0, -8, 90, 'I'],

			[-4, 0, -4, -90, 'L'],
			[-4, 0, -2, 0, 'I'],
			[-4, 0, 0, 0, 'L']

		];

		function addTop() {
			var modelFloorClone = modelFloor.clone();
			rotate(modelFloorClone, 180, new THREE.Vector3(1, 0, 0));  // top
			return modelFloorClone;
		}

		function addBottom() {
			var modelFloorClone = modelFloor.clone();
			// no rotation needed
			return modelFloorClone;
		}

		function addWest() {
			var modelFloorClone = modelFloor.clone();
			rotate(modelFloorClone, -90, new THREE.Vector3(0, 0, 1));  // west
			return modelFloorClone;
		}

		function addEast() {
			var modelFloorClone = modelFloor.clone();
			rotate(modelFloorClone, 90, new THREE.Vector3(0, 0, 1));  // east
			return modelFloorClone;
		}

		function addNorth() {
			var modelFloorClone = modelFloor.clone();
			rotate(modelFloorClone, 90, new THREE.Vector3(1, 0, 0));  // north
			return modelFloorClone;
		}

		function addSouth() {
			var modelFloorClone = modelFloor.clone();
			rotate(modelFloorClone, -90, new THREE.Vector3(1, 0, 0));  // south
			return modelFloorClone;
		}

		function addModelI(x, y, z, r) {
			var modelFrameClone = modelFrame.clone();
			modelFrameClone.add(addEast());
			modelFrameClone.add(addWest());
			modelFrameClone.add(addTop());
			modelFrameClone.add(addBottom());

			rotate(modelFrameClone, r, new THREE.Vector3(0, 1, 0));
			modelFrameClone.position.set(x, y, z);
			scene.add(modelFrameClone);
		}

		function addModelX(x, y, z, r) {
			var modelFrameClone = modelFrame.clone();
			modelFrameClone.add(addTop());
			modelFrameClone.add(addBottom());

			rotate(modelFrameClone, r, new THREE.Vector3(0, 1, 0));
			modelFrameClone.position.set(x, y, z);
			scene.add(modelFrameClone);
		}

		function addModelT(x, y, z, r) {
			var modelFrameClone = modelFrame.clone();
			modelFrameClone.add(addTop());
			modelFrameClone.add(addBottom());
			modelFrameClone.add(addNorth());

			rotate(modelFrameClone, r, new THREE.Vector3(0, 1, 0));
			modelFrameClone.position.set(x, y, z);
			scene.add(modelFrameClone);
		}

		function addModelL(x, y, z, r) {
			var modelFrameClone = modelFrame.clone();
			modelFrameClone.add(addTop());
			modelFrameClone.add(addBottom());
			modelFrameClone.add(addSouth());
			modelFrameClone.add(addWest());

			rotate(modelFrameClone, r, new THREE.Vector3(0, 1, 0));
			modelFrameClone.position.set(x, y, z);
			scene.add(modelFrameClone);
		}

		for (let i = 0; i < placementMap.length; i++) {
			//	 x, y, z, rotation, form 
			var curX = placementMap[i][0];
			var curY = placementMap[i][1];
			var curZ = placementMap[i][2];
			var curR = placementMap[i][3];
			var curF = placementMap[i][4];

			switch (curF) {
				case 'I':
					addModelI(curX, curY, curZ, curR);
					break;
				case 'X':
					addModelX(curX, curY, curZ, curR);
					break;
				case 'T':
					addModelT(curX, curY, curZ, curR);
					break;
				case 'L':
					addModelL(curX, curY, curZ, curR);
					break;
				default:
					break;
			}

			console.log('i: ' + i + ', ' + curX + ' ' + curY + ' ' + curZ + ' ' + curR + ' ' + curF);
		}
	} catch (error) {
		console.error('Error loading GLTF models:', error);
	}
}

// loading from glb-files 
loadAndPlaceModels();

function animate() {

	// update controls with a small step value to "power its engines"
	controls.update(0.01)

	controlsGui.update();
	renderer.render(scene, camera);
}

var raycaster = new THREE.Raycaster();
var pointer = new THREE.Vector2();

function onPointerClick(event) {
	raycaster.setFromCamera(pointer, camera);

	// const intersects = raycaster.intersectObject(cube);
	// if (intersects.length > 0) {
	// 	//console.log('INTERSECT');
	// 	cubeParams.rotationSwitch = !cubeParams.rotationSwitch;
	// }
}

function onPointerMove(event) {
	pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
	pointer.y = - (event.clientY / window.innerHeight) * 2 + 1;
}

window.addEventListener('mousedown', onPointerClick, false);
window.addEventListener('mousemove', onPointerMove, false);

window.addEventListener('resize', onWindowResize, false);

function onWindowResize() {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();

	renderer.setSize(window.innerWidth, window.innerHeight);
}