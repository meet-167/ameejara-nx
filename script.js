// Elements setup
const mobileMenu = document.getElementById('mobile-menu');
const navLinks = document.querySelector('.nav-links');
const navbar = document.getElementById('navbar');

// Mobile Navigation Toggle
mobileMenu.addEventListener('click', () => {
    mobileMenu.classList.toggle('active');
    navLinks.classList.toggle('active');
});

// Close mobile menu on link click
navLinks.addEventListener('click', () => {
    if (mobileMenu.classList.contains('active')) {
        mobileMenu.classList.remove('active');
        navLinks.classList.remove('active');
    }
});

// Navbar Scroll Effect
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Fade-in Animation On Scroll
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.15
};

const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

document.querySelectorAll('.fade-in-section').forEach(section => {
    observer.observe(section);
});

// --- THREE.JS BACKGROUND ---

const canvas = document.querySelector('#bg-canvas');
const scene = new THREE.Scene();

// Camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 30;

// Renderer
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true,
    antialias: true
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// Create Particle System
const particlesGeometry = new THREE.BufferGeometry();
const particlesCount = 700;

const posArray = new Float32Array(particlesCount * 3);
const colorsArray = new Float32Array(particlesCount * 3);

// Tones: #00d2ff and #d4af37 mixed
const color1 = new THREE.Color("#00d2ff"); // cyan
const color2 = new THREE.Color("#2a2a2a"); // greyish

for(let i = 0; i < particlesCount * 3; i+=3) {
    // Generate positions inside a torus/sphere bounds
    posArray[i] = (Math.random() - 0.5) * 60;   // x
    posArray[i+1] = (Math.random() - 0.5) * 60; // y
    posArray[i+2] = (Math.random() - 0.5) * 40; // z

    // Give 10% chance to be cyan, 90% greyish to look elegant
    const mixColor = Math.random() > 0.9 ? color1 : color2;
    colorsArray[i] = mixColor.r;
    colorsArray[i+1] = mixColor.g;
    colorsArray[i+2] = mixColor.b;
}

particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colorsArray, 3));

// Material
const particlesMaterial = new THREE.PointsMaterial({
    size: 0.15,
    vertexColors: true,
    blending: THREE.AdditiveBlending,
    transparent: true,
    opacity: 0.8
});

const particleMesh = new THREE.Points(particlesGeometry, particlesMaterial);
scene.add(particleMesh);



// Mouse Interaction
let mouseX = 0;
let mouseY = 0;
let targetX = 0;
let targetY = 0;

const windowHalfX = window.innerWidth / 2;
const windowHalfY = window.innerHeight / 2;

document.addEventListener('mousemove', (event) => {
    mouseX = (event.clientX - windowHalfX);
    mouseY = (event.clientY - windowHalfY);
});

// Scroll Event
let scrollY = window.scrollY;
let currentScroll = 0;

window.addEventListener('scroll', () => {
    scrollY = window.scrollY;
});

// Resize Event
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

// Animation Loop
const clock = new THREE.Clock();

function animate() {
    requestAnimationFrame(animate);

    const elapsedTime = clock.getElapsedTime();

    // Rotate particles slowly
    particleMesh.rotation.y = elapsedTime * 0.05;
    particleMesh.rotation.x = elapsedTime * 0.02;



    // Scroll interaction
    currentScroll = currentScroll + (scrollY - currentScroll) * 0.08;
    camera.position.y = -(currentScroll * 0.015);
    camera.position.x = Math.sin(currentScroll * 0.002) * 2;
    // Parallax on mouse
    targetX = mouseX * 0.001;
    targetY = mouseY * 0.001;
    
    particleMesh.rotation.y += 0.05 * (targetX - particleMesh.rotation.y);
    particleMesh.rotation.x += 0.05 * (targetY - particleMesh.rotation.x);
    
    renderer.render(scene, camera);
}

animate();
