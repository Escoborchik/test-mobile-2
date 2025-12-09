"use client"

import type React from "react"
import { useState } from "react"
import { Calendar, XCircle, DollarSign, TrendingUp, CalendarDays } from "lucide-react"
import { DatePickerModal } from "@/components/date-picker-modal"

interface KPICardProps {
  icon: React.ReactNode
  value: string
  subtitle: string
  iconBgColor: string
}

function KPICard({ icon, value, subtitle, iconBgColor }: KPICardProps) {
  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
      <div className="flex items-start gap-3">
        <div className={`${iconBgColor} rounded-xl p-2.5 shrink-0`}>{icon}</div>
        <div className="flex-1 min-w-0">
          <div className="text-2xl font-bold text-gray-900 mb-0.5">{value}</div>
          <div className="text-xs text-gray-500">{subtitle}</div>
        </div>
      </div>
    </div>
  )
}

export function AdminAnalyticsSection() {
  const [startDate, setStartDate] = useState(new Date())
  const [endDate, setEndDate] = useState(new Date())
  const [selectedCourt, setSelectedCourt] = useState("all")
  const [showStartDatePicker, setShowStartDatePicker] = useState(false)
  const [showEndDatePicker, setShowEndDatePicker] = useState(false)

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("ru-RU", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })
  }

  return (
    <div className="p-4 space-y-4">
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
        <div className="grid grid-cols-3 gap-3">
          {/* From Date */}
          <div>
            <label className="block text-xs text-gray-600 mb-1.5">От</label>
            <button
              onClick={() => setShowStartDatePicker(true)}
              className="w-full px-3 py-2.5 bg-white border border-gray-200 rounded-xl text-sm text-gray-700 flex items-center justify-between hover:border-gray-300 transition-colors"
            >
              <span>{formatDate(startDate)}</span>
              <CalendarDays className="w-4 h-4 text-gray-400" />
            </button>
          </div>

          {/* To Date */}
          <div>
            <label className="block text-xs text-gray-600 mb-1.5">До</label>
            <button
              onClick={() => setShowEndDatePicker(true)}
              className="w-full px-3 py-2.5 bg-white border border-gray-200 rounded-xl text-sm text-gray-700 flex items-center justify-between hover:border-gray-300 transition-colors"
            >
              <span>{formatDate(endDate)}</span>
              <CalendarDays className="w-4 h-4 text-gray-400" />
            </button>
          </div>

          {/* Court Filter */}
          <div>
            <label className="block text-xs text-gray-600 mb-1.5">Корт</label>
            <select
              value={selectedCourt}
              onChange={(e) => setSelectedCourt(e.target.value)}
              className="w-full px-3 py-2.5 bg-white border border-gray-200 rounded-xl text-sm text-gray-700 hover:border-gray-300 transition-colors appearance-none"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%239ca3af'%3E%3Cpath strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                backgroundRepeat: "no-repeat",
                backgroundPosition: "right 0.5rem center",
                backgroundSize: "1.5em 1.5em",
              }}
            >
              <option value="all">Все корты</option>
              <option value="1">Корт №1</option>
              <option value="2">Корт №2</option>
              <option value="3">Корт №3</option>
            </select>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <KPICard
          icon={<DollarSign className="w-5 h-5 text-emerald-700" />}
          value="₽284,500"
          subtitle="за текущий месяц"
          iconBgColor="bg-emerald-50"
        />
        <KPICard
          icon={<TrendingUp className="w-5 h-5 text-blue-700" />}
          value="74%"
          subtitle="средняя загрузка"
          iconBgColor="bg-blue-50"
        />
        <KPICard
          icon={<Calendar className="w-5 h-5 text-purple-700" />}
          value="156"
          subtitle="всего бронирований"
          iconBgColor="bg-purple-50"
        />
        <KPICard
          icon={<XCircle className="w-5 h-5 text-gray-700" />}
          value="12"
          subtitle="отмен за месяц"
          iconBgColor="bg-gray-50"
        />
      </div>

      {/* Date Picker Modals */}
      <DatePickerModal
        open={showStartDatePicker}
        onClose={() => setShowStartDatePicker(false)}
        selectedDate={startDate}
        onSelectDate={(date) => {
          setStartDate(date)
          setShowStartDatePicker(false)
        }}
      />
      <DatePickerModal
        open={showEndDatePicker}
        onClose={() => setShowEndDatePicker(false)}
        selectedDate={endDate}
        onSelectDate={(date) => {
          setEndDate(date)
          setShowEndDatePicker(false)
        }}
      />
    </div>
  )
}
