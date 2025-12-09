"use client";

import { useState } from "react";
import { Calendar, ChevronDown, Search, SlidersHorizontal } from "lucide-react";
import { DatePickerModal } from "@/components/date-picker-modal";

interface SearchSectionProps {
  onSearch: (date: Date, timeOfDay: string) => void;
  showFiltersButton?: boolean;
  onFiltersClick?: () => void;
  isCompact?: boolean;
  compact?: { date: Date; timeOfDay: string };
  onEditSearch?: () => void;
}

export function SearchSection({
  onSearch,
  showFiltersButton = false,
  onFiltersClick,
  isCompact = false,
  compact,
  onEditSearch,
}: SearchSectionProps) {
  const [selectedDate, setSelectedDate] = useState(compact?.date || new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedTimeOfDay, setSelectedTimeOfDay] = useState(
    compact?.timeOfDay || "all"
  );
  const [showTimeDropdown, setShowTimeDropdown] = useState(false);
  const [showExpanded, setShowExpanded] = useState(!isCompact);

  const formatDate = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const compareDate = new Date(date);
    compareDate.setHours(0, 0, 0, 0);

    if (compareDate.getTime() === today.getTime()) {
      return "Сегодня";
    }

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    if (compareDate.getTime() === tomorrow.getTime()) {
      return "Завтра";
    }

    return date.toLocaleDateString("ru-RU", { day: "numeric", month: "long" });
  };

  const handleSearch = () => {
    onSearch(selectedDate, selectedTimeOfDay);
  };

  const setQuickDate = (offset: number) => {
    const date = new Date();
    date.setDate(date.getDate() + offset);
    setSelectedDate(date);
  };

  const timeOptions = [
    { value: "all", label: "Весь день", time: "00:00–23:59" },
    { value: "morning", label: "Утро", time: "06:00–12:00" },
    { value: "day", label: "День", time: "12:00–18:00" },
    { value: "evening", label: "Вечер", time: "18:00–23:59" },
    { value: "night", label: "Ночь", time: "00:00–06:00" },
  ];

  const selectedOption =
    timeOptions.find((opt) => opt.value === selectedTimeOfDay) ||
    timeOptions[0];

  if (isCompact && !showExpanded) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-3">
        <div className="flex items-center justify-between gap-3">
          <button
            onClick={() => setShowExpanded(true)}
            className="flex items-center gap-2 text-sm hover:bg-gray-50 -m-1 p-1 rounded-lg transition-colors flex-1"
          >
            <Calendar className="w-4 h-4 text-emerald-600" />
            <span className="font-semibold text-gray-900">
              {formatDate(selectedDate)}
            </span>
            <span className="text-gray-400">•</span>
            <span className="font-medium text-gray-700">
              {selectedOption.time}
            </span>
          </button>
          {showFiltersButton && (
            <button
              onClick={onFiltersClick}
              className="w-9 h-9 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 transition-all flex items-center justify-center"
            >
              <SlidersHorizontal className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-4 space-y-1">
        <div>
          <h2 className="text-lg font-bold text-gray-900">
            Поиск свободного времени
          </h2>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setShowDatePicker(true)}
            className="flex-1 py-2 px-3 rounded-lg border-2 bg-white border-gray-200 hover:border-emerald-400 transition-all flex flex-col items-start"
          >
            <span className="text-xs font-medium text-gray-500 mb-0.5">
              Дата
            </span>
            <div className="flex items-center gap-1.5 text-gray-900">
              <Calendar className="w-4 h-4" />
              <span className="text-sm font-semibold truncate">
                {formatDate(selectedDate)}
              </span>
            </div>
          </button>

          <div className="flex-1 relative">
            <button
              onClick={() => setShowTimeDropdown(!showTimeDropdown)}
              className="w-full py-2 px-3 rounded-lg border-2 bg-white border-gray-200 hover:border-emerald-400 transition-all flex items-start justify-between group"
            >
              <div className="flex flex-col items-start">
                <span className="text-xs font-medium text-gray-500 mb-0.5">
                  Время
                </span>
                <span className="text-sm font-semibold text-gray-900">
                  {selectedOption.label}
                </span>
              </div>
              <ChevronDown
                className={`w-4 h-4 text-gray-400 group-hover:text-emerald-600 transition-all mt-1 ${
                  showTimeDropdown ? "rotate-180" : ""
                }`}
              />
            </button>

            {showTimeDropdown && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white border-2 border-gray-200 rounded-lg shadow-xl z-50 overflow-hidden">
                {timeOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => {
                      setSelectedTimeOfDay(option.value);
                      setShowTimeDropdown(false);
                    }}
                    className={`w-full px-3 py-2.5 text-left hover:bg-emerald-50 transition-colors border-b border-gray-100 last:border-b-0 ${
                      selectedTimeOfDay === option.value ? "bg-emerald-50" : ""
                    }`}
                  >
                    <div className="flex flex-col gap-0.5">
                      <span className="font-semibold text-sm text-gray-900">
                        {option.label}
                      </span>
                      <span
                        className={`text-xs ${
                          selectedTimeOfDay === option.value
                            ? "text-emerald-700"
                            : "text-gray-500"
                        }`}
                      >
                        {option.time}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="flex gap-2 pt-1">
          <button
            onClick={handleSearch}
            className="flex-1 h-11 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-2"
          >
            <Search className="w-4 h-4" />
            Показать свободные
          </button>

          {showFiltersButton && (
            <button
              onClick={onFiltersClick}
              className="h-11 w-11 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 transition-all flex items-center justify-center"
            >
              <SlidersHorizontal className="w-5 h-5" />
            </button>
          )}
        </div>

        {isCompact && (
          <button
            onClick={() => {
              setShowExpanded(false);
              if (onEditSearch) onEditSearch();
            }}
            className="w-full text-sm text-gray-500 hover:text-gray-700 font-medium"
          >
            Свернуть
          </button>
        )}
      </div>

      <DatePickerModal
        open={showDatePicker}
        onClose={() => setShowDatePicker(false)}
        selectedDate={selectedDate}
        onSelectDate={(date) => {
          setSelectedDate(date);
          setShowDatePicker(false);
        }}
      />
    </>
  );
}
