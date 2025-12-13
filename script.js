// BASIC CHECK – confirms JS is running
console.log("script.js loaded");

// SCENE
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x87ceeb); // blue sky

// CAMERA
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(0, 5, 10);

// RENDERER
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// LIGHTS
const sunlight = new THREE.DirectionalLight(0xffffff, 1);
sunlight.position.set(10, 20, 10);
scene.add(sunlight);

const ambient = new THREE.AmbientLight(0xffffff, 0.6);
scene.add(ambient);

// GROUND / ROAD
const groundGeometry = new THREE.PlaneGeometry(2000, 2000);
const groundMaterial = new THREE.MeshStandardMaterial({ color: 0x444444 });
const ground = new THREE.Mesh(groundGeometry, groundMaterial);
ground.rotation.x = -Math.PI / 2;
scene.add(ground);

// CAR MODEL
let car = null;
const loader = new THREE.GLTFLoader();

loader.load(
  "https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/VC/glTF-Binary/VC.glb",
  function (gltf) {
    car = gltf.scene;
    car.scale.set(0.5, 0.5, 0.5);
    scene.add(car);
  },
  undefined,
  function (error) {
    console.error("GLB failed to load", error);
  }
);

// CONTROLS
let speed = 0;
let turn = 0;

document.addEventListener("keydown", (e) => {
  if (e.key === "w" || e.key === "ArrowUp") speed = 0.25;
  if (e.key === "s" || e.key === "ArrowDown") speed = -0.15;
  if (e.key === "a" || e.key === "ArrowLeft") turn = 0.05;
  if (e.key === "d" || e.key === "ArrowRight") turn = -0.05;
});

document.addEventListener("keyup", () => {
  speed = 0;
  turn = 0;
});

// RESIZE HANDLER
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// ANIMATION LOOP
function animate() {
  requestAnimationFrame(animate);

  if (car) {
    car.rotation.y += turn;
    car.position.x += Math.sin(car.rotation.y) * speed;
    car.position.z += Math.cos(car.rotation.y) * speed;

    camera.position.x = car.position.x;
    camera.position.z = car.position.z + 10;
    camera.lookAt(car.position);
  }

  renderer.render(scene, camera);
}

animate();
