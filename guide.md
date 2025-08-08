# Guide Three.js - Les Bases Essentielles

## Introduction à Three.js

Three.js est une bibliothèque JavaScript qui facilite la création de graphiques 3D dans le navigateur web en utilisant WebGL. Elle abstrait la complexité de WebGL et offre une API simple pour créer des scènes 3D interactives.

## Structure de base d'une application Three.js

Toute application Three.js nécessite ces 4 éléments fondamentaux :

### 1. La Scène (Scene)
```javascript
const scene = new THREE.Scene();
```
La scène est le conteneur qui va accueillir tous vos objets 3D (géométries, lumières, caméras).

### 2. La Caméra (Camera)
```javascript
const camera = new THREE.PerspectiveCamera(
    60,                                           // FOV (champ de vision)
    container.clientWidth / container.clientHeight, // Ratio d'aspect
    0.1,                                          // Distance minimale
    1000                                          // Distance maximale
);
camera.position.z = 4; // Position de la caméra
```

**Types de caméras principales :**
- `PerspectiveCamera` : simulation de la vision humaine avec perspective
- `OrthographicCamera` : projection orthogonale (pas de perspective)

### 3. Le Renderer (Moteur de rendu)
```javascript
const renderer = new THREE.WebGLRenderer({ 
    antialias: true,  // Lissage des bords
    alpha: true       // Transparence du fond
});
renderer.setSize(container.clientWidth, container.clientHeight);
container.appendChild(renderer.domElement);
```

### 4. La Boucle d'animation
```javascript
function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}
animate();
```

## Les Géométries

Les géométries définissent la forme des objets 3D.

### Géométries de base
```javascript
// Sphère
const sphereGeometry = new THREE.SphereGeometry(
    1.5,  // rayon
    64,   // segments horizontaux
    64    // segments verticaux
);

// Boîte
const boxGeometry = new THREE.BoxGeometry(1, 1, 1);

// Cylindre
const cylinderGeometry = new THREE.CylinderGeometry(1, 1, 2, 32);

// Plan
const planeGeometry = new THREE.PlaneGeometry(2, 2);
```

## Les Matériaux

Les matériaux définissent l'apparence des objets.

### Types de matériaux principaux
```javascript
// Matériau de base (non affecté par la lumière)
const basicMaterial = new THREE.MeshBasicMaterial({ 
    color: 0xff0000,
    transparent: true,
    opacity: 0.5
});

// Matériau Phong (réagit à la lumière)
const phongMaterial = new THREE.MeshPhongMaterial({
    color: 0x00ff00,
    shininess: 100
});

// Matériau avec texture
const textureLoader = new THREE.TextureLoader();
const texture = textureLoader.load('texture.jpg');
const texturedMaterial = new THREE.MeshBasicMaterial({ map: texture });
```

### Propriétés importantes des matériaux
- `color` : couleur de base
- `transparent` : permet la transparence
- `opacity` : niveau de transparence (0-1)
- `map` : texture à appliquer
- `wireframe` : affichage en mode filaire

## Création d'objets (Mesh)

Un Mesh combine géométrie + matériau :

```javascript
const geometry = new THREE.SphereGeometry(1, 32, 32);
const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
const sphere = new THREE.Mesh(geometry, material);

// Positionnement
sphere.position.set(0, 0, 0);
sphere.rotation.x = Math.PI / 4;
sphere.scale.set(2, 2, 2);

// Ajout à la scène
scene.add(sphere);
```

## Système de coordonnées

