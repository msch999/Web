import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { SimplexNoise } from 'three/addons/math/SimplexNoise.js'; // Or another noise library


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
plane.position.y = 1.5;
scene.add(plane);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.03;

function animate() {
    controls.update();
    renderer.render(scene, camera);
}

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

function generateProceduralPlane(width, depth, segmentsX, segmentsZ, noiseScale, noiseStrength) {
    const geometry = new THREE.BufferGeometry();

    const positions = [];
    const normals = [];
    const uvs = [];
    const indices = [];

    const simplex = new SimplexNoise();
    
    // Generate vertices
    for (let z = 0; z <= segmentsZ; z++) {
        for (let x = 0; x <= segmentsX; x++) {
            const currentX = (x / segmentsX) * width - width / 2;
            const currentZ = (z / segmentsZ) * depth - depth / 2;

            // Apply noise to Y coordinate
            const y = simplex.noise(currentX * noiseScale, currentZ * noiseScale) * noiseStrength;

            positions.push(currentX, y, currentZ);
            uvs.push(x / segmentsX, z / segmentsZ);
            // Normals will be calculated later or set to a default for now
            normals.push(0, 1, 0); // Placeholder, proper normals need to be calculated based on face geometry
        }
    }

    // Generate faces (indices)
    for (let z = 0; z < segmentsZ; z++) {
        for (let x = 0; x < segmentsX; x++) {
            const a = x + z * (segmentsX + 1);
            const b = (x + 1) + z * (segmentsX + 1);
            const c = x + (z + 1) * (segmentsX + 1);
            const d = (x + 1) + (z + 1) * (segmentsX + 1);

            // Two triangles per quad
            indices.push(a, b, d);
            indices.push(a, d, c);
        }
    }

    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    geometry.setAttribute('normal', new THREE.Float32BufferAttribute(normals, 3));
    geometry.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
    geometry.setIndex(indices);

    // Crucial for correct lighting, calculates normals based on face data
    geometry.computeVertexNormals();

    return geometry;
}

// generateProceduralPlane(width, depth, segmentsX, segmentsZ, noiseScale, noiseStrength)
// Usage:
const geometry = generateProceduralPlane(100, 100, 64, 64, 0.10, 5);
const material = new THREE.MeshStandardMaterial({ color: 0x00ff00, side: THREE.DoubleSide });
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

camera.position.y = 30;
camera.position.z = 37;

camera.lookAt(new THREE.Vector3(0, 0, 0));