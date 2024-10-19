//
// https://youtu.be/sPereCgQnWQ?t=4223

import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);

class Box extends THREE.Mesh {
  constructor({ width, height, depth, color = '#00ff00',
    velocity = {
      x: 0, y: 0, z: 0
    },
    position = {
      x: 0, y: 0, z: 0
    }
  }) {
    super(
      new THREE.BoxGeometry(width, height, depth),
      new THREE.MeshStandardMaterial({ color })
    )
    this.width = width;
    this.height = height;
    this.depth = depth;

    this.position.set(position.x, position.y, position.z);

    this.bottom = this.position.y - this.height / 2;
    this.top = this.position.y + this.height / 2;

    this.velocity = velocity;
    this.gravity = -0.002;
    //console.log(this.velocity);
  }

  update(group) {
    this.bottom = this.position.y - this.height / 2;
    this.top = this.position.y + this.height / 2;

    this.position.x += this.velocity.x;
    this.position.z += this.velocity.z;
    this.applyGravity();
  }

  applyGravity() {
    this.velocity.y += this.gravity;

    // this is where the ground is hit
    if (this.bottom + this.velocity.y <= ground.top) {
      this.velocity.y *= 0.8;
      this.velocity.y = -this.velocity.y;
    }
    else
      this.position.y += this.velocity.y;
  }
}

const cube = new Box({
  width: 1,
  height: 1,
  depth: 1,
  velocity: {
    x: 0,
    y: -0.01,
    z: 0
  }
});
cube.castShadow = true;
scene.add(cube);

const ground = new Box({
  width: 5,
  height: 0.5,
  depth: 10,
  color: '#0000ff',
  position: {
    x: 0, y: -2, z: 0
  }
});
ground.receiveShadow = true;
scene.add(ground);

const light = new THREE.DirectionalLight(0xffffff, 3);
light.position.x = -2;
light.position.y = 3;
light.position.z = 2;
light.castShadow = true;
scene.add(light);

camera.position.z = 5;

const keys = {
  a: {
    pressed: false
  },
  d: {
    pressed: false
  },
  s: {
    pressed: false
  },
  w: {
    pressed: false
  }
}

window.addEventListener('keydown', (event) => {
  //console.log(event);
  switch (event.code) {
    case 'KeyA':
      keys.a.pressed = true;
      break;
    case 'KeyD':
      keys.d.pressed = true;
      break;
    case 'KeyS':
      keys.s.pressed = true;
      break;
    case 'KeyW':
      keys.w.pressed = true;
      break;
    default:
      break;
  }
})

window.addEventListener('keyup', (event) => {
  switch (event.code) {
    case 'KeyA':
      keys.a.pressed = false;
      break;
    case 'KeyD':
      keys.d.pressed = false;
      break;
    case 'KeyS':
      keys.s.pressed = false;
      break;
    case 'KeyW':
      keys.w.pressed = false;
      break;
    default:
      break;
  }
})

function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);

  // movement code
  cube.velocity.x = 0;
  cube.velocity.z = 0;
  if (keys.a.pressed) cube.velocity.x = -0.01 
  else if (keys.d.pressed) cube.velocity.x = 0.01;

  if (keys.s.pressed) cube.velocity.z = 0.01
  else if (keys.w.pressed) cube.velocity.z = -0.01;

  cube.update(ground);
  //cube.position.y += -0.01;
  // if (cube.position.y < -1.50)
  //   cube.position.y = -1.5;
  //   cube.rotation.x += 0.01;
  //   cube.rotation.y += 0.01; 
}

animate();