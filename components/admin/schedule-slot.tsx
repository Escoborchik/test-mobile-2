"use client";

interface TimeSlot {
  id: string;
  startTime: string;
  endTime: string;
  status: "available" | "booked" | "pending" | "awaiting-payment";
  clientName?: string;
}

interface ScheduleSlotProps {
  slot: TimeSlot;
  onClick: () => void;
}

export function ScheduleSlot({ slot, onClick }: ScheduleSlotProps) {
  const statusConfig = {
    available: {
      badgeBg: "bg-[#E6F6EC]",
      badgeText: "text-[#1E8F4A]",
      badgeBorder: "border border-[#BFEAD3]",
      label: "Свободно",
      leftBorder: "border-l-[4px] border-l-[#D1D5DB]",
    },
    booked: {
      badgeBg: "bg-[#FDE7E9]",
      badgeText: "text-[#C62828]",
      badgeBorder: "border border-[#F6C8CC]",
      label: "Занято",
      leftBorder: "border-l-[4px] border-l-[#DC2626]",
    },
    pending: {
      badgeBg: "bg-[#FFF4DB]",
      badgeText: "text-[#B76A00]",
      badgeBorder: "border border-[#FFE2A8]",
      label: "Ожидание",
      leftBorder: "border-l-[4px] border-l-[#FACC15]",
    },
    "awaiting-payment": {
      badgeBg: "bg-[#FFF4DB]",
      badgeText: "text-[#B76A00]",
      badgeBorder: "border border-[#FFE2A8]",
      label: "Ожидает оплаты",
      leftBorder: "border-l-[4px] border-l-[#FACC15]",
    },
  };

  const config = statusConfig[slot.status];
  const isOccupied = slot.status !== "available";

  return (
    <button
      onClick={onClick}
      className={`w-full rounded-xl bg-white ${config.leftBorder} border-r border-t border-b border-gray-200 text-left cursor-pointer hover:shadow-md hover:border-gray-300 transition-all active:scale-[0.98] p-4`}
    >
      <div className="flex items-start justify-between gap-3">
        {/* Left: Time and Client Info */}
        <div className="flex-1">
          <div className="font-semibold text-base text-gray-900 mb-0.5">
            {slot.startTime}–{slot.endTime}
          </div>
          {isOccupied && slot.clientName && (
            <div className="text-sm text-gray-600 mt-1">{slot.clientName}</div>
          )}
        </div>

        {/* Right: Compact Status Badge */}
        <span
          className={`text-xs font-semibold px-2.5 py-1 rounded-md ${config.badgeBg} ${config.badgeText} ${config.badgeBorder} flex-shrink-0`}
        >
          {config.label}
        </span>
      </div>
    </button>
  );
}
