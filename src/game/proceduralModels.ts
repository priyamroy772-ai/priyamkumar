import * as THREE from 'three';

// 1. Procedural 3D Golden Grocery Basket (3-12 parts)
export function create3DBasket(): THREE.Group {
  const basket = new THREE.Group();

  // Golden basket PBR material
  const basketMat = new THREE.MeshStandardMaterial({
    color: 0xffd21f,
    roughness: 0.35,
    metalness: 0.25,
  });

  const wireMat = new THREE.MeshStandardMaterial({
    color: 0xf5b800,
    roughness: 0.4,
    metalness: 0.3,
  });

  const handleMat = new THREE.MeshStandardMaterial({
    color: 0xd97706,
    roughness: 0.2,
    metalness: 0.4,
  });

  // Base plate
  const baseGeo = new THREE.CylinderGeometry(0.85, 0.7, 0.1, 16);
  const baseMesh = new THREE.Mesh(baseGeo, basketMat);
  baseMesh.position.y = 0.05;
  baseMesh.castShadow = true;
  baseMesh.receiveShadow = true;
  basket.add(baseMesh);

  // Top Rim (Torus)
  const rimGeo = new THREE.TorusGeometry(1.0, 0.06, 12, 24);
  rimGeo.rotateX(Math.PI / 2);
  const rimMesh = new THREE.Mesh(rimGeo, basketMat);
  rimMesh.position.y = 0.8;
  rimMesh.castShadow = true;
  basket.add(rimMesh);

  // Middle support Ring
  const midRimGeo = new THREE.TorusGeometry(0.9, 0.04, 10, 24);
  midRimGeo.rotateX(Math.PI / 2);
  const midRimMesh = new THREE.Mesh(midRimGeo, wireMat);
  midRimMesh.position.y = 0.45;
  basket.add(midRimMesh);

  // Vertical Wire Ribs (8 struts)
  for (let i = 0; i < 8; i++) {
    const angle = (i / 8) * Math.PI * 2;
    const strutGeo = new THREE.CylinderGeometry(0.035, 0.035, 0.8, 8);
    const strut = new THREE.Mesh(strutGeo, wireMat);
    const rTop = 0.95;
    const rBot = 0.75;
    const xTop = Math.cos(angle) * rTop;
    const zTop = Math.sin(angle) * rTop;
    const xBot = Math.cos(angle) * rBot;
    const zBot = Math.sin(angle) * rBot;

    strut.position.set((xTop + xBot) / 2, 0.42, (zTop + zBot) / 2);
    strut.lookAt(new THREE.Vector3(xTop, 0.8, zTop));
    strut.rotateX(Math.PI / 2);
    strut.castShadow = true;
    basket.add(strut);
  }

  // Arch Handle
  const handleGeo = new THREE.TorusGeometry(0.95, 0.05, 12, 24, Math.PI);
  const handleMesh = new THREE.Mesh(handleGeo, handleMat);
  handleMesh.position.y = 0.75;
  handleMesh.castShadow = true;
  basket.add(handleMesh);

  // Soft Contact Shadow Plane at base
  const shadowGeo = new THREE.PlaneGeometry(2.4, 2.4);
  const shadowCanvas = document.createElement('canvas');
  shadowCanvas.width = 128;
  shadowCanvas.height = 128;
  const ctx = shadowCanvas.getContext('2d')!;
  const grad = ctx.createRadialGradient(64, 64, 10, 64, 64, 60);
  grad.addColorStop(0, 'rgba(0, 0, 0, 0.4)');
  grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 128, 128);

  const shadowTex = new THREE.CanvasTexture(shadowCanvas);
  const shadowMat = new THREE.MeshBasicMaterial({
    map: shadowTex,
    transparent: true,
    depthWrite: false,
    opacity: 0.6,
  });
  const shadowMesh = new THREE.Mesh(shadowGeo, shadowMat);
  shadowMesh.rotation.x = -Math.PI / 2;
  shadowMesh.position.y = -0.01;
  basket.add(shadowMesh);

  return basket;
}

