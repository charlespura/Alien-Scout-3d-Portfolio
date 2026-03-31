import { Suspense, useEffect, useMemo, useRef, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { AdaptiveDpr, ContactShadows, Float, useGLTF } from '@react-three/drei'
import { motion } from 'framer-motion'
import gsap from 'gsap'
import * as THREE from 'three'
import { ArrowRight, Mail, Sparkles } from 'lucide-react'
import { cn } from './lib/utils'

const navItems = [
  { id: 'hero', label: 'Intro' },
  { id: 'about', label: 'About' },
  { id: 'tech', label: 'Tech Stack' },
  { id: 'projects', label: 'Projects' },
  { id: 'contact', label: 'Contact' },
]

const skills = [
  'React',
  'Three.js',
  'React Three Fiber',
  'Drei',
  'Framer Motion',
  'GSAP',
  'Tailwind CSS',
  'shadcn-style UI',
]

const projects = [
  {
    title: 'Alien Scout Experience',
    description: 'Realtime hero scene with directional lights, shadow grounding, and cinematic entrance timing.',
  },
  {
    title: 'Scroll Combat Camera',
    description: 'Section-driven camera animation that reacts to page position like a game character inspection mode.',
  },
  {
    title: 'Interactive Showcase Engine',
    description: 'Portfolio architecture that can swap characters/models while keeping the same motion rig.',
  },
]

const modelPath = `${import.meta.env.BASE_URL}models/Meshy_AI_A_Scout_from_an_alien_0331090602_texture.glb`

const stagePresets = {
  hero: {
    camera: [0, 1.35, 4.8],
    target: [0, 0.15, 0],
    modelPosition: [0, -1.65, 0],
    modelRotationY: 0.18,
  },
  about: {
    camera: [1.65, 0.68, 2.75],
    target: [0, 0.25, 0],
    modelPosition: [0, -0.86, 0],
    modelRotationY: 0.02,
  },
  tech: {
    camera: [1.65, 0.68, 2.75],
    target: [0, 0.25, 0],
    modelPosition: [0, -1.65, 0],
    modelRotationY: -0.45,
  },
  projects: {
    camera: [0.2, -0.42, 2.35],
    target: [0, -1.2, 0],
    modelPosition: [0, -1.68, 0],
    modelRotationY: 0.55,
  },
  contact: {
    camera: [-1.2, 0.9, 3.25],
    target: [0, 0.15, 0],
    modelPosition: [0, -1.65, 0],
    modelRotationY: 0.92,
  },
}

function AlienModel({ activeSection }) {
  const { scene } = useGLTF(modelPath)
  const modelRef = useRef(null)

  const normalized = useMemo(() => {
    const cloned = scene.clone(true)
    const box = new THREE.Box3().setFromObject(cloned)
    const size = new THREE.Vector3()
    const center = new THREE.Vector3()
    box.getSize(size)
    box.getCenter(center)

    const maxDim = Math.max(size.x, size.y, size.z) || 1
    const autoScale = 3.6 / maxDim

    return {
      cloned,
      autoScale,
      offset: [-center.x, -box.min.y, -center.z],
    }
  }, [scene])

  const vectors = useMemo(() => {
    const entries = Object.entries(stagePresets).map(([key, value]) => [
      key,
      {
        position: new THREE.Vector3(...value.modelPosition),
        rotationY: value.modelRotationY,
      },
    ])

    return Object.fromEntries(entries)
  }, [])

  useFrame((state, delta) => {
    const preset = vectors[activeSection] || vectors.hero
    if (!modelRef.current || !preset) return

    const ease = 1 - Math.exp(-4 * delta)
    modelRef.current.position.lerp(preset.position, ease)
    modelRef.current.rotation.y = THREE.MathUtils.damp(modelRef.current.rotation.y, preset.rotationY, 5, delta)

    modelRef.current.position.y += Math.sin(state.clock.elapsedTime * 1.1) * 0.0018
  })

  return (
    <Float speed={1.1} rotationIntensity={0.15} floatIntensity={0.3}>
      <group ref={modelRef}>
        <group scale={normalized.autoScale}>
          <primitive object={normalized.cloned} position={normalized.offset} />
        </group>
      </group>
    </Float>
  )
}

function CinematicRig({ activeSection }) {
  const { camera } = useThree()
  const lookAtRef = useRef(new THREE.Vector3(0, 0.15, 0))

  const vectors = useMemo(() => {
    const entries = Object.entries(stagePresets).map(([key, value]) => [
      key,
      {
        camera: new THREE.Vector3(...value.camera),
        target: new THREE.Vector3(...value.target),
      },
    ])

    return Object.fromEntries(entries)
  }, [])

  useFrame((_, delta) => {
    const preset = vectors[activeSection] || vectors.hero
    if (!preset) return

    const ease = 1 - Math.exp(-3.8 * delta)
    camera.position.lerp(preset.camera, ease)
    lookAtRef.current.lerp(preset.target, ease)
    camera.lookAt(lookAtRef.current)
  })

  return null
}

function Stage({ activeSection }) {
  return (
    <Canvas
      camera={{ position: stagePresets.hero.camera, fov: 42 }}
      dpr={[1, 1.4]}
      gl={{ antialias: false, powerPreference: 'high-performance', alpha: true }}
      performance={{ min: 0.6 }}
    >
      <fog attach="fog" args={['#0b1420', 4, 9]} />

      <ambientLight intensity={0.7} />
      <spotLight position={[2.8, 5, 3]} angle={0.45} penumbra={0.8} intensity={2.4} color="#f4f8ff" />
      <directionalLight position={[-2.2, 1.8, -2.5]} intensity={0.8} color="#5ac5b1" />
      <directionalLight position={[0.5, -1.5, 1]} intensity={0.45} color="#e6a23d" />

      <Suspense fallback={null}>
        <AlienModel activeSection={activeSection} />
      </Suspense>

      <ContactShadows position={[0, -1.7, 0]} opacity={0.45} scale={7.2} blur={1.7} frames={1} />
      <AdaptiveDpr pixelated />
      <CinematicRig activeSection={activeSection} />
    </Canvas>
  )
}

function Pill({ children, className }) {
  return (
    <span
      className={cn(
        'rounded-full border border-emerald-300/30 bg-emerald-200/10 px-3.5 py-1.5 text-xs font-semibold tracking-wide text-emerald-100 md:text-sm',
        className,
      )}
    >
      {children}
    </span>
  )
}

function SectionCard({ id, title, subtitle, children, className = '' }) {
  const isRight = className.includes('section-right')

  return (
    <section
      id={id}
      className={cn(
        'scroll-mt-24 flex min-h-[78vh] items-center',
        isRight ? 'justify-end' : 'justify-start',
      )}
    >
      <motion.article
        initial={{ opacity: 0, y: 26 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.35 }}
        transition={{ duration: 0.55 }}
        className={cn(
          'pointer-events-auto w-full max-w-xl rounded-2xl border border-white/15 bg-slate-950/55 p-6 shadow-xl shadow-black/30 backdrop-blur-lg md:p-8',
          className,
        )}
      >
        <h2 className="text-3xl text-white md:text-4xl">{title}</h2>
        {subtitle ? <p className="mt-2 max-w-2xl text-slate-200/90">{subtitle}</p> : null}
        <div className="mt-5">{children}</div>
      </motion.article>
    </section>
  )
}

function App() {
  const [activeSection, setActiveSection] = useState('hero')
  const manualSectionRef = useRef(null)
  const manualTimerRef = useRef(null)

  useEffect(() => {
    const heroAnim = gsap.timeline()
    heroAnim
      .from('.hud-chip', { y: 20, opacity: 0, duration: 0.4, ease: 'power2.out' })
      .from('.hud-title', { y: 34, opacity: 0, duration: 0.65, ease: 'power3.out' }, '-=0.2')
      .from('.hud-copy', { y: 22, opacity: 0, duration: 0.5, ease: 'power2.out' }, '-=0.35')

    return () => heroAnim.kill()
  }, [])

  useEffect(() => {
    const sectionIds = navItems.map((item) => item.id)
    let ticking = false

    const updateActiveSection = () => {
      if (manualSectionRef.current) return

      const viewportAnchor = window.innerHeight * 0.35
      let closestId = 'hero'
      let closestDistance = Number.POSITIVE_INFINITY

      sectionIds.forEach((id) => {
        const element = document.getElementById(id)
        if (!element) return

        const rect = element.getBoundingClientRect()
        const elementAnchor = rect.top + rect.height * 0.25
        const distance = Math.abs(elementAnchor - viewportAnchor)

        if (distance < closestDistance) {
          closestDistance = distance
          closestId = id
        }
      })

      setActiveSection((prev) => (prev === closestId ? prev : closestId))
    }

    const onScrollOrResize = () => {
      if (ticking) return
      ticking = true
      requestAnimationFrame(() => {
        updateActiveSection()
        ticking = false
      })
    }

    updateActiveSection()
    window.addEventListener('scroll', onScrollOrResize, { passive: true })
    window.addEventListener('resize', onScrollOrResize)

    return () => {
      window.removeEventListener('scroll', onScrollOrResize)
      window.removeEventListener('resize', onScrollOrResize)
      if (manualTimerRef.current) clearTimeout(manualTimerRef.current)
    }
  }, [])

  const jumpTo = (id) => {
    const target = document.getElementById(id)
    if (!target) return

    manualSectionRef.current = id
    if (manualTimerRef.current) clearTimeout(manualTimerRef.current)
    manualTimerRef.current = setTimeout(() => {
      manualSectionRef.current = null
    }, 700)

    setActiveSection(id)
    const headerOffset = 96
    const top = window.scrollY + target.getBoundingClientRect().top - headerOffset
    window.scrollTo({ top, behavior: 'smooth' })
  }

  return (
    <main className="relative min-h-screen">
      <header className="fixed left-0 top-0 z-50 w-full border-b border-white/10 bg-slate-950/65 backdrop-blur-xl">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-3 md:px-8">
          <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.22em] text-emerald-200/95">
            <Sparkles size={14} /> Charles Pura Portfolio
          </div>
          <nav className="flex flex-wrap justify-end gap-2 md:gap-3">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => jumpTo(item.id)}
                className={cn(
                  'rounded-full border px-3 py-1.5 text-xs font-semibold uppercase tracking-wider transition md:px-4',
                  activeSection === item.id
                    ? 'border-amber-300/60 bg-amber-300/15 text-amber-200'
                    : 'border-white/20 bg-white/5 text-slate-100 hover:bg-white/10',
                )}
              >
                {item.label}
              </button>
            ))}
          </nav>
        </div>
      </header>

      <div className="pointer-events-none fixed inset-0 top-16 z-10">
        <Stage activeSection={activeSection} />
      </div>

      <div className="pointer-events-none relative z-20 mx-auto w-full max-w-7xl px-4 pb-16 pt-24 md:px-8">
        <SectionCard
          id="hero"
          title="Charles Pura"
          subtitle="Tekken-style cinematic stage: scroll or use the navbar to drive camera movement around the character."
        >
          <Pill className="hud-chip mb-3">Created by Charles Pura</Pill>
          <p className="hud-title text-2xl font-bold leading-tight text-white md:text-3xl">
            A game-like portfolio where each section triggers a different character focus.
          </p>
          <p className="hud-copy mt-3 max-w-xl text-slate-200/90">
            Intro = full body, About = face zoom, Tech Stack = tactical side zoom, Projects = feet/lower-body focus.
          </p>
          <button
            onClick={() => jumpTo('projects')}
            className="mt-5 inline-flex items-center gap-2 rounded-full bg-emerald-300 px-5 py-2.5 text-sm font-bold text-slate-900 transition hover:bg-emerald-200"
          >
            Start Mission <ArrowRight size={15} />
          </button>
        </SectionCard>

        <SectionCard
          id="about"
          title="About"
          subtitle="This section zooms into the face area for a dramatic character-intro vibe."
          className="section-right"
        >
          <p className="max-w-2xl text-slate-200/90">
            I am Charles Pura. I build immersive web interfaces with cinematic motion, strong art direction, and
            production-ready React architecture.
          </p>
        </SectionCard>

        <SectionCard
          id="tech"
          title="Tech Stack"
          subtitle="Camera shifts to a tighter angle while showing the tools used to build this project."
        >
          <div className="flex flex-wrap gap-2">
            {skills.map((skill) => (
              <Pill key={skill}>{skill}</Pill>
            ))}
          </div>
        </SectionCard>

        <SectionCard
          id="projects"
          title="Projects"
          subtitle="Camera drops lower to highlight the feet/lower-body like a character detail pass."
          className="section-right"
        >
          <div className="grid gap-3">
            {projects.map((project) => (
              <article key={project.title} className="rounded-xl border border-white/15 bg-black/25 p-4">
                <h3 className="text-lg font-bold text-emerald-200">{project.title}</h3>
                <p className="mt-1 text-sm text-slate-200/90">{project.description}</p>
              </article>
            ))}
          </div>
        </SectionCard>

        <SectionCard
          id="contact"
          title="Contact"
          subtitle="Final camera swing before call-to-action."
          className="mb-8"
        >
          <p className="max-w-xl text-slate-200/90">Let&apos;s build a bold interactive experience together.</p>
          <a
            href="mailto:hello@example.com"
            className="mt-4 inline-flex items-center gap-2 rounded-full bg-amber-300 px-5 py-2.5 text-sm font-bold text-slate-900 transition hover:bg-amber-200"
          >
            <Mail size={15} /> hello@example.com
          </a>
        </SectionCard>

        <p className="pointer-events-none mb-4 text-center text-xs uppercase tracking-[0.18em] text-slate-300/80">
          Active camera target: <span className="font-semibold text-emerald-200">{activeSection}</span>
        </p>
      </div>
    </main>
  )
}

useGLTF.preload(modelPath)

export default App
