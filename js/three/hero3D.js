/* ==========================================================================
   Hero 3D — Three.js + DRACOLoader
   Objetos pedagógicos/geométricos flutuantes com parallax de cursor (lerp).
   Loop de renderização sincronizado com o gsap.ticker (loop único).
   ========================================================================== */

import * as THREE from 'three';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { gsap } from 'gsap';

const PALETTE = {
  gold: 0xf5a623,
  goldSoft: 0xffd166,
  blue: 0x3b82f6,
  blueDeep: 0x1d4ed8,
  white: 0xffffff,
  sky: 0x93c5fd,
};

export function initHero3D(container) {
  if (!container || typeof WebGLRenderingContext === 'undefined') return null;
  // Container sem tamanho (ex.: seção oculta ou display:none) — nada a renderizar
  if (!container.clientWidth || !container.clientHeight) return null;

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
  } catch (err) {
    console.warn('[hero3D] WebGL indisponível — usando fallback estático.', err);
    container.classList.add('hero-canvas--fallback');
    return null;
  }

  const dpr = Math.min(window.devicePixelRatio || 1, 1.75);
  renderer.setPixelRatio(dpr);
  renderer.setSize(container.clientWidth, container.clientHeight, false);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  container.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  scene.fog = new THREE.Fog(0x0b1f3a, 9, 22);

  const camera = new THREE.PerspectiveCamera(
    55,
    container.clientWidth / container.clientHeight,
    0.1,
    60
  );
  camera.position.set(0, 0.6, 7.5);

  /* ---------- Luzes ---------- */
  scene.add(new THREE.AmbientLight(0xffffff, 0.5));

  const dirLight = new THREE.DirectionalLight(0xffffff, 1.4);
  dirLight.position.set(4, 6, 5);
  scene.add(dirLight);

  const goldLight = new THREE.PointLight(PALETTE.gold, 2.2, 18);
  goldLight.position.set(-4, 2.5, 3);
  scene.add(goldLight);

  const blueLight = new THREE.PointLight(PALETTE.blue, 1.8, 18);
  blueLight.position.set(3.5, -2, 4);
  scene.add(blueLight);

  /* ---------- Grupo de objetos flutuantes ---------- */
  const group = new THREE.Group();
  scene.add(group);

  const shapes = [];

  const makeShape = (geometry, color, wire = false, emissive = 0x000000) => {
    const material = new THREE.MeshStandardMaterial({
      color,
      roughness: 0.35,
      metalness: 0.15,
      flatShading: true,
      wireframe: wire,
      emissive,
      emissiveIntensity: wire ? 0.35 : 0,
      transparent: true,
      opacity: 0.92,
    });
    return new THREE.Mesh(geometry, material);
  };

  // Livro aberto (pedagógico) — dois cubos finos inclinados
  const bookGroup = new THREE.Group();
  const pageMat = new THREE.MeshStandardMaterial({
    color: PALETTE.white,
    roughness: 0.5,
    metalness: 0.05,
    side: THREE.DoubleSide,
  });
  const coverMat = new THREE.MeshStandardMaterial({
    color: PALETTE.blueDeep,
    roughness: 0.4,
    metalness: 0.2,
  });
  const pageL = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.05, 0.75), pageMat);
  const pageR = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.05, 0.75), pageMat);
  const cover = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.08, 0.8), coverMat);
  pageL.position.set(-0.3, 0.06, 0);
  pageL.rotation.z = 0.22;
  pageR.position.set(0.3, 0.06, 0);
  pageR.rotation.z = -0.22;
  bookGroup.add(pageL, pageR, cover);
  bookGroup.position.set(-3.1, 1.4, -1.6);
  bookGroup.rotation.y = 0.5;
  group.add(bookGroup);
  shapes.push(bookGroup);

  // Icosaedro dourado (wireframe)
  const ico = makeShape(
    new THREE.IcosahedronGeometry(0.55, 0),
    PALETTE.gold,
    true,
    PALETTE.gold
  );
  ico.position.set(3.2, 1.7, -1.8);
  group.add(ico);
  shapes.push(ico);

  // Octaedro azul
  const octa = makeShape(new THREE.OctahedronGeometry(0.42, 0), PALETTE.blue);
  octa.position.set(-2.4, -1.1, -0.8);
  group.add(octa);
  shapes.push(octa);

  // Toro (anel) dourado
  const torus = makeShape(
    new THREE.TorusGeometry(0.34, 0.13, 14, 40),
    PALETTE.goldSoft,
    false,
    PALETTE.gold
  );
  torus.position.set(2.6, -1.3, -1.2);
  torus.rotation.x = 1.1;
  group.add(torus);
  shapes.push(torus);

  // Cubo (dado pedagógico) branco
  const cube = makeShape(new THREE.BoxGeometry(0.5, 0.5, 0.5), PALETTE.white);
  cube.position.set(0.4, 2.3, -2.4);
  group.add(cube);
  shapes.push(cube);

  // Tetraedro azul-claro
  const tetra = makeShape(new THREE.TetrahedronGeometry(0.38, 0), PALETTE.sky);
  tetra.position.set(-0.6, -1.9, -1.4);
  group.add(tetra);
  shapes.push(tetra);

  // Esfera pequena dourada
  const sphere = makeShape(new THREE.SphereGeometry(0.24, 20, 20), PALETTE.gold);
  sphere.position.set(1.9, 0.9, -0.6);
  group.add(sphere);
  shapes.push(sphere);

  /* ---------- Partículas de fundo ---------- */
  const PARTICLE_COUNT = 320;
  const positions = new Float32Array(PARTICLE_COUNT * 3);
  for (let i = 0; i < PARTICLE_COUNT; i += 1) {
    positions[i * 3] = (Math.random() - 0.5) * 16;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 9;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 8 - 2;
  }
  const particleGeo = new THREE.BufferGeometry();
  particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  const particleMat = new THREE.PointsMaterial({
    color: PALETTE.sky,
    size: 0.045,
    transparent: true,
    opacity: 0.65,
    depthWrite: false,
    sizeAttenuation: true,
  });
  const particles = new THREE.Points(particleGeo, particleMat);
  scene.add(particles);

  /* ---------- DRACOLoader (pronto para modelos .glb/.drc futuros) ---------- */
  const dracoLoader = new DRACOLoader();
  dracoLoader.setDecoderPath(
    'https://cdn.jsdelivr.net/npm/three@0.170.0/examples/jsm/libs/draco/'
  );
  const gltfLoader = new GLTFLoader();
  gltfLoader.setDRACOLoader(dracoLoader);

  // Carrega um modelo opcional (assets/models/hero.glb) se existir.
  // Mantém o hero procedural por padrão — zero dependência de rede.
  fetch('assets/models/hero.glb', { method: 'HEAD' })
    .then((res) => {
      if (!res.ok) return;
      return gltfLoader.loadAsync('assets/models/hero.glb');
    })
    .then((gltf) => {
      if (!gltf) return;
      const model = gltf.scene;
      model.scale.setScalar(1.4);
      model.position.set(0, 0.2, -1.5);
      group.add(model);
      shapes.push(model);
    })
    .catch(() => {
      /* modelo opcional ausente — segue com geometria procedural */
    });

  /* ---------- Parallax do cursor (lerp com amortecimento) ---------- */
  const mouse = { x: 0, y: 0 };
  const target = { x: 0, y: 0 };

  const onPointerMove = (e) => {
    target.x = (e.clientX / window.innerWidth) * 2 - 1;
    target.y = -((e.clientY / window.innerHeight) * 2 - 1);
  };
  window.addEventListener('pointermove', onPointerMove, { passive: true });

  /* ---------- Loop sincronizado com gsap.ticker ---------- */
  const tick = (time, deltaTime) => {
    const dt = Math.min(deltaTime || 0.016, 0.05);

    // Amortecimento (lerp) do cursor
    mouse.x += (target.x - mouse.x) * 0.045;
    mouse.y += (target.y - mouse.y) * 0.045;

    camera.position.x = mouse.x * 0.55;
    camera.position.y = 0.6 + mouse.y * 0.4;
    camera.lookAt(0, 0.2, 0);

    // Rotação lenta dos objetos
    group.rotation.y += dt * 0.1;
    bookGroup.rotation.y += dt * 0.25;
    ico.rotation.x += dt * 0.3;
    ico.rotation.y += dt * 0.4;
    octa.rotation.x += dt * 0.35;
    octa.rotation.z += dt * 0.25;
    torus.rotation.z += dt * 0.3;
    cube.rotation.x += dt * 0.4;
    cube.rotation.y += dt * 0.3;
    tetra.rotation.y += dt * 0.45;
    sphere.rotation.x += dt * 0.5;

    // Flutuação vertical suave
    shapes.forEach((s, i) => {
      s.position.y += Math.sin(time * 0.0012 + i * 1.7) * 0.0006;
    });

    particles.rotation.y += dt * 0.02;

    renderer.render(scene, camera);
  };

  if (reducedMotion) {
    // Renderiza um único frame estático (sem loop)
    tick(0, 0.016);
  } else {
    gsap.ticker.add(tick);
  }

  /* ---------- Resize ---------- */
  const onResize = () => {
    const w = container.clientWidth;
    const h = container.clientHeight;
    if (!w || !h) return;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h, false);
  };
  window.addEventListener('resize', onResize);

  /* ---------- Pausa quando a aba está oculta ---------- */
  const onVisibility = () => {
    if (document.hidden) {
      gsap.ticker.remove(tick);
    } else if (!reducedMotion) {
      gsap.ticker.add(tick);
    }
  };
  document.addEventListener('visibilitychange', onVisibility);

  /* ---------- Cleanup ---------- */
  return {
    dispose() {
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('resize', onResize);
      document.removeEventListener('visibilitychange', onVisibility);
      gsap.ticker.remove(tick);
      scene.traverse((obj) => {
        if (obj.geometry) obj.geometry.dispose();
        if (obj.material) {
          if (Array.isArray(obj.material)) obj.material.forEach((m) => m.dispose());
          else obj.material.dispose();
        }
      });
      renderer.dispose();
      if (renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
    },
  };
}