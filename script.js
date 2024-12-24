// Set up scene, camera, and renderer for Three.js
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Load textures for box wrapping and ribbon
const loader = new THREE.TextureLoader();
const wrappingTexture = loader.load('wrapping.jpg');  // Set your wrapping image here
const ribbonTexture = loader.load('ribbon.jpg');     // Set your ribbon image here

// Fallback colors for box and lid
const fallbackBoxMaterial = new THREE.MeshStandardMaterial({ color: 0xff0000 });
const fallbackLidMaterial = new THREE.MeshStandardMaterial({ color: 0xffff00 });

// Apply textures or fallback materials
const boxBaseMaterial = wrappingTexture ? new THREE.MeshStandardMaterial({ map: wrappingTexture }) : fallbackBoxMaterial;
const boxLidMaterial = ribbonTexture ? new THREE.MeshStandardMaterial({ map: ribbonTexture }) : fallbackLidMaterial;

// Box and lid geometries
const boxBaseGeometry = new THREE.BoxGeometry(1, 1, 1);
const boxLidGeometry = new THREE.BoxGeometry(1, 0.2, 1);

// Create meshes for box and lid
const boxBase = new THREE.Mesh(boxBaseGeometry, boxBaseMaterial);
const boxLid = new THREE.Mesh(boxLidGeometry, boxLidMaterial);

// Position the box and lid
boxBase.position.y = 0;
boxLid.position.y = 0.6;

// Add the box and lid to the scene
scene.add(boxBase, boxLid);

// Lighting setup
const light = new THREE.PointLight(0xffffff, 1, 100);
light.position.set(5, 5, 5);
scene.add(light);

// Snowflakes setup (CSS Snowflakes)
const snowflakes = [];
const snowflakeCount = 100;
for (let i = 0; i < snowflakeCount; i++) {
    const snowflake = document.createElement("div");
    snowflake.classList.add("snowflake");
    snowflake.innerHTML = "❄";  // Snowflake symbol
    snowflake.style.top = `${Math.random() * 100}%`;
    snowflake.style.left = `${Math.random() * 100}%`;
    snowflake.style.animation = `fall ${Math.random() * 10 + 5}s linear infinite`;
    document.body.appendChild(snowflake);
    snowflakes.push(snowflake);
}

// Music setup
const audio = new Audio('christmas.mp3');  // Set your music URL here
document.body.addEventListener('click', () => {
    if (audio.paused) {
        audio.play();
    }
});

// Box opening animation and message display
let isBoxOpened = false;
const messageDiv = document.getElementById('message');

window.addEventListener('click', () => {
    if (!isBoxOpened) {
        isBoxOpened = true;
        const lidAnimation = () => {
            if (boxLid.position.y < 1.5) {
                boxLid.position.y += 0.05;
                boxLid.rotation.x += 0.02;
                requestAnimationFrame(lidAnimation);
            } else {
                // Show message after box opens
                messageDiv.style.display = 'block';
                setTimeout(() => {
                    messageDiv.style.display = 'none';
                }, 5000); // Show message for 5 seconds
            }
        };
        lidAnimation();
    }
});

// Animation loop for rendering the scene
function animate() {
    requestAnimationFrame(animate);
    if (!isBoxOpened) {
        boxBase.rotation.y += 0.01;
    }
    renderer.render(scene, camera);
}

animate();
camera.position.z = 5;
