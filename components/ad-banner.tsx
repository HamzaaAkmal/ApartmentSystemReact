"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { X } from "lucide-react"
import type { AdBanner } from "@/lib/types"
import { getAllAdBanners } from "@/lib/data"

export function AdBannerCarousel() {
  const [banners, setBanners] = useState<AdBanner[]>([])
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0)
  const [dismissed, setDismissed] = useState(false)

  useEffect(() => {
    // Get active banners
    const activeBanners = getAllAdBanners().filter(
      (banner) =>
        banner.isActive &&
        new Date(banner.startDate) <= new Date() &&
        (!banner.endDate || new Date(banner.endDate) >= new Date()),
    )
    setBanners(activeBanners)

    // Auto-rotate banners every 5 seconds
    const interval = setInterval(() => {
      if (activeBanners.length > 1) {
        setCurrentBannerIndex((prevIndex) => (prevIndex + 1) % activeBanners.length)
      }
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  if (dismissed || banners.length === 0) {
    return null
  }

  const currentBanner = banners[currentBannerIndex]

  return (
    <div className="relative w-full bg-green-50 p-2">
      <div className="container mx-auto">
        <div className="relative rounded-lg border border-green-200 bg-white p-4 shadow-sm">
          <button
            onClick={() => setDismissed(true)}
            className="absolute right-2 top-2 rounded-full p-1 text-gray-500 hover:bg-gray-100"
            aria-label="Dismiss banner"
          >
            <X className="h-4 w-4" />
          </button>

          <div className="flex flex-col items-center gap-4 md:flex-row">
            <div className="relative h-32 w-full overflow-hidden rounded-md md:h-24 md:w-48">
              <Image
                src={currentBanner.imageUrl || "/placeholder.svg"}
                alt={currentBanner.title}
                fill
                className="object-cover"
              />
            </div>

            <div className="flex-1 text-center md:text-left">
              <h3 className="text-lg font-bold text-green-700">{currentBanner.title}</h3>
              <p className="text-sm text-gray-600">{currentBanner.description}</p>
            </div>

            {currentBanner.linkUrl && (
              <Link
                href={currentBanner.linkUrl}
                className="rounded-md bg-green-700 px-4 py-2 text-sm font-medium text-white hover:bg-green-800"
              >
                Learn More
              </Link>
            )}
          </div>

          {banners.length > 1 && (
            <div className="mt-3 flex justify-center gap-1">
              {banners.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentBannerIndex(index)}
                  className={`h-2 w-2 rounded-full ${index === currentBannerIndex ? "bg-green-700" : "bg-gray-300"}`}
                  aria-label={`Go to banner ${index + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
