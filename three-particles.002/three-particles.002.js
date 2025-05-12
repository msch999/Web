import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';

// following https://www.youtube.com/watch?v=dLYMzNmILQA
// current pos: https://youtu.be/dLYMzNmILQA?t=1293

// TextureLoader
const loader = new THREE.TextureLoader();
const cross = loader.load('./cross.png');

const scene = new THREE.Scene();
// wireframe material toggle
const overrideMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: true });
document.addEventListener('keydown', function (event) {
	// w Pressed: Toggle wireframe
	if (event.key === 'w') {
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
// background color
renderer.setClearColor(new THREE.Color('#21282a'), 1);

renderer.setAnimationLoop(animate);
document.body.appendChild(renderer.domElement);

// lights
const dirLight1 = new THREE.DirectionalLight(0xffffff, 3);
dirLight1.position.set(2, 2, 2);
scene.add(dirLight1);

const dirLight2 = new THREE.DirectionalLight(0x002288, 3);
dirLight2.position.set(- 2, - 2, - 2);
scene.add(dirLight2);

const ambientLight = new THREE.AmbientLight(0x555555);
scene.add(ambientLight);

// plane
// const geoPlane = new THREE.PlaneGeometry(5, 5);
// const matPlane = new THREE.MeshBasicMaterial({ color: 0x999999, side: THREE.DoubleSide });
// const plane = new THREE.Mesh(geoPlane, matPlane);
// plane.rotateX(- Math.PI / 2);
// plane.position.y = -1.0;
// scene.add(plane);

// const gridHelper = new THREE.GridHelper(10 /* size */, 10 /* divisions */);
// gridHelper.position.y = -0.9;
// scene.add(gridHelper);

camera.position.x = 0;
camera.position.y = 0;
camera.position.z = 1.3;

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.03;

// const gui = new GUI();
// gui.add(document, 'title');
// gui.add(controls, 'enableDamping', true);

// particles 
const geometryTorus = new THREE.TorusGeometry(.7, .2, 16, 100);

const particlesGeometry = new THREE.BufferGeometry;
const particlesCnt = 5000;  // why not 'particlesCount'?

const posArray = new Float32Array(particlesCnt * 3);
// xyz, xyz, xyz, xyz

for (let i = 0; i < particlesCnt * 3; i++) {
	posArray[i] = (Math.random() - 0.5) * 5;
}

particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3))

// Materials
const material = new THREE.PointsMaterial({
	//	transparent: true,
	size: 0.005
})

const particlesMaterial = new THREE.PointsMaterial({
	size: 0.009,
	map: cross,
	transparent: true,
	//color: 'yellow'
})

// Mesh
const sphere = new THREE.Points(geometryTorus, material)
const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial)
scene.add(sphere, particlesMesh)

const clock = new THREE.Clock();

function animate() {
	const elapsedTime = clock.getElapsedTime();

	const speed = 0.5 * elapsedTime;
	sphere.rotation.x = speed * 0;
	sphere.rotation.y = speed * 0;
	sphere.rotation.z = speed * 0.05;

	particlesMesh.rotation.y = -0.1 * elapsedTime;

	if (mouseX > 0) {
		particlesMesh.rotation.x = -mouseY * (elapsedTime * 0.00008);
		particlesMesh.rotation.y = mouseX * (elapsedTime * 0.00008);
	}

	controls.update();
	renderer.render(scene, camera);
}

let mouseX = 0;
let mouseY = 0;

function animateParticles(event) {
	mouseX = event.clientX;
	mouseY = event.clientY;
}

var raycaster = new THREE.Raycaster();
var pointer = new THREE.Vector2();

// // counting milliseconds 
// let startTime;
// let milliseconds;

// function startTimer() {
//     startTime = Date.now();
//     setInterval(updateTimer, 1); // Update every millisecond
// }

// function updateTimer() {
//     const currentTime = Date.now();
//     milliseconds = currentTime - startTime;
//     //console.log(milliseconds); // Display milliseconds in the console
// }

// startTimer();

let logMsg = '';

function onPointerClick(event) {
	raycaster.setFromCamera(pointer, camera);

	const intersects = raycaster.intersectObject(sphere);
	if (intersects.length > 0) {
		//console.log('INTERSECT ' + Math.floor((Math.random() * 10) + 1));
		logMsg = 'random: ' + Math.floor((Math.random() * 100) + 1);
		// logMsg = 'camera.position.x = ' + camera.position.x + ';'  + "\n";
		// logMsg = logMsg + 'camera.position.y = ' + camera.position.y + ';'  + "\n";
		// logMsg = logMsg + 'camera.position.z = ' + camera.position.z + ';'  + "\n";
		// logMsg = logMsg + milliseconds + "\n";
		console.log(logMsg);
	}
}

function onPointerMove(event) {
	pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
	pointer.y = - (event.clientY / window.innerHeight) * 2 + 1;
	animateParticles(event);
}

window.addEventListener('mousedown', onPointerClick, false);
window.addEventListener('mousemove', onPointerMove, false);

window.addEventListener('resize', onWindowResize, false);

function onWindowResize() {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();

	renderer.setSize(window.innerWidth, window.innerHeight);
}