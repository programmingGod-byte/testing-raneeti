"use client"

import { useEffect, useState } from "react"
import Particles, { initParticlesEngine } from "@tsparticles/react"
import { type Container, type ISourceOptions } from "@tsparticles/engine"
import { loadStarsPreset } from "@tsparticles/preset-stars"

export function ParticlesBackground() {
  const [init, setInit] = useState(false)

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadStarsPreset(engine)
    }).then(() => {
      setInit(true)
    })
  }, [])

  const particlesLoaded = async (container?: Container): Promise<void> => {
    console.log("Particles loaded", container)
  }

  

  const options: ISourceOptions = {
  background: {
    color: {
      value: "#0d1117", // dark space background
    },
  },
  fpsLimit: 60,
  particles: {
    number: {
      value: 150,
      density: {
        enable: true,
        area: 1080,
      },
    },
    size: {
      value: { min: 1, max: 3 },
    },
    move: {
      enable: true,
      speed: 0.5,
      direction: "none",
      outModes: {
        default: "out",
      },
      random: false, // more uniform flow
      straight: false,
    },
    opacity: {
      value: 0.8,
      animation: {
        enable: true,
        speed: 0.4,
        minimumValue: 0.3,
        sync: false,
      },
    },
    color: {
      value: "#ffffff",
    },
    links: {
      enable: true,
      distance: 120,  // closer range for tighter mesh
      color: "#00bfff", // cyan/blue lines for a nice glow
      opacity: 0.5,
      width: 1,
      triangles: {
        enable: true, // fill interconnected triangles
        color: "#00bfff",
        opacity: 0.1,
      },
    },
  },
  detectRetina: true,
  interactivity: {
    events: {
      onHover: {
        enable: true,
        mode: "grab",
      },
    },
    modes: {
      grab: {
        distance: 180,
        links: {
          opacity: 0.8, // brighter on hover
        },
      },
    },
  },
}


  if (init) {
    return (
      <Particles
        id="tsparticles"
        particlesLoaded={particlesLoaded}
        options={options}
        className="absolute top-0 left-0 w-full h-full -z-10"
      />
    )
  }

  return null
}