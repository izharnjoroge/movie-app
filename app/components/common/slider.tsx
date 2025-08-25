import { animate, motion, useMotionValue } from 'framer-motion'
import React, { useEffect, useState } from 'react'
import useMeasure from 'react-use-measure'

type infiniteSliderProps = {
  children: React.ReactNode
  gap?: number
  duration?: number
  direction?: 'horizontal' | 'vertical'
  durationOnHover?: number
  reverse?: boolean
  className: string
}

const Slider = ({
  children,
  gap = 3,
  duration = 1000,
  direction = 'horizontal',
  durationOnHover,
  reverse = false,
  className,
}: infiniteSliderProps) => {
  const [currentDuration, setCurrentDuration] = useState(duration)
  const [ref, { width, height }] = useMeasure()
  const [isTransitioning, setIsTransitioning] = useState(false)

  const translation = useMotionValue(0)
  const [key, setKey] = useState(0)

  useEffect(() => {
    let controls
    const size = direction == 'horizontal' ? width : height
    const contentSize = size + gap
    const from = reverse ? -contentSize / 2 : 0
    const to = reverse ? 0 / 2 : -contentSize

    if (isTransitioning) {
      controls = animate(translation, [translation.get(), to], {
        ease: 'linear',
        duration:
          (currentDuration * Math.abs(translation.get() - to)) / contentSize,
        onComplete: () => {
          setIsTransitioning(false)
          setKey(prev => prev + 1)
        },
      })
    } else {
      controls = animate(translation, [from, to], {
        ease: 'linear',
        duration: currentDuration,
        repeat: Infinity,
        repeatType: 'loop',
        repeatDelay: 0,
        onRepeat: () => {
          translation.set(from)
        },
      })
    }

    return controls.stop
  }, [
    key,
    translation,
    currentDuration,
    width,
    height,
    gap,
    isTransitioning,
    direction,
    reverse,
  ])

  const hoverProps = durationOnHover
    ? {
        onHoverStart: () => {
          setIsTransitioning(true)
          setCurrentDuration(durationOnHover)
        },
        onHoverEnd: () => {
          setIsTransitioning(true)
          setCurrentDuration(duration)
        },
      }
    : {}

  return (
    <div className='mt-5 overflow-hidden'>
      <motion.div
        className='flex w-max items-center'
        style={{
          ...(direction === 'horizontal'
            ? { x: translation }
            : { y: translation }),
          gap: `${gap}px`,
        }}
        ref={ref}
        {...hoverProps}
      >
        {children}
        {children}
      </motion.div>
    </div>
  )
}

export default Slider
