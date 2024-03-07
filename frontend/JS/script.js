import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.117.1/build/three.module.js';

import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.117.1/examples/jsm/controls/OrbitControls.js';

var scene, renderer, camera, controls;
const center = [80.2272547, 13.0786669];
var MAT_BUILDING;
// var iR;

Awake()

// When user resize window
window.addEventListener('resize', onWindowResize, false)

function onWindowResize() {
    if (scene) {
        camera.aspect = window.innerWidth / window.innerHeight
        camera.updateProjectionMatrix()
        renderer.setSize(window.innerWidth, window.innerHeight)
    }
}

onWindowResize()

function Awake() {

    // console.log("scene");
    let cont = document.getElementById("cont");

    // Init scene
    scene = new THREE.Scene()

    scene.background = new THREE.Color(0x222222)

    // Init Camera
    camera = new THREE.PerspectiveCamera(25, window.clientWidth / window.clientHeight, 1, 100)
    camera.position.set(8, 4, 0)

    // // Init group
    // iR = new THREE.Group()
    // iR.name = "Interactive Root"
    // scene.add(iR)

    // Init Light
    let light0 = new THREE.AmbientLight(0xfafafa, 0.25)

    let light1 = new THREE.PointLight(0xfafafa, 0.4)
    light1.position.set(200, 90, 40)

    let light2 = new THREE.PointLight(0xfafafa, 0.4)
    light2.position.set(200, 90, -40)

    scene.add(light0)
    scene.add(light1)
    scene.add(light2)

    let gridHelper = new THREE.GridHelper(60, 160, new THREE.Color(0x555555), new THREE.Color(0x333333))   //GridHelper( size : number, divisions : Number, colorCenterLine : Color, colorGrid : Color )
    scene.add(gridHelper)

    // let geometry = new THREE.BoxGeometry(1, 1, 1)
    // let material = new THREE.MeshBasicMaterial({ color: 0x00ff00 })
    // let mesh = new THREE.Mesh(geometry, material)
    // scene.add(mesh)

    // Init renderer
    renderer = new THREE.WebGLRenderer({
        antialias: true
    })
    renderer.setPixelRatio(window.devicePixelRatio)
    renderer.setSize(window.innerWidth, window.innerHeight)
    cont.appendChild(renderer.domElement);


    controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true
    controls.dampingFactor = 0.25
    controls.screenSpacePanning = false
    controls.maxDistance = 800

    controls.update()
    MAT_BUILDING = new THREE.MeshPhongMaterial()
    Update()
    GetGeoJson()
}

function Update() {
    requestAnimationFrame(Update)

    renderer.render(scene, camera)
    controls.update()
}

function GetGeoJson() {

    fetch("assets/worldMap.geo.json").then((res) => {

        res.json().then((data) => {
            // console.log(data)
            LoadBuildings(data)

        })
    })
}

function LoadBuildings(data) {

    let features = data.features

    for (let i = 0; i < features.length; i++) {

        let load = features[i]
        if (!load['properties']) return

        if (load.properties['continent']) {
            addBuilding(load.geometry.coordinates, load.properties, load.properties["continent"])
        }
    }
}

function addBuilding(data) {


    for (let i = 0; i < data.length; i++) {
        let el = data[i]

        let shape = genShape(el, center)
        let geometry = genGeometry(shape, {
            curveSegments: 1,
            
            bevelEnabled: false
        })

        geometry.rotateX(Math.PI / 2)
        geometry.rotateZ(Math.PI)

        let mesh = new THREE.Mesh(geometry, MAT_BUILDING)
        scene.add(mesh)
    }
}

function genShape(points, center) {
    let shape = new THREE.Shape()

    for (let i = 0; i < points.length; i++) {
        let elp = points[i]
        elp = GPSRelativePosition(elp, center)

        if (i == 0) {
            shape.moveTo(elp[0], elp[1])
        } else {
            shape.lineTo(elp[0], elp[1])
        }
    }

    return shape
}

function genGeometry(shape, settings) {
    let geometry = new THREE.ExtrudeGeometry(shape, settings)
    geometry.computeBoundingBox()

    return geometry
}

function GPSRelativePosition(objPosi, centerPosi) {

    // Get GPS distance
    let dis = geolib.getDistance(objPosi, centerPosi)

    // Get bearing angle
    let bearing = geolib.getRhumbLineBearing(objPosi, centerPosi)

    // Calculate X by centerPosi.x + distance * cos(rad)
    let x = centerPosi[0] + (dis * Math.cos(bearing * Math.PI / 180))

    // Calculate Y by centerPosi.y + distance * sin(rad)
    let y = centerPosi[1] + (dis * Math.sin(bearing * Math.PI / 180))

    // Reverse X (it work)
    return [-x / 100, y / 100]
}




// // mapboxgl.accessToken = config.accessToken;
// mapboxgl.accessToken = "pk.eyJ1Ijoic2Fpc2l2YXNhbmthciIsImEiOiJjbHF3OXRjdGYwMHJzMnFxcTg3d2lvcjhmIn0.HBKYuuBf6eYAbCm5ETIlCg";


// //starting location for both map and eventual sphere
// var origin = [80.2272547, 13.0786669, 1];

// var map = new mapboxgl.Map({
//     container: 'cont',
//     style: 'mapbox://styles/mapbox/streets-v11',
//     center: origin,
//     zoom: 17,
//     pitch: 60,
//     antialias:true
// });

// let stats;
// import Stats from 'https://threejs.org/examples/jsm/libs/stats.module.js';
// function animate() {
//     requestAnimationFrame(animate);
//     stats.update();
// }

// map.on('load', function() {
//     // stats
//     stats = new Stats();
//     map.getContainer().appendChild(stats.dom);
//     animate();

//     map.addLayer({
//         id: 'custom_layer',
//         type: 'custom',
//         renderingMode: '3d',
//         onAdd: function(map, mbxContext){

//             // instantiate threebox
//             window.tb = new Threebox(
//                 map, 
//                 mbxContext,
//                 {
//                     defaultLights: true,
//                     enableSelectingObjects: true
//                 }
//             );

//         },
        
//         render: function (gl, matrix) {
//           const jio =  tb.update();
//           console.log(jio)
//         }
//     })
// });

