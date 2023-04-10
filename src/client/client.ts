import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { DragControls } from 'three/examples/jsm/controls/DragControls'
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader'
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader'
import Stats from 'three/examples/jsm/libs/stats.module'
import { GUI } from 'dat.gui'
import { BoxGeometry } from 'three'

// Setup Scene
const scene = new THREE.Scene()
scene.add(new THREE.AxesHelper(15))
scene.background = new THREE.Color(0x333333)

const backGroundTexture = new THREE.CubeTextureLoader().load([
    'img/px_eso0932a.jpg',
    'img/nx_eso0932a.jpg',
    'img/py_eso0932a.jpg',
    'img/ny_eso0932a.jpg',
    'img/pz_eso0932a.jpg',
    'img/nz_eso0932a.jpg',
])
scene.background = backGroundTexture

// Add Light
const light = new THREE.PointLight()
light.position.set(2.5, 7.5, 15)
scene.add(light)

// Setup Camera
const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
)
camera.position.z = 2

// Setup Renderer 
const renderer = new THREE.WebGLRenderer()
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)


// Add orbital Controls
const controls = new OrbitControls(camera, renderer.domElement)

// camera.lookAt(0.5, 0.5, 0.5)
// controls.target.set(0.5, 0.5, 0.5)
// controls.update()

// controls.autoRotate = true
// controls.autoRotateSpeed = 5

// controls.enableDamping = true
// controls.dampingFactor = 0.01

// Enable keyboard controls
controls.listenToKeyEvents(document.body)
controls.keys = {
    LEFT: "KeyA",
    UP: "KeyW",
    RIGHT: "KeyD",
    BOTTOM: "KeyS"
}

// controls.screenSpacePanning = false // - Right click and moving up and down zooms in and out the object

// Control rotating angles
// controls.minAzimuthAngle = 0
// controls.maxAzimuthAngle = Math.PI/2

// Control zoom distance
// controls.minZoom = 1
// controls.maxZoom = 6

// Create custom material for the loaded object
const material = new THREE.MeshNormalMaterial()

// Add Cube obj from blender
const objLoader = new OBJLoader()
objLoader.load(
    'models/cube.obj',
    (object) => {
        //(object.children[0] as THREE.Mesh).material = material

        object.position.x = 3

        object.traverse(function (child) {
            if((child as THREE.Mesh).isMesh) {
                (child as THREE.Mesh).material = material
            }
        })

        scene.add(object)
    }, 
    (xhr) => {
        console.log((xhr.loaded / xhr.total) * 100 + '% loaded')
    },
    (error) => {
        console.log(error)
    }
)

// Import susane
const mtlLoader = new MTLLoader()
mtlLoader.load(
    'models/susane.mtl',
    (materials) => {
        materials.preload()
        console.log(materials)

        const objLoader2 = new OBJLoader()
        objLoader2.setMaterials(materials)

        objLoader2.load(
            'models/susane.obj',
            (object) => {
                scene.add(object)
            }, 
            (xhr) => {
                console.log((xhr.loaded / xhr.total) * 100 + '% loaded')
            },
            (error) => {
                console.log(error)
            }
        )
    },
    (xhr) => {
        console.log((xhr.loaded / xhr.total) * 100 + '% loaded')
    },
    (error) => {
        console.log(error)
    }
)

// // Create a cube object
// const geometry = new THREE.BoxGeometry()
// const material = new THREE.MeshNormalMaterial({ transparent: true })
// const cube = new THREE.Mesh(geometry, material)
// //scene.add(cube)

// const cubeData = {
//     width: 1,
//     height: 1,
//     depth: 1,
//     widthSegments: 1,
//     heightSegments: 1,
//     depthSegments: 1
// }

// function regenerateGeometry() {
//     const newGeometry = new THREE.BoxGeometry(
//         cubeData.width,
//         cubeData.height,
//         cubeData.depth,
//         cubeData.widthSegments,
//         cubeData.heightSegments,
//         cubeData.depthSegments
//     )
//     cube.geometry.dispose()
//     cube.geometry = newGeometry
// }

// // Add drag controls for the cube
// const dragControls = new DragControls([ cube ], camera, renderer.domElement)
// dragControls.addEventListener('dragstart', function (event) {
//     controls.enabled = false
//     event.object.material.opacity = 0.4
// })
// dragControls.addEventListener('dragend', function (event) {
//     controls.enabled = true
//     event.object.material.opacity = 1
// })

// Add window resize function for responsiveness
window.addEventListener('resize', onWindowResize, false)
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
}

// Add stats to check screen FPS
const stats = new Stats()
document.body.appendChild(stats.dom)

// // Add dat.GUI controls
// const gui = new GUI()

// const cubeFolder = gui.addFolder("Cube")

// const cubeRotationFolder = cubeFolder.addFolder("Rotation")
// cubeRotationFolder.add(cube.rotation, "x", 0, 2 * Math.PI)
// cubeRotationFolder.add(cube.rotation, "y", 0, 2 * Math.PI)
// cubeRotationFolder.add(cube.rotation, "z", 0, 2 * Math.PI)
// cubeRotationFolder.open()

// const cubePositionFolder = cubeFolder.addFolder("Position")
// cubePositionFolder.add(cube.position, "x", -10, 10)
// cubePositionFolder.add(cube.position, "y", -10, 10)
// cubePositionFolder.add(cube.position, "z", -10, 10)
// cubePositionFolder.open()

// const cubeScaleFolder = cubeFolder.addFolder("Scale")
// cubeScaleFolder.add(cube.scale, "x", 0, 5)
// cubeScaleFolder.add(cube.scale, "y", 0, 5)
// cubeScaleFolder.add(cube.scale, "z", 0, 5)
// cubeScaleFolder.open()

// cubeFolder.add(cube, "visible")

// const cubePropertiesFolder = cubeFolder.addFolder("Properties")
// cubePropertiesFolder
//         .add(cubeData, 'width', 1, 30)
//         .onChange(regenerateGeometry)
//         .onFinishChange(() => console.dir(cube.geometry))
// cubePropertiesFolder.add(cubeData, 'height', 1, 30).onChange(regenerateGeometry)
// cubePropertiesFolder.add(cubeData, 'depth', 1, 30).onChange(regenerateGeometry)
// cubePropertiesFolder.add(cubeData, 'widthSegments', 1, 30).onChange(regenerateGeometry)
// cubePropertiesFolder.add(cubeData, 'heightSegments', 1, 30).onChange(regenerateGeometry)
// cubePropertiesFolder.add(cubeData, 'depthSegments', 1, 30).onChange(regenerateGeometry)

// cubeFolder.open()

// Create animate function to refresh screen
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