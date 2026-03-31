import { Suspense, useEffect, useRef } from 'react'
import { Canvas } from '@react-three/fiber'
import { ContactShadows, Float, OrbitControls, useGLTF } from '@react-three/drei'
import { motion } from 'framer-motion'
import gsap from 'gsap'
import { ArrowRight, Mail, Sparkles } from 'lucide-react'
import { cn } from './lib/utils'

const skills = [
  'React',
  'Three.js',
  'React Three Fiber',
  'Drei',
  'Framer Motion',
  'GSAP',
  'Tailwind CSS',
  'UI / UX Design',
]

const projects = [
  {
    title: 'Alien Scout Experience',
    description:
      'Interactive hero scene with real-time lighting, smooth camera controls, and cinematic reveal animations.',
  },
  {
    title: 'Scroll Motion Lab',
    description:
      'Scroll-aware transitions and element choreography built with GSAP + Framer Motion for story-like flow.',
  },
  {
    title: 'Realtime Product Showcase',
    description:
      'A reusable 3D product stage for portfolios and landing pages with responsive desktop/mobile controls.',
  },
]

function AlienModel() {
  const { scene } = useGLTF('/models/Meshy_AI_A_Scout_from_an_alien_0331090602_texture.glb')
  return (
    <Float speed={1.4} rotationIntensity={0.6} floatIntensity={0.8}>
      <primitive object={scene} scale={2.1} position={[0, -1.65, 0]} />
    </Float>
  )
}

function Pill({ children, className }) {
  return (
    <span
      className={cn(
        'rounded-full border border-emerald-300/30 bg-emerald-200/10 px-4 py-1.5 text-sm font-medium text-emerald-100 backdrop-blur',
        className,
      )}
    >
      {children}
    </span>
  )
}

