import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';

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

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setAnimationLoop(animate);
document.body.appendChild(renderer.domElement);

// lights

// White directional light at half intensity shining from the top.
// const directionalLight = new THREE.DirectionalLight( 0xffffff, 0.5 );
// scene.add( directionalLight );


const pointLight = new THREE.PointLight( 0xaaaaaa, 15, 10, 1.5 );   // color, intensity, distance, decay
pointLight.position.set( 1, 1, 1 );
scene.add( pointLight );

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

// const gridHelper = new THREE.GridHelper(10 /* size */, 10 /* divisions */);
// gridHelper.position.y = -0.9;
// scene.add(gridHelper);

const geoCube = new THREE.BoxGeometry(1, 1, 1);
const matCube = new THREE.MeshStandardMaterial( { color: 0x999955, wireframe: false } );
//const matCube = new THREE.MeshPhongMaterial({ color: 0xffff00, flatShading: true });
//const matCube = new THREE.MeshNormalMaterial({ wireframe: false, transparent: true, opacity: 0.8 });

const cube = new THREE.Mesh(geoCube, matCube);
scene.add(cube);
cube.visible = true;   // testing

const geometry = new THREE.BufferGeometry();

// create a simple square shape. We duplicate the top left and bottom right
// vertices because each vertex needs to appear once per triangle.
const vertices = new Float32Array( [

	-1.0, -1.0,  1.0, // v0: unten links
	 1.0, -1.0,  1.0, // v1: unten rechts 
	 1.0,  1.0,  1.0, // v2: oben rechts

	 1.0,  1.0,  1.0, // v3: oben rechts
	-1.0,  1.0,  1.0, // v4: oben links
	-1.0, -1.0,  1.0, // v5: unten links

	1.0,  1.0,  1.0, 
	1.0,  1.0,  -1.0,
	1.0, -1.0,  1.0, 

	1.0,  1.0,  -1.0,
	1.0, -1.0,  1.0, 
	1.0, -1.0,  -1.0 

] );

// itemSize = 3 because there are 3 values (components) per vertex
geometry.setAttribute( 'position', new THREE.BufferAttribute( vertices, 3 ) );

const matMesh = new THREE.MeshBasicMaterial( { color: 0xaaaa00, side: THREE.DoubleSide } );

// const matMesh = new THREE.MeshStandardMaterial({ color: 0xffff00, side: THREE.DoubleSide, metalness : 0.001, roughness: 0.001 });
// const matMesh = new THREE.MeshPhongMaterial( {
// 	color: 0xff0000,
// 	specular: 0xffffff,
// 	shininess: 30,
// 	side: THREE.DoubleSide,
// 	// vertexColors: true,
// 	transparent: false
// } );
//const material = new THREE.MeshLambertMaterial({color:0xFF00FF,side: THREE.DoubleSide});

const mesh = new THREE.Mesh( geometry, matMesh );
mesh.position.z = -1;
//mesh.rotateX(-0.5);
scene.add(mesh);

camera.position.x = 0;
camera.position.y = 2;
camera.position.z = 4;

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.03;

const gui = new GUI();
gui.add(document, 'title');
gui.add(controls, 'enableDamping', true);

const cubefolder = gui.addFolder('the cube');

const cubeParams = {
	resetToDefault() { setDefaultCubeParams() },
	opacityChangeSwitch: false,
	rotationVelocity: 0.003,
	rotationSwitch: false,
	rotationXplus: true,
	rotationX: true,
	rotationYplus: true,
	rotationY: true
};

cubefolder.add(cubeParams, 'resetToDefault');
cubefolder.add(matCube, 'opacity', 0, 1).listen();
cubefolder.add(cubeParams, 'opacityChangeSwitch').name('auto opacity').listen();

cubefolder.add(cubeParams, 'rotationVelocity', 0, 1).listen();
cubefolder.add(cubeParams, 'rotationSwitch').listen();  // .disable();
cubefolder.add(cubeParams, 'rotationXplus').listen();
cubefolder.add(cubeParams, 'rotationX').listen();
cubefolder.add(cubeParams, 'rotationYplus').listen();
cubefolder.add(cubeParams, 'rotationY').listen();

function setDefaultCubeParams() {
	cubeParams.opacityChangeSwitch = false;
	cubeParams.rotationVelocity = 0.003;
	cubeParams.rotationSwitch = false;
	cubeParams.rotationXplus = true;
	cubeParams.rotationX = true;
	cubeParams.rotationYplus = true;
	cubeParams.rotationY = true;
	matCube.opacity = 0.8;
}

function animateCubeParams() {
	if (cubeParams.rotationSwitch) {
		if (cubeParams.rotationXplus) {
			if (cubeParams.rotationX)
				cube.rotation.x += cubeParams.rotationVelocity;
		} else {
			cube.rotation.x -= cubeParams.rotationVelocity;
		}

		if (cubeParams.rotationYplus) {
			if (cubeParams.rotationY)
				cube.rotation.y += cubeParams.rotationVelocity;
		} else {
			cube.rotation.y -= cubeParams.rotationVelocity;
		}
	}

	if (cubeParams.opacityChangeSwitch) {
		// constantly change :  Math.sin(Date.now() * 0.001) * 2.5;
		matCube.opacity = Math.sin(Date.now() * 0.001) * 1;
	}
}

function animate() {

	animateCubeParams();

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
		cubeParams.rotationSwitch = !cubeParams.rotationSwitch;
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