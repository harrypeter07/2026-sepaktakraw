'use client'

import { useRef } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { getCdnUrl } from '@/lib/cdn-image'

interface GalleryItem {
  key: string
  alt: string
  src: string
  fallback: string
}

interface HomeGalleryCarouselProps {
  items: GalleryItem[]
}

export function HomeGalleryCarousel({ items }: HomeGalleryCarouselProps) {
  const galleryRef = useRef<HTMLDivElement>(null)

  const scrollGallery = (dir: 'left' | 'right') => {
    galleryRef.current?.scrollBy({
      left: dir === 'left' ? -380 : 380,
      behavior: 'smooth',
    })
  }

  return (
    <section className="bg-slate-900 py-10 sm:py-14 overflow-hidden border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6 flex items-center justify-between">
        <div>
          <span className="text-[#38bdf8] text-[10px] font-black uppercase tracking-[0.3em]">
            Visuals
          </span>
          <h2 className="mt-1 text-2xl sm:text-3xl font-black uppercase text-white tracking-tight">
            THE SPORT IN MOTION
          </h2>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => scrollGallery('left')}
            className="h-9 w-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition"
            aria-label="Previous gallery image"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            onClick={() => scrollGallery('right')}
            className="h-9 w-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition"
            aria-label="Next gallery image"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      <div
        ref={galleryRef}
        className="flex gap-3 overflow-x-auto no-scrollbar px-4 sm:px-6 lg:px-8 pb-1 scroll-smooth"
      >
        {items.map((item, i) => (
          <div
            key={i}
            className="flex-shrink-0 w-48 sm:w-60 overflow-hidden rounded-xl relative group cursor-pointer"
            style={{ height: '18rem' }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={getCdnUrl(item.src)}
              alt={item.alt}
              loading="lazy"
              onError={(e) => {
                ;(e.target as HTMLImageElement).src = item.fallback
              }}
              className="h-full w-full object-cover transition duration-500 group-hover:scale-110 group-hover:brightness-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition duration-300" />
          </div>
        ))}
      </div>
    </section>
  )
}

export default HomeGalleryCarousel
