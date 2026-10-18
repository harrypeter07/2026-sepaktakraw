'use client'

import { useState, useMemo } from 'react'
import recordsData from '@/lib/msta-records.json'
import {
  Shield,
  Trophy,
  Users,
  Award,
  MapPin,
  Target,
  Zap,
  Activity,
  CheckCircle2,
  Filter,
  UserCheck,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'

export function StateSquadShowcase() {
  const [activeTab, setActiveTab] = useState<'men' | 'women' | 'staff'>('men')
  const [selectedPosition, setSelectedPosition] = useState<string>('all')
  const { stateSquad } = recordsData

  const getPositionMeta = (pos: string) => {
    switch (pos) {
      case 'Tekong':
        return {
          label: 'Tekong (Server)',
          badge: 'bg-amber-100 text-amber-900 border-amber-300',
          gradient: 'from-amber-600 via-amber-700 to-amber-900',
          accent: 'text-amber-300',
          desc: 'Primary server responsible for high-velocity service kicks and aces.',
        }
      case 'Killer':
        return {
          label: 'Killer (Striker)',
          badge: 'bg-rose-100 text-rose-900 border-rose-300',
          gradient: 'from-rose-600 via-rose-700 to-rose-900',
          accent: 'text-rose-300',
          desc: 'Primary attacker executing roll spikes, sunback strikes, and net blocks.',
        }
      case 'Feeder':
        return {
          label: 'Feeder (Setter)',
          badge: 'bg-blue-100 text-blue-900 border-blue-300',
          gradient: 'from-blue-600 via-blue-700 to-blue-900',
          accent: 'text-blue-300',
          desc: 'Pace controller delivering high-precision sets and defensive saves.',
        }
      default:
        return {
          label: pos || 'Athlete',
          badge: 'bg-slate-100 text-slate-800 border-slate-300',
          gradient: 'from-slate-700 via-slate-800 to-slate-900',
          accent: 'text-slate-300',
          desc: 'Professional state athlete representing Maharashtra.',
        }
    }
  }

  const filteredMen = useMemo(() => {
    if (selectedPosition === 'all') return stateSquad.men
    return stateSquad.men.filter((p) => p.position === selectedPosition)
  }, [stateSquad.men, selectedPosition])

  const filteredWomen = useMemo(() => {
    if (selectedPosition === 'all') return stateSquad.women
    return stateSquad.women.filter((p) => p.position === selectedPosition)
  }, [stateSquad.women, selectedPosition])

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-md overflow-hidden mb-12">
      {/* Header Banner */}
      <div className="relative bg-gradient-to-r from-[#0a192f] via-[#1e3a8a] to-[#1d4ed8] text-white p-6 sm:p-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Shield className="h-5 w-5 text-amber-400" />
              <span className="text-xs uppercase font-black tracking-widest text-amber-300">
                Official State Contingent Roster
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight">
              Maharashtra State Sepaktakraw Squad
            </h2>
            <p className="text-white/80 text-xs sm:text-sm mt-1 max-w-2xl leading-relaxed">
              Official contingent representing Maharashtra at the Senior National Sepaktakraw
              Championships and National Games, verified under MSTA records.
            </p>
          </div>

          {/* Tab buttons */}
          <div className="flex bg-black/30 p-1.5 rounded-xl backdrop-blur-sm self-start md:self-auto shrink-0 border border-white/10">
            <button
              onClick={() => {
                setActiveTab('men')
                setSelectedPosition('all')
              }}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'men'
                  ? 'bg-white text-[#1e3a8a] shadow-sm'
                  : 'text-white/80 hover:text-white'
              }`}
            >
              Men&apos;s Squad ({stateSquad.men.length})
            </button>
            <button
              onClick={() => {
                setActiveTab('women')
                setSelectedPosition('all')
              }}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'women'
                  ? 'bg-white text-[#1e3a8a] shadow-sm'
                  : 'text-white/80 hover:text-white'
              }`}
            >
              Women&apos;s Squad ({stateSquad.women.length})
            </button>
            <button
              onClick={() => {
                setActiveTab('staff')
                setSelectedPosition('all')
              }}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'staff'
                  ? 'bg-white text-[#1e3a8a] shadow-sm'
                  : 'text-white/80 hover:text-white'
              }`}
            >
              Coaches &amp; Officials ({stateSquad.staff.length})
            </button>
          </div>
        </div>

        {/* Position Filter (for player tabs) */}
        {activeTab !== 'staff' && (
          <div className="mt-6 pt-4 border-t border-white/10 flex flex-wrap items-center gap-2 text-xs">
            <span className="font-semibold text-white/60 flex items-center gap-1 mr-2">
              <Filter size={13} /> Filter by Role:
            </span>
            {['all', 'Tekong', 'Killer', 'Feeder'].map((pos) => (
              <button
                key={pos}
                onClick={() => setSelectedPosition(pos)}
                className={`px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  selectedPosition === pos
                    ? 'bg-amber-400 text-slate-900 font-extrabold shadow-sm'
                    : 'bg-white/10 text-white/80 hover:bg-white/20'
                }`}
              >
                {pos === 'all' ? 'All Positions' : pos}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Grid Content */}
      <div className="p-6 sm:p-8 bg-slate-50/50">
        {/* MEN'S SQUAD */}
        {activeTab === 'men' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {filteredMen.map((player) => {
              const meta = getPositionMeta(player.position)
              const initials = player.name
                .split(' ')
                .map((w) => w[0])
                .slice(0, 2)
                .join('')
                .toUpperCase()

              return (
                <div
                  key={player.id}
                  className="group bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between"
                >
                  {/* Athletic Jersey Card Header */}
                  <div
                    className={`relative h-40 w-full overflow-hidden bg-gradient-to-br ${meta.gradient} p-4 flex flex-col justify-between text-white`}
                  >
                    {/* Background jersey watermark pattern */}
                    <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:12px_12px]" />

                    {/* Top Row: Jersey Number & Position */}
                    <div className="relative z-10 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-black/40 backdrop-blur-md border border-white/20 font-black text-sm text-white shadow-inner">
                          #{player.jerseyNumber}
                        </span>
                        <span className="text-[10px] uppercase font-bold tracking-wider text-white/80">
                          Jersey
                        </span>
                      </div>
                      <Badge
                        className={`text-[10px] font-black uppercase tracking-wider border shadow-sm ${meta.badge}`}
                      >
                        {player.position}
                      </Badge>
                    </div>

                    {/* Center Monogram Insignia */}
                    <div className="relative z-10 flex items-center justify-center py-1">
                      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/15 backdrop-blur-md border border-white/30 text-white font-black text-xl tracking-wider shadow-lg group-hover:scale-105 transition-transform duration-300">
                        {initials}
                      </div>
                    </div>

                    {/* Bottom strip */}
                    <div className="relative z-10 flex items-center justify-between text-[11px] text-white/90">
                      <span className="font-semibold text-white/70">MSTA Contingent</span>
                      <span className="font-bold flex items-center gap-1">
                        <CheckCircle2 size={12} className="text-emerald-300" /> Verified
                      </span>
                    </div>
                  </div>

                  {/* Card Details Body */}
                  <div className="p-4 flex flex-col flex-1 justify-between">
                    <div>
                      <h4 className="font-black text-slate-900 text-base leading-tight group-hover:text-blue-700 transition-colors">
                        {player.name}
                      </h4>
                      <div className="mt-2.5 flex items-center justify-between text-xs">
                        <span className="flex items-center gap-1 font-bold text-slate-700">
                          <MapPin size={13} className="text-blue-600 shrink-0" />
                          {player.district}
                        </span>
                        {player.birthYear && (
                          <span className="text-[11px] bg-slate-100 px-2 py-0.5 rounded-md text-slate-600 font-bold border border-slate-200">
                            Born {player.birthYear}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                      <span className="font-medium">{meta.label}</span>
                      <span className="font-bold text-slate-700">Senior Men</span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* WOMEN'S SQUAD */}
        {activeTab === 'women' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {filteredWomen.map((player) => {
              const meta = getPositionMeta(player.position)
              const initials = player.name
                .split(' ')
                .map((w) => w[0])
                .slice(0, 2)
                .join('')
                .toUpperCase()

              return (
                <div
                  key={player.id}
                  className="group bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between"
                >
                  <div
                    className={`relative h-44 w-full overflow-hidden bg-gradient-to-br ${meta.gradient} p-4 flex flex-col justify-between text-white`}
                  >
                    <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:12px_12px]" />

                    <div className="relative z-10 flex items-center justify-between">
                      <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-black/40 backdrop-blur-md border border-white/20 font-black text-sm text-white shadow-inner">
                        #{player.jerseyNumber}
                      </span>
                      <Badge
                        className={`text-[10px] font-black uppercase tracking-wider border shadow-sm ${meta.badge}`}
                      >
                        {player.position}
                      </Badge>
                    </div>

                    <div className="relative z-10 flex items-center justify-center py-2">
                      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/15 backdrop-blur-md border border-white/30 text-white font-black text-2xl tracking-wider shadow-lg group-hover:scale-105 transition-transform duration-300">
                        {initials}
                      </div>
                    </div>

                    <div className="relative z-10 flex items-center justify-between text-[11px] text-white/90">
                      <span className="font-semibold text-white/70">MSTA Contingent</span>
                      <span className="font-bold flex items-center gap-1">
                        <CheckCircle2 size={12} className="text-emerald-300" /> Verified
                      </span>
                    </div>
                  </div>

                  <div className="p-5 flex flex-col flex-1 justify-between">
                    <div>
                      <h4 className="font-black text-slate-900 text-lg leading-tight group-hover:text-blue-700 transition-colors">
                        {player.name}
                      </h4>
                      <div className="mt-3 flex items-center justify-between text-xs">
                        <span className="flex items-center gap-1 font-bold text-slate-700">
                          <MapPin size={14} className="text-blue-600 shrink-0" />
                          {player.district}
                        </span>
                        {player.birthYear && (
                          <span className="text-[11px] bg-slate-100 px-2 py-0.5 rounded-md text-slate-600 font-bold border border-slate-200">
                            Born {player.birthYear}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                      <span className="font-medium">{meta.label}</span>
                      <span className="font-bold text-slate-700">Senior Women</span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* STAFF & OFFICIALS */}
        {activeTab === 'staff' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {stateSquad.staff.map((member) => {
              const initials = member.name
                .split(' ')
                .map((w) => w[0])
                .slice(0, 2)
                .join('')
                .toUpperCase()

              return (
                <div
                  key={member.id}
                  className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div>
                    {/* Header Insignia */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[#1e3a8a] to-[#2563eb] text-white font-black text-sm shadow-md">
                        {initials}
                      </div>
                      <Badge
                        variant="outline"
                        className="bg-blue-50 text-blue-800 border-blue-200 text-[10px] font-black uppercase tracking-wider px-2 py-0.5"
                      >
                        Official
                      </Badge>
                    </div>

                    <h4 className="font-black text-slate-900 text-base leading-snug">
                      {member.name}
                    </h4>
                    <p className="text-xs text-blue-700 font-bold mt-1.5 leading-relaxed">
                      {member.role}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                    <span className="font-semibold uppercase tracking-wider">MSTA Technical Council</span>
                    <UserCheck size={14} className="text-emerald-600" />
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
