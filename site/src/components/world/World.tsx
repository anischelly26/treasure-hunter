"use client";

import { Canvas, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { motion, onFrame } from "@/lib/motion";
import { fragmentShader, haloFragment, haloVertex, vertexShader } from "@/lib/world/shaders";
import { updateWorld, world } from "@/lib/world/store";

const DISTANCE = 10;
const FOV = 30;

type Quality = { segments: number; maxDpr: number; minDpr: number };

function pickQuality(): Quality {
  const nav = navigator as Navigator & { deviceMemory?: number };
  const cores = nav.hardwareConcurrency ?? 8;
  const memory = nav.deviceMemory ?? 8;
  const coarse = !window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  const weak = cores <= 4 || memory <= 4;
  if (coarse) return { segments: weak ? 96 : 128, maxDpr: weak ? 1 : 1.5, minDpr: 0.7 };
  return { segments: weak ? 150 : 220, maxDpr: weak ? 1.25 : 1.75, minDpr: 0.75 };
}

function Scene({ quality }: { quality: Quality }) {
  const { advance, camera, gl, scene, size, setDpr } = useThree();
  const mesh = useRef<THREE.Mesh>(null);
  const halo = useRef<THREE.Mesh>(null);

  const geometry = useMemo(() => new THREE.PlaneGeometry(1, 1, quality.segments, quality.segments), [quality.segments]);

  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader,
        fragmentShader,
        transparent: true,
        side: THREE.DoubleSide,
        uniforms: {
          uTime: { value: 0 },
          uMorph: { value: 0 },
          uWater: { value: 0 },
          uStrength: { value: 0.26 },
          uDensity: { value: 1.25 },
          uFrequency: { value: 2.2 },
          uAmplitude: { value: 0.3 },
          uVelocity: { value: 0 },
          uAudio: { value: 0 },
          uPlane: { value: new THREE.Vector2(6.4, 4) },
          uTexel: { value: 1 / quality.segments },
          uC1: { value: new THREE.Vector3() },
          uC2: { value: new THREE.Vector3() },
          uC3: { value: new THREE.Vector3() },
          uLight: { value: new THREE.Vector3(-0.45, 0.65, 0.7) },
          uBrightness: { value: 1 },
          uOpacity: { value: 1 },
          uGrain: { value: 0.05 },
          uLines: { value: 0 },
          uScan: { value: 0 },
          uRim: { value: 0.5 },
          uTint: { value: 1 },
        },
      }),
    [quality.segments],
  );

  const haloMaterial = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: haloVertex,
        fragmentShader: haloFragment,
        transparent: true,
        depthWrite: false,
        depthTest: false,
        uniforms: { uColor: { value: new THREE.Vector3() }, uIntensity: { value: 0 } },
      }),
    [],
  );

  useEffect(
    () => () => {
      geometry.dispose();
      material.dispose();
      haloMaterial.dispose();
    },
    [geometry, material, haloMaterial],
  );

  useEffect(() => {
    const aspect = size.width / Math.max(size.height, 1);

    let dpr = Math.min(window.devicePixelRatio || 1, quality.maxDpr);
    setDpr(dpr);
    let slow = 0;
    let fast = 0;

    // Compile off the main thread where the driver allows it, so the page stays
    // responsive while a cold GPU builds the program. Draw only once it is ready.
    let compiled = false;
    performance.mark("world:compile:start");
    gl.compileAsync(scene, camera)
      .catch(() => {})
      .then(() => {
        if (!compiled) performance.measure("world:compile", "world:compile:start");
        compiled = true;
      });

    return onFrame((time, dt) => {
      if (document.hidden) return;
      updateWorld(dt);
      if (!compiled) return;

      const s = world.cur;
      // Nothing to draw: skip the GPU work entirely.
      if (s.opacity < 0.01 || !mesh.current || !halo.current) return;

      const u = material.uniforms;
      u.uTime.value = world.time;
      u.uMorph.value = s.morph;
      u.uWater.value = s.water;
      u.uStrength.value = s.strength;
      u.uDensity.value = s.density;
      u.uFrequency.value = s.frequency;
      u.uAmplitude.value = s.amplitude + world.audio.sHigh * 0.08;
      u.uVelocity.value = Math.abs(motion.v);
      u.uAudio.value = world.audio.sBass;
      u.uC1.value.fromArray(s.c1);
      u.uC2.value.fromArray(s.c2);
      u.uC3.value.fromArray(s.c3);
      u.uBrightness.value = s.brightness;
      u.uOpacity.value = s.opacity;
      u.uGrain.value = s.grain;
      u.uLines.value = s.lines;
      u.uScan.value = s.scan;
      u.uRim.value = s.rim;
      u.uTint.value = s.tint;

      const p = motion.pointer;
      u.uLight.value.set(-0.45 + p.sx * 0.7, 0.65 - p.sy * 0.5, 0.7).normalize();

      // Composition is expressed in viewport fractions, so it survives any aspect ratio.
      const visH = 2 * DISTANCE * Math.tan(THREE.MathUtils.degToRad(FOV / 2));
      const visW = visH * aspect;
      const radius = (s.scale * Math.min(visW, visH)) / 2;
      const m = mesh.current;
      m.scale.setScalar(radius);
      m.position.set((s.x * visW) / 2, (s.y * visH) / 2, 0);
      m.rotation.set(s.rotX - p.sy * 0.03, s.rotY + p.sx * 0.05, s.rotZ);

      const h = halo.current;
      h.position.copy(m.position);
      h.scale.setScalar(radius * 4.2);
      haloMaterial.uniforms.uColor.value.set(
        (s.c1[0] + s.c2[0]) * 0.5,
        (s.c1[1] + s.c2[1]) * 0.5,
        (s.c1[2] + s.c2[2]) * 0.5,
      );
      haloMaterial.uniforms.uIntensity.value = (1 - s.morph) * 0.3 * s.brightness * s.opacity;

      const az = s.azimuth + p.sx * 0.05;
      const pol = s.polar - p.sy * 0.035;
      camera.position.set(DISTANCE * Math.sin(az) * Math.cos(pol), DISTANCE * Math.sin(pol), DISTANCE * Math.cos(az) * Math.cos(pol));
      camera.lookAt(0, 0, 0);

      advance(time);
      world.rendered = true;

      // Adaptive resolution: step down when frames run long, back up when there is headroom.
      if (dt > 1 / 42) slow++;
      else if (dt < 1 / 56) fast++;
      if (slow + fast >= 90) {
        if (slow > 45 && dpr > quality.minDpr) {
          dpr = Math.max(quality.minDpr, dpr - 0.25);
          setDpr(dpr);
        } else if (fast > 86 && dpr < Math.min(window.devicePixelRatio || 1, quality.maxDpr)) {
          dpr = Math.min(window.devicePixelRatio || 1, quality.maxDpr, dpr + 0.125);
          setDpr(dpr);
        }
        slow = fast = 0;
      }
    }, 100);
  }, [advance, camera, gl, scene, material, haloMaterial, quality, setDpr, size.width, size.height]);

  return (
    <>
      <mesh ref={halo} renderOrder={-1} material={haloMaterial}>
        <planeGeometry args={[1, 1]} />
      </mesh>
      <mesh ref={mesh} geometry={geometry} material={material} frustumCulled={false} />
    </>
  );
}

export default function World() {
  const quality = useMemo(() => pickQuality(), []);
  return (
    <Canvas
      frameloop="never"
      camera={{ fov: FOV, position: [0, 0, DISTANCE], near: 0.1, far: 60 }}
      gl={{ alpha: true, antialias: true, powerPreference: "high-performance", stencil: false }}
      style={{ pointerEvents: "none" }}
      aria-hidden="true"
    >
      <Scene quality={quality} />
    </Canvas>
  );
}
