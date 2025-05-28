import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// TextureLoader
const loader = new THREE.TextureLoader();
const cross = loader.load('./cross.png');
const circle = loader.load('./circle.png');

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
const particleTextures = [cross, circle];
const particlesMaterials = particleTextures.map(tex => new THREE.PointsMaterial({
    size: 0.1,
    map: tex,
    transparent: true,
    color: 'yellow'
}));

const particleCount = 200;
const particlesGeometry = new THREE.BufferGeometry();
const positions = new Float32Array(particleCount * 3);
const materialsForParticles = [];
for (let i = 0; i < particleCount; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 10; // x
    positions[i * 3 + 1] = Math.random() * 5 + 0.5; // y
    positions[i * 3 + 2] = (Math.random() - 0.5) * 10; // z
    // Randomly assign a material (cross or circle)
    materialsForParticles.push(particlesMaterials[Math.floor(Math.random() * particlesMaterials.length)]);
}
particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

// Create a group to hold all particles with different textures
const particlesGroup = new THREE.Group();
for (let i = 0; i < particleCount; i++) {
    const singleParticleGeometry = new THREE.BufferGeometry();
    singleParticleGeometry.setAttribute('position', new THREE.BufferAttribute(positions.slice(i * 3, i * 3 + 3), 3));
    const singleParticle = new THREE.Points(singleParticleGeometry, materialsForParticles[i]);
    particlesGroup.add(singleParticle);
}
scene.add(particlesGroup);

// Add lines connecting only circle particles in index order
const lineMaterialCircle = new THREE.LineBasicMaterial({ color: 0x00ffff, linewidth: 1 });
const lineGeometryCircle = new THREE.BufferGeometry();
const linePositionsCircle = [];
let lastCircleIdx = null;
for (let i = 0; i < particleCount; i++) {
    if (materialsForParticles[i] === particlesMaterials[1]) { // 1 = circle
        if (lastCircleIdx !== null) {
            const idxA = lastCircleIdx * 3;
            const idxB = i * 3;
            linePositionsCircle.push(
                positions[idxA], positions[idxA + 1], positions[idxA + 2],
                positions[idxB], positions[idxB + 1], positions[idxB + 2]
            );
        }
        lastCircleIdx = i;
    }
}
lineGeometryCircle.setAttribute('position', new THREE.Float32BufferAttribute(linePositionsCircle, 3));
const linesCircle = new THREE.LineSegments(lineGeometryCircle, lineMaterialCircle);
particlesGroup.add(linesCircle);

// Add lines connecting only cross particles in index order
const lineMaterialCross = new THREE.LineBasicMaterial({ color: 0xff69b4, linewidth: 1 }); // Hot pink
const lineGeometryCross = new THREE.BufferGeometry();
const linePositionsCross = [];
let lastCrossIdx = null;
for (let i = 0; i < particleCount; i++) {
    if (materialsForParticles[i] === particlesMaterials[0]) { // 0 = cross
        if (lastCrossIdx !== null) {
            const idxA = lastCrossIdx * 3;
            const idxB = i * 3;
            linePositionsCross.push(
                positions[idxA], positions[idxA + 1], positions[idxA + 2],
                positions[idxB], positions[idxB + 1], positions[idxB + 2]
            );
        }
        lastCrossIdx = i;
    }
}
lineGeometryCross.setAttribute('position', new THREE.Float32BufferAttribute(linePositionsCross, 3));
const linesCross = new THREE.LineSegments(lineGeometryCross, lineMaterialCross);
particlesGroup.add(linesCross);

let particleRotation = 0;

camera.position.y = 7;
camera.position.z = 6;

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.03;

function animate() {
	particleRotation += 0.001;
	particlesGroup.rotation.y = particleRotation;
	controls.update();
	renderer.render(scene, camera);
}

window.addEventListener('resize', onWindowResize, false);

function onWindowResize() {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize(window.innerWidth, window.innerHeight);
}