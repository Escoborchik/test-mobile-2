"use client"

import { useState, useEffect, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Search, Calendar, Heart, User } from "lucide-react"
import { SearchSection } from "@/components/search-section"
import { OrganizationCard } from "@/components/organization-card"
import { BookingsSection } from "@/components/bookings-section"
import { FavoritesSection } from "@/components/favorites-section"
import { ProfileSection } from "@/components/profile-section"

import { courts } from "@/data/courts"

function HomePageContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const tabFromUrl = searchParams.get("tab") as "search" | "bookings" | "favorites" | "profile" | null

  const [activeTab, setActiveTab] = useState<"search" | "bookings" | "favorites" | "profile">(tabFromUrl || "search")

  useEffect(() => {
    setActiveTab(tabFromUrl || "search")
  }, [tabFromUrl])

  const handleTabChange = (tab: "search" | "bookings" | "favorites" | "profile") => {
    setActiveTab(tab)
    if (tab === "search") {
      router.push("/client")
    } else {
      router.push(`/client?tab=${tab}`)
    }
  }

  const [favorites, setFavorites] = useState<string[]>([])

  const toggleFavorite = (courtId: string) => {
    setFavorites((prev) => (prev.includes(courtId) ? prev.filter((id) => id !== courtId) : [...prev, courtId]))
  }

  const favoriteCourts = courts.filter((court) => favorites.includes(court.id))

  const handleSearch = (date: Date, timeOfDay: string) => {
    router.push(`/search-results?date=${date.toISOString()}&time=${timeOfDay}`)
  }

  // Group courts by organization
  const organizations = courts.reduce(
    (acc, court) => {
      if (!acc[court.organization]) {
        acc[court.organization] = {
          name: court.organization,
          courts: [],
          address: court.address,
          priceRange: court.priceRange,
          image: court.image,
          amenities: court.amenities,
          surfaces: new Set<string>(),
          sportTypes: new Set<string>(),
        }
      }
      acc[court.organization].courts.push(court)
      // Collect unique surfaces and sport types
      if (court.characteristics[0]) acc[court.organization].surfaces.add(court.characteristics[0])
      if (court.characteristics[2]) acc[court.organization].sportTypes.add(court.characteristics[2])
      return acc
    },
    {} as Record<
      string,
      {
        name: string
        courts: typeof courts
        address: string
        priceRange: string
        image: string
        amenities: { type: string; label: string }[]
        surfaces: Set<string>
        sportTypes: Set<string>
      }
    >,
  )

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header - Fixed */}
      <header className="fixed top-0 left-0 right-0 z-20 bg-secondary text-white px-4 h-14 flex items-center"></header>

      {/* Main Content */}
      <main className="pt-14 pb-20">
        {activeTab === "search" && (
          <div className="px-4 py-5 space-y-5">
            <SearchSection onSearch={handleSearch} />

            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-3">Спортивные комплексы</h2>
              <div className="space-y-3">
                {Object.values(organizations).map((org) => (
                  <OrganizationCard
                    key={org.name}
                    organizationName={org.name}
                    courtsCount={org.courts.length}
                    address={org.address}
                    image={org.image}
                    priceRange={org.priceRange}
                    amenities={org.amenities}
                    surface={Array.from(org.surfaces).join(", ")}
                    sportTypes={Array.from(org.sportTypes)}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === "bookings" && <BookingsSection />}

        {activeTab === "favorites" && <FavoritesSection courts={favoriteCourts} onToggleFavorite={toggleFavorite} />}

        {activeTab === "profile" && <ProfileSection />}
      </main>

      {/* Bottom Navigation - Fixed */}
      <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border h-16 flex items-center justify-around z-30">
        <button
          onClick={() => handleTabChange("search")}
          className={`flex flex-col items-center gap-1 ${
            activeTab === "search" ? "text-accent" : "text-muted-foreground"
          }`}
        >
          <Search className="w-6 h-6" />
          <span className="text-xs">Поиск</span>
        </button>
        <button
          onClick={() => handleTabChange("bookings")}
          className={`flex flex-col items-center gap-1 ${
            activeTab === "bookings" ? "text-accent" : "text-muted-foreground"
          }`}
        >
          <Calendar className="w-6 h-6" />
          <span className="text-xs">Бронирования</span>
        </button>
        <button
          onClick={() => handleTabChange("favorites")}
          className={`flex flex-col items-center gap-1 ${
            activeTab === "favorites" ? "text-accent" : "text-muted-foreground"
          }`}
        >
          <Heart className="w-6 h-6" />
          <span className="text-xs">Избранное</span>
        </button>
        <button
          onClick={() => handleTabChange("profile")}
          className={`flex flex-col items-center gap-1 ${
            activeTab === "profile" ? "text-accent" : "text-muted-foreground"
          }`}
        >
          <User className="w-6 h-6" />
          <span className="text-xs">Профиль</span>
        </button>
      </nav>
    </div>
  )
}

export default function HomePage() {
  return (
    <Suspense fallback={<div>Загрузка...</div>}>
      <HomePageContent />
    </Suspense>
  )
}
