import Stats from 'https://threejs.org/examples/jsm/libs/stats.module.js';
mapboxgl.accessToken = 'pk.eyJ1Ijoic2Fpc2l2YXNhbmthciIsImEiOiJjbHF3OXRjdGYwMHJzMnFxcTg3d2lvcjhmIn0.HBKYuuBf6eYAbCm5ETIlCg';

const map = new mapboxgl.Map({
    container: 'map',
    // Choose from Mapbox's core styles, or make your own style with Mapbox Studio
    style: 'mapbox://styles/mapbox/streets-v12',
    center: [80.22519970447877,13.079753476989808],
    zoom: 20,
    pitch: 40,
    bearing: 20,
    antialias: true,
    hash: true,
});


// Add zoom controls
const navControl = new mapboxgl.NavigationControl();
map.addControl(navControl, 'top-right');

window.tb = new Threebox(map, map.getCanvas().getContext("webgl"), {
    defaultLights: true,
    enableSelectingObjects :true,
    enableDraggingObjects : true,
    enableSelectingFeatures: true, //change this to false to disable fill-extrusion features selection
    enableTooltips: true, // change this to false to disable default tooltips on fill-extrusion and 3D models
    multiLayer: true, // this will create a default custom layer that will manage a single tb.update
});


map.on('load', () => {

    let stats;
    function animate() {
        requestAnimationFrame(animate);
        stats.update();
    }

     // stats
     stats = new Stats();
     map.getContainer().appendChild(stats.dom);
     animate();

     map.addLayer(createExtrusionLayer("room-extrusion", "floor-plan"));

        map.addLayer(createCustomLayer("customLayer" + 0, [80.22522215123473,13.079770887833092,1], 0));
       
        // map.addLayer(
        //   createCustomLayer("customLayer" + 5, [80.2251, 13.0786], 0)
        // );
      });

      function animate() {
        requestAnimationFrame(animate);
        stats.update();
      }

      function createExtrusionLayer(layerId, sourceId, i) {
        map.addSource(sourceId, {
         
          type: "geojson",
          data: "assets/shenoyNagar2.geojson",
        });
        let extrusionLayer = {
          id: layerId,
          type: "fill-extrusion",
          source: sourceId,
          paint: {

            "fill-extrusion-color": ["get", "color"],

            "fill-extrusion-height": ["get", "height"],

            "fill-extrusion-base": ["get", "base_height"],
           
            "fill-extrusion-opacity": 1,
          },
        };
        return extrusionLayer;
      }

      function createCustomLayer(layerId, origin, i) {
        //create the layer
        let customLayer3D = {
          id: layerId,
          type: "custom",
          renderingMode: "3d",
          onAdd: function (map, gl) {
            addModel(layerId, origin, i);
          },
          render: function (gl, matrix) {
            // is not needed anymore if multiLayer : true
          },
        };
        return customLayer3D;
      }

      function addModel(layerId, origin, i) {
        // console.log('count');
        let options = {
          type: "gltf", //'gltf'/'mtl'
          obj: "./assets/road/road/scene.gltf", //model url
          bin: "", //replace by mtl attribute
          units: "meters", //units in the default values are always in meters
          scale: 0.08,
        //   length : 150,
          rotation: { x: 90, y: 180, z: 1 }, //default rotation
          anchor: "center",
        };
        // console.log(i);
        // console.log(options)
        tb.loadObj(options, function (model) {
          model.setCoords([origin[0] + 0 * 0.00012, origin[1]], 0);
          let l = map.getLayer(layerId);
        //   console.log(l)
          tb.add(model, layerId);
        });
      }
      map.on("click", function (e) {
      var coordinates = e.lngLat;
      
      console.log(
          "Latitude: " + coordinates.lat + ", Longitude: " + coordinates.lng
          );
    });
    



    // map.addSource('floorplan', {
    //     'type': 'geojson',
    //     'data': 'assets/shenoyNagar2.geojson'
    // });

    // map.addLayer({
    //     renderingMode: '3d',
    //     'id': 'room-extrusion',
    //     'type': 'fill-extrusion',
    //     'source': 'floorplan',
    //     'paint': {
    //         // Get the `fill-extrusion-color` from the source `color` property.
    //         'fill-extrusion-color': ['get', 'color'],

    //         // Get `fill-extrusion-height` from the source `height` property.
    //         'fill-extrusion-height': ['get', 'height'],

    //         // Get `fill-extrusion-base` from the source `base_height` property.
    //         'fill-extrusion-base': ['get', 'base_height'],

    //         // Make extrusions slightly opaque to see through indoor walls.
    //         'fill-extrusion-opacity': 0.5
    //     },
    //     onAdd: function(map, mbxContext){
    

    //         addModel(layerId, origin, i);

    //         // instantiate threebox
    //         window.tb = new Threebox(
    //             map, 
    //             mbxContext,
    //             {
    //                 defaultLights: true,
    //                 enableSelectingObjects: true
    //             }
    //         );
    
    //     },
        
    //     render: function (gl, matrix) {
    //        tb.update();
    //     //   console.log(jio)
    //     }     
    // });

    // function addModel(layerId, origin, i) {
    //     console.log('count');
    //     let options = {
    //       type: "gltf", //'gltf'/'mtl'
    //       obj: "assets/road/road/scene.gltf", //model url
    //       bin: "", //replace by mtl attribute
    //       units: "feets", //units in the default values are always in meters
    //       scale: 0.01,
    //     //   rotation: { x: 90, y: 180, z: 1 }, //default rotation
    //       anchor: "center",
    //     };
    //     console.log(i);
    //     tb.loadObj(options, function (model) {
    //       model.setCoords([origin[0] + 0 * 0.00012, origin[1]], 0);
    //       // let l = map.getLayer(layerId);
    //       tb.add(model, layerId);
    //     });
    //   }

    //   map.on("click", function (e) {
    //   var coordinates = e;
    //   console.log(coordinates)
    //   var coordinates = e.lngLat;
    //   console.log("Latitude: " + coordinates.lat + ", Longitude: " + coordinates.lng);
    // });

    //  // Load the road model
    //  new THREE.GLTFLoader().load('frontend/assets/road/road/scene.gltf', (gltf) => {
    //     roadModel = gltf.scene;
    //     roadModel.scale.set(0.1, 0.1, 0.1); // Adjust scale as needed
    //     tb.add(roadModel);
    // });


