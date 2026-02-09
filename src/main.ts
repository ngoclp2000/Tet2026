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
camera.position.set(0, 1.6, 32);
camera.rotation.set(0, Math.PI, 0);

const ambient = new THREE.AmbientLight(0xffffff, 0.6);
scene.add(ambient);

const sun = new THREE.DirectionalLight(0xfff1d6, 1.2);
sun.position.set(8, 16, 4);
sun.castShadow = true;
scene.add(sun);

const ground = new THREE.Mesh(
  new THREE.PlaneGeometry(140, 140),
  new THREE.MeshStandardMaterial({ color: 0x18263c })
);
ground.rotation.x = -Math.PI / 2;
scene.add(ground);

const walkway = new THREE.Mesh(
  new THREE.PlaneGeometry(20, 110),
  new THREE.MeshStandardMaterial({ color: 0x2f3f5f })
);
walkway.rotation.x = -Math.PI / 2;
walkway.position.z = -10;
scene.add(walkway);

const sidePathLeft = new THREE.Mesh(
  new THREE.PlaneGeometry(24, 90),
  new THREE.MeshStandardMaterial({ color: 0x22324d })
);
sidePathLeft.rotation.x = -Math.PI / 2;
sidePathLeft.position.set(-26, 0.01, -12);
scene.add(sidePathLeft);

const sidePathRight = new THREE.Mesh(
  new THREE.PlaneGeometry(24, 90),
  new THREE.MeshStandardMaterial({ color: 0x22324d })
);
sidePathRight.rotation.x = -Math.PI / 2;
sidePathRight.position.set(26, 0.01, -12);
scene.add(sidePathRight);

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
gate.position.set(0, 0, 30);
scene.add(gate);

const drum = new THREE.Mesh(
  new THREE.CylinderGeometry(1.6, 1.6, 2.2, 32),
  new THREE.MeshStandardMaterial({ color: 0xb5523c })
);
drum.position.set(-10, 1.2, 18);
scene.add(drum);

const goat = new THREE.Mesh(
  new THREE.SphereGeometry(1.3, 32, 32),
  new THREE.MeshStandardMaterial({ color: 0xf0f0f0 })
);
goat.position.set(10, 1.5, 16);
scene.add(goat);

const lanternGeometry = new THREE.SphereGeometry(0.45, 16, 16);
const lanternMaterial = new THREE.MeshStandardMaterial({
  color: 0xff5b3d,
  emissive: 0xff3b20,
  emissiveIntensity: 0.7
});

const lanterns = new THREE.Group();
for (let i = 0; i < 10; i += 1) {
  const lantern = new THREE.Mesh(lanternGeometry, lanternMaterial);
  lantern.position.set(-7.5 + i * 1.7, 4.8, 24);
  lanterns.add(lantern);
}
scene.add(lanterns);

const mapBoard = new THREE.Group();
const mapStand = new THREE.Mesh(
  new THREE.CylinderGeometry(0.25, 0.25, 3.6, 16),
  new THREE.MeshStandardMaterial({ color: 0x6b4b2a })
);
mapStand.position.set(0, 1.8, 24);
const mapPanel = new THREE.Mesh(
  new THREE.BoxGeometry(6, 3.4, 0.3),
  new THREE.MeshStandardMaterial({ color: 0xf8f1dc })
);
mapPanel.position.set(0, 3.3, 22.7);
const mapLegendLeft = new THREE.Mesh(
  new THREE.BoxGeometry(2.4, 1.2, 0.05),
  new THREE.MeshStandardMaterial({ color: 0x3f6b5d })
);
mapLegendLeft.position.set(-1.6, 3.6, 22.55);
const mapLegendRight = new THREE.Mesh(
  new THREE.BoxGeometry(2.4, 1.2, 0.05),
  new THREE.MeshStandardMaterial({ color: 0x6a4fa3 })
);
mapLegendRight.position.set(1.6, 3.6, 22.55);
mapBoard.add(mapStand, mapPanel, mapLegendLeft, mapLegendRight);
scene.add(mapBoard);

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
  if (event.code === "KeyW") movement.backward = false;
  if (event.code === "KeyS") movement.forward = false;
  if (event.code === "KeyA") movement.left = false;
  if (event.code === "KeyD") movement.right = false;
});

const stalls = new THREE.Group();
const stallBaseGeometry = new THREE.BoxGeometry(6, 2.4, 4);
const stallRoofGeometry = new THREE.ConeGeometry(3.8, 1.6, 4);
const stallCounterGeometry = new THREE.BoxGeometry(5, 1, 1.2);
const stallPostGeometry = new THREE.CylinderGeometry(0.15, 0.15, 2.6, 12);
const stallBaseMaterial = new THREE.MeshStandardMaterial({ color: 0x3f6b5d });
const stallRoofMaterial = new THREE.MeshStandardMaterial({ color: 0xf3c343 });
const stallCounterMaterial = new THREE.MeshStandardMaterial({ color: 0x8b5a2b });
const stallPostMaterial = new THREE.MeshStandardMaterial({ color: 0x6e3d1b });

