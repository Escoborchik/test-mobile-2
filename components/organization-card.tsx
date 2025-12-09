"use client";

import { useRouter } from "next/navigation";
import { MapPin, ChevronRight, Star } from "lucide-react";
import { getAmenityIcon } from "@/utils/getAmenityIcon";

interface OrganizationCardProps {
  organizationName: string;
  courtsCount: number;
  address: string;
  image: string;
  priceRange: string;
  amenities?: { type: string; label: string }[];
  rating?: number;
  surface?: string;
  sportTypes?: string[];
}

export function OrganizationCard({
  organizationName,
  courtsCount,
  address,
  image,
  priceRange,
  amenities = [],
  rating = 4.8,
  surface = "Хард, Грунт",
  sportTypes = ["Теннис"],
}: OrganizationCardProps) {
  const router = useRouter();

  const handleNavigate = () => {
    router.push(`/organization/${encodeURIComponent(organizationName)}`);
  };

  return (
    <button
      onClick={handleNavigate}
      className="w-full bg-white rounded-2xl border border-gray-200 hover:border-emerald-400 hover:shadow-md transition-all duration-200 overflow-hidden text-left group"
    >
      <div className="flex gap-3 p-3">
        <div className="flex-shrink-0 w-28 h-28 rounded-xl overflow-hidden bg-gray-100">
          <img
            src={image || "/placeholder.svg"}
            alt={organizationName}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
          {/* Top Section */}
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-bold text-gray-900 text-base truncate flex-1">
                {organizationName}
              </h3>
            </div>

            <div className="flex items-start gap-1">
              <MapPin className="w-3.5 h-3.5 text-gray-400 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-gray-500 line-clamp-1 leading-relaxed">
                {address}
              </p>
            </div>
          </div>

          {/* Amenities Section */}
          <div className="flex items-center gap-2 mt-2">
            {amenities.slice(0, 4).map((amenity) => (
              <div
                key={amenity.type}
                className="text-gray-400 group-hover:text-emerald-600 transition-colors"
                title={amenity.label}
              >
                {getAmenityIcon(amenity.type)}
              </div>
            ))}
          </div>

          {/* Price Section */}
          <div className="flex items-center justify-between gap-2 mt-2">
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-emerald-600 text-base whitespace-nowrap">
                {priceRange}
              </span>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-emerald-600 group-hover:translate-x-0.5 transition-all" />
          </div>
        </div>
      </div>
    </button>
  );
}
