"use client"

import { useRouter } from "next/navigation"
import { Clock, MapPin, Wifi, Droplets, Coffee, Car, Lock } from "lucide-react"

interface TimeSlotCardProps {
  courtId: string
  courtName: string
  courtAddress: string
  courtImage: string
  timeSlot: string
  pricePerHour: number
  date: Date
  amenities?: { type: string; label: string }[]
}

export function TimeSlotCard({
  courtId,
  courtName,
  courtAddress,
  courtImage,
  timeSlot,
  pricePerHour,
  date,
  amenities = [],
}: TimeSlotCardProps) {
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

  const handleBooking = () => {
    router.push(`/booking/step1?court=${courtId}&slot=${timeSlot}&date=${date.toISOString()}`)
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-200 hover:border-emerald-300 hover:shadow-lg transition-all duration-200 overflow-hidden">
      <div className="flex gap-4 p-4">
        {/* Court Image */}
        <div className="flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden bg-gray-100">
          <img src={courtImage || "/placeholder.svg"} alt={courtName} className="w-full h-full object-cover" />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Court Name */}
          <h3 className="font-bold text-gray-900 text-base mb-1 truncate">{courtName}</h3>

          {/* Address */}
          <div className="flex items-start gap-1.5 mb-2">
            <MapPin className="w-3.5 h-3.5 text-gray-400 mt-0.5 flex-shrink-0" />
            <p className="text-xs text-gray-600 line-clamp-1">{courtAddress}</p>
          </div>

          {/* Time and Price */}
          <div className="flex items-center justify-between gap-3 mb-2">
            <div className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-emerald-600" />
              <span className="font-semibold text-sm text-gray-900">{timeSlot}</span>
            </div>
            <div className="font-bold text-emerald-600 text-base whitespace-nowrap">{pricePerHour} ₽/час</div>
          </div>

          {/* Amenities */}
          {amenities.length > 0 && (
            <div className="flex items-center gap-2 mb-3">
              {amenities.slice(0, 4).map((amenity) => (
                <div key={amenity.type} className="text-gray-400" title={amenity.label}>
                  {getAmenityIcon(amenity.type)}
                </div>
              ))}
            </div>
          )}

          {/* Book Button */}
          <button
            onClick={handleBooking}
            className="w-full h-9 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold transition-all duration-200 hover:shadow-md"
          >
            Забронировать
          </button>
        </div>
      </div>
    </div>
  )
}
