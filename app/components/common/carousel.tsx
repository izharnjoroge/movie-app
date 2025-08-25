import { useState, ReactNode } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '../ui/button'

type ManualCarouselProps<T> = {
  items: T[]
  maxItems?: number
  renderItem: (item: T, index: number) => ReactNode
}

export function ManualCarousel<T>({
  items,
  maxItems = 4,
  renderItem,
}: ManualCarouselProps<T>) {
  const [index, setIndex] = useState(0)

  if (!items || items.length === 0) return null

  const visibleItems = items.slice(0, maxItems)
  const active = visibleItems[index]

  const nextSlide = () => setIndex(prev => (prev + 1) % visibleItems.length)
  const prevSlide = () =>
    setIndex(prev => (prev - 1 + visibleItems.length) % visibleItems.length)

  return (
    <div className='relative h-[60vh] w-full overflow-hidden'>
      {/* Render the active item */}
      {renderItem(active, index)}

      {/* Navigation Buttons */}
      <div className='absolute inset-y-0 left-0 flex items-center'>
        <Button
          variant='ghost'
          size='icon'
          onClick={prevSlide}
          className='rounded-full bg-black/50 text-white hover:bg-black/70'
        >
          <ChevronLeft className='h-6 w-6' />
        </Button>
      </div>
      <div className='absolute inset-y-0 right-0 flex items-center'>
        <Button
          variant='ghost'
          size='icon'
          onClick={nextSlide}
          className='rounded-full bg-black/50 text-white hover:bg-black/70'
        >
          <ChevronRight className='h-6 w-6' />
        </Button>
      </div>

      {/* Dots indicator */}
      <div className='absolute bottom-4 left-1/2 flex -translate-x-1/2 space-x-2'>
        {visibleItems.map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            className={`h-2 w-2 rounded-full transition ${
              i === index ? 'bg-white' : 'bg-gray-500'
            }`}
          />
        ))}
      </div>
    </div>
  )
}
