"use client"

import * as THREE from "three"
import { useEffect, useRef } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { ContactShadows } from "@react-three/drei"
import { HoodieLights, HoodieModel } from "./hoodie-model"

function HeroScene({ mouseRef }: { mouseRef: React.MutableRefObject<{ x: number; y: number }> }) {
  const group = useRef<THREE.Group>(null)

  useFrame((state, delta) => {
    if (!group.current) return
    const t = state.clock.elapsedTime
    const m = mouseRef.current
    group.current.rotation.y += delta * 0.35
    const k = Math.min(delta * 3, 1)
    group.current.rotation.x = THREE.MathUtils.lerp(group.current.rotation.x, m.y * 0.22, k)
    group.current.rotation.z = THREE.MathUtils.lerp(group.current.rotation.z, m.x * -0.08, k)
    group.current.position.y = Math.sin(t * 0.8) * 0.06
  })

  return (
    <>
      <HoodieLights mouseRef={mouseRef} />
      <group ref={group}>
        <HoodieModel />
      </group>
      <ContactShadows position={[0, -1.15, 0]} opacity={0.55} scale={4} blur={2.8} far={2.2} resolution={256} color="#000000" />
    </>
  )
}

export function HeroCanvas() {
  const mouseRef = useRef({ x: 0, y: 0 })

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mouseRef.current = {
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: -((e.clientY / window.innerHeight) * 2 - 1),
      }
    }
    window.addEventListener("mousemove", onMove, { passive: true })
    return () => window.removeEventListener("mousemove", onMove)
  }, [])

  return (
    <Canvas
      dpr={[1, 1.75]}
      camera={{ position: [0, 0, 3.4], fov: 35 }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      style={{ pointerEvents: "none" }}
    >
      <HeroScene mouseRef={mouseRef} />
    </Canvas>
  )
}
