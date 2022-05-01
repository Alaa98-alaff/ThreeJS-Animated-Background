import * as THREE from "three";
import * as dat from "dat.gui";
import { OrbitControls } from "https://unpkg.com/three@0.126.1/examples/jsm/controls/OrbitControls.js";

// set the GUI to the animation
const gui = new dat.GUI();
const world = {
  plane: {
    width: 10,
    height: 10,
    widthSegments: 10,
    heightSegments: 10,
  },
};

gui.add(world.plane, "width", 1, 20).onChange(generatePlane);
gui.add(world.plane, "height", 1, 20).onChange(generatePlane);
gui.add(world.plane, "widthSegments", 1, 50).onChange(generatePlane);
gui.add(world.plane, "heightSegments", 1, 50).onChange(generatePlane);

function generatePlane() {
  PlaneMesh.geometry.dispose();
  PlaneMesh.geometry = new THREE.PlaneGeometry(
    world.plane.width,
    world.plane.height,
    world.plane.widthSegments,
    world.plane.heightSegments
  );

  // to change the z indexes of the plane and make the shape different
  const { array } = PlaneMesh.geometry.attributes.position;
  for (let i = 0; i < array.length; i += 3) {
    let x = array[i];
    let y = array[i + 1];
    let z = array[i + 2];
    array[i + 2] = z + Math.random();
  }
}

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  innerWidth / innerHeight,
  0.1,
  1000 // animation shown up from 1 to 1000 pixels
);
const renderer = new THREE.WebGL1Renderer();

renderer.setSize(innerWidth, innerHeight);
renderer.setPixelRatio(devicePixelRatio); // to fix all the shapes pixel problems
document.body.appendChild(renderer.domElement); //canvas object
new OrbitControls(camera, renderer.domElement);
camera.position.z = 5;

// TEST BOX MESH
// const boxGeometry = new THREE.BoxGeometry(1, 1, 1); // width, length, height
// const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
// const boxMesh = new THREE.Mesh(boxGeometry, material);
// scene.add(boxMesh);

// to use mesh, we need two parameters (geometry, material);

const planeGeometry = new THREE.PlaneGeometry(5, 5, 10, 10);
const planeMaterial = new THREE.MeshPhongMaterial({
  // MeshPhongMaterial => react with light and its need light to be show
  color: 0xff0000,
  side: THREE.DoubleSide, // give the botht side color
  flatShading: THREE.FlatShading, // give it paper effect when z index is changed by the loop
});
const PlaneMesh = new THREE.Mesh(planeGeometry, planeMaterial);
scene.add(PlaneMesh);

const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(0, 0, 1); // z = 1 ==> for the front face
scene.add(light);

// lighting the backside for ORBITS ROTATING
const backLight = new THREE.DirectionalLight(0xffffff, 1);
backLight.position.set(0, 0, -1); // z = 1 ==> for the back face
scene.add(backLight);

// to change the z indexes of the plane and make the shape different
const { array } = PlaneMesh.geometry.attributes.position;
for (let i = 0; i < array.length; i += 3) {
  let x = array[i];
  let y = array[i + 1];
  let z = array[i + 2];

  array[i + 2] = z + Math.random();
}

// the same animation of canvas OBJ
function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
  // PlaneMesh.rotation.x += 0.01;
  // PlaneMesh.rotation.y += 0.01;
}

animate();
