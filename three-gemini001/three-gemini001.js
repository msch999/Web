import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// TextureLoader
const loader = new THREE.TextureLoader();
const cross = loader.load('./cross.png');

const scene = new THREE.Scene();
// wireframe material toggle
const overrideMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: true });
document.addEventListener('keydown', function (event) {
	// W Pressed: Toggle wireframe
	if (event.key === 'W') {
		console.log('W Pressed: Toggle wireframe');
		if (scene.overrideMaterial != overrideMaterial) {
			scene.overrideMaterial = overrideMaterial;
		} else {
			scene.overrideMaterial = null;
		}
		//scene.material.needsUpdate = true;
	}
});
// wireframe material toggle

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

// Add particles
const particlesMaterial = new THREE.PointsMaterial({
	size: 0.1,
	map: cross,
	transparent: true,
	color: 'yellow'
})

const particleCount = 200;
const particlesGeometry = new THREE.BufferGeometry();
const positions = new Float32Array(particleCount * 3);
for (let i = 0; i < particleCount; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 10; // x
    positions[i * 3 + 1] = Math.random() * 5 + 0.5; // y
    positions[i * 3 + 2] = (Math.random() - 0.5) * 10; // z
}
particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

const particles = new THREE.Points(particlesGeometry, particlesMaterial);
scene.add(particles);

// Add lines connecting some particles
const lineMaterial = new THREE.LineBasicMaterial({ color: 0x00ffff, linewidth: 1 });
const lineGeometry = new THREE.BufferGeometry();
const linePositions = [];

// Connect every 10th particle to the next one (as an example)
for (let i = 0; i < particleCount - 1; i += 10) {
    const idxA = i * 3;
    const idxB = (i + 10) * 3;
    if (idxB < positions.length) {
        // Point A
        linePositions.push(positions[idxA], positions[idxA + 1], positions[idxA + 2]);
        // Point B
        linePositions.push(positions[idxB], positions[idxB + 1], positions[idxB + 2]);
    }
}
lineGeometry.setAttribute('position', new THREE.Float32BufferAttribute(linePositions, 3));
const lines = new THREE.LineSegments(lineGeometry, lineMaterial);
particles.add(lines);

let particleRotation = 0;

camera.position.z = 6;

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.03;

function animate() {
	particleRotation += 0.01;
	particles.rotation.y = particleRotation;
	controls.update();
	renderer.render(scene, camera);
}

window.addEventListener('resize', onWindowResize, false);

function onWindowResize() {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize(window.innerWidth, window.innerHeight);
}