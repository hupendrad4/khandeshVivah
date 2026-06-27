"use client"

import { ReactNode, useCallback, useEffect, useState } from "react"
import useEmblaCarousel from "embla-carousel-react"
import { cn } from "@/lib/utils"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface ReusableCarouselProps {
  children: ReactNode[]
  className?: string
  autoPlay?: boolean
  autoPlayInterval?: number
  showDots?: boolean
  showArrows?: boolean
  slidesToShow?: number
}

export function ReusableCarousel({
  children,
  className,
  autoPlay = true,
  autoPlayInterval = 4000,
  showDots = true,
  showArrows = true,
  slidesToShow = 1,
}: ReusableCarouselProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: "start",
    skipSnaps: false,
    slidesToScroll: 1,
    breakpoints: {
      "(min-width: 768px)": { slidesToScroll: slidesToShow > 1 ? 2 : 1 },
      "(min-width: 1024px)": { slidesToScroll: slidesToShow },
    },
  })
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([])
  const [isPaused, setIsPaused] = useState(false)

  const onSelect = useCallback(() => {
    if (!emblaApi) return
    setSelectedIndex(emblaApi.selectedScrollSnap())
    setScrollSnaps(emblaApi.scrollSnapList())
  }, [emblaApi])

  useEffect(() => {
    if (!emblaApi) return
    onSelect()
    emblaApi.on("select", onSelect)
    emblaApi.on("reInit", onSelect)
  }, [emblaApi, onSelect])

  // Auto-play (pauses on hover)
  useEffect(() => {
    if (!emblaApi || !autoPlay || isPaused) return
    const interval = setInterval(() => {
      emblaApi.scrollNext()
    }, autoPlayInterval)
    return () => clearInterval(interval)
  }, [emblaApi, autoPlay, autoPlayInterval, isPaused])

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi])
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi])
  const scrollTo = useCallback((index: number) => emblaApi?.scrollTo(index), [emblaApi])

  return (
    <div className={cn("relative", className)}>
      <div
        className="overflow-hidden"
        ref={emblaRef}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        <div className="flex" style={{ marginLeft: `-${16}px` }}>
          {children.map((child, i) => (
            <div
              key={i}
              className="min-w-0 shrink-0 grow-0 pl-4"
              style={{ flex: `0 0 ${100 / (slidesToShow || 1)}%` }}
            >
              {child}
            </div>
          ))}
        </div>
      </div>

      {/* Arrows */}
      {showArrows && scrollSnaps.length > 1 && (
        <>
          <button
            onClick={scrollPrev}
            className="absolute -left-3 top-1/2 z-10 hidden -translate-y-1/2 rounded-full bg-white/90 p-2 shadow-lg backdrop-blur-sm transition-all hover:bg-white hover:shadow-xl md:flex"
            aria-label="Previous"
          >
            <ChevronLeft className="h-5 w-5 text-[#554336]" />
          </button>
          <button
            onClick={scrollNext}
            className="absolute -right-3 top-1/2 z-10 hidden -translate-y-1/2 rounded-full bg-white/90 p-2 shadow-lg backdrop-blur-sm transition-all hover:bg-white hover:shadow-xl md:flex"
            aria-label="Next"
          >
            <ChevronRight className="h-5 w-5 text-[#554336]" />
          </button>
        </>
      )}

      {/* Dots */}
      {showDots && scrollSnaps.length > 1 && (
        <div className="mt-6 flex justify-center gap-2">
          {scrollSnaps.map((_, i) => (
            <button
              key={i}
              onClick={() => scrollTo(i)}
              className={cn(
                "h-2 rounded-full transition-all duration-300",
                i === selectedIndex
                  ? "w-8 bg-gradient-to-r from-[#FF21A5] to-[#FF2E96]"
                  : "w-2 bg-[#E4E2E1] hover:bg-[#887364]",
              )}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  )
}
