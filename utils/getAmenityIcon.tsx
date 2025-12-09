import { Wifi, Droplets, Coffee, Car, Lock } from "lucide-react"

export const getAmenityIcon = (type: string) => {
  switch (type) {
    case "wifi":
      return <Wifi className="w-5 h-5" />
    case "shower":
      return <Droplets className="w-5 h-5" />
    case "cafe":
      return <Coffee className="w-5 h-5" />
    case "parking":
      return <Car className="w-5 h-5" />
    case "locker":
      return <Lock className="w-5 h-5" />
    default:
      return null
  }
}
