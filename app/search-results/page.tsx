"use client";

import { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { SearchSection } from "@/components/search-section";
import { TimeSlotCard } from "@/components/time-slot-card";
import { FilterModal } from "@/components/filter-modal";
import { courts } from "@/data/courts";

function SearchResultsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const dateParam = searchParams.get("date");
  const timeParam = searchParams.get("time");

  const [searchDate, setSearchDate] = useState<Date>(
    dateParam ? new Date(dateParam) : new Date()
  );
  const [searchTimeOfDay, setSearchTimeOfDay] = useState<string>(
    timeParam || "all"
  );
  const [showFilters, setShowFilters] = useState(false);

  // Filter states
  const [courtType, setCourtType] = useState<string[]>([]);
  const [surface, setSurface] = useState<string[]>([]);
  const [sport, setSport] = useState<string[]>([]);
  const [organizations, setOrganizations] = useState<string[]>([]);

  const handleSearch = (date: Date, timeOfDay: string) => {
    setSearchDate(date);
    setSearchTimeOfDay(timeOfDay);
  };

  const getFilteredSlots = () => {
    const timeRanges: { [key: string]: { start: number; end: number } } = {
      morning: { start: 6, end: 12 },
      day: { start: 12, end: 18 },
      evening: { start: 18, end: 24 },
      night: { start: 0, end: 6 },
      all: { start: 0, end: 24 },
    };

    const range = timeRanges[searchTimeOfDay] || timeRanges.all;

    const results: Array<{
      courtId: string;
      courtName: string;
      courtAddress: string;
      courtImage: string;
      courtOrganization: string;
      timeSlot: string;
      pricePerHour: number;
      amenities: { type: string; label: string }[];
      characteristics: string[];
    }> = [];

    courts.forEach((court) => {
      // Apply filters
      if (
        organizations.length > 0 &&
        !organizations.includes(court.organization)
      ) {
        return;
      }

      if (
        courtType.length > 0 &&
        !courtType.includes(court.characteristics[1])
      ) {
        return;
      }

      if (surface.length > 0 && !surface.includes(court.characteristics[0])) {
        return;
      }

      if (sport.length > 0 && !sport.includes(court.characteristics[2])) {
        return;
      }

      if (court.slots) {
        court.slots
          .filter((slot) => {
            if (!slot.available) return false;
            const startHour = Number.parseInt(
              slot.time.split("–")[0].split(":")[0]
            );

            if (range.start > range.end) {
              return startHour >= range.start || startHour < range.end;
            }
            return startHour >= range.start && startHour < range.end;
          })
          .forEach((slot) => {
            results.push({
              courtId: court.id,
              courtName: court.name,
              courtAddress: court.address,
              courtImage: court.image,
              courtOrganization: court.organization,
              timeSlot: slot.time,
              pricePerHour: slot.price,
              amenities: court.amenities,
              characteristics: court.characteristics,
            });
          });
      }
    });

    return results;
  };

  const filteredSlots = getFilteredSlots();

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Fixed Header */}
      <header className="fixed top-0 left-0 right-0 z-30 bg-white border-b border-gray-200 px-4 h-14 flex items-center gap-3 shadow-sm">
        <button
          onClick={() => router.back()}
          className="flex items-center justify-center w-9 h-9 rounded-full hover:bg-gray-100 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-gray-700" />
        </button>
        <h1 className="text-lg font-bold text-gray-900">Результаты поиска</h1>
      </header>

      {/* Main Content */}
      <main className="pt-14">
        <div className="sticky top-14 z-20 bg-gray-50 px-4 pt-3 pb-2">
          <SearchSection
            onSearch={handleSearch}
            showFiltersButton={true}
            onFiltersClick={() => setShowFilters(true)}
            isCompact={true}
            compact={{ date: searchDate, timeOfDay: searchTimeOfDay }}
          />
        </div>

        {/* Results */}
        <div className="px-4 py-3">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base font-bold text-gray-900">
              Найдено:{" "}
              <span className="text-emerald-600">{filteredSlots.length}</span>{" "}
              слотов
            </h2>
          </div>

          {filteredSlots.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-200 p-8 text-center">
              <p className="text-gray-500">
                Нет доступных слотов для выбранных параметров
              </p>
              <p className="text-sm text-gray-400 mt-2">
                Попробуйте изменить дату или время
              </p>
            </div>
          ) : (
            <div className="space-y-2.5">
              {filteredSlots.map((slot, index) => (
                <TimeSlotCard
                  key={`${slot.courtId}-${slot.timeSlot}-${index}`}
                  courtId={slot.courtId}
                  courtName={slot.courtName}
                  courtAddress={slot.courtAddress}
                  courtImage={slot.courtImage}
                  timeSlot={slot.timeSlot}
                  pricePerHour={slot.pricePerHour}
                  date={searchDate}
                  amenities={slot.amenities}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      <FilterModal
        open={showFilters}
        onClose={() => setShowFilters(false)}
        courtType={courtType}
        surface={surface}
        sport={sport}
        organizations={organizations}
        nearestAvailable={false}
        onCourtTypeChange={setCourtType}
        onSurfaceChange={setSurface}
        onSportChange={setSport}
        onOrganizationsChange={setOrganizations}
      />
    </div>
  );
}

export default function SearchResultsPage() {
  return (
    <Suspense fallback={<div>Загрузка...</div>}>
      <SearchResultsContent />
    </Suspense>
  );
}
