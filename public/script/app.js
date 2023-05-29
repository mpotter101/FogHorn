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
const FBX_FILES = [
	FBX_FILE_APARTMENTS, FBX_FILE_OFFICE,
	FBX_FILE_SHOPPING_1, FBX_FILE_SHOPPING_2, FBX_FILE_STATION
];

window.THREE = THREE;

var FogHornBoot = function () {
	this.scene = new THREE.Scene()
	this.scene.add(new THREE.AxesHelper(5))
	
	this.light = new THREE.PointLight()
	this.light.position.set(0.8, 1.4, 1.0)
	this.scene.add(this.light)

	this.ambientLight = new THREE.AmbientLight()
	this.scene.add(this.ambientLight)
	this.camera = new THREE.PerspectiveCamera(
		75,
		window.innerWidth / window.innerHeight,
		0.1,
		20000
	)
	this.camera.position.set(0.8, 1.4, 1.0)
	
	this.renderer = new THREE.WebGLRenderer()
	this.renderer.setSize(window.innerWidth, window.innerHeight)
	document.body.appendChild(this.renderer.domElement)

	this.controls = new OrbitControls(this.camera, this.renderer.domElement)
	this.controls.enableDamping = true
	this.controls.target.set(0, 1, 0)
	
	this.sky = new THREE.Mesh(
        new THREE.SphereGeometry(10000, 32, 32),
        new THREE.MeshBasicMaterial({
            color: 0x8080FF,
            side: THREE.BackSide,
        })
    );
    this.scene.add(this.sky);
	
	this.blocks = [];
	const fbxLoader = new FBXLoader()
	
	this.blockSize
	this.SetupBlocks = () => {
		let box3 = new THREE.Box3().setFromObject( this.blocks[0] );
		let size = new THREE.Vector3();
		box3.getSize(size);
		this.blockSize = box3;
		
		// assume assets are same size for now;
		Object.assign (this.blocks [0].position, new THREE.Vector3(0, 0, 0));
		Object.assign (this.blocks [1].position, new THREE.Vector3(-box3.max.x, 0, 0));
		Object.assign (this.blocks [2].position, new THREE.Vector3(-box3.max.x * 2, 0, 0));
		Object.assign (this.blocks [3].position, new THREE.Vector3(-box3.max.x * 3, 0, 0));
		Object.assign (this.blocks [4].position, new THREE.Vector3(-box3.max.x * 4, 0, 0));
	}
	
	FBX_FILES.forEach(file => {
		fbxLoader.load(
		file,
		(object) => {
			object.scale.setScalar(0.01);
			object.rotateX( -Math.PI / 2 );
			this.blocks.push (object);
			this.scene.add(object);
			
			if (this.blocks.length == FBX_FILES.length) {
				this.SetupBlocks();
			}
		}
	)
	});
	
	
	this.onWindowResize = () => {
		this.camera.aspect = window.innerWidth / window.innerHeight
		this.camera.updateProjectionMatrix()
		this.renderer.setSize(window.innerWidth, window.innerHeight)
		this.render()
	}
	window.addEventListener('resize', this.onWindowResize, false)

	this.stats = new Stats()
	document.body.appendChild(this.stats.dom)
	
	this.MoveAndLeapBlocks = () => {
		if (this.blockSize) {
			this.blocks.forEach (block => {
				block.translateX ( 0.1 );
				
				if (block.position.x > this.blockSize.max.x) {
					block.position.x = -this.blockSize.max.x * 4
				}
			});
		}
	};

	this.animate = () => {
		requestAnimationFrame(this.animate)

		this.controls.update()
		
		this.MoveAndLeapBlocks();

		this.render()

		this.stats.update()
	}

	this.render = () => {
		this.renderer.render(this.scene, this.camera)
	}
	
	this.totalTime_ = 0.0;
    this.previousRAF_ = null;
	this.scene.fog = new THREE.FogExp2(0xff33d2, 0.05);
	
	this.animate()
}

window.app = new FogHornBoot();