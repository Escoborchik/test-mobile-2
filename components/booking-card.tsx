"use client";

import {
  Calendar,
  Clock,
  MapPin,
  Repeat,
  Navigation,
  Share2,
} from "lucide-react";
import type { Booking, BookingStatus } from "./bookings-section";

interface BookingCardProps {
  booking: Booking;
  onClick: () => void;
}

interface StatusInfo {
  label: string;
  color: string;
  borderColor: string;
}

const getPaymentAndConfirmationStatus = (
  status: BookingStatus
): { payment: StatusInfo; confirmation: StatusInfo } => {
  const statusMap: Record<
    BookingStatus,
    { payment: StatusInfo; confirmation: StatusInfo }
  > = {
    pending_payment: {
      payment: {
        label: "Ожидает оплаты",
        color: "bg-amber-50 text-amber-700",
        borderColor: "border-l-amber-500",
      },
      confirmation: {
        label: "—",
        color: "bg-gray-50 text-gray-400",
        borderColor: "border-l-gray-300",
      },
    },
    awaiting_confirmation: {
      payment: {
        label: "Оплачено",
        color: "bg-emerald-50 text-emerald-700",
        borderColor: "border-l-emerald-500",
      },
      confirmation: {
        label: "Ожидает подтверждения",
        color: "bg-blue-50 text-blue-700",
        borderColor: "border-l-blue-500",
      },
    },
    confirmed: {
      payment: {
        label: "Оплачено",
        color: "bg-emerald-50 text-emerald-700",
        borderColor: "border-l-emerald-500",
      },
      confirmation: {
        label: "Подтверждено",
        color: "bg-emerald-50 text-emerald-700",
        borderColor: "border-l-emerald-500",
      },
    },
    cancelled_refund: {
      payment: {
        label: "Возврат оформлен",
        color: "bg-blue-50 text-blue-700",
        borderColor: "border-l-blue-500",
      },
      confirmation: {
        label: "Отменено",
        color: "bg-gray-50 text-gray-600",
        borderColor: "border-l-gray-400",
      },
    },
    cancelled_no_refund: {
      payment: {
        label: "Оплачено",
        color: "bg-emerald-50 text-emerald-700",
        borderColor: "border-l-emerald-500",
      },
      confirmation: {
        label: "Отменено",
        color: "bg-gray-50 text-gray-600",
        borderColor: "border-l-gray-400",
      },
    },
    rejected_refund: {
      payment: {
        label: "Возврат оформлен",
        color: "bg-blue-50 text-blue-700",
        borderColor: "border-l-blue-500",
      },
      confirmation: {
        label: "Отклонено",
        color: "bg-red-50 text-red-700",
        borderColor: "border-l-red-500",
      },
    },
    rejected_no_refund: {
      payment: {
        label: "Оплачено",
        color: "bg-emerald-50 text-emerald-700",
        borderColor: "border-l-emerald-500",
      },
      confirmation: {
        label: "Отклонено",
        color: "bg-red-50 text-red-700",
        borderColor: "border-l-red-500",
      },
    },
  };

  return statusMap[status];
};

export function BookingCard({ booking, onClick }: BookingCardProps) {
  const formattedDate = new Date(booking.date).toLocaleDateString("ru-RU", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const { payment, confirmation } = getPaymentAndConfirmationStatus(
    booking.status
  );

  return (
    <div
      onClick={onClick}
      className={`bg-white border-l-4 ${confirmation.borderColor} border-r border-t border-b border-gray-200 rounded-xl overflow-hidden cursor-pointer hover:shadow-lg transition-all duration-200`}
    >
      {/* Header Section */}
      <div className="px-4 pt-3 pb-2.5">
        <div className="flex items-start justify-between gap-3 mb-2">
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-lg text-gray-900 mb-0.5 truncate">
              {booking.courtName}
            </h3>
            <p className="text-sm text-gray-600 truncate mb-3">
              {booking.organization}
            </p>
          </div>
          <div className="flex flex-col gap-1 items-end">
            <div className="flex flex-col items-end">
              <span
                className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold ${payment.color}`}
              >
                {payment.label}
              </span>
            </div>
            <div className="flex flex-col items-end mt-1">
              <span
                className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold ${confirmation.color}`}
              >
                {confirmation.label}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4 mb-2">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-emerald-600" />
            <span className="font-semibold text-sm text-gray-900">
              {formattedDate}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-emerald-600" />
            <span className="font-semibold text-sm text-gray-900">
              {booking.time}
            </span>
          </div>
        </div>

        {/* Address */}
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0" />
          <span className="truncate">{booking.address}</span>
        </div>
      </div>

      {/* Footer Section */}
      <div className="px-4 py-2.5 bg-white border-t border-gray-100">
        <div className="flex items-center justify-end gap-3">
          <span className="font-bold text-lg text-gray-900">
            {booking.price} ₽
          </span>
        </div>
      </div>
    </div>
  );
}
