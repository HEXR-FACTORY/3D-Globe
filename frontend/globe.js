import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.117.1/build/three.module.js';

import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.117.1/examples/jsm/controls/OrbitControls.js';

// Initialize Three.js scene
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

 // Init Light
 let light0 = new THREE.AmbientLight(0xfafafa, 0.25)

 let light1 = new THREE.PointLight(0xfafafa, 0.4)
 light1.position.set(200, 90, 40)

 let light2 = new THREE.PointLight(0xfafafa, 0.4)
 light2.position.set(200, 90, -40)

 scene.add(light0)
 scene.add(light1)
 scene.add(light2)

let gridHelper = new THREE.GridHelper(30, 30, new THREE.Color(0x555555), new THREE.Color(0x333333))   //GridHelper( size : number, divisions : Number, colorCenterLine : Color, colorGrid : Color )
scene.add(gridHelper);
// camera.position.z = 80;
const renderer = new THREE.WebGLRenderer({
    antialias: true
});
renderer.setPixelRatio(window.devicePixelRatio)
renderer.setSize(window.innerWidth, window.innerHeight);
// let cont = document.getElementById('globe')
// cont.appendChild(renderer.domElement);
document.body.appendChild(renderer.domElement);

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


// Load your GeoJSON data (replace 'your_geojson_data.geojson' with your actual data)
axios.get('assets/AnnaNagar.geojson')
    .then(response => {
        const geoJsonData = response.data;
        console.log(geoJsonData)

        // Map GeoJSON data to 3D objects
        geoJsonData.features.forEach(feature => {
            const coordinates = feature.geometry.coordinates;

            // Extrude the buildings based on height information
            const height = feature.properties.height || 0;
            const extrudeSettings = { depth: height, bevelEnabled: false };

            // Create a geometry for the building
            const geometry = new THREE.ExtrudeGeometry(new THREE.Shape(coordinates), extrudeSettings);

            // Create a material (you may want to use textures or different materials)
            const material = new THREE.MeshBasicMaterial({ color: 0x808080 });

            // Create a mesh using the geometry and material
            const mesh = new THREE.Mesh(geometry, material);

            // Add the mesh to the scene
            scene.add(mesh);
        });
    })
    .catch(error => {
        console.error('Error loading GeoJSON data', error);
    });

// Set up camera and controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true
controls.dampingFactor = 0.25
controls.screenSpacePanning = false
controls.maxDistance = 800
controls.update()

camera.position.set(8, 4, 0)


// Render loop
const animate = () => {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
};

animate();

