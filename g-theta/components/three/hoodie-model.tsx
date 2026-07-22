"use client"

import * as THREE from "three"
import { useMemo, useRef, type MutableRefObject } from "react"
import { useFrame } from "@react-three/fiber"

/**
 * Procedural blank hoodie built from primitives — deliberately design-free
 * (no prints, no graphics). Parts are separable for the explosion timeline.
 */

type Vec3 = [number, number, number]

type PartProps = {
  position: Vec3
  rotation?: Vec3
  scale?: Vec3
  explodeDir: Vec3
  explodeSpin?: Vec3
  explodeRef?: MutableRefObject<number>
  children: React.ReactNode
}

function easeInOut(t: number) {
  return t * t * (3 - 2 * t)
}

function Part({ position, rotation = [0, 0, 0], scale, explodeDir, explodeSpin = [0, 0, 0], explodeRef, children }: PartProps) {
  const ref = useRef<THREE.Group>(null)

  useFrame(() => {
    if (!ref.current) return
    const e = easeInOut(THREE.MathUtils.clamp(explodeRef?.current ?? 0, 0, 1))
    ref.current.position.set(
      position[0] + explodeDir[0] * e,
      position[1] + explodeDir[1] * e,
      position[2] + explodeDir[2] * e
    )
    ref.current.rotation.set(
      rotation[0] + explodeSpin[0] * e,
      rotation[1] + explodeSpin[1] * e,
      rotation[2] + explodeSpin[2] * e
    )
  })

  return (
    <group ref={ref} position={position} rotation={rotation} scale={scale}>
      {children}
    </group>
  )
}

