"use client"

import * as THREE from "three"
import { useRef } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { ContactShadows } from "@react-three/drei"
import { HoodieLights, HoodieModel } from "./hoodie-model"

type DragState = {
  dragging: boolean
  lastX: number
  lastY: number
  velY: number
  rotY: number
  rotX: number
}

function ViewerScene({
  drag,
  colorHex,
  zoomRef,
  lightRef,
}: {
  drag: React.MutableRefObject<DragState>
  colorHex: string
  zoomRef: React.MutableRefObject<number>
  lightRef: React.MutableRefObject<number>
}) {
  const group = useRef<THREE.Group>(null)
  const lights = useRef({ x: 0, y: 0 })

  useFrame((state, delta) => {
    const d = drag.current
    if (!d.dragging) {
      d.velY *= Math.pow(0.93, delta * 60)
      d.rotY += d.velY
      d.rotY += delta * 0.12 // idle drift
      d.rotX = THREE.MathUtils.lerp(d.rotX, 0.12, Math.min(delta * 2, 1))
    }
    if (group.current) {
      group.current.rotation.y = d.rotY
      group.current.rotation.x = d.rotX
      group.current.position.y = Math.sin(state.clock.elapsedTime * 0.7) * 0.04
    }
    const cam = state.camera as THREE.PerspectiveCamera
    cam.position.z = THREE.MathUtils.lerp(cam.position.z, zoomRef.current, Math.min(delta * 5, 1))
  })

  return (
    <>
      <ViewerLightRig lightRef={lightRef} mouse={lights} />
      <group ref={group}>
        <HoodieModel colorHex={colorHex} />
      </group>
      <ContactShadows position={[0, -1.15, 0]} opacity={0.5} scale={4} blur={2.6} far={2.2} resolution={256} color="#000000" />
    </>
  )
}

function ViewerLightRig({
  lightRef,
  mouse,
}: {
  lightRef: React.MutableRefObject<number>
  mouse: React.MutableRefObject<{ x: number; y: number }>
}) {
  const intensity = useRef(1)
  useFrame((_, delta) => {
    intensity.current = THREE.MathUtils.lerp(intensity.current, lightRef.current, Math.min(delta * 5, 1))
  })
  return <DynamicLights intensityRef={intensity} mouse={mouse} />
}

function DynamicLights({
  intensityRef,
  mouse,
}: {
  intensityRef: React.MutableRefObject<number>
  mouse: React.MutableRefObject<{ x: number; y: number }>
}) {
  const groupRef = useRef<THREE.Group>(null)
  useFrame(() => {
    if (!groupRef.current) return
    groupRef.current.traverse((obj) => {
      const light = obj as THREE.Light
      if (light.isLight && light.userData.base !== undefined) {
        light.intensity = light.userData.base * intensityRef.current
      }
    })
  })
  return (
    <group ref={groupRef}>
      <ambientLight intensity={0.4} userData={{ base: 0.4 }} />
      <hemisphereLight args={["#e6e9f5", "#0a0a10", 0.5]} userData={{ base: 0.5 }} />
      <directionalLight position={[1.5, 2, 3]} intensity={2.6} color="#ffffff" userData={{ base: 2.6 }} />
      <pointLight position={[-2.4, 0.4, 2]} intensity={9} color="#4f7cff" distance={8} userData={{ base: 9 }} />
      <pointLight position={[2.4, -0.6, -2]} intensity={8} color="#a855f7" distance={8} userData={{ base: 8 }} />
      <pointLight position={[0, 2.4, -2.6]} intensity={6} color="#d7d9e0" distance={8} userData={{ base: 6 }} />
    </group>
  )
}

export function ViewerCanvas({
  colorHex,
  zoom,
  light,
}: {
  colorHex: string
  zoom: number
  light: number
}) {
  const drag = useRef<DragState>({ dragging: false, lastX: 0, lastY: 0, velY: 0, rotY: 0.4, rotX: 0.12 })
  const zoomRef = useRef(zoom)
  const lightRef = useRef(light)
  zoomRef.current = zoom
  lightRef.current = light

  return (
    <div
      className="h-full w-full"
      style={{ touchAction: "none", cursor: "grab" }}
      data-cursor
      onPointerDown={(e) => {
        ;(e.target as HTMLElement).setPointerCapture(e.pointerId)
        drag.current.dragging = true
        drag.current.lastX = e.clientX
        drag.current.lastY = e.clientY
      }}
      onPointerMove={(e) => {
        const d = drag.current
        if (!d.dragging) return
        const dx = e.clientX - d.lastX
        const dy = e.clientY - d.lastY
        d.lastX = e.clientX
        d.lastY = e.clientY
        d.rotY += dx * 0.008
        d.velY = dx * 0.008
        d.rotX = THREE.MathUtils.clamp(d.rotX + dy * 0.004, -0.5, 0.6)
      }}
      onPointerUp={() => {
        drag.current.dragging = false
      }}
      onPointerLeave={() => {
        drag.current.dragging = false
      }}
    >
      <Canvas
        dpr={[1, 1.75]}
        camera={{ position: [0, 0, 3.4], fov: 35 }}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      >
        <ViewerScene drag={drag} colorHex={colorHex} zoomRef={zoomRef} lightRef={lightRef} />
      </Canvas>
    </div>
  )
}
