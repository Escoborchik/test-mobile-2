"use client"

import { useRouter } from "next/navigation"
import { MapPin, ChevronRight, Wifi, Droplets, Coffee, Car, Lock } from "lucide-react"

interface AllCourtsCardProps {
  courtId: string
  courtName: string
  courtAddress: string
  courtImage: string
  priceRange: string
  amenities?: { type: string; label: string }[]
}

export function AllCourtsCard({
  courtId,
  courtName,
  courtAddress,
  courtImage,
  priceRange,
  amenities = [],
}: AllCourtsCardProps) {
  const router = useRouter()

  const getAmenityIcon = (type: string) => {
    switch (type) {
      case "wifi":
        return <Wifi className="w-4 h-4" />
      case "shower":
        return <Droplets className="w-4 h-4" />
      case "cafe":
        return <Coffee className="w-4 h-4" />
      case "parking":
        return <Car className="w-4 h-4" />
      case "locker":
        return <Lock className="w-4 h-4" />
      default:
        return null
    }
  }

  const handleNavigate = () => {
    router.push(`/court/${courtId}`)
  }

  return (
    <button
      onClick={handleNavigate}
      className="w-full bg-white rounded-2xl border border-gray-200 hover:border-emerald-300 hover:shadow-lg transition-all duration-200 overflow-hidden text-left"
    >
      <div className="flex gap-3 p-3">
        {/* Court Image - Small on Left */}
        <div className="flex-shrink-0 w-24 h-24 rounded-xl overflow-hidden bg-gray-100">
          <img src={courtImage || "/placeholder.svg"} alt={courtName} className="w-full h-full object-cover" />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0 flex flex-col justify-between py-1">
          {/* Top Section */}
          <div>
            <h3 className="font-bold text-gray-900 text-base mb-1 truncate">{courtName}</h3>
            <div className="flex items-start gap-1.5 mb-2">
              <MapPin className="w-3.5 h-3.5 text-gray-400 mt-0.5 flex-shrink-0" />
              <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed">{courtAddress}</p>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="flex items-center justify-between gap-2">
            {/* Amenities */}
            <div className="flex items-center gap-2">
              {amenities.slice(0, 3).map((amenity) => (
                <div key={amenity.type} className="text-gray-400" title={amenity.label}>
                  {getAmenityIcon(amenity.type)}
                </div>
              ))}
            </div>

            {/* Price and Arrow */}
            <div className="flex items-center gap-2">
              <span className="font-bold text-emerald-600 text-sm whitespace-nowrap">{priceRange}</span>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </div>
          </div>
        </div>
      </div>
    </button>
  )
}
