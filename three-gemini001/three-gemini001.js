import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
// Add text in the center
import { FontLoader } from 'three/addons/loaders/FontLoader.js';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';
import { Line2 } from 'three/addons/lines/Line2.js';
import { LineMaterial } from 'three/addons/lines/LineMaterial.js';
import { LineGeometry } from 'three/addons/lines/LineGeometry.js';

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

// // plane
// const geoPlane = new THREE.PlaneGeometry(5, 5);
// const matPlane = new THREE.MeshBasicMaterial({ color: 0x999999, side: THREE.DoubleSide });
// const plane = new THREE.Mesh(geoPlane, matPlane);
// plane.rotateX(- Math.PI / 2);
// plane.position.y = -1.0;
// scene.add(plane);

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
    positions[i * 3] = (Math.random() - 0.5) * 12; // x
    positions[i * 3 + 1] = (Math.random() - 0.5) * 12; // y 
    positions[i * 3 + 2] = (Math.random() - 0.5) * 12; // z
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

// Helper: color options for lines
// const colorOptions = [0xff69b4, 0x00ffff, 0xffff00, 0xff0000, 0x00ff00, 0xffa500, 0x0000ff, 0xffffff, 0x00ff00];
const colorOptions = [0xFFC312, 0xC4E538, 0x12CBC4, 0xFDA7DF, 0xED4C67,
0xF79F1F, 0xA3CB38, 0x1289A7, 0xD980FA];

// Store references to line objects for per-segment color animation
let linesCircle, linesCross;

// Add lines connecting only circle particles in index order
const lineMaterialCircle = new LineMaterial({ vertexColors: true, linewidth: 2, resolution: new THREE.Vector2(window.innerWidth, window.innerHeight) });
const lineGeometryCircle = new LineGeometry();
const linePositionsCircle = [];
const lineColorsCircle = [];
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
            // Initial color for this segment (random)
            const color = new THREE.Color(colorOptions[Math.floor(Math.random() * colorOptions.length)]);
            lineColorsCircle.push(color.r, color.g, color.b, color.r, color.g, color.b);
        }
        lastCircleIdx = i;
    }
}
lineGeometryCircle.setPositions(linePositionsCircle);
lineGeometryCircle.setColors(lineColorsCircle);
linesCircle = new Line2(lineGeometryCircle, lineMaterialCircle);
particlesGroup.add(linesCircle);

// Add lines connecting only cross particles in index order
const lineMaterialCross = new LineMaterial({ vertexColors: true, linewidth: 2, resolution: new THREE.Vector2(window.innerWidth, window.innerHeight) });
const lineGeometryCross = new LineGeometry();
const linePositionsCross = [];
const lineColorsCross = [];
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
            // Initial color for this segment (random)
            const color = new THREE.Color(colorOptions[Math.floor(Math.random() * colorOptions.length)]);
            lineColorsCross.push(color.r, color.g, color.b, color.r, color.g, color.b);
        }
        lastCrossIdx = i;
    }
}
lineGeometryCross.setPositions(linePositionsCross);
lineGeometryCross.setColors(lineColorsCross);
linesCross = new Line2(lineGeometryCross, lineMaterialCross);
particlesGroup.add(linesCross);

// Add text in the center
let textMesh;
let textMat;
const fontLoader = new FontLoader();
fontLoader.load('https://cdn.jsdelivr.net/npm/three@0.167.1/examples/fonts/droid/droid_sans_regular.typeface.json', function(font) {
    const textGeo = new TextGeometry(
        'Proudly programmed by Github Copilot GPT-4.1\nprompted by »msch«',
        {
            font: font,
            size: 0.35,
            depth: 0.05,
            curveSegments: 8,
            bevelEnabled: false
        }
    );
    textGeo.center();
    textMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    textMesh = new THREE.Mesh(textGeo, textMat);
    textMesh.position.set(0, 0, 0);
    scene.add(textMesh);
});

let particleRotation = 0;

camera.position.y = 1;
camera.position.z = 7;

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.03;

let animationRunning = true;
let rotationRunning = true;
let colorAnimationRunning = true;
let colorChangeTimer = 0;
const colorChangeInterval = 120; // frames between color changes (slower)
let clickState = 0; // 0: all running, 1: rotation stopped, 2: color stopped

function stopRotation() {
    rotationRunning = false;
}
function startRotation() {
    rotationRunning = true;
}
function stopColorAnimation() {
    colorAnimationRunning = false;
}
function startColorAnimation() {
    colorAnimationRunning = true;
}
function startAll() {
    animationRunning = true;
    rotationRunning = true;
    colorAnimationRunning = true;
    renderer.setAnimationLoop(animate);
}
function stopAll() {
    animationRunning = false;
    renderer.setAnimationLoop(null);
}

function toggleAnimation() {
    clickState = (clickState + 1) % 3;
    if (clickState === 1) {
        stopRotation();
        startColorAnimation();
        animationRunning = true;
        renderer.setAnimationLoop(animate);
    } else if (clickState === 2) {
        stopColorAnimation();
        animationRunning = true;
        renderer.setAnimationLoop(animate);
    } else {
        startAll();
    }
}

window.addEventListener('click', toggleAnimation);

function animate() {
    if (!animationRunning) return;
    if (rotationRunning) {
        particleRotation += 0.001;
        particlesGroup.rotation.y = particleRotation;
    }
    if (colorAnimationRunning) {
        colorChangeTimer++;
        if (colorChangeTimer >= colorChangeInterval) {
            colorChangeTimer = 0;
            // Animate colors for each segment (circles)
            if (linesCircle && linesCircle.geometry) {
                const colorsCircle = [];
                for (let i = 0; i < linePositionsCircle.length; i += 6) {
                    const color = new THREE.Color(colorOptions[Math.floor(Math.random() * colorOptions.length)]);
                    colorsCircle.push(color.r, color.g, color.b, color.r, color.g, color.b);
                }
                linesCircle.geometry.setColors(colorsCircle);
            }
            // Animate colors for each segment (crosses)
            if (linesCross && linesCross.geometry) {
                const colorsCross = [];
                for (let i = 0; i < linePositionsCross.length; i += 6) {
                    const color = new THREE.Color(colorOptions[Math.floor(Math.random() * colorOptions.length)]);
                    colorsCross.push(color.r, color.g, color.b, color.r, color.g, color.b);
                }
                linesCross.geometry.setColors(colorsCross);
            }
        }
    }
    // Animate text color fade between line colors
    if (textMat) {
        const t = performance.now() * 0.0005;
        // Pick two colors from colorOptions to fade between
        const idxA = Math.floor(t) % colorOptions.length;
        const idxB = (idxA + 1) % colorOptions.length;
        const colorA = new THREE.Color(colorOptions[idxA]);
        const colorB = new THREE.Color(colorOptions[idxB]);
        const blend = t % 1;
        // Linear interpolation
        textMat.color.r = colorA.r * (1 - blend) + colorB.r * blend;
        textMat.color.g = colorA.g * (1 - blend) + colorB.g * blend;
        textMat.color.b = colorA.b * (1 - blend) + colorB.b * blend;
    }
    controls.update();
    renderer.render(scene, camera);
}

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    if (lineMaterialCircle) lineMaterialCircle.resolution.set(window.innerWidth, window.innerHeight);
    if (lineMaterialCross) lineMaterialCross.resolution.set(window.innerWidth, window.innerHeight);
});