"use client"

import { useRef, useMemo } from "react"
import { useFrame } from "@react-three/fiber"
import type { Mesh } from "three"
import { MeshStandardMaterial } from "three"

interface HumanModelProps {
  target: string
  affected: boolean
}

export function HumanModel({ target, affected }: HumanModelProps) {
  const meshRef = useRef<Mesh>(null)

  // Create materials with different colors for normal vs affected
  const normalMaterial = useMemo(() => new MeshStandardMaterial({ color: "#f0a5a5" }), [])
  const affectedMaterial = useMemo(() => new MeshStandardMaterial({ color: "#ff6b6b" }), [])
  const highlightMaterial = useMemo(
    () => new MeshStandardMaterial({ color: "#ff3333", emissive: "#ff0000", emissiveIntensity: 0.2 }),
    [],
  )

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.005
    }
  })

  // Determine which organ to highlight based on target
  const renderTargetedOrgan = () => {
    switch (target) {
      case "heart":
        return (
          <mesh position={[0, 0.2, 0.5]} scale={affected ? 1.1 : 1}>
            <sphereGeometry args={[0.6, 32, 32]} />
            <meshStandardMaterial
              color={affected ? "#ff3333" : "#e57373"}
              emissive={affected ? "#ff0000" : "#000000"}
              emissiveIntensity={affected ? 0.3 : 0}
            />
          </mesh>
        )
      case "lungs":
        return (
          <>
            {/* Left lung */}
            <mesh position={[-0.7, 0.2, 0.3]} scale={affected ? 1.1 : 1}>
              <capsuleGeometry args={[0.4, 1, 8, 16]} />
              <meshStandardMaterial
                color={affected ? "#ff3333" : "#90caf9"}
                emissive={affected ? "#ff0000" : "#000000"}
                emissiveIntensity={affected ? 0.3 : 0}
              />
            </mesh>
            {/* Right lung */}
            <mesh position={[0.7, 0.2, 0.3]} scale={affected && target === "lungs-right" ? 1.1 : 1}>
              <capsuleGeometry args={[0.4, 1, 8, 16]} />
              <meshStandardMaterial
                color={affected && target === "lungs-right" ? "#ff3333" : "#90caf9"}
                emissive={affected && target === "lungs-right" ? "#ff0000" : "#000000"}
                emissiveIntensity={affected && target === "lungs-right" ? 0.3 : 0}
              />
            </mesh>
          </>
        )
      case "spine":
        return (
          <mesh position={[0, 0, -0.3]} rotation={[0, 0, 0]}>
            <cylinderGeometry args={[0.2, 0.2, 3, 16]} />
            <meshStandardMaterial
              color={affected ? "#ff3333" : "#e0e0e0"}
              emissive={affected ? "#ff0000" : "#000000"}
              emissiveIntensity={affected ? 0.3 : 0}
            />
            {/* Herniated disc */}
            {affected && (
              <mesh position={[0.3, -0.5, 0]}>
                <sphereGeometry args={[0.15, 16, 16]} />
                <meshStandardMaterial color="#ff3333" emissive="#ff0000" emissiveIntensity={0.5} />
              </mesh>
            )}
          </mesh>
        )
      case "head":
        return (
          <mesh position={[0, 1.5, 0]} scale={affected ? 1.05 : 1}>
            <sphereGeometry args={[0.5, 32, 32]} />
            <meshStandardMaterial
              color={affected ? "#ff3333" : "#f0a5a5"}
              emissive={affected ? "#ff0000" : "#000000"}
              emissiveIntensity={affected ? 0.3 : 0}
            />
            {/* Brain visualization for headaches */}
            {affected && (
              <mesh position={[0, 0, 0]} scale={0.7}>
                <sphereGeometry args={[0.5, 16, 16]} />
                <meshStandardMaterial color="#ff9999" wireframe={true} />
              </mesh>
            )}
          </mesh>
        )
      default:
        return null
    }
  }

  return (
    <group>
      {/* Body */}
      <mesh ref={meshRef} position={[0, 0, 0]}>
        <capsuleGeometry args={[1, 2, 4, 16]} />
        <meshStandardMaterial color="#f0a5a5" />
      </mesh>

      {/* Head */}
      <mesh position={[0, 1.5, 0]}>
        <sphereGeometry args={[0.5, 32, 32]} />
        <meshStandardMaterial color="#f0a5a5" />
      </mesh>

      {/* Arms */}
      <mesh position={[-1.2, 0.2, 0]} rotation={[0, 0, -0.5]}>
        <capsuleGeometry args={[0.25, 1.5, 4, 16]} />
        <meshStandardMaterial color="#f0a5a5" />
      </mesh>

      <mesh position={[1.2, 0.2, 0]} rotation={[0, 0, 0.5]}>
        <capsuleGeometry args={[0.25, 1.5, 4, 16]} />
        <meshStandardMaterial color="#f0a5a5" />
      </mesh>

      {/* Legs */}
      <mesh position={[-0.5, -1.8, 0]} rotation={[0.2, 0, 0]}>
        <capsuleGeometry args={[0.25, 1.5, 4, 16]} />
        <meshStandardMaterial color="#f0a5a5" />
      </mesh>

      <mesh position={[0.5, -1.8, 0]} rotation={[0.2, 0, 0]}>
        <capsuleGeometry args={[0.25, 1.5, 4, 16]} />
        <meshStandardMaterial color="#f0a5a5" />
      </mesh>

      {/* Render the targeted organ based on the input */}
      {renderTargetedOrgan()}
    </group>
  )
}