function App() {
  const heroRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.intro-chip', { y: 26, opacity: 0, duration: 0.7, ease: 'power2.out' })
      gsap.from('.intro-title', {
        y: 38,
        opacity: 0,
        duration: 0.9,
        delay: 0.15,
        ease: 'power3.out',
      })
      gsap.from('.intro-copy', {
        y: 24,
        opacity: 0,
        duration: 0.8,
        delay: 0.35,
        ease: 'power2.out',
      })
      gsap.from('.intro-actions', {
        y: 16,
        opacity: 0,
        duration: 0.6,
        delay: 0.45,
        ease: 'power2.out',
      })
    }, heroRef)

    return () => ctx.revert()
  }, [])

  return (
    <main className="mx-auto w-full max-w-7xl px-6 py-8 md:px-10 md:py-12">
      <section
        ref={heroRef}
        className="relative overflow-hidden rounded-3xl border border-white/15 bg-slate-950/40 p-6 shadow-2xl shadow-black/30 backdrop-blur-xl md:p-10"
      >
        <div className="pointer-events-none absolute -left-16 -top-16 h-56 w-56 rounded-full bg-emerald-300/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 right-0 h-60 w-60 rounded-full bg-amber-300/20 blur-3xl" />

        <div className="grid items-center gap-8 lg:grid-cols-2">
          <div>
            <Pill className="intro-chip inline-flex items-center gap-2">
              <Sparkles size={14} /> 3D PORTFOLIO
            </Pill>

            <h1 className="intro-title mt-4 text-4xl leading-tight text-white md:text-6xl">
              Alien Scout
              <span className="block text-emerald-300">Creative Developer</span>
            </h1>

            <p className="intro-copy mt-4 max-w-xl text-base text-slate-200/90 md:text-lg">
              A cinematic React + Three.js portfolio that blends realtime 3D visuals with smooth motion systems for
              a modern showcase experience.
            </p>

            <div className="intro-actions mt-6 flex flex-wrap gap-3">
              <a
                href="#projects"
                className="inline-flex items-center gap-2 rounded-full bg-emerald-300 px-5 py-2.5 font-semibold text-slate-900 transition hover:bg-emerald-200"
              >
                View Projects <ArrowRight size={16} />
              </a>
              <a
                href="#contact"
                className="inline-flex items-center gap-2 rounded-full border border-white/30 px-5 py-2.5 font-semibold text-white transition hover:bg-white/10"
              >
                Contact Me <Mail size={16} />
              </a>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.25, duration: 0.8, ease: 'easeOut' }}
            className="h-[360px] rounded-2xl border border-white/10 bg-slate-900/80 md:h-[480px]"
          >
            <Canvas camera={{ position: [0, 1.6, 4.8], fov: 42 }}>
              <ambientLight intensity={0.65} />
              <directionalLight position={[2, 5, 3]} intensity={1.3} />
              <directionalLight position={[-2, 2, -2]} intensity={0.45} color="#6dcdb0" />
              <Suspense fallback={null}>
                <AlienModel />
              </Suspense>
              <ContactShadows position={[0, -1.65, 0]} opacity={0.45} scale={8} blur={2.4} />
              <OrbitControls enablePan={false} minDistance={3.6} maxDistance={7} />
            </Canvas>
          </motion.div>
        </div>
      </section>

      <section className="mt-8 grid gap-6 md:grid-cols-2">
        <motion.article
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.65 }}
          className="rounded-2xl border border-white/12 bg-slate-950/45 p-6 backdrop-blur"
        >
          <h2 className="text-2xl text-white">Tech Stack</h2>
          <p className="mt-2 text-slate-200/85">Built using the tools you requested:</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {skills.map((skill) => (
              <Pill key={skill}>{skill}</Pill>
            ))}
          </div>
        </motion.article>

        <motion.article
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ delay: 0.1, duration: 0.65 }}
          className="rounded-2xl border border-white/12 bg-slate-950/45 p-6 backdrop-blur"
        >
          <h2 className="text-2xl text-white">About</h2>
          <p className="mt-2 text-slate-200/90">
            I build immersive, high-impact web experiences that combine interactive 3D storytelling, smooth animations,
            and production-ready frontend engineering.
          </p>
          <a
            className="mt-6 inline-flex items-center gap-2 rounded-full border border-amber-300/40 px-4 py-2 font-semibold text-amber-200 transition hover:bg-amber-200/10"
            href="#"
          >
            Portfolio Source
          </a>
        </motion.article>
      </section>

      <section id="projects" className="mt-10">
        <h2 className="text-3xl text-white">Featured Projects</h2>
        <div className="mt-5 grid gap-4 md:grid-cols-3">
          {projects.map((project, index) => (
            <motion.article
              key={project.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ delay: index * 0.1, duration: 0.55 }}
              className="rounded-2xl border border-white/12 bg-black/30 p-5"
            >
              <h3 className="text-xl text-emerald-200">{project.title}</h3>
              <p className="mt-2 text-sm text-slate-200/90">{project.description}</p>
            </motion.article>
          ))}
        </div>
      </section>

      <section id="contact" className="mt-10 mb-4 rounded-2xl border border-white/12 bg-slate-950/45 p-6 backdrop-blur">
        <h2 className="text-3xl text-white">Let&apos;s Build Something Bold</h2>
        <p className="mt-2 max-w-2xl text-slate-200/90">
          Looking for a standout interactive website or product presentation? Let&apos;s collaborate and bring your vision
          to life with React and modern 3D web tech.
        </p>
        <a
          href="mailto:hello@example.com"
          className="mt-5 inline-flex items-center gap-2 rounded-full bg-amber-300 px-5 py-2.5 font-semibold text-slate-900 transition hover:bg-amber-200"
        >
          <Mail size={16} /> hello@example.com
        </a>
      </section>
    </main>
  )
}

useGLTF.preload('/models/Meshy_AI_A_Scout_from_an_alien_0331090602_texture.glb')

export default App
