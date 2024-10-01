import * as THREE from 'three';

import { FlyControls } from 'three/addons/controls/FlyControls.js'

import { GUI } from 'three/addons/libs/lil-gui.module.min.js';

import { loadAndPlaceModels } from './loadAndPlaceModels.js';

export const scene = new THREE.Scene();
// wireframe material toggle
const overrideMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: true });
document.addEventListener('keydown', function (event) {
	// W Pressed: Toggle wireframe
	if (event.key === 'W') {
		//console.log(`Key "${event.key}" pressed [event: keydown]`);
		if (scene.overrideMaterial != overrideMaterial) {
			scene.overrideMaterial = overrideMaterial;
		} else {
			scene.overrideMaterial = null;
		}
		scene.material.needsUpdate = true;
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
pointLight.position.set(0, 0, 0);
scene.add(pointLight);

const gridHelper = new THREE.GridHelper(10 /* size */, 10 /* divisions */);
gridHelper.position.y = -0.9;
scene.add(gridHelper);

// Kamera-Position initialisieren
camera.position.set(0.6, 0.42, 3.86);

 // Initiate FlyControls with various params
 const controls = new FlyControls( camera, renderer.domElement );
 controls.movementSpeed = 5;
//  controls.rollSpeed = Math.PI / 24;
 controls.rollSpeed = 0.5;
 controls.autoForward = false;
 controls.dragToLook = true;
 controls.keys = {};

 
// loading from glb-files 
loadAndPlaceModels();

function animate() {

	// update controls with a small step value to "power its engines"
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