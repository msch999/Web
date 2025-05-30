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
plane.position.y = -0.01;
scene.add(plane);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.03;

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

camera.position.y = 3;
camera.position.z = 4;

function animate() {
    controls.update();
    renderer.render(scene, camera);
}

const wall = '#';
const player = '@';
const box = 'o';
const target = '^'; 
const empty = '.'; 
// Level definition
// This is a simple level layout using characters
// '#' walls, '@' player, 'o' boxes, '^' targets, '.' empty spaces
// The level is a 2D array of strings, each string represents a row 
const level = {
    lev001: [
        "#####",
        "#.@^#",
        "#.o.#",
        "#...#",
        "#####"]
};