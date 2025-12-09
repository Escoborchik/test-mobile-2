"use client";

import { Calendar, Clock, MapPin } from "lucide-react";

interface Booking {
  id: string;
  clientName: string;
  courtName: string;
  date: string;
  time: string;
  price: number;
  status: "pending" | "confirmed";
  isRecurring: boolean;
  tariff?: string;
  weekDays?: string;
}

interface AdminBookingCardProps {
  booking: Booking;
  onConfirm: (id: string) => void;
  onReject: (id: string) => void;
  onClick: () => void;
}

export function AdminBookingCard({
  booking,
  onConfirm,
  onReject,
  onClick,
}: AdminBookingCardProps) {
  const tariffName = booking.isRecurring ? "Абонемент" : "Разовое";
  const borderColor =
    booking.status === "pending"
      ? "border-l-yellow-400"
      : "border-l-emerald-500";

  return (
    <div
      onClick={onClick}
      className={`bg-card rounded-xl border-l-4 ${borderColor} border-r border-t border-b border-border p-3 cursor-pointer hover:shadow-md transition-all active:scale-[0.99]`}
    >
      {/* Header: Name and Price */}
      <div className="flex items-start justify-between mb-2">
        <h3 className="font-semibold text-base text-foreground">
          {booking.clientName}
        </h3>
        <div className="flex items-center gap-2">
          <span
            className={`text-xs font-semibold px-2 py-0.5 rounded ${
              booking.isRecurring
                ? "bg-blue-100 text-blue-700"
                : "bg-gray-100 text-gray-700"
            }`}
          >
            {tariffName}
          </span>
          <span className="font-bold text-lg text-foreground">
            {booking.price} ₽
          </span>
        </div>
      </div>

      {/* Info Grid with Icons */}
      <div className="space-y-1.5 mb-3">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <MapPin className="w-4 h-4 text-accent" />
          <span>{booking.courtName}</span>
        </div>

        {booking.isRecurring ? (
          <>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="w-4 h-4 text-accent" />
              <span>{booking.weekDays}</span>
              <Clock className="w-4 h-4 text-accent ml-2" />
              <span>{booking.time}</span>
            </div>
          </>
        ) : (
          <>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="w-4 h-4 text-accent" />
              <span>{booking.date}</span>
              <Clock className="w-4 h-4 text-accent ml-2" />
              <span>{booking.time}</span>
            </div>
          </>
        )}
      </div>

      {booking.status === "pending" ? (
        <div className="flex gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onConfirm(booking.id);
            }}
            className="flex-1 bg-emerald-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-emerald-700 transition-colors"
          >
            Подтвердить
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onReject(booking.id);
            }}
            className="flex-1 bg-red-100 text-red-700 py-2 rounded-lg text-sm font-medium hover:bg-red-200 transition-colors"
          >
            Отклонить
          </button>
        </div>
      ) : (
        <div className="flex justify-end">
          <span className="px-2.5 py-1 bg-emerald-100 text-emerald-700 text-xs font-semibold rounded-md">
            Подтверждено
          </span>
        </div>
      )}
    </div>
  );
}
