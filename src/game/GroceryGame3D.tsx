import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { create3DBasket, createProduceMesh, PRODUCE_PRESETS, ProduceConfig } from './proceduralModels';
import { sounds } from './soundEffects';
import { useGrocery } from '../context/GroceryContext';
import { Trophy, Heart, Volume2, VolumeX, X, Play, RotateCcw, ArrowLeft, Sparkles, ShoppingBag } from 'lucide-react';

interface ActiveFallingItem {
  mesh: THREE.Group;
  config: ProduceConfig;
  speed: number;
  rotationSpeed: { x: number; y: number; z: number };
}

export const GroceryGame3D: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { updateMonthlyBudget, settings, showToast, addItem } = useGrocery();

  const containerRef = useRef<HTMLDivElement>(null);

  // React HUD States
  const [gameState, setGameState] = useState<'title' | 'playing' | 'gameover'>('title');
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => {
    try {
      return parseInt(localStorage.getItem('priyam_game_highscore') || '0', 10);
    } catch {
      return 0;
    }
  });
  const [lives, setLives] = useState(3);
  const [isMuted, setIsMuted] = useState(false);
  const [rewardClaimed, setRewardClaimed] = useState(false);

  // Mutable Game Loop State in refs to prevent React re-renders tearing down WebGL
  const gameRef = useRef<{
    score: number;
    lives: number;
    basketX: number;
    targetBasketX: number;
    spawnTimer: number;
    spawnInterval: number;
    speedMultiplier: number;
    items: ActiveFallingItem[];
    particles: THREE.Points | null;
    particlePositions: Float32Array;
    particleVelocities: Float32Array;
    particleLife: Float32Array;
    particleCount: number;
    isOver: boolean;
  }>({
    score: 0,
    lives: 3,
    basketX: 0,
    targetBasketX: 0,
    spawnTimer: 0,
    spawnInterval: 1.1,
    speedMultiplier: 1.0,
    items: [],
    particles: null,
    particlePositions: new Float32Array(150 * 3),
    particleVelocities: new Float32Array(150 * 3),
    particleLife: new Float32Array(150),
    particleCount: 150,
    isOver: false,
  });

  // Handle Mute
  const toggleMute = () => {
    sounds.isMuted = !isMuted;
    setIsMuted(!isMuted);
  };

  // Start / Restart Game
  const startGame = () => {
    gameRef.current.score = 0;
    gameRef.current.lives = 3;
    gameRef.current.basketX = 0;
    gameRef.current.targetBasketX = 0;
    gameRef.current.spawnTimer = 0;
    gameRef.current.speedMultiplier = 1.0;
    gameRef.current.isOver = false;

    // Clear falling items
    gameRef.current.items.forEach((item) => {
      item.mesh.parent?.remove(item.mesh);
    });
    gameRef.current.items = [];

    setScore(0);
    setLives(3);
    setRewardClaimed(false);
    setGameState('playing');
  };

  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;

    // 1. Software WebGL Detection Guard
    const isSoftwareGl = (() => {
      try {
        const gl = document.createElement('canvas').getContext('webgl2');
        if (!gl) return true;
        const ext = gl.getExtension('WEBGL_debug_renderer_info');
        const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
        const gpu = String(gl.getParameter(param));
        gl.getExtension('WEBGL_lose_context')?.loseContext();
        return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
      } catch {
        return true;
      }
    })();

    // 2. Three.js Scene, Camera & Renderer
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xfffef8);
    scene.fog = new THREE.Fog(0xfffef8, 12, 28);

    const width = container.clientWidth || 380;
    const height = container.clientHeight || 640;

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 4.5, 7.5);
    camera.lookAt(0, 1.2, 0);

    const renderer = new THREE.WebGLRenderer({
      antialias: !isSoftwareGl,
      powerPreference: 'high-performance',
      alpha: true,
    });
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    renderer.shadowMap.enabled = !isSoftwareGl;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    container.appendChild(renderer.domElement);

    // 3. Studio Lighting Rig
    const ambientLight = new THREE.HemisphereLight(0xfff9e6, 0x94a3b8, 0.7);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xfffaed, 1.2);
    keyLight.position.set(4, 10, 5);
    keyLight.castShadow = !isSoftwareGl;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    keyLight.shadow.bias = -0.0005;
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0xffedd5, 0.5);
    fillLight.position.set(-5, 6, -2);
    scene.add(fillLight);

    // 4. Ground Arena
    const floorGeo = new THREE.PlaneGeometry(24, 24);
    const floorMat = new THREE.MeshStandardMaterial({
      color: 0xfef9c3,
      roughness: 0.8,
      metalness: 0.05,
    });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = 0;
    floor.receiveShadow = !isSoftwareGl;
    scene.add(floor);

    // Arena side guides
    const leftGuide = new THREE.Mesh(
      new THREE.CylinderGeometry(0.08, 0.08, 14, 8),
      new THREE.MeshStandardMaterial({ color: 0xfde047, roughness: 0.4 })
    );
    leftGuide.position.set(-3.2, 0.1, 0);
    leftGuide.rotation.x = Math.PI / 2;
    scene.add(leftGuide);

    const rightGuide = leftGuide.clone();
    rightGuide.position.set(3.2, 0.1, 0);
    scene.add(rightGuide);

    // 5. Hero Golden Basket
    const basket = create3DBasket();
    basket.position.set(0, 0, 0);
    scene.add(basket);

    // 6. Particle Burst Pool for Juicy Feedback
    const pGeo = new THREE.BufferGeometry();
    pGeo.setAttribute('position', new THREE.BufferAttribute(gameRef.current.particlePositions, 3));
    const pMat = new THREE.PointsMaterial({
      color: 0xffd21f,
      size: 0.15,
      transparent: true,
      opacity: 0.9,
    });
    const particleSystem = new THREE.Points(pGeo, pMat);
    scene.add(particleSystem);
    gameRef.current.particles = particleSystem;

    // Helper function to trigger particle burst
    const spawnCatchBurst = (x: number, y: number, z: number, colorHex: number) => {
      pMat.color.setHex(colorHex);
      const pos = gameRef.current.particlePositions;
      const vel = gameRef.current.particleVelocities;
      const life = gameRef.current.particleLife;

      for (let i = 0; i < gameRef.current.particleCount; i++) {
        const i3 = i * 3;
        pos[i3] = x;
        pos[i3 + 1] = y;
        pos[i3 + 2] = z;

        const theta = Math.random() * Math.PI * 2;
        const phi = Math.random() * Math.PI;
        const speed = 1.5 + Math.random() * 3.5;

        vel[i3] = Math.sin(phi) * Math.cos(theta) * speed;
        vel[i3 + 1] = Math.cos(phi) * speed + 1.2;
        vel[i3 + 2] = Math.sin(phi) * Math.sin(theta) * speed;

        life[i] = 0.5 + Math.random() * 0.4;
      }
      pGeo.attributes.position.needsUpdate = true;
    };

    // 7. Input Handlers: Mouse, Touch & Keyboard
    const handlePointerMove = (clientX: number) => {
      const rect = container.getBoundingClientRect();
      const normX = ((clientX - rect.left) / rect.width) * 2 - 1;
      const target = Math.max(-2.7, Math.min(2.7, normX * 3.4));
      gameRef.current.targetBasketX = target;
    };

    const onMouseMove = (e: MouseEvent) => {
      handlePointerMove(e.clientX);
    };

    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        handlePointerMove(e.touches[0].clientX);
      }
    };

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        gameRef.current.targetBasketX = Math.max(-2.7, gameRef.current.targetBasketX - 0.7);
      } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        gameRef.current.targetBasketX = Math.min(2.7, gameRef.current.targetBasketX + 0.7);
      }
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('touchmove', onTouchMove, { passive: true });
    window.addEventListener('keydown', onKeyDown);

    // 8. 60fps Animation Loop with Delta Timing
    let animationFrameId: number;
    let lastTime = performance.now();

    const gameLoop = (now: number) => {
      const rawDt = (now - lastTime) / 1000;
      lastTime = now;
      const dt = Math.min(rawDt, 0.05);

      const state = gameRef.current;

      // Exponential damping on Basket Movement (silky feel)
      state.basketX = THREE.MathUtils.damp(state.basketX, state.targetBasketX, 14, dt);
      basket.position.x = state.basketX;
      // Slight basket banking tilt based on velocity
      const velocity = (state.targetBasketX - state.basketX);
      basket.rotation.z = THREE.MathUtils.damp(basket.rotation.z, -velocity * 0.15, 10, dt);

      // Only spawn & advance game physics if playing
      if (gameState === 'playing' && !state.isOver) {
        state.spawnTimer += dt;
        if (state.spawnTimer >= state.spawnInterval) {
          state.spawnTimer = 0;

          // Pick random produce or hazard
          const isHazard = Math.random() < 0.22;
          const config = isHazard
            ? PRODUCE_PRESETS.find((p) => p.type === 'hazard')!
            : PRODUCE_PRESETS[Math.floor(Math.random() * (PRODUCE_PRESETS.length - 1))];

          const mesh = createProduceMesh(config.type);
          const spawnX = (Math.random() - 0.5) * 5.0;
          mesh.position.set(spawnX, 7.5, (Math.random() - 0.5) * 0.8);
          scene.add(mesh);

          state.items.push({
            mesh,
            config,
            speed: (3.2 + Math.random() * 1.5) * state.speedMultiplier,
            rotationSpeed: {
              x: (Math.random() - 0.5) * 3,
              y: (Math.random() - 0.5) * 3,
              z: (Math.random() - 0.5) * 3,
            },
          });

          // Slowly ramp difficulty
          state.speedMultiplier = Math.min(2.2, state.speedMultiplier + 0.015);
          state.spawnInterval = Math.max(0.65, state.spawnInterval - 0.005);
        }

        // Advance falling items & check collision
        for (let i = state.items.length - 1; i >= 0; i--) {
          const item = state.items[i];
          item.mesh.position.y -= item.speed * dt;
          item.mesh.rotation.x += item.rotationSpeed.x * dt;
          item.mesh.rotation.y += item.rotationSpeed.y * dt;

          const dx = Math.abs(item.mesh.position.x - basket.position.x);
          const dy = item.mesh.position.y - basket.position.y;

          // Catch collision boundary (basket radius ~0.9, height ~0.75)
          if (dy <= 0.8 && dy >= 0.1 && dx <= 0.95) {
            // CAUGHT!
            if (item.config.type === 'hazard') {
              sounds.playHazardSound();
              state.lives -= 1;
              setLives(state.lives);
              spawnCatchBurst(item.mesh.position.x, 0.7, item.mesh.position.z, 0xef4444);

              // Camera shake
              camera.position.x = (Math.random() - 0.5) * 0.4;
              setTimeout(() => {
                camera.position.x = 0;
              }, 120);

              if (state.lives <= 0) {
                state.isOver = true;
                sounds.playGameOverSound(false);
                setGameState('gameover');
                if (state.score > highScore) {
                  setHighScore(state.score);
                  try {
                    localStorage.setItem('priyam_game_highscore', state.score.toString());
                  } catch {}
                }
              }
            } else {
              // Fresh Grocery Catch
              sounds.playCatchSound(item.config.category as any);
              state.score += item.config.points;
              setScore(state.score);
              const color =
                item.config.type === 'tomato'
                  ? 0xef4444
                  : item.config.type === 'banana'
                  ? 0xfacc15
                  : 0x4ade80;
              spawnCatchBurst(item.mesh.position.x, 0.7, item.mesh.position.z, color);

              if (state.score > highScore) {
                setHighScore(state.score);
                try {
                  localStorage.setItem('priyam_game_highscore', state.score.toString());
                } catch {}
              }
            }

            scene.remove(item.mesh);
            state.items.splice(i, 1);
            continue;
          }

          // Missed item falling past floor
          if (item.mesh.position.y < -0.5) {
            if (item.config.type !== 'hazard') {
              // Missed good produce loses 1 life
              state.lives -= 1;
              setLives(state.lives);
              sounds.playHazardSound();

              if (state.lives <= 0) {
                state.isOver = true;
                sounds.playGameOverSound(false);
                setGameState('gameover');
                if (state.score > highScore) {
                  setHighScore(state.score);
                  try {
                    localStorage.setItem('priyam_game_highscore', state.score.toString());
                  } catch {}
                }
              }
            }
            scene.remove(item.mesh);
            state.items.splice(i, 1);
          }
        }
      }

      // Update particle physics
      const pos = state.particlePositions;
      const vel = state.particleVelocities;
      const life = state.particleLife;
      let activeParticles = false;

      for (let p = 0; p < state.particleCount; p++) {
        if (life[p] > 0) {
          activeParticles = true;
          life[p] -= dt;
          const p3 = p * 3;
          pos[p3] += vel[p3] * dt;
          pos[p3 + 1] += vel[p3 + 1] * dt;
          pos[p3 + 2] += vel[p3 + 2] * dt;
          vel[p3 + 1] -= 9.8 * dt; // gravity
        } else {
          pos[p * 3 + 1] = -100; // hide
        }
      }
      if (activeParticles) {
        pGeo.attributes.position.needsUpdate = true;
      }

      renderer.render(scene, camera);
      animationFrameId = requestAnimationFrame(gameLoop);
    };

    animationFrameId = requestAnimationFrame(gameLoop);

    // Resize Handler
    const handleResize = () => {
      if (!container) return;
      const newW = container.clientWidth || 380;
      const newH = container.clientHeight || 640;
      camera.aspect = newW / newH;
      camera.updateProjectionMatrix();
      renderer.setSize(newW, newH);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('resize', handleResize);

      // Clean Three.js geometries & materials
      scene.clear();
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  // Claim Reward from Game to Real Grocery Manager
  const handleClaimReward = () => {
    if (rewardClaimed) return;
    const bonusSavings = Math.max(100, Math.round(score * 2));
    updateMonthlyBudget(settings.monthlyBudget + bonusSavings);

    // Also add a free fresh fruit reward
    addItem({
      name: 'Reward Fuji Apple',
      quantity: 1,
      unit: 'kg',
      price: 0,
      category: 'Fruits',
      notes: 'Unlocked as a high-score prize in Market Catch 3D!',
    });

    setRewardClaimed(true);
    showToast(`Claimed +₹${bonusSavings} Grocery Budget & Free Apples!`);
  };

  return (
    <div className="relative w-full h-full min-h-[680px] flex flex-col justify-between bg-[#FFFEF8] overflow-hidden select-none">
      {/* 3D WebGL Canvas Mount */}
      <div ref={containerRef} className="absolute inset-0 w-full h-full z-0 cursor-ew-resize" />

      {/* Top Header Overlay */}
      <div className="relative z-20 px-4 py-3 flex items-center justify-between pointer-events-auto">
        <button
          onClick={onClose}
          className="w-9 h-9 rounded-full bg-white/90 backdrop-blur-md border border-amber-200 text-slate-700 flex items-center justify-center shadow-md active:scale-95 transition-all"
          aria-label="Back to grocery manager"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        {/* Live HUD when playing */}
        {gameState === 'playing' ? (
          <div className="flex items-center gap-3 bg-white/90 backdrop-blur-md px-3.5 py-1.5 rounded-2xl border border-amber-200 shadow-md">
            {/* Score */}
            <div className="flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span className="text-sm font-black text-slate-900 tabular-nums font-display">
                {score}
              </span>
            </div>

            {/* Lives */}
            <div className="flex items-center gap-1 border-l border-slate-200 pl-2.5">
              {[1, 2, 3].map((heart) => (
                <Heart
                  key={heart}
                  className={`w-4 h-4 ${
                    heart <= lives
                      ? 'fill-rose-500 text-rose-500'
                      : 'fill-slate-200 text-slate-300'
                  }`}
                />
              ))}
            </div>
          </div>
        ) : (
          <span className="text-xs font-bold uppercase tracking-wider text-amber-900 bg-amber-100/90 px-3 py-1 rounded-full border border-amber-300">
            Three.js 3D Mini-Game
          </span>
        )}

        {/* Audio Mute toggle */}
        <button
          onClick={toggleMute}
          className="w-9 h-9 rounded-full bg-white/90 backdrop-blur-md border border-amber-200 text-slate-700 flex items-center justify-center shadow-md active:scale-95 transition-all"
        >
          {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
        </button>
      </div>

      {/* Title Screen Overlay */}
      {gameState === 'title' && (
        <div className="relative z-20 my-auto p-6 flex flex-col items-center text-center animate-in zoom-in-95 duration-200 pointer-events-auto">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-400 to-[#FFD21F] text-amber-950 flex items-center justify-center shadow-xl shadow-amber-400/30 mb-3 border border-amber-300">
            <ShoppingBag className="w-8 h-8 stroke-[2.4]" />
          </div>

          <h2 className="text-3xl font-black text-slate-900 tracking-tight font-display">
            Priyam Market Catch 3D
          </h2>
          <p className="text-xs font-semibold text-slate-600 mt-1 max-w-xs">
            Catch fresh produce in your 3D golden basket! Dodge spoiled cans and earn grocery budget savings.
          </p>

          {/* High Score Pill */}
          {highScore > 0 && (
            <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 font-bold text-xs border border-amber-300">
              <Trophy className="w-3.5 h-3.5 text-amber-600" />
              <span>Best Score: {highScore}</span>
            </div>
          )}

          {/* Start CTA Button */}
          <button
            onClick={startGame}
            className="mt-6 px-8 py-3.5 rounded-2xl btn-yellow-3d text-amber-950 font-black text-sm flex items-center gap-2 shadow-xl hover:scale-105 active:scale-95 transition-all cursor-pointer font-display"
          >
            <Play className="w-5 h-5 fill-amber-950 stroke-none" />
            <span>Play 3D Catch</span>
          </button>

          {/* Flat control hint line */}
          <div className="mt-6 text-[11px] font-semibold text-slate-500 bg-white/80 backdrop-blur-sm px-3.5 py-1.5 rounded-xl border border-amber-200/60 shadow-sm">
            Drag or swipe anywhere to move basket · Keyboard ← / →
          </div>
        </div>
      )}

      {/* Game Over Modal Overlay */}
      {gameState === 'gameover' && (
        <div className="relative z-30 m-auto p-6 max-w-xs w-full bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl border border-amber-200 text-center animate-in zoom-in-95 duration-200 pointer-events-auto">
          <div className="w-14 h-14 mx-auto rounded-full bg-gradient-to-tr from-[#FFD21F] to-amber-500 text-amber-950 flex items-center justify-center shadow-md mb-2">
            <Trophy className="w-7 h-7" />
          </div>

          <h3 className="text-2xl font-black text-slate-900 font-display">
            {score >= 100 ? 'Awesome Shopping!' : 'Good Effort!'}
          </h3>

          <div className="my-3 p-3 bg-amber-50/80 rounded-2xl border border-amber-200">
            <span className="text-[11px] font-bold text-slate-500 uppercase">Final Score</span>
            <div className="text-3xl font-black text-amber-950 font-display mt-0.5 tabular-nums">
              {score}
            </div>
            {score >= highScore && score > 0 && (
              <span className="text-[11px] font-extrabold text-emerald-600 mt-1 block">
                ★ New Personal Record! ★
              </span>
            )}
          </div>

          {/* Claim Real Reward Feature */}
          <div className="mb-4">
            <button
              onClick={handleClaimReward}
              disabled={rewardClaimed || score === 0}
              className={`w-full py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-sm ${
                rewardClaimed
                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                  : 'bg-gradient-to-r from-amber-400 to-[#FFD21F] text-amber-950 hover:brightness-105 active:scale-95 border border-amber-400'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-900" />
              <span>
                {rewardClaimed
                  ? 'Bonus Saved to Budget!'
                  : `Claim +₹${Math.max(100, Math.round(score * 2))} Budget Reward`}
              </span>
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <button
              onClick={startGame}
              className="py-2.5 rounded-xl btn-yellow-3d text-amber-950 font-extrabold text-xs flex items-center justify-center gap-1 shadow-md cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Play Again</span>
            </button>

            <button
              onClick={onClose}
              className="py-2.5 rounded-xl border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-50 transition-colors"
            >
              Back to App
            </button>
          </div>
        </div>
      )}

      {/* Bottom Control Hint / Touch Guide when playing */}
      {gameState === 'playing' && (
        <div className="relative z-20 pb-4 flex justify-center pointer-events-none">
          <div className="px-4 py-1.5 rounded-full bg-white/80 backdrop-blur-sm border border-amber-200 text-slate-600 font-bold text-[11px] shadow-sm">
            Drag left & right to catch falling produce!
          </div>
        </div>
      )}
    </div>
  );
};
