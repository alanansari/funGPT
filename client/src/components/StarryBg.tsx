import { useEffect, useRef } from 'react'

interface Star {
    x: number
    y: number
    r: number
    alpha: number
    speed: number
}

const StarryBg = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null)

    useEffect(() => {
        const canvas = canvasRef.current!
        const ctx = canvas.getContext('2d')!
        let animId: number
        const stars: Star[] = []

        const initStars = () => {
            stars.length = 0
            for (let i = 0; i < 220; i++) {
                stars.push({
                    x: Math.random() * canvas.width,
                    y: Math.random() * canvas.height,
                    r: Math.random() * 1.4 + 0.2,
                    alpha: Math.random(),
                    speed: (Math.random() * 0.018 + 0.004) * (Math.random() < 0.5 ? 1 : -1),
                })
            }
        }

        const resize = () => {
            canvas.width = window.innerWidth
            canvas.height = window.innerHeight
            initStars()
        }

        const draw = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height)
            for (const s of stars) {
                s.alpha += s.speed
                if (s.alpha >= 1) { s.alpha = 1; s.speed *= -1 }
                if (s.alpha <= 0) { s.alpha = 0; s.speed *= -1 }
                ctx.beginPath()
                ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2)
                ctx.fillStyle = `rgba(255,255,255,${s.alpha})`
                ctx.fill()
            }
            animId = requestAnimationFrame(draw)
        }

        resize()
        draw()
        window.addEventListener('resize', resize)

        return () => {
            cancelAnimationFrame(animId)
            window.removeEventListener('resize', resize)
        }
    }, [])

    return <canvas ref={canvasRef} style={{ position: 'fixed', inset: 0, zIndex: 0 }} />
}

export default StarryBg