const gameStallMaterial = new THREE.MeshStandardMaterial({ color: 0x6a4fa3 });
const gameRoofMaterial = new THREE.MeshStandardMaterial({ color: 0xf26d4f });
const gameSignMaterial = new THREE.MeshStandardMaterial({
  color: 0xfff1d6,
  emissive: 0xf3c343,
  emissiveIntensity: 0.4
});

function createStall(
  position: THREE.Vector3,
  rotationY: number,
  isGame: boolean
) {
  const stall = new THREE.Group();

  const base = new THREE.Mesh(
    stallBaseGeometry,
    isGame ? gameStallMaterial : stallBaseMaterial
  );
  base.position.y = 1.2;

  const roof = new THREE.Mesh(
    stallRoofGeometry,
    isGame ? gameRoofMaterial : stallRoofMaterial
  );
  roof.position.y = 3.2;
  roof.rotation.y = Math.PI / 4;

  const counter = new THREE.Mesh(stallCounterGeometry, stallCounterMaterial);
  counter.position.set(0, 1.1, 2.1);

  const posts = [
    new THREE.Vector3(-2.6, 1.3, -1.6),
    new THREE.Vector3(2.6, 1.3, -1.6),
    new THREE.Vector3(-2.6, 1.3, 1.6),
    new THREE.Vector3(2.6, 1.3, 1.6)
  ].map((offset) => {
    const post = new THREE.Mesh(stallPostGeometry, stallPostMaterial);
    post.position.copy(offset);
    return post;
  });

  const sign = new THREE.Mesh(
    new THREE.BoxGeometry(3.5, 0.8, 0.3),
    isGame ? gameSignMaterial : stallRoofMaterial
  );
  sign.position.set(0, 3.3, 2);

  stall.add(base, roof, counter, sign, ...posts);
  stall.position.copy(position);
  stall.rotation.y = rotationY;
  return stall;
}

stalls.add(
  createStall(new THREE.Vector3(-24, 0, 8), Math.PI / 7, false),
  createStall(new THREE.Vector3(-30, 0, -6), Math.PI / 10, false),
  createStall(new THREE.Vector3(-24, 0, -20), Math.PI / 10, false),
  createStall(new THREE.Vector3(24, 0, 8), -Math.PI / 7, false),
  createStall(new THREE.Vector3(30, 0, -6), -Math.PI / 10, false),
  createStall(new THREE.Vector3(24, 0, -20), -Math.PI / 10, false),
  createStall(new THREE.Vector3(-10, 0, -28), Math.PI / 12, true),
  createStall(new THREE.Vector3(0, 0, -28), 0, true),
  createStall(new THREE.Vector3(10, 0, -28), -Math.PI / 12, true)
);
scene.add(stalls);

const gameProps = new THREE.Group();
const ringMaterial = new THREE.MeshStandardMaterial({ color: 0x5bc0be });
for (let i = 0; i < 6; i += 1) {
  const ring = new THREE.Mesh(
    new THREE.TorusGeometry(0.6, 0.15, 12, 24),
    ringMaterial
  );
  ring.position.set(-12 + i * 1.1, 1.8, -26);
  ring.rotation.x = Math.PI / 2;
  gameProps.add(ring);
}

const dartBoard = new THREE.Mesh(
  new THREE.CylinderGeometry(1.4, 1.4, 0.3, 20),
  new THREE.MeshStandardMaterial({ color: 0xb7332b })
);
dartBoard.position.set(0, 2.2, -32);
dartBoard.rotation.x = Math.PI / 2;
gameProps.add(dartBoard);

const prizeTable = new THREE.Mesh(
  new THREE.BoxGeometry(4.5, 0.6, 2),
  new THREE.MeshStandardMaterial({ color: 0x2f8f83 })
);
prizeTable.position.set(12, 1.2, -26);
gameProps.add(prizeTable);

scene.add(gameProps);

const zoneSigns = new THREE.Group();
const signPostGeometry = new THREE.CylinderGeometry(0.18, 0.18, 3.2, 12);
const signPanelGeometry = new THREE.BoxGeometry(4.2, 1.4, 0.4);
const foodSign = new THREE.Mesh(signPanelGeometry, stallRoofMaterial);
const foodPost = new THREE.Mesh(signPostGeometry, stallPostMaterial);
foodSign.position.set(-30, 3.1, 14);
foodPost.position.set(-30, 1.6, 14);
const gameSign = new THREE.Mesh(signPanelGeometry, gameRoofMaterial);
const gamePost = new THREE.Mesh(signPostGeometry, stallPostMaterial);
gameSign.position.set(0, 3.1, -36);
gamePost.position.set(0, 1.6, -36);
zoneSigns.add(foodSign, foodPost, gameSign, gamePost);
scene.add(zoneSigns);

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
  previousPointer = { x: event.clientX, y: event.clientY };

  camera.rotation.y -= deltaX * 0.003;
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
  camera.position.y = 1.6;
  camera.position.x = THREE.MathUtils.clamp(camera.position.x, -40, 40);
  camera.position.z = THREE.MathUtils.clamp(camera.position.z, -50, 34);

  lanterns.rotation.y += 0.002;
  goat.position.y = 1.5 + Math.sin(Date.now() * 0.002) * 0.1;
  drum.rotation.y -= 0.003;

  renderer.render(scene, camera);
}

animate();
