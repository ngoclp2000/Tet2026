import * as THREE from "three";
import "./style.css";

const canvas = document.querySelector<HTMLCanvasElement>("#scene");

if (!canvas) {
  throw new Error("Không tìm thấy canvas #scene");
}

const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x0b1022);

const scene = new THREE.Scene();
scene.fog = new THREE.Fog(0x0b1022, 20, 80);

const camera = new THREE.PerspectiveCamera(
  60,
  window.innerWidth / window.innerHeight,
  0.1,
  200
);
camera.position.set(0, 6, 14);

const ambient = new THREE.AmbientLight(0xffffff, 0.6);
scene.add(ambient);

const sun = new THREE.DirectionalLight(0xfff1d6, 1.2);
sun.position.set(8, 16, 4);
sun.castShadow = true;
scene.add(sun);

const ground = new THREE.Mesh(
  new THREE.PlaneGeometry(120, 120),
  new THREE.MeshStandardMaterial({ color: 0x1c2a44 })
);
ground.rotation.x = -Math.PI / 2;
scene.add(ground);

const gate = new THREE.Group();
const pillarGeometry = new THREE.BoxGeometry(1.2, 6, 1.2);
const pillarMaterial = new THREE.MeshStandardMaterial({ color: 0xd7332f });
const beamGeometry = new THREE.BoxGeometry(6.5, 1.2, 1.4);
const beamMaterial = new THREE.MeshStandardMaterial({ color: 0xf3c343 });

const leftPillar = new THREE.Mesh(pillarGeometry, pillarMaterial);
leftPillar.position.set(-2.5, 3, 0);
const rightPillar = new THREE.Mesh(pillarGeometry, pillarMaterial);
rightPillar.position.set(2.5, 3, 0);
const beam = new THREE.Mesh(beamGeometry, beamMaterial);
beam.position.set(0, 6.2, 0);

gate.add(leftPillar, rightPillar, beam);
scene.add(gate);

const drum = new THREE.Mesh(
  new THREE.CylinderGeometry(1.6, 1.6, 2.2, 32),
  new THREE.MeshStandardMaterial({ color: 0xb5523c })
);
drum.position.set(-6, 1.2, -2);
scene.add(drum);

const goat = new THREE.Mesh(
  new THREE.SphereGeometry(1.3, 32, 32),
  new THREE.MeshStandardMaterial({ color: 0xf0f0f0 })
);
goat.position.set(5.2, 1.5, -4);
scene.add(goat);

const lanternGeometry = new THREE.SphereGeometry(0.45, 16, 16);
const lanternMaterial = new THREE.MeshStandardMaterial({
  color: 0xff5b3d,
  emissive: 0xff3b20,
  emissiveIntensity: 0.7
});

const lanterns = new THREE.Group();
for (let i = 0; i < 8; i += 1) {
  const lantern = new THREE.Mesh(lanternGeometry, lanternMaterial);
  lantern.position.set(-6 + i * 1.7, 4.8, -6);
  lanterns.add(lantern);
}
scene.add(lanterns);

const movement = {
  forward: false,
  backward: false,
  left: false,
  right: false
};

const velocity = new THREE.Vector3();
const direction = new THREE.Vector3();

window.addEventListener("keydown", (event) => {
  if (event.code === "KeyW") movement.forward = true;
  if (event.code === "KeyS") movement.backward = true;
  if (event.code === "KeyA") movement.left = true;
  if (event.code === "KeyD") movement.right = true;
});

window.addEventListener("keyup", (event) => {
  if (event.code === "KeyW") movement.forward = false;
  if (event.code === "KeyS") movement.backward = false;
  if (event.code === "KeyA") movement.left = false;
  if (event.code === "KeyD") movement.right = false;
});

let isDragging = false;
let previousPointer = { x: 0, y: 0 };

canvas.addEventListener("pointerdown", (event) => {
  isDragging = true;
  previousPointer = { x: event.clientX, y: event.clientY };
});

canvas.addEventListener("pointerup", () => {
  isDragging = false;
});

canvas.addEventListener("pointermove", (event) => {
  if (!isDragging) return;
  const deltaX = event.clientX - previousPointer.x;
  const deltaY = event.clientY - previousPointer.y;
  previousPointer = { x: event.clientX, y: event.clientY };

  camera.rotation.y -= deltaX * 0.003;
  camera.rotation.x -= deltaY * 0.003;
  camera.rotation.x = THREE.MathUtils.clamp(camera.rotation.x, -0.6, 0.6);
});

function onResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

window.addEventListener("resize", onResize);

function animate() {
  requestAnimationFrame(animate);

  direction.set(0, 0, 0);
  if (movement.forward) direction.z -= 1;
  if (movement.backward) direction.z += 1;
  if (movement.left) direction.x -= 1;
  if (movement.right) direction.x += 1;

  direction.normalize();
  velocity.lerp(direction, 0.08);

  const forward = new THREE.Vector3(0, 0, -1).applyQuaternion(camera.quaternion);
  const right = new THREE.Vector3(1, 0, 0).applyQuaternion(camera.quaternion);

  camera.position.addScaledVector(forward, velocity.z * 0.2);
  camera.position.addScaledVector(right, velocity.x * 0.2);

  lanterns.rotation.y += 0.002;
  goat.position.y = 1.5 + Math.sin(Date.now() * 0.002) * 0.1;
  drum.rotation.y -= 0.003;

  renderer.render(scene, camera);
}

animate();
