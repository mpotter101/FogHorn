// Needs an import map to convert the exposed alias from the server... Why? Just let me access my files.
import * as THREE from 'three';
import { OrbitControls } from '/jsm/controls/OrbitControls.js';
import { FBXLoader } from '/jsm/loaders/FBXLoader.js';
import Stats from '/jsm/libs/stats.module.js';

const FBX_FILE_APARTMENTS = 'Block-Apartments.fbx';
const FBX_FILE_CITY_BOUNDARY = 'Block-City-Boundary.fbx';
const FBX_FILE_OFFICE = 'Block-Office.fbx';
const FBX_FILE_SHOPPING_1 = 'Block-Shopping-1.fbx';
const FBX_FILE_SHOPPING_2 = 'Block-Shopping-2.fbx';
const FBX_FILE_STATION = 'Block-Station.fbx';

var FogHornBoot = function () {
	const scene = new THREE.Scene()
	scene.add(new THREE.AxesHelper(5))

	
	const light = new THREE.PointLight()
	light.position.set(0.8, 1.4, 1.0)
	scene.add(light)

	const ambientLight = new THREE.AmbientLight()
	scene.add(ambientLight)
	const camera = new THREE.PerspectiveCamera(
		75,
		window.innerWidth / window.innerHeight,
		0.1,
		1000
	)
	camera.position.set(0.8, 1.4, 1.0)
	
	const renderer = new THREE.WebGLRenderer()
	renderer.setSize(window.innerWidth, window.innerHeight)
	document.body.appendChild(renderer.domElement)

	const controls = new OrbitControls(camera, renderer.domElement)
	controls.enableDamping = true
	controls.target.set(0, 1, 0)
	
	const fbxLoader = new FBXLoader()
	fbxLoader.load(
		FBX_FILE_APARTMENTS,
		(object) => {
			object.scale.setScalar(0.01);
			object.rotateX( -Math.PI / 2);
			scene.add(object)
		},
		(xhr) => {
			console.log((xhr.loaded / xhr.total) * 100 + '% loaded')
		},
		(error) => {
			console.log(error)
		}
	)
	
	window.addEventListener('resize', onWindowResize, false)
	function onWindowResize() {
		camera.aspect = window.innerWidth / window.innerHeight
		camera.updateProjectionMatrix()
		renderer.setSize(window.innerWidth, window.innerHeight)
		render()
	}

	const stats = new Stats()
	document.body.appendChild(stats.dom)

	function animate() {
		requestAnimationFrame(animate)

		controls.update()

		render()

		stats.update()
	}

	function render() {
		renderer.render(scene, camera)
	}

	animate()
}

window.FogHornBoot = FogHornBoot;