Three.js utilise un système de coordonnées 3D :
- **X** : gauche-droite
- **Y** : bas-haut  
- **Z** : arrière-avant (vers l'utilisateur)

```javascript
object.position.x = 1;  // droite
object.position.y = 1;  // haut
object.position.z = 1;  // vers nous
```

## Éclairage

### Types de lumières
```javascript
// Lumière ambiante (éclaire tout uniformément)
const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
scene.add(ambientLight);

// Lumière directionnelle (comme le soleil)
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
directionalLight.position.set(1, 1, 1);
scene.add(directionalLight);

// Lumière ponctuelle
const pointLight = new THREE.PointLight(0xffffff, 1, 100);
pointLight.position.set(0, 10, 0);
scene.add(pointLight);

// Lumière spot
const spotLight = new THREE.SpotLight(0xffffff, 1);
spotLight.position.set(0, 10, 0);
scene.add(spotLight);
```

## Contrôles de caméra (OrbitControls)

```javascript
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;    // Inertie
controls.dampingFactor = 0.05;    // Force de l'inertie
controls.enableZoom = true;       // Zoom autorisé
controls.enablePan = false;       // Déplacement latéral
controls.minDistance = 2.5;       // Distance min
controls.maxDistance = 8;         // Distance max

// Dans la boucle d'animation
function animate() {
    controls.update(); // Important pour l'inertie
    renderer.render(scene, camera);
}
```

## Interaction avec la souris (Raycasting)

Le raycasting permet de détecter les clics sur les objets 3D :

```javascript
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
const clickableObjects = []; // Array des objets cliquables

container.addEventListener('click', (event) => {
    const rect = container.getBoundingClientRect();
    
    // Conversion coordonnées écran → coordonnées normalisées
    mouse.x = ((event.clientX - rect.left) / container.clientWidth) * 2 - 1;
    mouse.y = -((event.clientY - rect.top) / container.clientHeight) * 2 + 1;
    
    // Configuration du rayon
    raycaster.setFromCamera(mouse, camera);
    
    // Détection des intersections
    const intersects = raycaster.intersectObjects(clickableObjects);
    
    if (intersects.length > 0) {
        const clickedObject = intersects[0].object;
        console.log('Objet cliqué:', clickedObject);
    }
});
```

## Textures

### Chargement de textures
```javascript
const textureLoader = new THREE.TextureLoader();

// Chargement simple
const texture = textureLoader.load('image.jpg');

// Chargement avec callbacks
const texture = textureLoader.load(
    'image.jpg',
    // onLoad
    (texture) => {
        console.log('Texture chargée');
    },
    // onProgress
    (progress) => {
        console.log('Progression:', progress);
    },
    // onError
    (error) => {
        console.log('Erreur:', error);
    }
);

// Application de la texture
const material = new THREE.MeshBasicMaterial({ map: texture });
```

### Création de texture canvas
```javascript
// Création d'un canvas personnalisé
const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');
canvas.width = 512;
canvas.height = 256;

// Dessin sur le canvas
const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
gradient.addColorStop(0, '#4a90e2');
gradient.addColorStop(1, '#2196f3');
ctx.fillStyle = gradient;
ctx.fillRect(0, 0, canvas.width, canvas.height);

// Conversion en texture Three.js
const canvasTexture = new THREE.CanvasTexture(canvas);
```

## Conversion coordonnées géographiques

Pour placer des objets sur une sphère selon latitude/longitude :

```javascript
function latLonToVector3(lat, lon, radius) {
    // Conversion en radians
    const phi = (90 - lat) * (Math.PI / 180);    // latitude
    const theta = (lon + 180) * (Math.PI / 180); // longitude
    
    // Coordonnées sphériques → cartésiennes
    const x = -radius * Math.sin(phi) * Math.cos(theta);
    const z = radius * Math.sin(phi) * Math.sin(theta);
    const y = radius * Math.cos(phi);
    
    return new THREE.Vector3(x, y, z);
}

// Utilisation
const parisPosition = latLonToVector3(48.8566, 2.3522, 1.52);
point.position.copy(parisPosition);
```

## Gestion du redimensionnement

```javascript
function onWindowResize() {
    // Mise à jour du ratio de la caméra
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    
    // Mise à jour de la taille du renderer
    renderer.setSize(container.clientWidth, container.clientHeight);
}

window.addEventListener('resize', onWindowResize);
```

## Animation et transformation

### Rotation continue
```javascript
function animate() {
    requestAnimationFrame(animate);
    
    // Rotation automatique
    if (earth) {
        earth.rotation.y += 0.002; // Vitesse de rotation
    }
    
    renderer.render(scene, camera);
}
```

### Types de transformations
```javascript
// Position
object.position.set(x, y, z);
object.position.x = 1;

// Rotation (en radians)
object.rotation.set(x, y, z);
object.rotation.y = Math.PI / 4; // 45 degrés

// Échelle
object.scale.set(x, y, z);
object.scale.multiplyScalar(2); // Double la taille
```

## Bonnes pratiques

### 1. Performance
- Réutilisez les géométries et matériaux quand possible
- Utilisez `Object.dispose()` pour libérer la mémoire
- Limitez le nombre d'objets dans la scène

### 2. Organisation du code
```javascript
class ThreeJSApp {
    constructor(container) {
        this.container = container;
        this.init();
    }
    
    init() {
        this.createScene();
        this.createCamera();
        this.createRenderer();
        this.createObjects();
        this.setupControls();
        this.setupEventListeners();
        this.animate();
    }
    
    createScene() {
        this.scene = new THREE.Scene();
    }
    
    // ... autres méthodes
}
```

### 3. Gestion des erreurs
```javascript
// Toujours gérer les erreurs de chargement
textureLoader.load(
    'texture.jpg',
    (texture) => { /* succès */ },
    (progress) => { /* progression */ },
    (error) => {
        console.error('Erreur de chargement:', error);
        // Texture de fallback
        const fallbackMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
    }
);
```

## Exemple complet minimal

```javascript
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// Configuration de base
const container = document.getElementById('container');
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();

renderer.setSize(container.clientWidth, container.clientHeight);
container.appendChild(renderer.domElement);

// Contrôles
const controls = new OrbitControls(camera, renderer.domElement);

// Objet simple
const geometry = new THREE.BoxGeometry();
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

// Position de la caméra
camera.position.z = 5;

// Boucle d'animation
function animate() {
    requestAnimationFrame(animate);
    
    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;
    
    controls.update();
    renderer.render(scene, camera);
}

animate();
```

Ce guide couvre les concepts essentiels de Three.js que vous retrouverez dans votre code. Commencez par créer des scènes simples et ajoutez progressivement de la complexité. Three.js est très puissant mais ces bases vous permettront de comprendre et modifier n'importe quel code Three.js existant.