"use client"

import * as THREE from "three"
import { useRef } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import type { MotionValue } from "motion/react"
import { HoodieLights, HoodieModel } from "./hoodie-model"

function ExplosionScene({ progress }: { progress: MotionValue<number> }) {
  const group = useRef<THREE.Group>(null)
  const explodeRef = useRef(0)
  const mouse = useRef({ x: 0, y: 0 })

  useFrame((_, delta) => {
    const raw = progress.get()
    // explode out over the first half of the pin, reassemble over the second
    const target = raw < 0.5 ? raw * 2 : (1 - raw) * 2
    explodeRef.current = THREE.MathUtils.lerp(explodeRef.current, target, Math.min(delta * 6, 1))
    if (group.current) {
      group.current.rotation.y += delta * 0.25
      group.current.rotation.x = 0.1 + explodeRef.current * 0.12
    }
  })

  return (
    <>
      <HoodieLights mouseRef={mouse} />
      <group ref={group} scale={0.92}>
        <HoodieModel explodeRef={explodeRef} />
      </group>
    </>
  )
}

export function ExplosionCanvas({ progress }: { progress: MotionValue<number> }) {
  return (
    <Canvas
      dpr={[1, 1.5]}
      camera={{ position: [0, 0, 4.4], fov: 35 }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      style={{ pointerEvents: "none" }}
    >
      <ExplosionScene progress={progress} />
    </Canvas>
  )
}
