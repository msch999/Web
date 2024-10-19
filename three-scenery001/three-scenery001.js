import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const scene = new THREE.Scene();
// wireframe material toggle
const overrideMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: true });
document.addEventListener('keydown', function (event) {
	// W Pressed: Toggle wireframe
	console.log(`Key "${event.key}" pressed [event: keydown]`);
	// W Pressed: Toggle wireframe
	if (event.key === 'W') {
		// if (event.keyCode === 87) {
		if (scene.overrideMaterial != overrideMaterial) {
			scene.overrideMaterial = overrideMaterial;
		} else {
			scene.overrideMaterial = null;
		}
		scene.material.needsUpdate = true;
	}
});
// wireframe material toggle

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setAnimationLoop(animate);
document.body.appendChild(renderer.domElement);

// lights
const dirLight1 = new THREE.DirectionalLight(0xffffff, 1);
dirLight1.position.set(2, 4, -2);
scene.add(dirLight1);

// const dirLight2 = new THREE.DirectionalLight(0x002288, 3);
// dirLight2.position.set(- 2, - 2, - 2);
// scene.add(dirLight2);

const ambientLight = new THREE.AmbientLight(0x555555);
scene.add(ambientLight);

// plane
const geoPlane = new THREE.PlaneGeometry(11, 11);
const matPlane = new THREE.MeshStandardMaterial({ color: 0xFFFFFF, side: THREE.DoubleSide });
const plane = new THREE.Mesh(geoPlane, matPlane);
plane.rotateX(- Math.PI / 2);
plane.position.y = -1.0;
scene.add(plane);

const gridHelper = new THREE.GridHelper(10 /* size */, 10 /* divisions */);
gridHelper.position.y = -0.9;
scene.add(gridHelper);

// radius - Radius of the torus, from the center of the torus to the center of the tube. Default is 1.
// tube — Radius of the tube. Default is 0.4.
// radialSegments — Default is 12
// tubularSegments — Default is 48.
// const torus = new THREE.Mesh(
// 	new THREE.TorusGeometry(0.5, 0.1, 12, 48),
// 	new THREE.MeshBasicMaterial({ color: 0xaaaa00 })
// );
const torus = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({ color: 0xaaaa00 }));
scene.add(torus);

//const geometry = new THREE.BoxGeometry(1, 1, 1);
//const material = new THREE.MeshBasicMaterial( { color: 0x00ff00, wireframe: true } );
//const material = new THREE.MeshPhongMaterial({ color: 0xffffff, flatShading: true });
//const material = new THREE.MeshNormalMaterial({ wireframe: false, transparent: true, opacity: 0.8 });
//const cube = new THREE.Mesh(geometry, material);
//scene.add(cube);

let objects = new Array();

const manager = new THREE.LoadingManager();

manager.onStart = function (url, itemsLoaded, itemsTotal) {
	console.log('Started loading file: ' + url + '.\nLoaded ' + itemsLoaded + ' of ' + itemsTotal + ' files.');
};
manager.onLoad = function () {
	console.log('Loading complete!');
};
manager.onProgress = function (url, itemsLoaded, itemsTotal) {
	console.log('Loading file: ' + url + '.\nLoaded ' + itemsLoaded + ' of ' + itemsTotal + ' files.');
};
manager.onError = function (url) {
	console.log('There was an error loading ' + url);
};
//  GLTFLoader
THREE.Cache.enabled = true;
var loader = new GLTFLoader(manager);
loader.setPath('public/');
loader.load('couch.glb', function (gltf) {
	const couch = gltf.scene;
	//objects.push(couch);

	var s = 1;
	// couch.scale.x = s;
	// couch.scale.y = s;
	// couch.scale.z = s;
	couch.scale.multiplyScalar(s); // Multiply Scalar https://dustinpfister.github.io/2021/05/11/threejs-object3d-scale/

	couch.position.set(0, -1, 0);
	couch.visible = false;
	scene.add(couch);
});

// Clock for animations
const clock = new THREE.Clock();

camera.position.z = 7;

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.03;

const gui = new GUI();
gui.add(document, 'title');
gui.add(controls, 'enableDamping', true);

function animate() {
	controls.update();

	requestAnimationFrame(animate);

	//let delta = clock.getDelta();

	// Move animated objects from horizon to the front
	objects.forEach(obj => {
		obj.position.z += 0.0001; // Move object forward
		if (obj.position.z > 5) {
			obj.position.z = -30; // Reset position when it gets too close
		}
	});

	renderer.render(scene, camera);
}

function copyClones() {
	var couch = scene.getObjectByName("Sketchfab_Scene");
	//console.log('couch: ' + couch);
	const copy1 = couch.clone();

	copy1.scale.set(0.25, 0.25, 0.25);
	copy1.position.set(-2, -1, 0);
	copy1.visible = true;

	const copy2 = couch.clone();
	copy2.scale.set(0.125, 0.125, 0.125);
	copy2.position.set(3, -1, 1.25);
	copy2.visible = true;

	scene.add(copy1);
	scene.add(copy2);
	return copy1;
}

var raycaster = new THREE.Raycaster();
var pointer = new THREE.Vector2();

let couchCounter = 0;

function onPointerClick(event) {

	raycaster.setFromCamera(pointer, camera);
	const intersection = raycaster.intersectObject(torus);
	if (intersection.length > 0) {
		// console.log('INTERSECT'); 
		if (torus.material.color.r == 0xaa) {
			torus.material.color.r = 0xff;
			torus.material.color.g = 0x00;
			torus.material.color.b = 0x00;
		} else {
			console.log('couchCounter != 0'); 
			torus.material.color.r = 0xaa;
			torus.material.color.g = 0xaa;
			torus.material.color.b = 0x00;
		}

		if (couchCounter < 1) {
			couchCounter = couchCounter + 1;
			const couch = scene.getObjectByName("Sketchfab_Scene");
			const copy1 = couch.clone();
			copy1.scale.set(0.25, 0.25, 0.25);
			copy1.position.set(-3, 0, 0);
			copy1.visible = true;
			scene.add(copy1);
			objects.push(copy1);
			//couchCounter = 0;
		}
	}
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