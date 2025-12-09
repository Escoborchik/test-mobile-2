"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { AdminBookingCard } from "./admin-booking-card";
import { AdminBookingDetailSheet } from "./admin-booking-detail-sheet";

import { type Booking, bookings as initialBookings } from "@/data/bookings";

export function AdminBookingsSection() {
  const [activeTab, setActiveTab] = useState<"pending" | "confirmed">(
    "pending"
  );
  const [selectedCourt, setSelectedCourt] = useState("all");
  const [showCourtFilter, setShowCourtFilter] = useState(false);
  const [selectedBookingType, setSelectedBookingType] = useState<
    "all" | "single" | "subscription"
  >("all");
  const [showBookingTypeFilter, setShowBookingTypeFilter] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [bookings, setBookings] = useState<Booking[]>(initialBookings);

  const courts = ["all", "Корт №1", "Корт №2", "Корт №3"];
  const bookingTypes = [
    { value: "all", label: "Все типы" },
    { value: "single", label: "Разовое" },
    { value: "subscription", label: "Абонемент" },
  ];

  const pendingBookings = bookings.filter((b) => b.status === "pending");
  const confirmedBookings = bookings.filter((b) => b.status === "confirmed");

  let displayedBookings =
    activeTab === "pending" ? pendingBookings : confirmedBookings;

  // Filter by booking type
  if (selectedBookingType !== "all") {
    displayedBookings = displayedBookings.filter((b) => {
      if (selectedBookingType === "single") {
        return !b.isRecurring;
      } else if (selectedBookingType === "subscription") {
        return b.isRecurring;
      }
      return true;
    });
  }

  // Filter by court
  if (selectedCourt !== "all") {
    displayedBookings = displayedBookings.filter(
      (b) => b.courtName === selectedCourt
    );
  }

  const handleConfirm = (id: string) => {
    setBookings((prevBookings) =>
      prevBookings.map((booking) =>
        booking.id === id
          ? { ...booking, status: "confirmed" as const }
          : booking
      )
    );
    if (selectedBooking?.id === id) {
      setSelectedBooking(null);
    }
  };

  const handleReject = (id: string) => {
    setBookings((prevBookings) =>
      prevBookings.filter((booking) => booking.id !== id)
    );
    if (selectedBooking?.id === id) {
      setSelectedBooking(null);
    }
  };

  return (
    <div className="pb-4">
      <div className="flex gap-2 px-4 py-3 bg-white border-b border-gray-200">
        <button
          onClick={() => setActiveTab("pending")}
          className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${
            activeTab === "pending"
              ? "bg-emerald-600 text-white"
              : "bg-gray-100 text-gray-600"
          }`}
        >
          Ожидающие ({pendingBookings.length})
        </button>
        <button
          onClick={() => setActiveTab("confirmed")}
          className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${
            activeTab === "confirmed"
              ? "bg-emerald-600 text-white"
              : "bg-gray-100 text-gray-600"
          }`}
        >
          Подтверждённые
        </button>
      </div>

      <div className="flex gap-2 px-4 py-3 bg-muted/30">
        <div className="relative">
          <button
            onClick={() => setShowCourtFilter(!showCourtFilter)}
            className="flex items-center gap-2 px-3 py-2 bg-card rounded-lg border border-border text-sm font-medium"
          >
            <span className="text-muted-foreground text-xs">Корт:</span>
            <span>
              {selectedCourt === "all"
                ? "Все"
                : selectedCourt.replace("Корт ", "№")}
            </span>
            <ChevronDown className="w-4 h-4 ml-1" />
          </button>

          {showCourtFilter && (
            <div className="absolute top-full left-0 mt-1 w-48 bg-card rounded-lg shadow-lg border border-border z-10">
              {courts.map((court) => (
                <button
                  key={court}
                  onClick={() => {
                    setSelectedCourt(court);
                    setShowCourtFilter(false);
                  }}
                  className={`block w-full text-left px-3 py-2 hover:bg-muted text-sm transition-colors ${
                    selectedCourt === court ? "bg-muted font-medium" : ""
                  }`}
                >
                  {court === "all" ? "Все" : court}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="relative">
          <button
            onClick={() => setShowBookingTypeFilter(!showBookingTypeFilter)}
            className="flex items-center gap-2 px-3 py-2 bg-card rounded-lg border border-border text-sm font-medium"
          >
            <span className="text-muted-foreground text-xs">Тип:</span>
            <span>
              {bookingTypes
                .find((t) => t.value === selectedBookingType)
                ?.label.replace(" типы", "")
                .replace("Все", "Все")}
            </span>
            <ChevronDown className="w-4 h-4 ml-1" />
          </button>

          {showBookingTypeFilter && (
            <div className="absolute top-full left-0 mt-1 w-48 bg-card rounded-lg shadow-lg border border-border z-10">
              {bookingTypes.map((type) => (
                <button
                  key={type.value}
                  onClick={() => {
                    setSelectedBookingType(
                      type.value as "all" | "single" | "subscription"
                    );
                    setShowBookingTypeFilter(false);
                  }}
                  className={`block w-full text-left px-3 py-2 hover:bg-muted text-sm transition-colors ${
                    selectedBookingType === type.value
                      ? "bg-muted font-medium"
                      : ""
                  }`}
                >
                  {type.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Bookings List */}
      <div className="px-4 py-3 space-y-2.5 bg-gray-50">
        {displayedBookings.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-sm">
              Нет {activeTab === "pending" ? "ожидающих" : "подтверждённых"}{" "}
              бронирований
            </p>
          </div>
        ) : (
          displayedBookings.map((booking) => (
            <AdminBookingCard
              key={booking.id}
              booking={booking}
              onConfirm={handleConfirm}
              onReject={handleReject}
              onClick={() => setSelectedBooking(booking)}
            />
          ))
        )}
      </div>

      {/* Booking Detail Sheet */}
      {selectedBooking && (
        <AdminBookingDetailSheet
          booking={selectedBooking}
          onClose={() => setSelectedBooking(null)}
          onConfirm={handleConfirm}
          onReject={handleReject}
        />
      )}
    </div>
  );
}
