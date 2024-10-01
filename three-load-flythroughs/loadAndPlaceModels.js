import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { scene } from "./three-load-flythroughs.js";

//  GLTFLoader
THREE.Cache.enabled = true;
var loader = new GLTFLoader().setPath('public/');
// rotation helper
// https://stackoverflow.com/questions/29907536/how-can-i-rotate-a-mesh-by-90-degrees-in-threejs
// e.g. rotate( myMesh, 90, new THREE.Vector3( 0, 0, 1 ) );
function rotate(object, deg, axis) {
	// axis is a THREE.Vector3
	var q = new THREE.Quaternion();
	q.setFromAxisAngle(axis, THREE.MathUtils.degToRad(deg)); // we need to use radians
	q.normalize();
	object.quaternion.multiply(q);
}
// Modell laden und mehrfach platzieren mit async/await
// Funktion zum Laden und Platzieren beider Modelle
export async function loadAndPlaceModels() {
	try {
		// 1. Lade beide GLTF-Modelle asynchron
		const [gltf1, gltf2] = await Promise.all([
			loader.loadAsync('flythroughs.004.Xud.glb'),
			loader.loadAsync('flythroughs.004.Xud.floor.glb')
		]);

		const modelFrame = gltf1.scene;
		const modelFloor = gltf2.scene;

		const placementMap = [
			//	 x, y, z, rotation, form 
			[0, 0, 0, 0, 'I'],
			[0, 0, -2, 0, 'I'],

			[0, 0, -4, 0, 'X'],

			[-2, 0, -4, 90, 'I'],
			[2, 0, -4, 90, 'I'],

			[0, 0, -6, 0, 'I'],
			[0, 0, -8, 0, 'T'],

			[-2, 0, -8, 90, 'I'],
			[2, 0, -8, 90, 'I'],

			[-4, 0, -4, -90, 'L'],
			[-4, 0, -2, 0, 'I'],
			[-4, 0, 0, 0, 'L']
		];

		function addTop() {
			var modelFloorClone = modelFloor.clone();
			rotate(modelFloorClone, 180, new THREE.Vector3(1, 0, 0)); // top
			return modelFloorClone;
		}

		function addBottom() {
			var modelFloorClone = modelFloor.clone();
			// no rotation needed
			return modelFloorClone;
		}

		function addWest() {
			var modelFloorClone = modelFloor.clone();
			rotate(modelFloorClone, -90, new THREE.Vector3(0, 0, 1)); // west
			return modelFloorClone;
		}

		function addEast() {
			var modelFloorClone = modelFloor.clone();
			rotate(modelFloorClone, 90, new THREE.Vector3(0, 0, 1)); // east
			return modelFloorClone;
		}

		function addNorth() {
			var modelFloorClone = modelFloor.clone();
			rotate(modelFloorClone, 90, new THREE.Vector3(1, 0, 0)); // north
			return modelFloorClone;
		}

		function addSouth() {
			var modelFloorClone = modelFloor.clone();
			rotate(modelFloorClone, -90, new THREE.Vector3(1, 0, 0)); // south
			return modelFloorClone;
		}

		function addModelI(x, y, z, r) {
			var modelFrameClone = modelFrame.clone();
			modelFrameClone.add(addEast());
			modelFrameClone.add(addWest());
			modelFrameClone.add(addTop());
			modelFrameClone.add(addBottom());

			rotate(modelFrameClone, r, new THREE.Vector3(0, 1, 0));
			modelFrameClone.position.set(x, y, z);
			scene.add(modelFrameClone);
		}

		function addModelX(x, y, z, r) {
			var modelFrameClone = modelFrame.clone();
			modelFrameClone.add(addTop());
			modelFrameClone.add(addBottom());

			rotate(modelFrameClone, r, new THREE.Vector3(0, 1, 0));
			modelFrameClone.position.set(x, y, z);
			scene.add(modelFrameClone);
		}

		function addModelT(x, y, z, r) {
			var modelFrameClone = modelFrame.clone();
			modelFrameClone.add(addTop());
			modelFrameClone.add(addBottom());
			modelFrameClone.add(addNorth());

			rotate(modelFrameClone, r, new THREE.Vector3(0, 1, 0));
			modelFrameClone.position.set(x, y, z);
			scene.add(modelFrameClone);
		}

		function addModelL(x, y, z, r) {
			var modelFrameClone = modelFrame.clone();
			modelFrameClone.add(addTop());
			modelFrameClone.add(addBottom());
			modelFrameClone.add(addSouth());
			modelFrameClone.add(addWest());

			rotate(modelFrameClone, r, new THREE.Vector3(0, 1, 0));
			modelFrameClone.position.set(x, y, z);
			scene.add(modelFrameClone);
		}

		for (let i = 0; i < placementMap.length; i++) {
			//	 x, y, z, rotation, form 
			var curX = placementMap[i][0];
			var curY = placementMap[i][1];
			var curZ = placementMap[i][2];
			var curR = placementMap[i][3];
			var curF = placementMap[i][4];

			switch (curF) {
				case 'I':
					addModelI(curX, curY, curZ, curR);
					break;
				case 'X':
					addModelX(curX, curY, curZ, curR);
					break;
				case 'T':
					addModelT(curX, curY, curZ, curR);
					break;
				case 'L':
					addModelL(curX, curY, curZ, curR);
					break;
				default:
					break;
			}

			// console.log('i: ' + i + ', ' + curX + ' ' + curY + ' ' + curZ + ' ' + curR + ' ' + curF);
		}
	} catch (error) {
		console.error('Error loading GLTF models:', error);
	}
}
