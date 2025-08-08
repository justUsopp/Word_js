import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const container = document.getElementById('globe-container');

// SCENE
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(60, container.clientWidth / container.clientHeight, 0.1, 1000);
camera.position.z = 4;

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(container.clientWidth, container.clientHeight);
container.appendChild(renderer.domElement);

// CONTROLS
const controls = new THREE.OrbitControls(camera, renderer.domElement);

// EARTH
const earthGeometry = new THREE.SphereGeometry(1.5, 64, 64);
const earthTexture = new THREE.TextureLoader().load('earth.jpg'); // assure-toi de l'avoir à la racine
const earthMaterial = new THREE.MeshBasicMaterial({ map: earthTexture });
const earth = new THREE.Mesh(earthGeometry, earthMaterial);
scene.add(earth);

// LAT/LON → 3D
function latLonToVector3(lat, lon, radius) {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);
  const x = -radius * Math.sin(phi) * Math.cos(theta);
  const z = radius * Math.sin(phi) * Math.sin(theta);
  const y = radius * Math.cos(phi);
  return new THREE.Vector3(x, y, z);
}

// POINTS
const locations = [
  { name: 'Parigi', lat: 48.8566, lon: 2.3522 },
  { name: 'New York', lat: 40.7128, lon: -74.006 },
];

const pointGeometry = new THREE.SphereGeometry(0.03, 8, 8);
const pointMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
const clickablePoints = [];

locations.forEach(loc => {
  const point = new THREE.Mesh(pointGeometry, pointMaterial.clone());
  point.position.copy(latLonToVector3(loc.lat, loc.lon, 1.52));
  point.userData = { name: loc.name };
  scene.add(point);
  clickablePoints.push(point);
});

// INTERACTION
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

container.addEventListener('click', event => {
  const rect = container.getBoundingClientRect();
  mouse.x = ((event.clientX - rect.left) / container.clientWidth) * 2 - 1;
  mouse.y = -((event.clientY - rect.top) / container.clientHeight) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(clickablePoints);

  if (intersects.length > 0) {
    const name = intersects[0].object.userData.name;
    alert(`Hai cliccato su: ${name}`);
  }
});

// RENDER
function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}
animate();

// Handle resize
window.addEventListener('resize', () => {
  camera.aspect = container.clientWidth / container.clientHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(container.clientWidth, container.clientHeight);
});
