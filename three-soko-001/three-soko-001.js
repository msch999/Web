import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { SimplexNoise } from 'three/addons/math/SimplexNoise.js'; // Or another noise library
//------------------------------------------------------------------------------------------
import Grid from "../../sokoban-generator/src/grid.js";

export function generateSokobanLevel(parameters = {}) {
  let {
    width = 9,
    height = 9,
    boxes = 3,
    minWalls = 13,
    attempts = 5000,
    seed = Date.now(),
    initialPosition,
    type = "string",
  } = parameters;

  let grid = new Grid(width, height, boxes, seed, minWalls, initialPosition);

  while (--attempts > 0) {
    if (!grid.applyTemplates()
      || !grid.isGoodCandidate()
      || !grid.redeployGoals()
      || !grid.generateFarthestBoxes()) {
      continue;
    }

    if (type === "string") {
      return grid.toReadableString();
    }

    if (type === "class") {
      return grid;
    }

    console.warn(`sokoban-generator/generateSokobanLevel: Unrecognized value for key "string": ${type}. It should be either "string" or "class`);
    return grid.toReadableString();
  }

  return null;
}

// var myrng = new Math.seedrandom('Aabcdefh');
// var myrng = new Math.seedrandom();
var myrng = new Math.seedrandom('hello.');
//console.log(myrng());                // Always 0.9282578795792454
// console.log(myrng());                // Always 0.3752569768646784
const options = {
  width: 9, // the width of the sokoban grid 
  height: 6, // the height of the sokoban grid
  boxes: 3, // the boxes on the grid
  minWalls: 13, // the minimum number of walls on the grid
  attempts: 5000, // when generating the map, the maximum attempts
  seed: myrng(), // map seed. See note below
  initialPosition: { // The initial position of player
    x: 3,
    y: 0
  },
  type: "class", // the return type, either "string" or "class" 
};

let sokoLev = generateSokobanLevel(options);

if (!sokoLev) {
  console.error('Failed to generate a valid Sokoban level.');
} 

//var readableStr = sokoLev._data.toReadableString();
//console.log(readableStr);
//------------------------------------------------------------------------------------------

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
const geoPlane = new THREE.PlaneGeometry(options.width, options.height);
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

// --- Sokoban Level Rendering ---
let i = 0;
let l = [];
let row = '';
let data = sokoLev._data.toReadableString();
for (let i = 0; i < data.length; i++) {
  if (data[i] === '\n') {
    l.push(row);
    row = '';
    continue;
  }       
  row = row + data[i];    
}
console.log(data);
const lev001 = l

const cellSize = 1; // 1x1x1 boxes
const yOffset = 0.5; // so boxes sit on the plane

const colors = {
  wall: 'gray',
  player: 'green',
  box: 'orange', 
  goal: 'yellow',
  boxOnGoal: 0xffcc66, // light orange
  playerOnGoal: 'lightblue'
};

for (let y = 0; y < lev001.length; y++) {
  const row = lev001[y];
  for (let x = 0; x < row.length; x++) {
    const cell = row[x];
    let mesh = null;
    if (cell === '#') {
      // Wall
      mesh = new THREE.Mesh(
        new THREE.BoxGeometry(cellSize, cellSize, cellSize),
        new THREE.MeshLambertMaterial({ color: colors.wall })
      );
    } else if (cell === '@') {
      // Player
      mesh = new THREE.Mesh(
        new THREE.BoxGeometry(cellSize, cellSize, cellSize),
        new THREE.MeshLambertMaterial({ color: colors.player })
      );
    } else if (cell === '$') {
      // Box
      mesh = new THREE.Mesh(
        new THREE.BoxGeometry(cellSize, cellSize, cellSize),
        new THREE.MeshLambertMaterial({ color: colors.box })
      );
    } else if (cell === '.') {
      // Goal
      mesh = new THREE.Mesh(
        new THREE.BoxGeometry(cellSize, cellSize, cellSize),
        new THREE.MeshLambertMaterial({ color: colors.goal })
      );
    } else if (cell === '*') {
      // Box on goal
      mesh = new THREE.Mesh(
        new THREE.BoxGeometry(cellSize, cellSize, cellSize),
        new THREE.MeshLambertMaterial({ color: colors.boxOnGoal })
      );
    } else if (cell === '+') {
      // Player on goal
      mesh = new THREE.Mesh(
        new THREE.BoxGeometry(cellSize, cellSize, cellSize),
        new THREE.MeshLambertMaterial({ color: colors.playerOnGoal })
      );
    }
    if (mesh) {
      mesh.position.set(
        x - lev001[0].length / 2 + 0.5,
        yOffset,
        y - lev001.length / 2 + 0.5
      );
      scene.add(mesh);
    }
  }
}
// --- End Sokoban Level Rendering ---
