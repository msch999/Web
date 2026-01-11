import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import SokobanInfinite from "./src/SokobanInfinite.js";
import { WIDTH, HEIGHT } from "./src/SokobanInfinite.js";
//------------------------------------------------------------------------------------------
import Grid from "./src/grid.js";

export function generateSokobanLevel(parameters = {}) {
  let {
    width = 9,
    height = 12,
    boxes = 1,
    minWalls = 13,
    attempts = 5000,
    seed = Date.now(),
    initialPosition,
    type = "string",
  } = parameters;

  console.log('three-soko-001.generateSokobanLevel() ' +  parameters);

  let grid = new Grid(width, height, boxes, seed, minWalls, initialPosition);

  while (--attempts > 0) {
    if (!grid.applyTemplates()
      || !grid.isGoodCandidate()
      || !grid.redeployGoals()
      || !grid.generateFarthestBoxes()) {
      continue;
    }

    console.log(`three-soko-001.generateSokobanLevel() - Found a valid Sokoban level after ${5000 - attempts} attempts.`);  
    console.log(grid.toReadableString());

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
camera.position.y = 6;
camera.position.z = 3;

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setAnimationLoop(animate);
document.body.appendChild(renderer.domElement);

// lights
const dirLight1 = new THREE.DirectionalLight(0xffffff, 3);
dirLight1.position.set(5, 7, 2);
scene.add(dirLight1);

const dirLight2 = new THREE.DirectionalLight(0x002288, 3);
dirLight2.position.set(- 5, 5, - 2);
scene.add(dirLight2);

const ambientLight = new THREE.AmbientLight(0x555555);
scene.add(ambientLight);

// plane
const geoPlane = new THREE.PlaneGeometry(WIDTH, HEIGHT);
const matPlane = new THREE.MeshBasicMaterial({ color: 0x999999, side: THREE.DoubleSide });
const plane = new THREE.Mesh(geoPlane, matPlane);
plane.rotateX(- Math.PI / 2);
plane.position.y = -0.001;
scene.add(plane);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.03;

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

let curState, prevState = null;

function animate() {
  controls.update();
  renderer.render(scene, camera);

  if (curState && prevState) {
    curState = soko3.state.player;
    // Check if the state has changed
    if (curState !== prevState) {
      // Update the scene based on the new state
      console.log('State has changed, updating scene...');
      renderState();
      prevState = curState; // Update prevState to current state
    }
  }

  // --- Example: Use SokobanInfinite state in animate ---
  // Access player and box positions from soko3
  // (Replace this with code to update your 3D objects as needed)
  // Player position:
  // console.log('Player:', soko3.state.player);
  // Boxes:
  // console.log('Boxes:', soko3.state.boxes);
  // Grid (2D array):
  // console.log('Grid:', soko3.state.grid);
  // --- End Example ---
}



let soko3 = new SokobanInfinite();
soko3.componentDidMount();

function failureCallback(error) {
  console.error(`Error generating: ${error}`);
}

function startFirstNewProblem() {
  new Promise(res => {
    soko3.startNewProblem();

    setTimeout(() => res(), 500);
  }).then(successCallback, failureCallback);
}

// first generation of level
startFirstNewProblem();
// document.addEventListener('keydown', soko3.handleKeyDown.bind(soko3));

function successCallback() {
  console.log('successCallback()');

  renderState();
  curState = soko3.state.player;
  prevState = curState;
}

const cellSize = 0.95; // 1x1x1 boxes = 1.00
const yOffset = cellSize / 2; // so boxes sit on the plane

function renderState() {
  // let width = soko3.state.grid[0].length;
  // let height = soko3.state.grid.length;
  // let level = soko3.initialLevel.toReadableString();
  let level = soko3.state.grid._data.toReadableString();
  let width = soko3.state.grid._width;
  let height = soko3.state.grid._height;
  console.log('renderState()\n');

  const colors = {
    wall: 'gray',
    player: 'green',
    box: 'orange',
    goal: 'yellow',
    boxOnGoal: 0xffcc66, // light orange
    playerOnGoal: 'lightblue'
  };

  let x = 0
  let y = 0;
  for (let i = 0; i < level.length; i++) {
    let c = level[i];
    let mesh = null;
    x++;
    switch (c) {
      case '\n': // Newline character
        y++;
        x = 0; // Reset x for the next row
        break;
      case ' ': // Empty space
        // mesh = new THREE.Mesh(
        //   new THREE.BoxGeometry(cellSize, cellSize, cellSize),
        //   new THREE.MeshLambertMaterial({ color: colors.playerOnGoal })
        // );
        break
      case '#': // Wall
        mesh = new THREE.Mesh(
          new THREE.BoxGeometry(cellSize, cellSize, cellSize),
          new THREE.MeshLambertMaterial({ color: colors.wall })
        );
        break;
      case '@': // Player
        mesh = new THREE.Mesh(
          new THREE.BoxGeometry(cellSize, cellSize, cellSize),
          new THREE.MeshLambertMaterial({ color: colors.player })
        );
        break;
      case '$': // Box
        mesh = new THREE.Mesh(
          new THREE.BoxGeometry(cellSize, cellSize, cellSize),
          new THREE.MeshLambertMaterial({ color: colors.box })
        );
        break;
      case '.': // Goal
        mesh = new THREE.Mesh(
          new THREE.BoxGeometry(cellSize, cellSize / 10, cellSize),
          new THREE.MeshLambertMaterial({ color: colors.goal })
        );
        break;
      case '*': // Box on goal
        break
      case '+': // Player on goal
        break;
      default:
        console.warn(`Unrecognized character in Sokoban level: ${c}`);
    }

    if (mesh) {
      mesh.position.set(
        (x - (width / 2) - (cellSize / 2)),
        yOffset,
        (y - (height / 2)) + (cellSize / 2));
      // console.log(`Adding mesh at position: (${x}, ${yOffset}, ${y})`);
      scene.add(mesh);
    }
  }

}
