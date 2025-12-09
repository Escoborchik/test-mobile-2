"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  MapPin,
  Phone,
  Mail,
  Clock,
  CalendarDays,
  ChevronDown,
  ChevronRight,
  Tag,
} from "lucide-react";
import { courts } from "@/data/courts";
import { DatePickerModal } from "@/components/date-picker-modal";
import { getAmenityIcon } from "@/utils/getAmenityIcon";

export default function OrganizationPage() {
  const params = useParams();
  const router = useRouter();
  const organizationName = decodeURIComponent(params.id as string);

  const [activeTab, setActiveTab] = useState<"info" | "schedule">("info");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedTimeOfDay, setSelectedTimeOfDay] = useState("all");
  const [showTimeDropdown, setShowTimeDropdown] = useState(false);
  const [expandedTariffs, setExpandedTariffs] = useState<number[]>([]);

  // Get all courts for this organization
  const organizationCourts = courts.filter(
    (court) => court.organization === organizationName
  );

  if (organizationCourts.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Организация не найдена</p>
      </div>
    );
  }

  const firstCourt = organizationCourts[0];

  const formatDate = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const compareDate = new Date(date);
    compareDate.setHours(0, 0, 0, 0);

    if (compareDate.getTime() === today.getTime()) {
      return "Сегодня";
    }

    return date.toLocaleDateString("ru-RU", { day: "numeric", month: "long" });
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

  const toggleTariff = (tariffId: number) => {
    setExpandedTariffs((prev) =>
      prev.includes(tariffId)
        ? prev.filter((id) => id !== tariffId)
        : [...prev, tariffId]
    );
  };

  const getFilteredSlots = () => {
    const timeRanges: { [key: string]: { start: number; end: number } } = {
      morning: { start: 6, end: 12 },
      day: { start: 12, end: 18 },
      evening: { start: 18, end: 24 },
      night: { start: 0, end: 6 },
      all: { start: 0, end: 24 },
    };

    const range = timeRanges[selectedTimeOfDay] || timeRanges.all;

    const courtSlots: {
      [courtName: string]: Array<{ time: string; price: number }>;
    } = {};

    organizationCourts.forEach((court) => {
      if (court.slots) {
        const filtered = court.slots
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
          .map((slot) => ({ time: slot.time, price: slot.price }));

        if (filtered.length > 0) {
          courtSlots[court.name] = filtered;
        }
      }
    });

    return courtSlots;
  };

  const groupedSlots = getFilteredSlots();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Fixed Header */}
      <header className="fixed top-0 left-0 right-0 z-30 bg-white border-b border-gray-200 px-4 h-14 flex items-center gap-3 shadow-sm">
        <button
          onClick={() => router.back()}
          className="flex items-center justify-center w-9 h-9 rounded-full hover:bg-gray-100 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-gray-700" />
        </button>
        <h1 className="text-lg font-bold text-gray-900 truncate">
          {organizationName}
        </h1>
      </header>

      {/* Hero Image */}
      <div className="pt-14 relative">
        <div className="h-48 bg-gradient-to-br from-emerald-600 to-emerald-800 relative overflow-hidden">
          <img
            src={firstCourt.image || "/placeholder.svg"}
            alt={organizationName}
            className="w-full h-full object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        </div>
      </div>

      {/* Tabs */}
      <div className="sticky top-14 z-20 bg-white border-b border-gray-200 px-4">
        <div className="flex gap-1">
          <button
            onClick={() => setActiveTab("info")}
            className={`flex-1 py-3 text-sm font-semibold transition-all relative ${
              activeTab === "info" ? "text-emerald-600" : "text-gray-500"
            }`}
          >
            Информация
            {activeTab === "info" && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-600" />
            )}
          </button>
          <button
            onClick={() => setActiveTab("schedule")}
            className={`flex-1 py-3 text-sm font-semibold transition-all relative ${
              activeTab === "schedule" ? "text-emerald-600" : "text-gray-500"
            }`}
          >
            Доступное время
            {activeTab === "schedule" && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-600" />
            )}
          </button>
        </div>
      </div>

      {/* Tab Content */}
      <div className="px-4 py-6 pb-20">
        {activeTab === "info" && (
          <div className="space-y-6">
            {/* Description */}
            <div>
              <h2 className="text-lg font-semibold text-foreground mb-2">
                Описание
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                {firstCourt.description}
              </p>
            </div>

            {/* Characteristics */}
            <div>
              <h2 className="text-lg font-semibold text-foreground mb-3">
                Характеристики
              </h2>
              <div className="space-y-2">
                <p className="text-sm leading-relaxed">
                  <span className="text-gray-500 font-medium">Покрытие: </span>
                  <span className="text-foreground font-medium">
                    {firstCourt.characteristics[0]}
                  </span>
                </p>
                <p className="text-sm leading-relaxed">
                  <span className="text-gray-500 font-medium">
                    Тип площадки:{" "}
                  </span>
                  <span className="text-foreground font-medium">
                    {firstCourt.characteristics[1]}
                  </span>
                </p>
                <p className="text-sm leading-relaxed">
                  <span className="text-gray-500 font-medium">
                    Вид спорта:{" "}
                  </span>
                  <span className="text-foreground font-medium">
                    {firstCourt.characteristics[2]}
                  </span>
                </p>
              </div>
            </div>

            {/* Amenities */}
            <div>
              <h2 className="text-lg font-semibold text-foreground mb-3">
                Удобства
              </h2>
              <div className="grid grid-cols-2 gap-3">
                {firstCourt.amenities.map((amenity) => (
                  <div
                    key={amenity.type}
                    className="flex items-center gap-2 text-foreground"
                  >
                    <div className="text-accent">
                      {getAmenityIcon(amenity.type)}
                    </div>
                    <span>{amenity.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Tariffs */}
            {firstCourt.schedule && (
              <div>
                <h2 className="text-lg font-semibold text-foreground mb-3">
                  Тарифы
                </h2>
                <div className="space-y-3">
                  {firstCourt.schedule.tariffs.map((tariff) => {
                    const isExpanded = expandedTariffs.includes(tariff.id);
                    return (
                      <div
                        key={tariff.id}
                        className="bg-card border border-border rounded-2xl overflow-hidden"
                      >
                        {/* Tariff Header - Clickable */}
                        <button
                          onClick={() => toggleTariff(tariff.id)}
                          className="w-full flex items-center gap-3 p-4 hover:bg-gray-50 transition-colors"
                        >
                          <div className="w-10 h-10 rounded-full bg-emerald-600 flex items-center justify-center text-xl flex-shrink-0">
                            {tariff.icon}
                          </div>
                          <div className="flex-1 text-left">
                            <h3 className="font-semibold text-foreground">
                              {tariff.name}
                            </h3>
                          </div>
                          <ChevronRight
                            className={`w-5 h-5 text-gray-400 transition-transform duration-200 flex-shrink-0 ${
                              isExpanded ? "rotate-90" : ""
                            }`}
                          />
                        </button>

                        {/* Time Slots - Expandable */}
                        {isExpanded && (
                          <div className="px-4 pb-4 space-y-3 border-t border-gray-100 pt-3">
                            {tariff.timeSlots.map((slot, index) => (
                              <div
                                key={index}
                                className="flex items-center gap-4"
                              >
                                {/* Time */}
                                <div className="flex items-center gap-2 flex-1">
                                  <Clock className="w-4 h-4 text-muted-foreground" />
                                  <div>
                                    <p className="font-medium text-foreground">
                                      {slot.time}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                      {slot.days}
                                    </p>
                                  </div>
                                </div>

                                {/* Price */}
                                <div className="flex items-center gap-2">
                                  <Tag className="w-4 h-4 text-muted-foreground" />
                                  <p className="font-semibold text-foreground">
                                    {slot.price} ₽ / час
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Services */}
            {firstCourt.schedule && (
              <div>
                <h2 className="text-lg font-semibold text-foreground mb-3">
                  Услуги
                </h2>
                <div className="space-y-2">
                  {firstCourt.schedule.services.map((service, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between py-2"
                    >
                      <span className="text-foreground">{service.name}</span>
                      <span className="font-semibold text-foreground">
                        {service.price} ₽ / час
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Address */}
            <div>
              <h2 className="text-lg font-semibold text-foreground mb-2">
                Адрес
              </h2>
              <div className="flex items-start gap-2 text-foreground">
                <MapPin className="w-5 h-5 text-accent mt-0.5" />
                <p>{firstCourt.address}</p>
              </div>
            </div>

            {/* Schedule */}
            {firstCourt.schedule && (
              <div>
                <h2 className="text-lg font-semibold text-foreground mb-2">
                  Расписание работы
                </h2>
                <div className="flex items-start gap-2 mb-2">
                  <Clock className="w-5 h-5 text-muted-foreground mt-0.5" />
                  <p className="text-foreground">
                    {firstCourt.schedule.workingHours}
                  </p>
                </div>
              </div>
            )}

            {/* Contacts */}
            {firstCourt.contacts && (
              <div>
                <h2 className="text-lg font-semibold text-foreground mb-3">
                  Контакты
                </h2>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-foreground">
                    <Phone className="w-5 h-5 text-accent" />
                    <a
                      href={`tel:${firstCourt.contacts.phone}`}
                      className="hover:text-accent"
                    >
                      {firstCourt.contacts.phone}
                    </a>
                  </div>
                  <div className="flex items-center gap-2 text-foreground">
                    <Mail className="w-5 h-5 text-accent" />
                    <a
                      href={`mailto:${firstCourt.contacts.email}`}
                      className="hover:text-accent"
                    >
                      {firstCourt.contacts.email}
                    </a>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === "schedule" && (
          <div className="space-y-4">
            {/* Date and Time Filters */}
            <div className="flex gap-2">
              <button
                onClick={() => setShowDatePicker(true)}
                className="flex items-center gap-2 px-6 py-3 rounded-full bg-emerald-700 text-white text-sm font-semibold whitespace-nowrap hover:bg-emerald-800 hover:shadow-lg transition-all duration-200 shadow-md"
              >
                <CalendarDays className="w-4 h-4" />
                <span>{formatDate(selectedDate)}</span>
              </button>

              <div className="relative">
                <button
                  onClick={() => setShowTimeDropdown(!showTimeDropdown)}
                  className="flex items-center gap-2 px-6 py-3 rounded-full bg-emerald-700 text-white text-sm font-semibold whitespace-nowrap hover:bg-emerald-800 hover:shadow-lg transition-all duration-200 shadow-md"
                >
                  <Clock className="w-4 h-4" />
                  <span>{selectedOption.label}</span>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform duration-200 ${
                      showTimeDropdown ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {showTimeDropdown && (
                  <div className="absolute top-full left-0 mt-2 bg-white border-2 border-gray-200 rounded-xl shadow-xl z-50 overflow-hidden min-w-[200px]">
                    {timeOptions.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => {
                          setSelectedTimeOfDay(option.value);
                          setShowTimeDropdown(false);
                        }}
                        className={`w-full px-4 py-3 text-left hover:bg-emerald-50 transition-colors border-b border-gray-100 last:border-b-0 ${
                          selectedTimeOfDay === option.value
                            ? "bg-emerald-50"
                            : ""
                        }`}
                      >
                        <div className="font-semibold text-sm text-gray-900">
                          {option.label}
                        </div>
                        <div
                          className={`text-xs mt-0.5 ${
                            selectedTimeOfDay === option.value
                              ? "text-emerald-700"
                              : "text-gray-500"
                          }`}
                        >
                          {option.time}
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Grouped Slots by Court */}
            <div>
              <h2 className="text-lg font-semibold text-foreground mb-3">
                Доступное время
              </h2>
              {Object.keys(groupedSlots).length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">Доступных слотов нет</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {Object.entries(groupedSlots).map(([courtName, slots]) => (
                    <div
                      key={courtName}
                      className="bg-white rounded-2xl border border-gray-200 p-4"
                    >
                      <h3 className="font-bold text-gray-900 mb-3">
                        {courtName}
                      </h3>
                      <div className="space-y-2">
                        {slots.map((slot, idx) => (
                          <button
                            key={idx}
                            onClick={() => {
                              const court = organizationCourts.find(
                                (c) => c.name === courtName
                              );
                              if (court) {
                                router.push(
                                  `/booking/step1?court=${court.id}&slot=${
                                    slot.time
                                  }&date=${selectedDate.toISOString()}`
                                );
                              }
                            }}
                            className="w-full px-4 py-3 rounded-xl border-2 bg-emerald-50 border-emerald-200 text-foreground hover:border-emerald-400 hover:bg-emerald-100 transition-all duration-200"
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-semibold">{slot.time}</span>
                              <span className="font-bold">
                                {slot.price} ₽/час
                              </span>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
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
    </div>
  );
}