export function HoodieModel({
  colorHex = "#17171b",
  explodeRef,
}: {
  colorHex?: string
  explodeRef?: MutableRefObject<number>
}) {
  const fabricMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color(colorHex),
        roughness: 0.88,
        metalness: 0.02,
        side: THREE.DoubleSide,
      }),
    []
  )
  const trimMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color(colorHex).multiplyScalar(0.75),
        roughness: 0.92,
        metalness: 0.02,
        side: THREE.DoubleSide,
      }),
    []
  )
  const metalMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color("#c9ccd6"),
        roughness: 0.25,
        metalness: 1,
      }),
    []
  )
  const target = useMemo(() => new THREE.Color(colorHex), [colorHex])
  const targetTrim = useMemo(() => new THREE.Color(colorHex).multiplyScalar(0.72), [colorHex])

  useFrame((_, delta) => {
    const k = Math.min(delta * 5, 1)
    fabricMat.color.lerp(target, k)
    trimMat.color.lerp(targetTrim, k)
  })

  return (
    <group>
      {/* torso */}
      <Part position={[0, 0, 0]} explodeDir={[0, 0, 0]} explodeRef={explodeRef} scale={[1, 1, 0.62]}>
        <mesh material={fabricMat}>
          <capsuleGeometry args={[0.5, 0.55, 8, 28]} />
        </mesh>
      </Part>

      {/* hem band */}
      <Part position={[0, -0.68, 0]} explodeDir={[0, -0.75, 0]} explodeRef={explodeRef} scale={[1, 1, 0.62]}>
        <mesh material={trimMat}>
          <cylinderGeometry args={[0.5, 0.53, 0.18, 28]} />
        </mesh>
      </Part>

      {/* hood shell */}
      <Part
        position={[0, 0.56, -0.06]}
        rotation={[-0.4, 0, 0]}
        explodeDir={[0, 0.9, -0.6]}
        explodeSpin={[-0.5, 0, 0]}
        explodeRef={explodeRef}
        scale={[0.88, 0.82, 0.9]}
      >
        <mesh material={fabricMat}>
          <sphereGeometry args={[0.42, 28, 18, 0, Math.PI * 2, 0, 1.9]} />
        </mesh>
      </Part>

      {/* hood rim */}
      <Part
        position={[0, 0.5, 0.16]}
        rotation={[1.35, 0, 0]}
        explodeDir={[0, 0.65, 0.6]}
        explodeSpin={[0.6, 0, 0]}
        explodeRef={explodeRef}
      >
        <mesh material={trimMat}>
          <torusGeometry args={[0.27, 0.08, 12, 28, Math.PI]} />
        </mesh>
      </Part>

      {/* sleeves */}
      <Part
        position={[-0.62, 0.02, 0]}
        rotation={[0, 0, 0.5]}
        explodeDir={[-1.05, 0.18, 0]}
        explodeSpin={[0, 0, 0.5]}
        explodeRef={explodeRef}
      >
        <mesh material={fabricMat}>
          <capsuleGeometry args={[0.155, 0.6, 8, 20]} />
        </mesh>
      </Part>
      <Part
        position={[0.62, 0.02, 0]}
        rotation={[0, 0, -0.5]}
        explodeDir={[1.05, 0.18, 0]}
        explodeSpin={[0, 0, -0.5]}
        explodeRef={explodeRef}
      >
        <mesh material={fabricMat}>
          <capsuleGeometry args={[0.155, 0.6, 8, 20]} />
        </mesh>
      </Part>

      {/* cuffs */}
      <Part
        position={[-0.83, -0.35, 0]}
        rotation={[0, 0, 0.5]}
        explodeDir={[-1.3, -0.15, 0]}
        explodeRef={explodeRef}
      >
        <mesh material={trimMat}>
          <cylinderGeometry args={[0.135, 0.15, 0.14, 20]} />
        </mesh>
      </Part>
      <Part
        position={[0.83, -0.35, 0]}
        rotation={[0, 0, -0.5]}
        explodeDir={[1.3, -0.15, 0]}
        explodeRef={explodeRef}
      >
        <mesh material={trimMat}>
          <cylinderGeometry args={[0.135, 0.15, 0.14, 20]} />
        </mesh>
      </Part>

      {/* kangaroo pocket */}
      <Part
        position={[0, -0.36, 0.29]}
        rotation={[-0.1, 0, 0]}
        explodeDir={[0, -0.5, 0.95]}
        explodeSpin={[-0.4, 0, 0]}
        explodeRef={explodeRef}
      >
        <mesh material={trimMat}>
          <boxGeometry args={[0.52, 0.28, 0.08]} />
        </mesh>
      </Part>

      {/* zipper line */}
      <Part position={[0, 0.06, 0.325]} explodeDir={[0, 0.1, 1.15]} explodeRef={explodeRef}>
        <mesh material={metalMat}>
          <boxGeometry args={[0.02, 0.7, 0.025]} />
        </mesh>
        <mesh material={metalMat} position={[0, -0.38, 0]}>
          <boxGeometry args={[0.045, 0.07, 0.03]} />
        </mesh>
      </Part>

      {/* drawstrings */}
      <Part
        position={[-0.09, 0.28, 0.34]}
        rotation={[0.12, 0, 0.06]}
        explodeDir={[-0.35, 0.55, 0.85]}
        explodeRef={explodeRef}
      >
        <mesh material={trimMat}>
          <cylinderGeometry args={[0.013, 0.013, 0.3, 8]} />
        </mesh>
        <mesh material={metalMat} position={[0, -0.17, 0]}>
          <cylinderGeometry args={[0.017, 0.017, 0.06, 8]} />
        </mesh>
      </Part>
      <Part
        position={[0.09, 0.28, 0.34]}
        rotation={[0.12, 0, -0.06]}
        explodeDir={[0.35, 0.55, 0.85]}
        explodeRef={explodeRef}
      >
        <mesh material={trimMat}>
          <cylinderGeometry args={[0.013, 0.013, 0.3, 8]} />
        </mesh>
        <mesh material={metalMat} position={[0, -0.17, 0]}>
          <cylinderGeometry args={[0.017, 0.017, 0.06, 8]} />
        </mesh>
      </Part>
    </group>
  )
}

export function HoodieLights({ intensity = 1, mouseRef }: { intensity?: number; mouseRef?: MutableRefObject<{ x: number; y: number }> }) {
  const key = useRef<THREE.DirectionalLight>(null)

  useFrame((_, delta) => {
    if (!key.current) return
    const m = mouseRef?.current ?? { x: 0, y: 0 }
    const k = Math.min(delta * 4, 1)
    key.current.position.x = THREE.MathUtils.lerp(key.current.position.x, m.x * 3, k)
    key.current.position.y = THREE.MathUtils.lerp(key.current.position.y, 2 + m.y * 2, k)
  })

  return (
    <>
      <ambientLight intensity={0.4 * intensity} />
      <hemisphereLight args={["#e6e9f5", "#0a0a10", 0.5 * intensity]} />
      <directionalLight ref={key} position={[1.5, 2, 3]} intensity={2.6 * intensity} color="#ffffff" />
      <pointLight position={[-2.4, 0.4, 2]} intensity={9 * intensity} color="#4f7cff" distance={8} />
      <pointLight position={[2.4, -0.6, -2]} intensity={8 * intensity} color="#a855f7" distance={8} />
      <pointLight position={[0, 2.4, -2.6]} intensity={6 * intensity} color="#d7d9e0" distance={8} />
    </>
  )
}
