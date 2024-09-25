import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';

import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const scene = new THREE.Scene();
// wireframe material toggle
const overrideMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: true });
document.addEventListener('keydown', function (event) {
	// W Pressed: Toggle wireframe
	if (event.keyCode === 87) {
		if (scene.overrideMaterial != overrideMaterial) {
			scene.overrideMaterial = overrideMaterial;
		} else {
			scene.overrideMaterial = null;
		}
		scene.material.needsUpdate = true;
	}
});
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
pointLight.position.set(1, 1, 1);
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
const geoPlane = new THREE.PlaneGeometry(5, 5);
const matPlane = new THREE.MeshBasicMaterial({ color: 0x333333, side: THREE.DoubleSide });
const plane = new THREE.Mesh(geoPlane, matPlane);
plane.rotateX(- Math.PI / 2);
plane.position.y = -1.0;
scene.add(plane);

const gridHelper = new THREE.GridHelper(10 /* size */, 10 /* divisions */);
gridHelper.position.y = -0.9;
scene.add(gridHelper);

camera.position.x = 3;
camera.position.y = 3;
camera.position.z = 6;

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.03;

THREE.Cache.enabled = true;
var loader = new GLTFLoader().setPath('public/');
var deeplyClonedModels = [];

// rotation helper
// https://stackoverflow.com/questions/29907536/how-can-i-rotate-a-mesh-by-90-degrees-in-threejs
function rotate(object, deg, axis) {
	// axis is a THREE.Vector3
	var q = new THREE.Quaternion();
	q.setFromAxisAngle(axis, THREE.MathUtils.degToRad(deg)); // we need to use radians
	q.normalize();
	object.quaternion.multiply(q);
}

// loader.load( 'flythroughs.001-T.glb', async function ( gltf ) {

// 	const modelT = gltf.scene;
// 	// wait until the model can be added to the scene without blocking due to shader compilation

// 	await renderer.compileAsync( modelT, camera, scene );
// 	scene.add( modelT );
// } );
for (var i = 0; i < 3; i++) {
	loader.load('flythroughs.001-T.glb', async function (gltf) {
		var currentT = gltf.scene;
		var index = 0;
		// wait until the model can be added to the scene without blocking due to shader compilation
		await renderer.compileAsync(currentT, camera, scene);

		var count = deeplyClonedModels.push(currentT);
		console.log('Count: ' + count + ' i: ' + i);
		var xPos = 2;
		var zPos = -2;
		var yRot = 360;
		
		deeplyClonedModels[count - 1].position.x = xPos;
		deeplyClonedModels[count - 1].position.z = zPos
		// deeplyClonedModels[count - 1].rotation.y = yRot;
		//rotate( currentT, yRot, new THREE.Vector3( 0, 1, 0 ));
		scene.add(currentT);
	});
}

//
//deeplyClonedModels[1].position.x = 3;


// loader.load('flythroughs.001-I.glb', async function (gltf) {

// 	const modelI = gltf.scene;
// 	// wait until the model can be added to the scene without blocking due to shader compilation

// 	await renderer.compileAsync(modelI, camera, scene);
// 	scene.add(modelI);
// });

function animate() {
	controls.update();
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