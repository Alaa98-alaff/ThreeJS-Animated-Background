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

const reycaster = new THREE.Raycaster();
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

// to use mesh, we need two parameters (geometry, material);
const planeGeometry = new THREE.PlaneGeometry(5, 5, 10, 10);
const planeMaterial = new THREE.MeshPhongMaterial({
  // MeshPhongMaterial => react with light and its need light to be show
  side: THREE.DoubleSide, // give the botht side color
  flatShading: THREE.FlatShading, // give it paper effect when z index is changed by the loop
  vertexColors: true, // to show up the new colors that we set in the attribute
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

// set color attribute for every piece of the plane
let colors = [];
for (let i = 0; i < PlaneMesh.geometry.attributes.position.count; i++) {
  colors.push(0, 0.19, 0.4);
}

PlaneMesh.geometry.setAttribute(
  "color",
  new THREE.BufferAttribute(new Float32Array(colors), 3)
);

// set mouse coordinates
const mouse = {
  x: undefined,
  y: undefined,
};

function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
  reycaster.setFromCamera(mouse, camera);
  const intersects = reycaster.intersectObject(PlaneMesh);

  if (intersects.length > 0) {
    const { color } = intersects[0].object.geometry.attributes;

    // vertice 1
    color.setX(intersects[0].face.a, 0.1);
    color.setY(intersects[0].face.a, 0.5);
    color.setZ(intersects[0].face.a, 1);

    // vertice 2
    color.setX(intersects[0].face.b, 0.1);
    color.setY(intersects[0].face.b, 0.5);
    color.setZ(intersects[0].face.b, 1);

    // vertice 3
    color.setX(intersects[0].face.c, 0.1);
    color.setY(intersects[0].face.c, 0.5);
    color.setZ(intersects[0].face.c, 1);

    // UPDATE COLOR
    color.needsUpdate = true;
  }
}

animate();

addEventListener("mousemove", function (event) {
  mouse.x = (event.clientX / this.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / this.innerHeight) * 2 + 1;
});
