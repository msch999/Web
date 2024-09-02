import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
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
const geoPlane = new THREE.PlaneGeometry(5, 5);
const matPlane = new THREE.MeshBasicMaterial({ color: 0x999999, side: THREE.DoubleSide });
const plane = new THREE.Mesh(geoPlane, matPlane);
plane.rotateX(- Math.PI / 2);
plane.position.y = -1.0;
scene.add(plane);

// const gridHelper = new THREE.GridHelper(10 /* size */, 10 /* divisions */);
// gridHelper.position.y = -0.9;
// scene.add(gridHelper);

const geometry = new THREE.BoxGeometry(1, 1, 1);
//const material = new THREE.MeshBasicMaterial( { color: 0x00ff00, wireframe: true } );
//const material = new THREE.MeshPhongMaterial({ color: 0xffffff, flatShading: true });
const material = new THREE.MeshNormalMaterial({ wireframe: false, transparent: false, opacity: 0.35 });

const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

camera.position.z = 5;

const controls = new OrbitControls(camera, renderer.domElement);
controls.update();

let rotSwitch = true;

function animate() {
	if (rotSwitch) {
		cube.rotation.x -= 0.01;
		cube.rotation.y += 0.01;
	}
	controls.update();
	renderer.render(scene, camera);
}

var raycaster = new THREE.Raycaster();
var pointer = new THREE.Vector2();

function onPointerClick(event) {

	raycaster.setFromCamera(pointer, camera);

	const intersects = raycaster.intersectObject(cube);
	if (intersects.length > 0) {
	  //console.log('INTERSECT');
	  rotSwitch = !rotSwitch;
	}
}

console.log('main-basic-cube-example.js');

function onPointerMove(event) {
	pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
	pointer.y = - (event.clientY / window.innerHeight) * 2 + 1;
}

// function onMouseDown( event ) {
// 	console.log('down');
// }

// function onMouseUp( event ) {
// 	console.log('up');
// }

window.addEventListener('mousedown', onPointerClick, false);
//window.addEventListener( 'mousedown', onMouseDown, false );
window.addEventListener('mousemove', onPointerMove, false);
//window.addEventListener( 'mouseup', onMouseUp, false );

window.addEventListener('resize', onWindowResize, false);

function onWindowResize() {

	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();

	renderer.setSize(window.innerWidth, window.innerHeight);

}