//     // Assuming you have a variable to keep track of the dragging state
// let isDragging = false;

// // Assuming you have a variable to store the initial mouse or touch position
// let startPosition = { x: 0, y: 0 };

// // Event listener for mouse down or touch start to start dragging
// window.addEventListener('mousedown', startDragging);
// window.addEventListener('touchstart', startDragging);

// // Event listener for mouse up or touch end to stop dragging
// window.addEventListener('mouseup', stopDragging);
// window.addEventListener('touchend', stopDragging);

// // Event listener for mouse move or touch move to update dragging position
// window.addEventListener('mousemove', updateDragging);
// window.addEventListener('touchmove', updateDragging);

// // Function to start dragging
// function startDragging(event) {
//     isDragging = true;
//     startPosition = getMousePosition(event);
// }

// // Function to stop dragging
// function stopDragging() {
//     isDragging = false;
// }

// // Function to update dragging position and adjust road length
// function updateDragging(event) {
//     if (isDragging) {
//         const currentPosition = getMousePosition(event);

//         // Calculate the change in position
//         const deltaX = currentPosition.x - startPosition.x;
//         const deltaY = currentPosition.y - startPosition.y;

//         // Adjust the road length based on the change in position
//         adjustRoadLength(deltaX, deltaY);

//         // Update the start position for the next iteration
//         startPosition = currentPosition;
//     }
// }

// // Function to get mouse or touch position
// function getMousePosition(event) {
//     const x = event.clientX || event.touches[0].clientX;
//     const y = event.clientY || event.touches[0].clientY;
//     return { x, y };
// }

// // Function to adjust road length
// function adjustRoadLength(deltaX, deltaY) {
//     // Add your logic here to update the road length based on dragging input
//     // You may need to adjust the geometry or position of the road model
//     // For demonstration, I'll just log the delta values
//     console.log('Delta X:', deltaX, 'Delta Y:', deltaY);
// }