// 2. Procedural Falling Produce Models (Tomato, Apple, Carrot, Milk, Banana, Rotten/Hazard)
export type ProduceType = 'tomato' | 'apple' | 'carrot' | 'milk' | 'banana' | 'hazard';

export interface ProduceConfig {
  type: ProduceType;
  name: string;
  points: number;
  category: 'vegetable' | 'fruit' | 'dairy' | 'special' | 'hazard';
}

export const PRODUCE_PRESETS: ProduceConfig[] = [
  { type: 'tomato', name: 'Fresh Tomato', points: 10, category: 'vegetable' },
  { type: 'apple', name: 'Crisp Apple', points: 15, category: 'fruit' },
  { type: 'banana', name: 'Sweet Banana', points: 20, category: 'fruit' },
  { type: 'carrot', name: 'Crunchy Carrot', points: 15, category: 'vegetable' },
  { type: 'milk', name: 'Farm Milk', points: 25, category: 'dairy' },
  { type: 'hazard', name: 'Spoiled Can', points: -30, category: 'hazard' },
];

export function createProduceMesh(type: ProduceType): THREE.Group {
  const item = new THREE.Group();

  switch (type) {
    case 'tomato': {
      // 1. Red body
      const bodyMat = new THREE.MeshStandardMaterial({
        color: 0xef4444,
        roughness: 0.2,
        metalness: 0.1,
      });
      const body = new THREE.Mesh(new THREE.SphereGeometry(0.38, 16, 16), bodyMat);
      body.scale.set(1.1, 0.9, 1.1);
      body.castShadow = true;
      item.add(body);

      // 2. Green Calyx star leaves
      const greenMat = new THREE.MeshStandardMaterial({ color: 0x2e7d32, roughness: 0.4 });
      for (let i = 0; i < 5; i++) {
        const leaf = new THREE.Mesh(new THREE.ConeGeometry(0.06, 0.22, 5), greenMat);
        const a = (i / 5) * Math.PI * 2;
        leaf.position.set(Math.cos(a) * 0.12, 0.35, Math.sin(a) * 0.12);
        leaf.rotation.x = Math.PI / 2 + 0.3;
        leaf.rotation.z = -a;
        item.add(leaf);
      }

      // 3. Stem
      const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.18, 6), greenMat);
      stem.position.y = 0.42;
      stem.rotation.z = 0.15;
      item.add(stem);
      break;
    }

    case 'apple': {
      // 1. Apple Body
      const appleMat = new THREE.MeshStandardMaterial({
        color: 0xdc2626,
        roughness: 0.25,
        metalness: 0.1,
      });
      const body = new THREE.Mesh(new THREE.SphereGeometry(0.36, 16, 16), appleMat);
      body.scale.set(1.0, 1.05, 1.0);
      body.castShadow = true;
      item.add(body);

      // 2. Stem
      const stemMat = new THREE.MeshStandardMaterial({ color: 0x5d4037, roughness: 0.6 });
      const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.02, 0.22, 6), stemMat);
      stem.position.y = 0.38;
      stem.rotation.z = 0.15;
      item.add(stem);

      // 3. Green Leaf
      const leafMat = new THREE.MeshStandardMaterial({ color: 0x4caf50, roughness: 0.3 });
      const leaf = new THREE.Mesh(new THREE.ConeGeometry(0.07, 0.2, 5), leafMat);
      leaf.position.set(0.1, 0.42, 0);
      leaf.rotation.z = -Math.PI / 3;
      item.add(leaf);
      break;
    }

    case 'banana': {
      // Curved banana made of 3 connected segments
      const peelMat = new THREE.MeshStandardMaterial({
        color: 0xfacc15,
        roughness: 0.3,
        metalness: 0.05,
      });
      const tipMat = new THREE.MeshStandardMaterial({ color: 0x4d7c0f, roughness: 0.5 });

      const bananaBody = new THREE.Mesh(
        new THREE.CylinderGeometry(0.12, 0.09, 0.7, 8),
        peelMat
      );
      bananaBody.rotation.z = Math.PI / 4;
      bananaBody.scale.set(0.9, 1, 1.2);
      bananaBody.castShadow = true;
      item.add(bananaBody);

      const tipTop = new THREE.Mesh(new THREE.ConeGeometry(0.06, 0.15, 6), tipMat);
      tipTop.position.set(-0.28, 0.28, 0);
      tipTop.rotation.z = -Math.PI / 4;
      item.add(tipTop);

      const tipBot = new THREE.Mesh(new THREE.ConeGeometry(0.07, 0.12, 6), tipMat);
      tipBot.position.set(0.26, -0.26, 0);
      tipBot.rotation.z = Math.PI * 0.75;
      item.add(tipBot);
      break;
    }

    case 'carrot': {
      // 1. Orange Cone Body
      const carrotMat = new THREE.MeshStandardMaterial({
        color: 0xf97316,
        roughness: 0.35,
        metalness: 0.05,
      });
      const body = new THREE.Mesh(new THREE.ConeGeometry(0.18, 0.75, 12), carrotMat);
      body.rotation.x = Math.PI;
      body.castShadow = true;
      item.add(body);

      // 2. Green leafy top (3 tufts)
      const greenMat = new THREE.MeshStandardMaterial({ color: 0x22c55e, roughness: 0.4 });
      for (let i = 0; i < 3; i++) {
        const leaf = new THREE.Mesh(new THREE.ConeGeometry(0.06, 0.28, 6), greenMat);
        leaf.position.set((i - 1) * 0.08, 0.42, 0);
        leaf.rotation.z = (i - 1) * 0.25;
        item.add(leaf);
      }
      break;
    }

    case 'milk': {
      // 1. Milk Glass/Carton Bottle
      const bottleMat = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        roughness: 0.15,
        metalness: 0.1,
      });
      const body = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.2, 0.6, 14), bottleMat);
      body.castShadow = true;
      item.add(body);

      // 2. Neck
      const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.18, 0.15, 14), bottleMat);
      neck.position.y = 0.35;
      item.add(neck);

      // 3. Blue Cap
      const capMat = new THREE.MeshStandardMaterial({ color: 0x2563eb, roughness: 0.3 });
      const cap = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.11, 0.08, 14), capMat);
      cap.position.y = 0.44;
      item.add(cap);

      // 4. Blue label band
      const labelMat = new THREE.MeshStandardMaterial({ color: 0x3b82f6, roughness: 0.4 });
      const label = new THREE.Mesh(new THREE.CylinderGeometry(0.185, 0.185, 0.25, 14), labelMat);
      label.position.y = 0.02;
      item.add(label);
      break;
    }

    case 'hazard': {
      // Spoiled / Rotten Spiky Item
      const hazardMat = new THREE.MeshStandardMaterial({
        color: 0x475569,
        roughness: 0.8,
        metalness: 0.3,
      });
      const core = new THREE.Mesh(new THREE.SphereGeometry(0.3, 10, 10), hazardMat);
      core.castShadow = true;
      item.add(core);

      // Spikes
      const spikeMat = new THREE.MeshStandardMaterial({ color: 0xef4444, roughness: 0.3 });
      for (let i = 0; i < 6; i++) {
        const spike = new THREE.Mesh(new THREE.ConeGeometry(0.08, 0.25, 5), spikeMat);
        const angle = (i / 6) * Math.PI * 2;
        spike.position.set(Math.cos(angle) * 0.32, 0, Math.sin(angle) * 0.32);
        spike.rotation.z = -Math.PI / 2;
        spike.rotation.y = angle;
        item.add(spike);
      }
      break;
    }
  }

  return item;
}
