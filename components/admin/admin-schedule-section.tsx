"use client";

import { useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  CalendarDays,
  ChevronDown,
} from "lucide-react";
import { DatePickerModal } from "@/components/date-picker-modal";
import { ScheduleSlot } from "./schedule-slot";
import { AddBookingSheet } from "./add-booking-sheet";
import { ScheduleBookingDetailSheet } from "./schedule-booking-detail-sheet";

interface TimeSlot {
  id: string;
  startTime: string;
  endTime: string;
  status: "available" | "booked" | "pending" | "awaiting-payment";
  clientName?: string;
  clientPhone?: string;
  clientEmail?: string;
  price?: number;
  isRecurring?: boolean;
  recurringDetails?: {
    startDate: string;
    endDate: string;
    daysOfWeek: string[];
    totalSessions: number;
    remainingSessions: number;
    totalAmount: number;
  };
}

export function AdminScheduleSection() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedCourt, setSelectedCourt] = useState("Корт-1");
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showAddBooking, setShowAddBooking] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
  const [showCourtDropdown, setShowCourtDropdown] = useState(false);

  const courts = [
    {
      name: "Корт-1",
      type: "Закрытый",
      surface: "Хард",
      address: "Сибирский тракт, 34Б",
      sport: "Теннис",
    },
    {
      name: "Корт-2",
      type: "Закрытый",
      surface: "Хард",
      address: "Сибирский тракт, 34Б",
      sport: "Теннис",
    },
    {
      name: "Корт-3",
      type: "Закрытый",
      surface: "Хард",
      address: "Сибирский тракт, 34Б",
      sport: "Теннис",
    },
  ];

  const currentCourt =
    courts.find((c) => c.name === selectedCourt) || courts[0];

  const timeSlots: TimeSlot[] = [
    { id: "1", startTime: "08:00", endTime: "09:30", status: "available" },
    {
      id: "2",
      startTime: "09:30",
      endTime: "11:00",
      status: "booked",
      clientName: "Иван Иванов",
      clientPhone: "+7 (900) 123-45-67",
      clientEmail: "ivan@example.com",
      price: 1500,
    },
    { id: "3", startTime: "11:00", endTime: "12:00", status: "available" },
    {
      id: "4",
      startTime: "12:00",
      endTime: "13:00",
      status: "pending",
      clientName: "Мария Петрова",
      clientPhone: "+7 (900) 234-56-78",
      clientEmail: "maria@example.com",
      price: 1000,
    },
    { id: "5", startTime: "13:00", endTime: "15:30", status: "available" },
    {
      id: "6",
      startTime: "15:30",
      endTime: "18:00",
      status: "booked",
      clientName: "Алексей Сидоров",
      clientPhone: "+7 (900) 345-67-89",
      clientEmail: "alex@example.com",
      price: 2500,
      isRecurring: true,
      recurringDetails: {
        startDate: "15 янв 2025",
        endDate: "15 фев 2025",
        daysOfWeek: ["Понедельник", "Среда", "Пятница"],
        totalSessions: 12,
        remainingSessions: 10,
        totalAmount: 30000,
      },
    },
    { id: "7", startTime: "18:00", endTime: "23:00", status: "available" },
  ];

  // Group consecutive slots with the same status
  const groupedSlots: TimeSlot[] = [];
  for (let i = 0; i < timeSlots.length; i++) {
    const currentSlot = timeSlots[i];

    if (currentSlot.status === "available") {
      // Look ahead for consecutive available slots
      let endIndex = i;
      while (
        endIndex + 1 < timeSlots.length &&
        timeSlots[endIndex + 1].status === "available"
      ) {
        endIndex++;
      }

      groupedSlots.push({
        ...currentSlot,
        endTime: timeSlots[endIndex].endTime,
      });

      i = endIndex;
    } else {
      groupedSlots.push(currentSlot);
    }
  }

  const formatDateFull = (date: Date) => {
    return date.toLocaleDateString("ru-RU", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <div className="pb-4">
      <div className="sticky top-0 z-10 bg-white border-b border-gray-200">
        {/* Date Selector - Modern and Informative */}
        <div className="px-4 py-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                const newDate = new Date(selectedDate);
                newDate.setDate(newDate.getDate() - 1);
                setSelectedDate(newDate);
              }}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors flex-shrink-0"
            >
              <ChevronLeft className="w-5 h-5 text-gray-600" />
            </button>

            <button
              onClick={() => setShowDatePicker(true)}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors"
            >
              <CalendarDays className="w-5 h-5 text-emerald-600" />
              <span className="text-base font-semibold text-gray-900">
                {formatDateFull(selectedDate)}
              </span>
            </button>

            <button
              onClick={() => {
                const newDate = new Date(selectedDate);
                newDate.setDate(newDate.getDate() + 1);
                setSelectedDate(newDate);
              }}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors flex-shrink-0"
            >
              <ChevronRight className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>

        <div className="px-4 py-3 border-b border-gray-100">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-600">Корт:</label>
            <div className="relative">
              <button
                onClick={() => setShowCourtDropdown(!showCourtDropdown)}
                className="w-full px-4 py-2.5 rounded-lg border-2 bg-white border-gray-200 hover:border-emerald-400 transition-all flex items-center justify-between group"
              >
                <div className="flex flex-col items-start">
                  <span className="text-sm font-semibold text-gray-900">
                    {selectedCourt}
                  </span>
                </div>
                <ChevronDown
                  className={`w-5 h-5 text-gray-400 group-hover:text-emerald-600 transition-all ${
                    showCourtDropdown ? "rotate-180" : ""
                  }`}
                />
              </button>

              {showCourtDropdown && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border-2 border-gray-200 rounded-lg shadow-xl z-50 overflow-hidden">
                  {courts.map((court) => (
                    <button
                      key={court.name}
                      onClick={() => {
                        setSelectedCourt(court.name);
                        setShowCourtDropdown(false);
                      }}
                      className={`w-full px-4 py-2.5 text-left hover:bg-emerald-50 transition-colors border-b border-gray-100 last:border-b-0 ${
                        selectedCourt === court.name ? "bg-emerald-50" : ""
                      }`}
                    >
                      <span className="font-semibold text-sm text-gray-900">
                        {court.name}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="px-4 py-2.5 bg-gray-50">
          <p className="text-xs text-gray-600">
            {currentCourt.type} • {currentCourt.surface} • {currentCourt.sport}{" "}
            • {currentCourt.address}
          </p>
        </div>
      </div>

      <div className="px-4 space-y-2.5 mt-4">
        {groupedSlots.map((slot) => (
          <ScheduleSlot
            key={slot.id}
            slot={slot}
            onClick={() => {
              if (slot.status !== "available") {
                setSelectedSlot(slot);
              } else {
                setShowAddBooking(true);
              }
            }}
          />
        ))}
      </div>

      {/* Date Picker Modal */}
      <DatePickerModal
        open={showDatePicker}
        onClose={() => setShowDatePicker(false)}
        selectedDate={selectedDate}
        onSelectDate={(date) => {
          setSelectedDate(date);
          setShowDatePicker(false);
        }}
      />

      {/* Add Booking Sheet */}
      {showAddBooking && (
        <AddBookingSheet
          onClose={() => setShowAddBooking(false)}
          defaultCourt={selectedCourt}
          defaultDate={selectedDate}
          courtInfo={currentCourt}
        />
      )}

      {/* Booking Detail Sheet */}
      {selectedSlot && (
        <ScheduleBookingDetailSheet
          slot={selectedSlot}
          courtName={selectedCourt}
          courtInfo={currentCourt}
          onClose={() => setSelectedSlot(null)}
        />
      )}
    </div>
  );
}
